"""Query graph for municipal code data extraction."""

from __future__ import annotations
import os
from typing import Dict, Any, List, Optional, Union
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableConfig
from langchain_openai import ChatOpenAI
import json

from src.RAG.codebook_retriever import CodebookRetriever
from src.RAG.queries import (
    SIGNAGE_QUERIES,
    # PARKING_QUERIES,  # Commented out
    format_query
)
from src.agent.config_file import Configuration


class SignList(BaseModel):
    signs: List[str] = Field(description="List of individual signs, with each sign as a separate item")

class DesignRequirements(BaseModel):
    requirements: str = Field(description="Detailed description of sign design requirements")
    
class SignageRequirements(BaseModel):
    permitted_sign_types: Optional[SignList] = Field(None, alias="Permitted Sign Types")
    prohibited_sign_types: Optional[SignList] = Field(None, alias="Prohibited Sign Types")
    design_requirements: Optional[DesignRequirements] = Field(None, alias="Design Requirements")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class QueryResult(BaseModel):
    signage_requirements: Optional[SignageRequirements] = None
    errors: Dict[str, str] = Field(default_factory=dict)

# Configuration handler
def get_config(config: RunnableConfig) -> Configuration:
    """Get the full configuration object."""
    return Configuration.from_runnable_config(config)

# Initialization node
def initialize_query_state(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
    """Initialize the query state with a retriever instance."""
    configuration = get_config(config)
    html_document_id = "bargersville_in"
    zone_code = "RR"
    
    try:
        # Initialize retriever once
        retriever = CodebookRetriever(html_document_id=html_document_id)
        return {**state, "html_document_id": html_document_id, "zone_code": zone_code, "retriever": retriever}
    
    except Exception as e:
        # Handle errors
        error_message = f"Error initializing retriever: {str(e)}"
        print(error_message)
        errors = state.get("errors", {})
        return {**state, "errors": {**errors, "initialization": error_message}}

def query_signage_requirements(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
    """Query signage requirements from the municipal code."""
    retriever = state["retriever"]
    zone_code = state["zone_code"]
    
    try:
        # Query for permitted sign types
        permitted_signs_query = format_query(SIGNAGE_QUERIES["permitted_signs"], zone_code=zone_code)
        permitted_signs_result = retriever.query_codebook(permitted_signs_query, SignList)
        
        # Query for prohibited sign types
        prohibited_signs_query = format_query(SIGNAGE_QUERIES["prohibited_signs"], zone_code=zone_code)
        prohibited_signs_result = retriever.query_codebook(prohibited_signs_query, SignList)
        
        # Query for design requirements
        design_requirements_query = format_query(SIGNAGE_QUERIES["design_requirements"], zone_code=zone_code)
        design_requirements_result = retriever.query_codebook(design_requirements_query, DesignRequirements)
        
        signage_requirements = SignageRequirements(
            **{
                "Permitted Sign Types": permitted_signs_result["answer"],
                "Prohibited Sign Types": prohibited_signs_result["answer"],
                "Design Requirements": design_requirements_result["answer"]
            }
        )
        return {**state, "signage_requirements": signage_requirements.model_dump()}
    
    except Exception as e:
        # Handle errors
        error_message = f"Error querying signage requirements: {str(e)}"
        print(error_message)
        errors = state.get("errors", {})
        return {**state, "errors": {**errors, "signage_requirements": error_message}}

def combine_results(state: Dict[str, Any]) -> Dict[str, Any]:
    """Combine results from parallel nodes into a consolidated schema."""
    # Remove the retriever from the final state as it's not needed anymore
    # and might cause serialization issues
    state_without_retriever = {k: v for k, v in state.items() if k != "retriever"}
    
    try:
        # Create the final QueryResult with all nested data
        result = QueryResult(
            signage_requirements=state.get("signage_requirements"),
            # parking_requirements=state.get("parking_requirements"),  # Commented out
            errors=state.get("errors", {})
        )
        
        # Return the model as a dictionary
        return result.model_dump()
    except Exception as e:
        # If validation fails, return original state without retriever
        error_message = f"Error validating results: {str(e)}"
        print(error_message)
        errors = state_without_retriever.get("errors", {})
        return {
            **state_without_retriever, 
            "errors": {**errors, "validation": error_message}
        }

# Create the query graph
def create_graph() -> StateGraph:
    """Create the graph for municipal code querying."""
    graph = StateGraph(Dict)
    
    # Add nodes
    graph.add_node("initialize_query_state", initialize_query_state)
    graph.add_node("query_signage_requirements", query_signage_requirements)
    # graph.add_node("query_parking_requirements", query_parking_requirements)  # Commented out
    graph.add_node("combine_results", combine_results)
    
    # Add edges
    graph.add_edge(START, "initialize_query_state")
    
    # Add edges for parallel processing
    graph.add_edge("initialize_query_state", "query_signage_requirements")
    # graph.add_edge("initialize_query_state", "query_parking_requirements")  # Commented out
    
    # Join parallel paths
    graph.add_edge("query_signage_requirements", "combine_results")
    # graph.add_edge("query_parking_requirements", "combine_results")  # Commented out
    graph.add_edge("combine_results", END)
    
    return graph.compile()

# Create the graph instance for the LangGraph server
graph = create_graph()

# Main execution function
def run_query(
    html_document_id: str,
    zone_code: str,
    model_name: str = "gpt-4o-mini"
) -> Dict[str, Any]:
    """Run the municipal code query with configurable parameters."""
    # Create configuration
    config = {
        "configurable": {
            "model_name": model_name,
            "zone_code": zone_code
        }
    }
    
    # Initial state
    initial_state = {
        "html_document_id": html_document_id,
        "zone_code": zone_code,
        "retriever": None,  # Will be populated in initialize_query_state
        "signage_requirements": {},
        # "parking_requirements": {},  # Commented out
        "errors": {}
    }
    
    # Run the graph
    final_state = graph.invoke(initial_state, config)
    
    # Return the validated result
    return final_state

if __name__ == "__main__":
    # Example usage
    results = run_query(
        html_document_id="bargersville_in",
        zone_code="RR"
    )
    print("\nSignage Requirements:")
    print(json.dumps(results.get("signage_requirements", {}), indent=2))
    # print("\nParking Requirements:")  # Commented out
    # print(json.dumps(results.get("parking_requirements", {}), indent=2))  # Commented out