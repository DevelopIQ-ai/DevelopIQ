"""Main graph definition for the municipal code retrieval and analysis system."""

from __future__ import annotations
import asyncio
import os
from qdrant_wrapper.qdrant_base import QdrantBase
import requests
from typing import Dict, Any, TypedDict, Optional, Literal
from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableConfig
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import json, re
from langsmith import traceable
# Import your existing helper functions
from src.utils.alp_scraper import scrape_html_from_alp
from src.utils.codebook_helpers import extract_table_of_contents, get_section_content
from agent_graphs.configurations import ExtractorConfiguration
from qdrant_wrapper.qdrant_base import DocumentStatus
from qdrant_wrapper.qdrant_ingestor import QdrantIngestor
from dotenv import load_dotenv
load_dotenv()

# Define the state as a TypedDict
class ExtractorState(TypedDict):
    document_id: str
    document_content: str
    municipality: str 
    state_code: str
    zone_code: str
    section_list: Dict[str, Any]


def get_config(config: RunnableConfig) -> ExtractorConfiguration:
    return ExtractorConfiguration.from_runnable_config(config)

#### HELPERS #####

def create_document_id(municipality: str, state: str) -> str:
    return f"{municipality.lower().replace(' ', '_')}_{state.lower()}"


def fetch_from_s3(document_id: str) -> Optional[str]:
    """Fetch HTML document from S3."""
    try:
        base_url = os.getenv("S3_BASE_URL") + document_id + ".html"
        response = requests.get(base_url)
        
        if response.status_code == 200:
            print("Successfully fetched HTML document from S3")
            return response.text
        else:
            print(f"Document not found in S3 (status code: {response.status_code}). Trying to scrape directly...")
            return None
    except Exception as e:
        print(f"Error fetching document from S3: {e}. Trying to scrape directly...")
        return None

#### GRAPH NODES ####

def init_state(state: ExtractorState, config: RunnableConfig) -> ExtractorState:
    """Initialize the state for the extractor graph."""

    if "municipality" not in state.keys():
        raise ValueError("Missing required keys: municipality")
    if "state_code" not in state.keys():
        raise ValueError("Missing required keys: state_code")

    document_id = create_document_id(state["municipality"], state["state_code"])
    return {
        **state,
        "document_id": document_id
    }

async def router_func(state: ExtractorState) -> Literal["get_codebook_alp", "final_node"]:
    """Find the codebook for the given municipality and state."""
    qclient = QdrantBase()
    if not state["document_id"]:
        raise ValueError("Missing required keys: document_id")
    codebook_exists = await qclient.document_exists_and_is_indexed(state["document_id"])
    print("CODEBOOK EXISTS: ", codebook_exists)
    if codebook_exists is DocumentStatus.INDEXED:
        print("INDEX INDEX INDEX")
        return "final_node"
    elif codebook_exists is DocumentStatus.UDC:
        print("UDC UDC UDC")
        return "final_node"
    elif codebook_exists is DocumentStatus.EMPTY:
        print("EMPTY EMPTY EMPTY")
        return "final_node"
    elif codebook_exists is DocumentStatus.NOT_EXISTS:
        print("NOT EXISTS NOT EXISTS NOT EXISTS")
        return "get_codebook_alp"
    else:
        raise ValueError(f"Unknown document status: {codebook_exists}")

### only go here if the codebook is not found. 
async def get_codebook_alp(state: ExtractorState, config: RunnableConfig) -> ExtractorState:
    """Retrieve the HTML document from S3 or by scraping if not available in S3."""
    configuration = get_config(config)
    document_id = state["document_id"]
    
    # Try to get document from S3 first
    document_content = fetch_from_s3(document_id)
    if document_content is not None:
        return {**state, "document_content": document_content}
    
    # If S3 fetch failed, try direct scraping
    try:
        html_url = scrape_html_from_alp(state["municipality"], state["state_code"])
        response = requests.get(html_url)
        response.raise_for_status()
        
        print("Successfully scraped HTML document directly")
        document_content = response.text
        return {**state, "document_content": document_content}
    except Exception as e:
        print(f"Error scraping document directly: {e}")
    
    # If we reach here, we couldn't get the document from either source
    raise ValueError(f"Could not retrieve document for {state['municipality']}, {state['state_code']}")

    
async def get_section_names_alp(state: ExtractorState, config: RunnableConfig) -> ExtractorState:
    """Get the list of relevant sections by identifying the most relevant chapter."""
    configuration = get_config(config)
    document_content = state["document_content"]
    
    # Extract titles and chapters
    hierarchy = extract_table_of_contents(
        html_content=document_content,
        hierarchy_depth="titles_and_chapters"
    )
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
        zone_code=state["zone_code"], 
        hierarchy=hierarchy
    ))
    
    json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
    if not json_match:
        raise ValueError("LLM response did not contain valid JSON")
    
    selection = json.loads(json_match.group(0))    
    chapter_number = selection["chapter_number"]
    
    # Get sections from selected chapter
    section_list = extract_table_of_contents(
        html_content=document_content,
        target_chapter=chapter_number  
    )
    
    print(f"Found {len(section_list)} sections in {selection['selected_chapter']}")
    return {**state, "section_list": section_list}


async def chunk_alp(state: ExtractorState, config: RunnableConfig) -> ExtractorState:
    """Chunk the sections and ingest them into Qdrant."""
    ingestor = QdrantIngestor(state["document_id"], state["document_content"])
    await ingestor.create_empty_codebook()
    sections = state["section_list"]
    await ingestor.process_all_sections(sections, get_section_content)
    return state

async def final_node(state: ExtractorState, config: RunnableConfig) -> ExtractorState:
    """Final node to return the state."""
    return state

def create_graph() -> StateGraph:
    """Create the graph for the municipal code retrieval and analysis system."""
    extractor_graph = StateGraph(ExtractorState)
    
    # Add nodes and connect them
    extractor_graph.add_node("init_state", init_state)
    extractor_graph.add_node("get_codebook_alp", get_codebook_alp)
    extractor_graph.add_node("get_section_names_alp", get_section_names_alp)
    extractor_graph.add_node("chunk_alp", chunk_alp)
    extractor_graph.add_node("final_node", final_node)
    extractor_graph.add_edge(START, "init_state")
    extractor_graph.add_conditional_edges(
    "init_state",
    router_func,
    )
    extractor_graph.add_edge("get_codebook_alp", "get_section_names_alp")
    extractor_graph.add_edge("get_section_names_alp", "chunk_alp")
    extractor_graph.add_edge("chunk_alp", "final_node")
    extractor_graph.add_edge("final_node", END)
    
    return extractor_graph.compile()

extractor_graph = create_graph()

graph = extractor_graph

async def run_analysis(
    test_mode: bool = False,
    model_name: str = "gpt-4o-mini",
) -> Dict[str, Any]:
    """Run the municipal code analysis with configurable parameters."""
    print("RUNNING ANALYSIS")
    config = {
        "configurable": {
            "model_name": model_name,
            "test_mode": test_mode
        }
    }
    initial_state = {
        "document_id": "",
        "document_content": "",
        "section_list": {},
        "municipality": "ALBANY",
        "state_code": "IN",
        "zone_code": "R-R"
    }
    
    # Run the graph
    final_state = await extractor_graph.ainvoke(initial_state, config)
    return final_state


if __name__ == "__main__":
    results = asyncio.run(run_analysis(test_mode=False))
    print("RESULTS: ", results)
    print("\nFinal Results:")
    for key, value in results.items():
        print(f"\n{key.upper()}:")
        print(value)


