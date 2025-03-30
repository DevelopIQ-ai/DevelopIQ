"""Main graph definition for the municipal code retrieval and analysis system."""

from __future__ import annotations
import os
import requests
from typing import Dict, Any, TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableConfig
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import json, re
from langsmith import traceable
# Import your existing helper functions
from src.utils.alp_scraper import scrape_html_from_alp
from src.utils.codebook_helpers import extract_table_of_contents, get_section_content
from src.RAG.codebook_retriever import CodebookRetriever
from src.agent.config_file import Configuration

# Define the state as a TypedDict
class DocumentState(TypedDict):
    # Processing state
    html_document_id: str
    document_content: str
    
    # Results
    title_list: Dict[str, Any]
    section_list: Dict[str, Any]
    analysis_results: Dict[str, Any]
# Configuration handler
def get_config(config: RunnableConfig) -> Configuration:
    """Get the full configuration object."""
    return Configuration.from_runnable_config(config)

# Define node functions
def initialize_state(state: DocumentState, config: RunnableConfig) -> DocumentState:
    """Initialize the state from configuration."""
    configuration = get_config(config)
    
    # Create document ID from municipality and state
    document_id = f"{configuration.municipality.lower().replace(' ', '_')}_{configuration.state.lower()}"
    
    # Return updated state with initial values
    return {
        **state,
        "html_document_id": document_id,
    }

def retrieve_html_document(state: DocumentState, config: RunnableConfig) -> DocumentState:
    """Retrieve the HTML document."""
    configuration = get_config(config)
    document_id = state["html_document_id"]
    use_cache = configuration.use_html_cache
    
    os.makedirs(configuration.storage_path, exist_ok=True)
    
    # Check if document already exists in cache
    storage_file_path = f"{configuration.storage_path}/{document_id}.html"
    if os.path.exists(storage_file_path) and use_cache:
        print(f"Using cached HTML document with ID: {document_id}")
        with open(storage_file_path, "r", encoding="utf-8") as f:
            document_content = f.read()
        return {**state, "document_content": document_content}
    
    # If not in cache, try to fetch from web (unless in test mode)
    if not configuration.test_mode:
        try:
            html_url = scrape_html_from_alp(configuration.municipality, configuration.state)
            response = requests.get(html_url)
            response.raise_for_status()
            
            if response.status_code == 200:
                print("Successfully fetched HTML document")
                html_content = response.text
                with open(storage_file_path, "w", encoding="utf-8") as f:
                    f.write(html_content)
                return {**state, "document_content": html_content}
        except Exception as e:
            print(f"Error fetching document: {e}")
    
    # If we reach here, we couldn't get the document
    raise ValueError(f"Could not retrieve HTML document for {configuration.municipality}, {configuration.state}")

def get_section_list(state: DocumentState, config: RunnableConfig) -> DocumentState:
    """Get the list of relevant sections by identifying the most relevant chapter."""
    configuration = get_config(config)
    html_document_id = state["html_document_id"]
    use_cache = configuration.use_toc_cache
    
    # Extract titles and chapters
    hierarchy = extract_table_of_contents(
        html_document_id=html_document_id,
        hierarchy_depth="titles_and_chapters"
    )
    
    # Use LLM to analyze and identify relevant chapter
    llm = ChatOpenAI(model=configuration.model_name, temperature=0)
    prompt = ChatPromptTemplate.from_template("""
        As a municipal code expert, identify the most relevant title and chapter 
        about {topic} for zone code {zone_code}.
        
        Document structure:
        {hierarchy}
        
        Return JSON only:
        {{
            "selected_title": "EXACT TITLE TEXT",
            "title_reason": "Brief explanation",
            "selected_chapter": "EXACT CHAPTER TEXT",
            "chapter_number": "EXACT CHAPTER NUMBER",
            "chapter_reason": "Brief explanation"
        }}
    """)
    
    response = llm.invoke(prompt.format(
        topic="Development Standards", 
        zone_code=configuration.zone_code, 
        hierarchy=hierarchy
    ))
    
    # Extract JSON from response
    json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
    if not json_match:
        raise ValueError("LLM response did not contain valid JSON")
    
    selection = json.loads(json_match.group(0))    
    chapter_number = selection["chapter_number"]
    
    # Get sections from selected chapter
    section_list = extract_table_of_contents(
        html_document_id=html_document_id,
        target_chapter=chapter_number  
    )
    
    print(f"Found {len(section_list)} sections in {selection['selected_chapter']}")
    return {**state, "section_list": section_list}

def extract_section_content_and_index(state: DocumentState, config: RunnableConfig) -> DocumentState:
    """Extract section content and index it in the vector database."""
    configuration = get_config(config)
    html_document_id = state["html_document_id"]
    use_cache = configuration.use_chunk_cache
    
    # Initialize retriever
    retriever = CodebookRetriever(html_document_id=html_document_id)
    codebook_exists = retriever.codebook_exists_and_is_indexed(html_document_id)
    print("CODEBOOK EXISTS: ", codebook_exists)
    # if cache is enabled or codebook does not exist, process the sections
    if use_cache or not retriever.codebook_exists_and_is_indexed(html_document_id):
        sections = state["section_list"]
        print("PROCESSING SECTIONS, because cache is disabled or codebook does not exist")
        retriever.process_all_sections(sections, get_section_content)
    else:
        print("Codebook already exists, using cached version")
    
def analyze_municipal_code(state: DocumentState, config: RunnableConfig) -> DocumentState:
    """Query the indexed codebook and analyze results."""
    configuration = get_config(config)
    html_document_id = state["html_document_id"]
    use_cache = configuration.use_query_cache
    
    # Initialize retriever (using the same database as the previous node)
    retriever = CodebookRetriever(html_document_id=html_document_id)
    
    # Query the codebook
    prohibited_signs = retriever.query_codebook("List the prohibited signs.")
    permitted_signs = retriever.query_codebook("List the permitted signs.")

    # Update state with analysis results
    analysis_results = {
        "prohibited_signs": prohibited_signs,
        "permitted_signs": permitted_signs
    }
    
    print("Analysis results:", analysis_results)
    return {**state, "analysis_results": analysis_results}

def create_graph() -> StateGraph:
    """Create the graph for the municipal code retrieval and analysis system."""
    graph = StateGraph(DocumentState)
    
    # Add nodes and connect them
    graph.add_node("initialize_state", initialize_state)
    graph.add_node("retrieve_html_document", retrieve_html_document)
    graph.add_node("get_section_list", get_section_list)
    graph.add_node("extract_section_content_and_index", extract_section_content_and_index)
    graph.add_node("analyze_municipal_code", analyze_municipal_code)
    
    graph.add_edge(START, "initialize_state")
    graph.add_edge("initialize_state", "retrieve_html_document")
    graph.add_edge("retrieve_html_document", "get_section_list")
    graph.add_edge("get_section_list", "extract_section_content_and_index")
    graph.add_edge("extract_section_content_and_index", "analyze_municipal_code")
    graph.add_edge("analyze_municipal_code", END)
    
    return graph.compile()

# Create the graph instance for the LangGraph server
graph = create_graph()

# Main execution function for direct use
def run_analysis(
    municipality: str = "Bargersville",
    state: str = "IN",
    zone_code: str = "RR",
    use_html_cache: bool = True,
    use_toc_cache: bool = True,
    use_section_cache: bool = False,
    test_mode: bool = False,
    model_name: str = "gpt-4o-mini",
    storage_path: str = "./html_storage"
) -> Dict[str, Any]:
    """Run the municipal code analysis with configurable parameters."""
    # Create configuration
    config = {
        "configurable": {
            "municipality": municipality,
            "state": state,
            "zone_code": zone_code,
            "use_html_cache": use_html_cache,
            "use_toc_cache": use_toc_cache,
            "use_section_cache": use_section_cache,
            "model_name": model_name,
            "storage_path": storage_path,
            "test_mode": test_mode
        }
    }
    
    # Initial state (minimal, with only values that change during processing)
    initial_state = {
        "html_document_id": "",
        "document_content": "",
        "title_list": {},
        "section_list": {},
        "analysis_results": {}
    }
    
    # Run the graph
    final_state = graph.invoke(initial_state, config)
    
    # Return the analysis results
    return final_state["analysis_results"]
if __name__ == "__main__":
    results = run_analysis(test_mode=True)
    print("\nFinal Results:")
    for key, value in results.items():
        print(f"\n{key.upper()}:")
        print(value)