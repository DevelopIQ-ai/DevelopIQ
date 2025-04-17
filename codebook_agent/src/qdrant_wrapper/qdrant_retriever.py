import os
import asyncio
from typing import List, Dict, Tuple, Any

import httpx
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from langchain_qdrant import QdrantVectorStore

from qdrant_wrapper.qdrant_base import QdrantBase, DocumentStatus
from qdrant_wrapper.rag_strategies import RetrievalStrategy, SectionBasedRetrieval
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_fixed
from qdrant_client.http.exceptions import ResponseHandlingException
# Configuration constants
OPENAI_MODEL = "gpt-4o-mini"
CLAUDE_MODEL = "claude-3-7-sonnet-latest"
DEFAULT_RETRIEVAL_K = 3
PERMITTED_USES_RETRIEVAL_K = 2
SCROLL_LIMIT = 100
STANDARD_QUERY_PROMPT = """Answer the question based only on the following context:
            {context}

            Question: {query}
            """

class QdrantRetriever(QdrantBase):
    """Class for retrieving and querying documents from Qdrant."""
    
    def __init__(self, document_id: str = None):
        super().__init__()
        
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OPENAI_API_KEY is not set")
        if not os.getenv("ANTHROPIC_API_KEY"):
            raise ValueError("ANTHROPIC_API_KEY is not set")
        if not document_id:
            raise ValueError("document_id is not set")
    
        self.document_id = document_id
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
        
    async def initialize(self):
        """Async initialization method to be called after construction."""
        # Validate document is indexed
        codebook_status = await self.document_exists_and_is_indexed(self.document_id)
        print(f"Codebook status: {codebook_status}")
        print(f"Document ID: {self.document_id}")
        
        if codebook_status is not DocumentStatus.INDEXED:
            raise ValueError("Codebook is not indexed. Cannot retrieve from codebook")
            
        # Initialize the default retrieval strategy
        self.retrieval_strategy = SectionBasedRetrieval(
            client=self.client,
            collection_name=self.document_id
        )

        self.retriever = QdrantVectorStore(
            client=self.client,
            collection_name=self.document_id,
            embedding=self.embeddings,
        ).as_retriever(search_kwargs={"k": DEFAULT_RETRIEVAL_K})
        return self
    
    async def get_chunks_by_section(self, section_number: str) -> List[Dict]:
        """Retrieve all chunks from a specific section."""
        filter_ = Filter(
            must=[
                FieldCondition(
                    key="section_number",
                    match=MatchValue(value=section_number)
                )
            ]
        )
        result, _ = await self.async_client.scroll(
            collection_name=self.document_id,
            scroll_filter=filter_,
            limit=SCROLL_LIMIT,
            with_payload=True
        )
        return [point.payload for point in result]

    @retry(
    stop=stop_after_attempt(3),
    wait=wait_fixed(60),
        retry=retry_if_exception_type((httpx.ConnectTimeout, ResponseHandlingException))
    )
    async def send_query(self, question: str, structured_output, custom_prompt: str = None, model_name: str = OPENAI_MODEL):
        """Query the codebook with a question and return structured output."""
        rag_result = self.retrieval_strategy.retrieve(self.retriever, question)
        raw_context = rag_result['raw_content']
        chunks = rag_result['chunks']
        section_list = rag_result['section_list']
        
        if model_name == OPENAI_MODEL:
            llm = self.openai_llm
        elif model_name == CLAUDE_MODEL:
            llm = self.claude_llm
        else:
            raise ValueError(f"Invalid model name: {model_name}")

        if custom_prompt:
            prompt = ChatPromptTemplate.from_template(custom_prompt + "\n\n\n\n" + STANDARD_QUERY_PROMPT)
        else:
            prompt = ChatPromptTemplate.from_template(STANDARD_QUERY_PROMPT)
        # Build the LangChain pipeline
        chain = (
            {"context": lambda _: raw_context, "query": RunnablePassthrough()}
            | prompt
            | llm.with_structured_output(structured_output)
        )

        # Execute the chain and return results
        result = await chain.ainvoke(question)
        result = result.model_dump()
        result.update({
            "section_list": section_list,
            "chunks": chunks
        })
        return result
    
    ## you can also change this to take a list of structured outputs.
    async def execute_queries_in_parallel(self, questions: List[str], structured_output) -> List[Tuple[Any, Dict]]:
        """
        Execute multiple queries in parallel and return all results when complete.
        """
        # Create a task for each query
        tasks = []
        for question in questions:
            task = self.send_query(question, structured_output)
            tasks.append(task)
        
        # Wait for all tasks to complete
        results = await asyncio.gather(*tasks)    
        return results
