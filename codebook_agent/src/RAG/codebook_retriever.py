import os
import uuid
import asyncio
import shutil
from dotenv import load_dotenv
from typing import List, Dict
from pathlib import Path

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
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
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

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

        self.llm = ChatOpenAI(
            temperature=0,
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            model="gpt-4o-mini"
        )

        # self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=8)

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

    async def embed_chunks(self, chunks: List[str], batch_size: int = 16) -> List[List[float]]:
        embeddings = []

        for batch in chunked(chunks, batch_size):
            batch_embeddings = await self.embeddings.aembed_documents(batch)
            embeddings.extend(batch_embeddings)

        return embeddings

    # async def process_section(self, section_info: Dict, extract_section_content) -> int:
    #     section_name = section_info['sectionName']
    #     section_number = section_info['sectionNumber']
    #     chapter_number = section_info['chapterNumber']
    #     full_number = f"{chapter_number}.{section_number}"

    #     content_dict = extract_section_content(self.html_document_id, full_number)
    #     if "error" in content_dict:
    #         print(f"Error extracting content: {content_dict['error']}")
    #         return 0

    #     content_text = content_dict["content"]
    #     chunks = self.text_splitter.split_text(content_text)
    #     if not chunks:
    #         return 0

    #     embeddings = self.embeddings.embed_documents(chunks)
    #     payloads = [{
    #         "chapterNumber": chapter_number,
    #         "sectionName": section_name,
    #         "sectionNumber": section_number,
    #         "text": chunk
    #     } for chunk in chunks]

    #     points = [
    #         PointStruct(
    #             id=str(uuid.uuid4()),
    #             vector=embedding,
    #             payload=payloads[i]
    #         ) for i, embedding in enumerate(embeddings)
    #     ]

    #     await self.upsert_in_batches(points)
    #     return len(chunks)

    async def process_section(self, section_info: Dict, extract_section_content) -> int:
        section_name = section_info['sectionName']
        section_number = section_info['sectionNumber']
        chapter_number = section_info['chapterNumber']
        full_number = f"{chapter_number}.{section_number}"

        content_dict = extract_section_content(self.html_document_id, full_number)
        if "error" in content_dict:
            print(f"Error extracting content: {content_dict['error']}")
            return 0

        content_text = content_dict["content"]
        chunks = self.text_splitter.split_text(content_text)
        if not chunks:
            return 0
        
        thread_name = threading.current_thread().name
        print(f"[{thread_name}] Starting section {section_info['chapterNumber']}.{section_info['sectionNumber']}")

        # loop = asyncio.get_event_loop()
        # embeddings = await loop.run_in_executor(self.executor, self.embeddings.aembed_documents, chunks)
        # embeddings = await self.embeddings.aembed_documents(chunks)
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

    async def query_codebook(self, question, structured_output):
        await self._ensure_collection_exists()

        print("Querying Qdrant with LangChain retriever....")
        retriever = QdrantVectorStore(
            client=self.client,
            collection_name=self.collection_name,
            embedding=self.embeddings,
        ).as_retriever(search_kwargs={"k": 5})

        prompt = ChatPromptTemplate.from_template(
            """Answer the question based only on the following context:
            {context}

            Question: {query}
            """
        )

        chain = (
            {"context": retriever, "query": RunnablePassthrough()}
            | prompt
            | self.llm.with_structured_output(structured_output)
        )

        result = await chain.ainvoke(question)
        return result
