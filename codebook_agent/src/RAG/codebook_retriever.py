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
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

# HYPER PARAMETERS

# chunk size
# chunk overlap
# k
# search type
# score threshold

# METHODS

# retrieval style
# filter
# hybrid search - keyword + semantic
# reranker


class CodebookRetriever:

    
    def __init__(self, persist_directory="./codebook_db", html_document_id=None, reset_db=False):
        """
        Initialize the CodebookRetriever
        
        Args:
            persist_directory: Directory to store the vector database
            html_document_id: The ID of the HTML document to extract sections from
            reset_db: If True, deletes existing database to start fresh
        """
        if not html_document_id:
            raise ValueError("html_document_id is required")
        
        self.persist_directory = persist_directory
        self.html_document_id = html_document_id
        
        if reset_db and os.path.exists(persist_directory):
            shutil.rmtree(persist_directory)
            print(f"Removed existing database at {persist_directory}")
        else:
            print(f"Using existing database at {persist_directory}")
        
        Path(persist_directory).mkdir(parents=True, exist_ok=True)
        
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
        self.chroma_client = chromadb.PersistentClient(path=persist_directory)  
        self.collection_name = f"{self.html_document_id}"        
            # Try to get the collection directly
        try:
            self.collection = self.chroma_client.get_collection(self.collection_name)
            print(f"Using existing collection: {self.collection_name}")
        except Exception as e: # tried to do value error but it was not working
            print("Collection does not exist, creating new collection")
            self.collection = self.chroma_client.create_collection(
                self.collection_name,
                metadata={"hnsw:space": "cosine"}  # Ensure consistent embedding space
            )
            print(f"Created new collection: {self.collection_name}")                                                                 
        self.db = Chroma(
            client=self.chroma_client,
            collection_name=self.collection_name,
            embedding_function=self.embeddings
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
                                                                            
        self.llm = ChatOpenAI(temperature=0, openai_api_key=os.getenv("OPENAI_API_KEY"))
        print("CodebookRetriever initialized")

    def codebook_exists_and_is_indexed(self, collection_name):
        """
        Check if the codebook exists and is indexed
        """
        print("Checking if codebook exists and is indexed", collection_name)
        try:
            self.chroma_client.get_collection(collection_name)
            if self.collection.count() > 0:
                print("Codebook exists and is indexed", collection_name)
                return True
            else:
                print("Codebook exists but is empty", collection_name)
                return False
        except Exception as e:
            print("Codebook does not exist or is not indexed", collection_name)
            return False
            
    def process_all_sections(self, sections_list, extract_section_content):
        """
        Process all sections in the provided list
        
        Args:
            sections_list: List of dicts with section_name and section_number
            
        Returns:
            int: Total number of chunks added
        """
        total_chunks = 0
        for section in sections_list:
            print(f"Processing section {section['sectionNumber']}: {section['sectionName']}")
            try:
                chunks_added = self.process_section(section, extract_section_content)
                total_chunks += chunks_added
                print(f"Added section {section['sectionNumber']}: {section['sectionName']} ({chunks_added} chunks)")
            except Exception as e:
                print(f"Error processing section {section['sectionNumber']}: {str(e)}")
        
        return total_chunks
    
    def process_section(self, section_info, extract_section_content):
        """
        Process a single section and add it to the vector database
        
        Args:
            section_info: Dict with section_name and section_number
            
        Returns:
            int: Number of chunks added
        """
        section_name = section_info['sectionName']
        section_number = section_info['sectionNumber']
        chapter_number = section_info['chapterNumber']
        full_number = chapter_number + "." + section_number


        content_dict = extract_section_content(self.html_document_id, full_number)
        if "error" in content_dict:
            print(f"Error extracting content: {content_dict['error']}")
            return 0
        content_text = content_dict["content"] 
        # Split into smaller chunks if needed (for very large sections)
        chunks = self.text_splitter.split_text(content_text)
        # Use LangChain's add_texts which handles the embedding
        texts = [chunk for chunk in chunks]
        metadatas = [{
            'chapterNumber': chapter_number,
            'sectionName': section_name,
            'sectionNumber': section_number
        } for _ in chunks]
        
        ids = [f"{section_number}-chunk-{i}" for i in range(len(chunks))]
        
        # Add texts using LangChain's interface
        if texts:
            self.db.add_texts(texts=texts, metadatas=metadatas, ids=ids)
            
        return len(chunks)
    
    def query_codebook(self, question):
        """
        Query the codebook with a natural language question
        
        Args:
            question: The question to ask
        
        Returns:
            dict: The answer and source information
        """
        # Create retriever from vector store
        print("INSPECTING METADATA SAMPLE:")
        results = self.collection.get(limit=2)
        if results and 'metadatas' in results and results['metadatas']:
            for i, metadata in enumerate(results['metadatas']):
                print(f"Document {i} metadata: {metadata}")
        retriever = self.db.as_retriever(search_kwargs={"k": 5})
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
                'sectionName': doc.metadata['sectionName'],
                'sectionNumber': doc.metadata['sectionNumber'],
                'chapterNumber': doc.metadata['chapterNumber'],
            })

        return {
            'answer': answer,
            'sources': sources
        }
