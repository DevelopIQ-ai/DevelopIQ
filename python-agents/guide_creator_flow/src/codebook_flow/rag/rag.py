import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain_chroma import Chroma
import chromadb
import sys
import shutil
from functions.section_extractor import extract_section_content
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

class CodebookRetriever:
    def __init__(self, persist_directory="./codebook_db", html_document_id=None, reset_db=False):
        """
        Initialize the CodebookRetriever
        
        Args:
            persist_directory: Directory to store the vector database
            html_document_id: The ID of the HTML document to extract sections from
            reset_db: If True, deletes existing database to start fresh
        """
        self.persist_directory = persist_directory
        self.html_document_id = html_document_id
        
        # Reset database if requested
        if reset_db and os.path.exists(persist_directory):
            shutil.rmtree(persist_directory)
            print(f"Removed existing database at {persist_directory}")
        
        Path(persist_directory).mkdir(parents=True, exist_ok=True)
        
        # Initialize embedding model
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
        
        # Create ChromaDB client
        self.chroma_client = chromadb.PersistentClient(path=persist_directory)
        
        # Check if collection exists and get or create
        try:
            self.collection_name = "codebook"
            
            collection_names = [col.name for col in self.chroma_client.list_collections()]
            
            if self.collection_name in collection_names:
                self.collection = self.chroma_client.get_collection(self.collection_name)
                print(f"Using existing collection: {self.collection_name}")
            else:
                self.collection = self.chroma_client.create_collection(
                    self.collection_name,
                    metadata={"hnsw:space": "cosine"}  # Ensure consistent embedding space
                )
                print(f"Created new collection: {self.collection_name}")
        except Exception as e:
            print(f"Error with collection: {str(e)}")
            # Create a unique collection name instead
            import uuid
            self.collection_name = f"codebook_{uuid.uuid4().hex[:8]}"
            print(f"Creating collection with new name: {self.collection_name}")
            self.collection = self.chroma_client.create_collection(
                self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
        
        # Initialize the LangChain Chroma wrapper
        self.db = Chroma(
            client=self.chroma_client,
            collection_name=self.collection_name,
            embedding_function=self.embeddings
        )
        
        # Initialize the text splitter for chunking
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        # Initialize the language model
        self.llm = ChatOpenAI(temperature=0, openai_api_key=os.getenv("OPENAI_API_KEY"))
    
    def process_section(self, section_info):
        """
        Process a single section and add it to the vector database
        
        Args:
            section_info: Dict with section_name and section_number
            
        Returns:
            int: Number of chunks added
        """
        section_name = section_info['section_name']
        section_number = section_info['section_number']
        
        # Extract the section content using the provided function
        content = extract_section_content(self.html_document_id, section_number)
        
        # Split into smaller chunks if needed (for very large sections)
        chunks = self.text_splitter.split_text(content)
        
        # Use LangChain's add_texts which handles the embedding
        texts = [chunk for chunk in chunks]
        metadatas = [{
            'section_name': section_name,
            'section_number': section_number
        } for _ in chunks]
        
        ids = [f"{section_number}-chunk-{i}" for i in range(len(chunks))]
        
        # Add texts using LangChain's interface
        if texts:
            self.db.add_texts(texts=texts, metadatas=metadatas, ids=ids)
        
        return len(chunks)
    
    def process_all_sections(self, sections_list):
        """
        Process all sections in the provided list
        
        Args:
            sections_list: List of dicts with section_name and section_number
            
        Returns:
            int: Total number of chunks added
        """
        total_chunks = 0
        for section in sections_list:
            print(section)
            try:
                chunks_added = self.process_section(section)
                total_chunks += chunks_added
                print(f"Added section {section['section_number']}: {section['section_name']} ({chunks_added} chunks)")
            except Exception as e:
                print(f"Error processing section {section['section_number']}: {str(e)}")
        
        return total_chunks
    
    def query_codebook(self, question):
        """
        Query the codebook with a natural language question
        
        Args:
            question: The question to ask
        
        Returns:
            dict: The answer and source information
        """
        # Create retriever from vector store
        retriever = self.db.as_retriever(search_kwargs={"k": 3})
        
        # Set up the QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True
        )
        
        # Get the answer
        result = qa_chain.invoke({"query": question})
        
        # Format the response
        answer = result['result']
        
        # Extract source information
        sources = []
        for doc in result['source_documents']:
            sources.append({
                'section_number': doc.metadata.get('section_number'),
                'section_name': doc.metadata.get('section_name')
            })
        
        return {
            'answer': answer,
            'sources': sources
        }

if __name__ == "__main__":
    # Example usage
    html_document_id = "bargersville_in"  # Replace with actual document ID
    
    # Use reset_db=True to start fresh
    retriever = CodebookRetriever(html_document_id=html_document_id, reset_db=False)
    
    sections_list = [
        {
            "section_number": "154.032",
            "section_name": "RESIDENTIAL DISTRICTS STANDARDS AND USES."
        },
        {
            "section_number": "154.033",
            "section_name": "COMMERCIAL DISTRICTS STANDARDS AND USES."
        },
        {
            "section_number": "154.034",
            "section_name": "INDUSTRIAL DEVELOPMENT STANDARDS AND USES."
        },
        {
            "section_number": "154.035",
            "section_name": "SPECIAL DISTRICT DEVELOPMENT STANDARDS."
        },
    ]
    
    retriever.process_all_sections(sections_list)