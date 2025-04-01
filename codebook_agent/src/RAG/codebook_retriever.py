import os
import asyncio
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
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from concurrent.futures import ThreadPoolExecutor


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
            chunk_size=8000,
            chunk_overlap=500
        )
                                                                            
        self.llm = ChatOpenAI(temperature=0, openai_api_key=os.getenv("OPENAI_API_KEY"), model="gpt-4o-mini")
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
            
    async def process_all_sections(self, sections_list, extract_section_content):
        """
        Process all sections in the provided list asynchronously
        
        Args:
            sections_list: List of dicts with section_name and section_number
            
        Returns:
            int: Total number of chunks added
        """
        tasks = []
        for section in sections_list:
            print(f"Creating task for section {section['sectionNumber']}: {section['sectionName']}")
            task = self.process_section(section, extract_section_content)
            tasks.append(task)
        
        # Wait for all tasks to complete
        results = await asyncio.gather(*tasks)
        
        total_chunks = sum(results)
        return total_chunks
    
    async def process_section(self, section_info, extract_section_content):
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

        # Run the CPU-bound content extraction in a thread pool
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as executor:
            content_dict = await loop.run_in_executor(
                executor,
                extract_section_content,
                self.html_document_id, 
                full_number
            )
            
        if "error" in content_dict:
            print(f"Error extracting content: {content_dict['error']}")
            return 0
            
        content_text = content_dict["content"] 
        
        # Split into smaller chunks if needed (for very large sections)
        with ThreadPoolExecutor() as executor:
            chunks = await loop.run_in_executor(
                executor,
                self.text_splitter.split_text,
                content_text
            )
            
        # Prepare metadata and IDs
        texts = [chunk for chunk in chunks]
        metadatas = [{
            'chapterNumber': chapter_number,
            'sectionName': section_name,
            'sectionNumber': section_number
        } for _ in chunks]
        
        ids = [f"{section_number}-chunk-{i}" for i in range(len(chunks))]
        
        # Add texts using LangChain's interface
        if texts:
            with ThreadPoolExecutor() as executor:
                await loop.run_in_executor(
                    executor,
                    self.db.add_texts,
                    texts, metadatas, ids
                )
            
        print(f"Added section {section_number}: {section_name} ({len(chunks)} chunks)")
        return len(chunks)
    
    def query_codebook(self, question, structured_output):
        """
        Query the codebook with a natural language question
        
        Args:
            question: The question to ask
            structured_output: Pydantic model class for structured output
        
        Returns:
            dict: The answer and source information
        """
        # Create retriever from vector store
        retriever = self.db.as_retriever(search_kwargs={"k": 5})
        
        # Create a prompt template
        
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
        
        result = chain.invoke(question)
        
        # Get source documents
        source_docs = []
        if hasattr(chain, 'retriever') and hasattr(chain.retriever, 'get_relevant_documents'):
            source_docs = chain.retriever.get_relevant_documents(question)
        
        # Extract source information
        sources = []
        for doc in source_docs:
            sources.append({
                'sectionName': doc.metadata['sectionName'],
                'sectionNumber': doc.metadata['sectionNumber'],
                'chapterNumber': doc.metadata['chapterNumber'],
            })
        
        return {
            'answer': result,
            'sources': sources
        }

    def process_all_sections_sync(self, sections_list, extract_section_content):
        """Synchronous wrapper for process_all_sections"""
        return asyncio.run(self.process_all_sections(sections_list, extract_section_content))