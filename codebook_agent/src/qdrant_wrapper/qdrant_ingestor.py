import os
import uuid
import asyncio
import threading
from typing import List, Dict, Optional

from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from qdrant_client.http.models import PointStruct
from more_itertools import chunked
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from qdrant_client.http.exceptions import ResponseHandlingException

from qdrant_wrapper.qdrant_base import QdrantBase
from qdrant_client.http.models import VectorParams, Distance

load_dotenv()
# Constants
CHUNK_SIZE = 8000
CHUNK_OVERLAP = 500
SEPARATOR = "块"
BATCH_SIZE = 50
EMBEDDING_BATCH_SIZE = 32
MAX_RETRY_ATTEMPTS = 5
RETRY_MULTIPLIER = 1
MIN_RETRY_WAIT = 1
MAX_RETRY_WAIT = 10
VECTOR_SIZE = 1536
VECTOR_DISTANCE = Distance.COSINE

class QdrantIngestor(QdrantBase):
    """Class for ingesting documents into Qdrant."""
    
    def __init__(self, document_id: str, document_content: str):
        super().__init__()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE, 
            chunk_overlap=CHUNK_OVERLAP, 
            separators=[SEPARATOR], 
            keep_separator=False
        )
        self.document_id = document_id
        self.document_content = document_content

    @retry(
        stop=stop_after_attempt(MAX_RETRY_ATTEMPTS),
        wait=wait_exponential(multiplier=RETRY_MULTIPLIER, min=MIN_RETRY_WAIT, max=MAX_RETRY_WAIT),
        retry=retry_if_exception_type(ResponseHandlingException)
    )
    async def _upsert_batch(self, batch: List[PointStruct]):
        """Upsert a batch of points with retry logic."""
        await self.async_client.upsert(
            collection_name=self.document_id,
            points=batch
        )
    
    async def upsert_in_batches(self, points: List[PointStruct], batch_size: int = BATCH_SIZE):
        """Upsert points in batches to avoid overloading the service."""
        for batch in chunked(points, batch_size):
            await self._upsert_batch(list(batch))
    
    async def process_section(self, section_info: Dict, extract_section_content) -> int:
        """Process a single section from the document."""
        if not self.document_content:
            raise ValueError("HTML content must be loaded before processing sections")
            
        section_name = section_info['sectionName']
        section_number = section_info['sectionNumber']
        chapter_number = section_info['chapterNumber']
        full_number = f"{chapter_number}.{section_number}"

        content_dict = extract_section_content(self.document_content, full_number)
        if "error" in content_dict:
            print(f"Error extracting content: {content_dict['error']}")
            return 0

        content_text = content_dict["content"]
        chunks = self.text_splitter.split_text(content_text)
        if not chunks:
            return 0
        
        thread_name = threading.current_thread().name
        print(f"[{thread_name}] Starting section {chapter_number}.{section_number}")

        embeddings = []
        for batch in chunked(chunks, EMBEDDING_BATCH_SIZE):
            batch_embeddings = await self.embeddings.aembed_documents(list(batch))
            embeddings.extend(batch_embeddings)

        payloads = [{
            "chapter_number": chapter_number,
            "section_name": section_name,
            "section_number": section_number,
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
        """Process all sections in the document asynchronously."""
        print("Processing all sections asynchronously...")
        tasks = [
            self.process_section(section, extract_section_content)
            for section in sections_list
        ]
        results = await asyncio.gather(*tasks)
        return sum(results)

    async def create_empty_codebook(self) -> bool:
        """Create a new codebook collection."""
        try:
            await self.async_client.create_collection(
                collection_name=self.document_id,
                vectors_config=VectorParams(size=VECTOR_SIZE, distance=VECTOR_DISTANCE)
            )
            return True
        except Exception as e:
            print(f"Error creating codebook: {e}")
            return False
        
    
    