"""Query graph for municipal code data extraction."""

from __future__ import annotations
import os
import operator
from typing import Dict, Any, Annotated, TypedDict, Optional
from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableConfig
import json
from agent_graphs.queries import (
    BUILDING_REQUIREMENTS_QUERIES,
    format_query
)
from agent_graphs.models import NumericalAnswer
from agent_graphs.configurations import QuerierConfiguration
from qdrant_wrapper.qdrant_retriever import QdrantRetriever

# Custom reducer function for dictionary merge
def dict_merge(existing: Dict[str, Any], new: Dict[str, Any]) -> Dict[str, Any]:
    """Merge two dictionaries without overwriting the existing one."""
    result = existing.copy()
    for key, value in new.items():
        if key not in result:
            result[key] = value
    return result

# Define the state with reducer functions
class QuerierState(TypedDict):
    document_id: str
    zone_code: str
    results: Dict[str, Dict[str, Any]]

def get_config(config: RunnableConfig) -> QuerierConfiguration:
    """Get the full configuration object."""
    return QuerierConfiguration.from_runnable_config(config)

def init_state(state: QuerierState, config: RunnableConfig) -> QuerierState:
    if "document_id" not in state.keys():
        raise ValueError("Missing required key: document_id")
    if "zone_code" not in state.keys():
        raise ValueError("Missing required key: zone_code")
    return {
        **state,
        "results": {}
    }

async def building_requirements_node(state: QuerierState, config: RunnableConfig) -> QuerierState:
    """Query building requirements from the municipal code."""
    document_id = state["document_id"]
    zone_code = state["zone_code"]  
   
    # Create a dictionary mapping query types to their queries
    queries = {
        "maximum_building_height": format_query(BUILDING_REQUIREMENTS_QUERIES["maximum_building_height"], zone_code=zone_code),
        "maximum_lot_coverage": format_query(BUILDING_REQUIREMENTS_QUERIES["maximum_lot_coverage"], zone_code=zone_code)
    }
    
    retriever = QdrantRetriever(document_id=document_id)
    await retriever.initialize()

    # Get the questions list and keep track of which index corresponds to which query type
    questions = list(queries.values())
    query_vars = list(queries.keys())
    
    # Execute queries in parallel as before
    raw_results = await retriever.execute_queries_in_parallel(questions, NumericalAnswer)
    
    # Reorganize results into a dictionary using the query types
    results = {
        query_var: raw_results[i] 
        for i, query_var in enumerate(query_vars)
    }
    return {
        **state,
        "results": results
    }
# def combine_results_node(state: Dict[str, Any]) -> Dict[str, Any]:
#     """Combine results from parallel nodes into a consolidated schema."""
#     # Get all requirements and errors
#     requirements = state.get("requirements", {})
#     errors = state.get("errors", {})
    
#     try:
#         # Create the final QueryResult with all nested data
#         result = QueryResult(
#             building_requirements=requirements.get("building_requirements"),
#             errors=errors
#         )
        
#         # Return the model as a dictionary
#         return {
#             "html_document_id": state.get("html_document_id", ""),
#             "zone_code": state.get("zone_code", ""),
#             "result": result.model_dump()
#         }
#     except Exception as e:
#         # If validation fails, add error
#         error_message = f"Error validating results: {str(e)}"
#         print(error_message)
        
#         return {
#             "html_document_id": state.get("html_document_id", ""),
#             "zone_code": state.get("zone_code", ""),
#             "errors": {**errors, "validation": error_message}
#         }

# Create the query graph
def create_graph() -> StateGraph:
    """Create the graph for municipal code querying."""
    querier_graph = StateGraph(QuerierState)
    
    # Add nodes
    querier_graph.add_node("init_state_node", init_state)
    querier_graph.add_node("building_requirements_node", building_requirements_node)
    # graph.add_node("combine_results_node", combine_results_node)
    
    # Add edges
    querier_graph.add_edge(START, "init_state_node")    
    querier_graph.add_edge("init_state_node", "building_requirements_node")
    querier_graph.add_edge("building_requirements_node", END)
    # graph.add_edge("building_requirements_node", "combine_results_node")
    # graph.add_edge("combine_results_node", END)
    return querier_graph.compile()

querier_graph = create_graph()
graph = querier_graph
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
        "requirements": {},
        "errors": {}
    }
    
    # Run the graph
    final_state = graph.invoke(initial_state, config)
    
    # Return the validated result
    return final_state

if __name__ == "__main__":
    results = run_query(
        html_document_id="bargersville_in",
        zone_code="RR"
    )
    print("\nDevelopment Requirements:")
    print(json.dumps(results, indent=2))