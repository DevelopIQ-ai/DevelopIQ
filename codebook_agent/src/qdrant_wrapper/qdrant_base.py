import os
from typing import Optional
from dotenv import load_dotenv

from langchain_openai import OpenAIEmbeddings
from qdrant_client import QdrantClient, AsyncQdrantClient
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type
import httpx
from qdrant_client.http.exceptions import ResponseHandlingException
# Load environment variables    
load_dotenv()

# Constants


from enum import Enum
from dataclasses import dataclass

@dataclass
class DocumentStatus(Enum):
    NOT_EXISTS = 0
    EMPTY = 1
    UDC= 2
    INDEXED = 3


class QdrantBase:
    """Base class for Qdrant operations with shared functionality."""
    
    def __init__(self):
        # Initialize embeddings
        self.async_client = AsyncQdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY"),
            
        )
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY"),
        )
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
    
   
    @retry(
        stop=stop_after_attempt(5),
        wait=wait_fixed(15),
        retry=retry_if_exception_type((httpx.ConnectTimeout, ResponseHandlingException))
    )
    async def document_exists_and_is_indexed(self, document_id: str) -> DocumentStatus:
        """Check if a collection exists and has indexed documents."""
        try:
            exists = await self.async_client.collection_exists(collection_name=document_id)
            if not exists:
                return DocumentStatus.NOT_EXISTS
            stats = await self.async_client.count(collection_name=document_id)
            if stats.count == 0:
                return DocumentStatus.EMPTY
            if stats.count < 10:
                return DocumentStatus.UDC
            return DocumentStatus.INDEXED
        except Exception as e:
            raise Exception(f"Error checking if document exists and is indexed: {e}") from e
    
