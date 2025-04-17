from typing import Dict, Any, Protocol
from qdrant_client.http.models import Filter, FieldCondition, MatchValue

# Configuration constants
SECTION_RETRIEVAL_LIMIT = 5
SCROLL_LIMIT = 100

class RetrievalStrategy(Protocol):
    """Protocol defining the interface for document retrieval strategies."""
    
    def retrieve(self, retriever: Any, query: str) -> Dict[str, Any]:
        """Retrieve relevant content based on the query."""
        ...

class SectionBasedRetrieval:
    """
    A retrieval strategy that finds relevant sections and retrieves all chunks from those sections.
    
    This strategy is particularly effective for legal documents and codebooks where maintaining
    the complete context of a section is important for accurate interpretation.
    """
    
    def __init__(self, client, collection_name, section_limit=SECTION_RETRIEVAL_LIMIT):
        self.client = client
        self.collection_name = collection_name
        self.section_limit = section_limit
    
    def retrieve(self, retriever, query: str) -> Dict[str, Any]:
        """
        Retrieve all chunks from sections identified by the initial query.
        
        Rather than just returning the top-k most semantically relevant chunks,
        this strategy:
        1. Finds the top-k most relevant chunks via vector search
        2. Identifies which sections those chunks belong to
        3. Retrieves ALL chunks from those sections
        
        This ensures complete context at the section level.
        """
        # Initialize unique sections set
        unique_sections = set()

        # Get initial search results
        search_docs = retriever.invoke(query)
        doc_ids = [doc.metadata.get("_id") for doc in search_docs if doc.metadata.get("_id")]
        all_points = []
        
        # If we have document IDs, fetch the complete sections they belong to
        if doc_ids:
            for doc_id in doc_ids:
                try:
                    point = self.client.retrieve(
                        collection_name=self.collection_name,
                        ids=[doc_id],
                        with_payload=True
                    )
                    if point and point[0].payload:
                        chapter = point[0].payload.get("chapter_number")
                        section = point[0].payload.get("section_number")
                        
                        if chapter is not None and section is not None:
                            # Add to unique sections
                            unique_sections.add(f"{chapter}.{section}")
                        
                            # Create filter to get chunks from the same section
                            filter_ = Filter(
                                must=[
                                    FieldCondition(
                                        key="chapter_number",
                                        match=MatchValue(value=chapter)
                                    ),
                                    FieldCondition(
                                        key="section_number",
                                        match=MatchValue(value=section)
                                    )
                                ]
                            )
                            
                            # Get all chunks from this section (limited by section_limit)
                            section_points, _ = self.client.scroll(
                                collection_name=self.collection_name,
                                scroll_filter=filter_,
                                limit=self.section_limit,
                                with_payload=True
                            )
                            print(f"Query: {query}")
                            print(f"Found {len(section_points)} points in section {chapter}.{section}")
                            all_points.extend(section_points)

                except Exception as e:
                    print(f"Error retrieving document {doc_id}: {e}")
        
        # Process the retrieved content
        context_texts = [doc.page_content for doc in search_docs if doc.page_content]
        
        # Add unique section chunks to context
        for point in all_points:
            if point.payload["text"] not in context_texts:
                context_texts.append(point.payload["text"])
        combined_context = "\n\n".join(context_texts)
        
        # Create the chunks array with required metadata
        chunks = []
        for point in all_points:
            if point.payload:
                chunk = {
                    "id": point.id,
                    "section_number": point.payload.get("section_number"),
                    "chapter_number": point.payload.get("chapter_number"),
                    "section_name": point.payload.get("section_name", ""),
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