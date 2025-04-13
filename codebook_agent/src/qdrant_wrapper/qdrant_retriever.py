import os
from typing import List, Dict

from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from langchain_qdrant import QdrantVectorStore

from qdrant_wrapper.qdrant_base import QdrantBase

OPENAI_MODEL = "gpt-4o-mini"
CLAUDE_MODEL = "claude-3-7-sonnet-latest"
DEFAULT_RETRIEVAL_K = 5
PERMITTED_USES_RETRIEVAL_K = 3
SECTION_RETRIEVAL_LIMIT = 10
SCROLL_LIMIT = 100

class QdrantRetriever(QdrantBase):
    """Class for retrieving and querying documents from Qdrant."""
    
    def __init__(self, collection_name: str = None):
        super().__init__(collection_name)
        
        # Initialize LLMs for query processing
        self.openai_llm = ChatOpenAI(
            temperature=0,
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            model=OPENAI_MODEL
        )
        self.claude_llm = ChatAnthropic(
            temperature=0,
            api_key=os.getenv("ANTHROPIC_API_KEY"),
            model=CLAUDE_MODEL
        )
    
    async def get_chunks_by_section(self, section_number: str) -> List[Dict]:
        """Retrieve all chunks from a specific section."""
        await self._ensure_collection_exists()
        
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
            limit=SCROLL_LIMIT,
            with_payload=True
        )
        return [point.payload for point in result]

    async def list_all_chunks(self) -> List[Dict]:
        """List all chunks in the collection."""
        await self._ensure_collection_exists()
        
        all_payloads = []
        offset = None

        while True:
            result, next_offset = await self.async_client.scroll(
                collection_name=self.collection_name,
                offset=offset,
                limit=SCROLL_LIMIT,
                with_payload=True
            )
            all_payloads.extend([pt.payload for pt in result])
            if next_offset is None:
                break
            offset = next_offset

        return all_payloads
    
    async def retrieve_from_section(self, retriever, query: str):
        """Retrieve all chunks from the sections returned by the initial query."""
        await self._ensure_collection_exists()
        
        # Initialize unique sections set
        unique_sections = set()

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
                            # Add to unique sections
                            unique_sections.add(f"{chapter}.{section}")

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
                                limit=SECTION_RETRIEVAL_LIMIT,
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
        
        # Convert unique sections to a sorted list
        section_list = sorted(list(unique_sections))
        
        # Return both the structured chunks and raw content
        return {
            "chunks": chunks,
            "raw_content": combined_context,
            "section_list": section_list
        }

    async def query_codebook(self, question: str, structured_output):
        """Query the codebook with a question and return structured output."""
        await self._ensure_collection_exists()

        # First get the top k chunks by similarity
        retriever = QdrantVectorStore(
            client=self.client,
            collection_name=self.collection_name,
            embedding=self.embeddings,
        ).as_retriever(search_kwargs={"k": DEFAULT_RETRIEVAL_K})
        
        retriever_content = await self.retrieve_from_section(retriever, question)
        raw_context = retriever_content['raw_content']
        chunks = retriever_content['chunks']
        section_list = retriever_content['section_list']

        # Standard query prompt
        STANDARD_QUERY_PROMPT = """Answer the question based only on the following context:
            {context}

            Question: {query}
            """

        prompt = ChatPromptTemplate.from_template(STANDARD_QUERY_PROMPT)

        chain = (
            {"context": lambda _: raw_context, "query": RunnablePassthrough()}
            | prompt
            | self.openai_llm.with_structured_output(structured_output)
        )

        result = await chain.ainvoke(question)
        return result, {
            "chunks": chunks,
            "section_list": section_list
        }
    
    async def query_codebook_permitted_uses(self, question: str, structured_output):
        """Query the codebook specifically for permitted uses."""
        await self._ensure_collection_exists()

        retriever = QdrantVectorStore(
            client=self.client,
            collection_name=self.collection_name,
            embedding=self.embeddings,
        ).as_retriever(search_kwargs={"k": PERMITTED_USES_RETRIEVAL_K})

        # Get the raw context first
        retriever_content = await self.retrieve_from_section(retriever, question)
        raw_context = retriever_content['raw_content']
        chunks = retriever_content['chunks']
        section_list = retriever_content['section_list']

        # Detailed prompt specifically for permitted uses
        PERMITTED_USES_PROMPT = """
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

        final_prompt = ChatPromptTemplate.from_template(PERMITTED_USES_PROMPT)

        final_chain = (
            {"context": lambda _: raw_context, "query": RunnablePassthrough()}
            | final_prompt
            | self.claude_llm.with_structured_output(structured_output)
        )

        result = await final_chain.ainvoke(question)
        return result, {
            "chunks": chunks,
            "section_list": section_list
        }