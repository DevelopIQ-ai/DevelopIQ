import os
import uuid
import asyncio
import shutil
import json
import time
from dotenv import load_dotenv
from typing import List, Dict
from pathlib import Path

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain.text_splitter import RecursiveCharacterTextSplitter, RecursiveJsonSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from qdrant_client import QdrantClient, AsyncQdrantClient
from qdrant_client.http.models import (
    PointStruct,
    VectorParams,
    Distance,
    Filter,
    FieldCondition,
    MatchValue,
)

from langchain_qdrant import QdrantVectorStore

from more_itertools import chunked
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from qdrant_client.http.exceptions import ResponseHandlingException

import concurrent.futures
import threading

from src.utils.codebook_helpers import load_html 

# Load environment variables    
load_dotenv()


class CodebookRetriever:
    def __init__(self, html_document_id=None, html_content=None, reset_db=False):
        if not html_document_id:
            raise ValueError("html_document_id is required")
        if not html_content:
            html_content = load_html(html_document_id)

        self.html_content = html_content
        self.collection_name = html_document_id
        
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=8000, chunk_overlap=500, separators=["块"], keep_separator=False)
        # self.json_splitter = RecursiveJsonSplitter(max_chunk_size=4000, min_chunk_size=500)

        # Async client for ingestion
        self.async_client = AsyncQdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY"),
        )

        # Sync client for querying (LangChain compatibility)
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY"),
        )

        self.openai_llm = ChatOpenAI(
            temperature=0,
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            model="gpt-4o-mini"
        )

        self.claude_llm = ChatAnthropic(
            temperature=0,
            api_key=os.getenv("ANTHROPIC_API_KEY"),
            model="claude-3-7-sonnet-latest"
        )

        print("CodebookRetriever initialized with Qdrant")

    async def _ensure_collection_exists(self):
        existing = await self.async_client.get_collections()
        if self.collection_name not in [col.name for col in existing.collections]:
            await self.async_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
            )
            print(f"Created Qdrant collection: {self.collection_name}")
        else:
            print(f"Using existing Qdrant collection: {self.collection_name}")

    async def codebook_exists_and_is_indexed(self, collection_name):
        try:
            stats = await self.async_client.count(collection_name=self.collection_name)
            return stats.count > 0
        except Exception:
            return False

    @retry(
        stop=stop_after_attempt(5),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        retry=retry_if_exception_type(ResponseHandlingException)
    )
    async def _upsert_batch(self, batch: List[PointStruct]):
        await self.async_client.upsert(
            collection_name=self.collection_name,
            points=batch
        )

    async def upsert_in_batches(self, points: List[PointStruct], batch_size: int = 50):
        for batch in chunked(points, batch_size):
            await self._upsert_batch(batch)

    async def process_section(self, section_info: Dict, extract_section_content) -> int:
        section_name = section_info['sectionName']
        section_number = section_info['sectionNumber']
        chapter_number = section_info['chapterNumber']
        full_number = f"{chapter_number}.{section_number}"

        content_dict = extract_section_content(self.html_content, full_number)
        if "error" in content_dict:
            print(f"Error extracting content: {content_dict['error']}")
            return 0

        content_text = content_dict["content"]
        chunks = self.text_splitter.split_text(content_text)
        if not chunks:
            return 0
        
        thread_name = threading.current_thread().name
        print(f"[{thread_name}] Starting section {section_info['chapterNumber']}.{section_info['sectionNumber']}")

        embeddings = []

        for batch in chunked(chunks, 32):
            batch_embeddings = await self.embeddings.aembed_documents(batch)
            embeddings.extend(batch_embeddings)


        payloads = [{
            "chapterNumber": chapter_number,
            "sectionName": section_name,
            "sectionNumber": section_number,
            "text": chunk
        } for chunk in chunks]

        points = [
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload=payloads[i]
            ) for i, embedding in enumerate(embeddings)
        ]

        await self.upsert_in_batches(points)
        print(f"[{thread_name}] Finished section {section_info['chapterNumber']}.{section_info['sectionNumber']}")
        return len(chunks)
    
    async def process_all_sections(self, sections_list: List[Dict], extract_section_content) -> int:
        print("Processing all sections asynchronously...")
        tasks = [
            self.process_section(section, extract_section_content)
            for section in sections_list
        ]
        results = await asyncio.gather(*tasks)
        return sum(results)

    async def get_chunks_by_section(self, section_number: str) -> List[Dict]:
        filter_ = Filter(
            must=[
                FieldCondition(
                    key="sectionNumber",
                    match=MatchValue(value=section_number)
                )
            ]
        )
        result, _ = await self.async_client.scroll(
            collection_name=self.collection_name,
            scroll_filter=filter_,
            limit=100,
            with_payload=True
        )
        return [point.payload for point in result]

    async def list_all_chunks(self) -> List[Dict]:
        all_payloads = []
        offset = None

        while True:
            result, next_offset = await self.async_client.scroll(
                collection_name=self.collection_name,
                offset=offset,
                limit=100,
                with_payload=True
            )
            all_payloads.extend([pt.payload for pt in result])
            if next_offset is None:
                break
            offset = next_offset

        return all_payloads
    
    async def retrieve_from_section(self, retriever, query):
        # Retrieves all chunks from the sections returned by the initial query

        # Get initial search results
        search_docs = await retriever.ainvoke(query)
        doc_ids = [doc.metadata.get("_id") for doc in search_docs if doc.metadata.get("_id")]
        all_points = []
        
        # If we have document IDs but missing metadata, fetch the complete points
        if doc_ids:
            # First try to get the complete points by their IDs
            for doc_id in doc_ids:
                try:
                    point = await self.async_client.retrieve(
                        collection_name=self.collection_name,
                        ids=[doc_id],
                        with_payload=True
                    )
                    if point and point[0].payload:
                        chapter = point[0].payload.get("chapterNumber")
                        section = point[0].payload.get("sectionNumber")
                        
                        if chapter is not None and section is not None:

                            # Create filter to get chunks from the same section
                            filter_ = Filter(
                                must=[
                                    FieldCondition(
                                        key="chapterNumber",
                                        match=MatchValue(value=chapter)
                                    ),
                                    FieldCondition(
                                        key="sectionNumber",
                                        match=MatchValue(value=section)
                                    )
                                ]
                            )
                            
                            # Get all chunks from this section
                            section_points, _ = await self.async_client.scroll(
                                collection_name=self.collection_name,
                                scroll_filter=filter_,
                                limit=10,
                                with_payload=True
                            )
                            print('Query: ', query)
                            print(f"Found {len(section_points)} points in section {chapter}.{section}")
                            all_points.extend(section_points)

                except Exception as e:
                    print(f"Error retrieving document {doc_id}: {e}")
        
        # Combine retrieved docs with their neighbors
        context_texts = [doc.page_content for doc in search_docs if doc.page_content]
        
        # Add unique neighbors to context
        for point in all_points:
            if point.payload["text"] not in context_texts:
                context_texts.append(point.payload["text"])
        
        # Combine all unique chunks as context
        combined_context = "\n\n".join(context_texts)
        
        # Create the chunks array with required metadata
        chunks = []
        for point in all_points:
            if point.payload:
                chunk = {
                    "id": point.id,
                    "sectionNumber": point.payload.get("sectionNumber"),
                    "chapterNumber": point.payload.get("chapterNumber"),
                    "sectionName": point.payload.get("sectionName", ""),
                    "text": point.payload.get("text", "")
                }
                chunks.append(chunk)
        
        # Return both the structured chunks and raw content
        return {
            "chunks": chunks,
            "raw_content": combined_context
        }

    async def query_codebook(self, question, structured_output):
        await self._ensure_collection_exists()

        # First get the top k chunks by similarity
        retriever = QdrantVectorStore(
            client=self.client,
            collection_name=self.collection_name,
            embedding=self.embeddings,
        ).as_retriever(search_kwargs={"k": 5})
        
        retriever_content = await self.retrieve_from_section(retriever, question)
        raw_context = retriever_content['raw_content']
        chunks = retriever_content['chunks']

        # print('######################### RAW CONTEXT #########################')
        # print(raw_context)
        # print('######################### END RAW CONTEXT #########################')

        prompt = ChatPromptTemplate.from_template(
            """Answer the question based only on the following context:
            {context}

            Question: {query}
            """
        )

        chain = (
            {"context": lambda _: raw_context, "query": RunnablePassthrough()}
            | prompt
            | self.openai_llm.with_structured_output(structured_output)
        )

        result = await chain.ainvoke(question)
        return result, {
            "chunks": chunks,
            "raw_context": raw_context
        }
    
    async def query_codebook_permitted_uses(self, question, structured_output):
        await self._ensure_collection_exists()

        retriever = QdrantVectorStore(
            client=self.client,
            collection_name=self.collection_name,
            embedding=self.embeddings,
        ).as_retriever(search_kwargs={"k": 3})

        # Step 1: Get the raw context first
        retriever_content = await self.retrieve_from_section(retriever, question)
        raw_context = retriever_content['raw_content']
        chunks = retriever_content['chunks']

        # print('######################### RAW CONTEXT #########################')
        # print(raw_context)
        # print('######################### END RAW CONTEXT #########################')

        # Step 3: Use the processed context in the final chain
        final_prompt = ChatPromptTemplate.from_template(
            """
            You are a helpful assistant that answers questions about a municipality's codebook.
            Sometimes, the content has tables, which are formatted in markdown.
            
            <TABLE DIRECTIONS>
                - Ensure you only rely on the content inside the table.
                - Scan every single row.
                - Do not make up any information.
                - Always check if the zone code is a column header; if it is, ensure you only look for cell values in that column that align with the question.
                - Ignore any columns that do not have the zone code as a header.
                - If asked about a specific row or column, ensure you only rely on the content inside that row or column.
                - If dealing with multiple tables, refer to that table's header row to determine which column to look at.
            </TABLE DIRECTIONS>

            <INDUSTRY EXPERT HINT>
            The answer is always in the context. 
            Permitted Uses and Special Exceptions are often found in the PERMITTED USES section, PERMITTED USES TABLE section, or in similar sections.
            </INDUSTRY EXPERT HINT>

            Answer the question based only on the following context:
            {context}

            Question: {query}
            """
        )

        final_chain = (
            {"context": lambda _: raw_context, "query": RunnablePassthrough()}
            | final_prompt
            | self.claude_llm.with_structured_output(structured_output)
        )

        result = await final_chain.ainvoke(question)
        # print('######################### RESULT #########################')
        # print(result)
        # print('######################### END RESULT #########################')
        return result, {
            "chunks": chunks,
            "raw_context": raw_context
        }
    
    # result[structured_output],
    # sources = {
    #     chunks:[
    #         {
    #             id: "34534534534543",
    #             sectionNumber: "154.040",
    #             sectionName: "Residential",
    #             chapterNumber: "154",
    #             text: "chunk"
    #         }
    #     ],
    #     raw_context: "..."
    # }