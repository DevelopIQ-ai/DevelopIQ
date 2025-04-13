# """Query graph for municipal code data extraction."""

# from __future__ import annotations
# import os
# import operator
# from typing import Dict, Any, Annotated, TypedDict, Optional
# from langgraph.graph import StateGraph, START, END
# from langchain_core.runnables import RunnableConfig
# import json

# from src.RAG.codebook_retriever import CodebookRetriever
# from src.RAG.queries import (
#     SIGNAGE_QUERIES,
#     PARKING_QUERIES,
#     LOT_REQUIREMENTS_QUERIES,
#     BUILDING_PLACEMENT_QUERIES,
#     BUILDING_REQUIREMENTS_QUERIES,
#     LANDSCAPING_QUERIES,
#     PERMITTED_USES_QUERIES,
#     format_query
# )
# from src.RAG.query_models import (
#     Feet,
#     Percentage,
#     BuildingRequirements,
#     QueryResult,
# )
# from agent_graphs.configurations import Configuration

# # Custom reducer function for dictionary merge
# def dict_merge(existing: Dict[str, Any], new: Dict[str, Any]) -> Dict[str, Any]:
#     """Merge two dictionaries without overwriting the existing one."""
#     result = existing.copy()
#     for key, value in new.items():
#         if key not in result:
#             result[key] = value
#     return result

# # Define the state with reducer functions
# class MunicipalCodeState(TypedDict):
#     html_document_id: str
#     zone_code: str
#     requirements: Annotated[Dict[str, Any], dict_merge]  # Use custom reducer for requirements
#     errors: Annotated[Dict[str, str], dict_merge]  # Use custom reducer for errors

# # Helper function to create a new retriever instance
# def get_retriever(html_document_id: str):
#     """Create a new CodebookRetriever instance."""
#     try:
#         retriever = CodebookRetriever(html_document_id=html_document_id)
#         print("Created new retriever instance")
#         return retriever
#     except Exception as e:
#         print(f"Error creating retriever: {str(e)}")
#         return None

# # Configuration handler
# def get_config(config: RunnableConfig) -> Configuration:
#     """Get the full configuration object."""
#     return Configuration.from_runnable_config(config)

# # Initialization node
# def init_state_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
#     """Initialize the query state."""
#     configuration = get_config(config)
#     html_document_id = f"{configuration.municipality.lower().replace(' ', '_')}_{configuration.state.lower()}"
#     zone_code = configuration.zone_code
#     # Return updated state with initial values

#     # Create retriever but don't store it in state
#     retriever = get_retriever(html_document_id)
#     if not retriever:
#         return {
#             **state, 
#             "html_document_id": html_document_id, 
#             "zone_code": zone_code, 
#             "requirements": {},
#             "errors": {"initialization": "Failed to create retriever"}
#         }
    
#     return {
#         **state, 
#         "html_document_id": html_document_id, 
#         "zone_code": zone_code, 
#         "requirements": {},
#         "errors": {}
#     }

# # Building requirements query node
# async def building_requirements_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
#     """Query building requirements from the municipal code."""
#     html_document_id = state["html_document_id"]
#     zone_code = state["zone_code"]
    
#     # Create a new retriever instance for this node
#     retriever = get_retriever(html_document_id)
#     if not retriever:
#         return {
#             "errors": {
#                 "building_requirements": "Failed to get retriever"
#             }
#         }
    
#     try:
#         # Query for building height
#         height_query = format_query(BUILDING_REQUIREMENTS_QUERIES["building_height"], zone_code=zone_code)
#         height_result, height_source = await retriever.query_codebook(height_query, Feet)
        
#         coverage_query = format_query(BUILDING_REQUIREMENTS_QUERIES["lot_coverage"], zone_code=zone_code)
#         coverage_result, coverage_source = await retriever.query_codebook(coverage_query, Percentage)
        
#         # Create Pydantic model for building requirements
#         building_reqs = BuildingRequirements(
#             **{
#                 "Maximum Building Height": {
#                     "feet": height_result,
#                     "source": height_source
#                 },
#                 "Maximum Lot Coverage": {
#                     "percentage": coverage_result,
#                     "source": coverage_source
#                 }
#             }
#         )
        
#         # Return only the requirements we're updating
#         return {
#             "requirements": {
#                 "building_requirements": building_reqs.model_dump()
#             }
#         }
    
#     except Exception as e:
#         error_message = f"Error querying building requirements: {str(e)}"
#         print(error_message)
        
#         # Return only the error we're adding
#         return {
#             "errors": {
#                 "building_requirements": error_message
#             }
#         }

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

# # Create the query graph
# def create_graph() -> StateGraph:
#     """Create the graph for municipal code querying."""
#     graph = StateGraph(MunicipalCodeState)
    
#     # Add nodes
#     graph.add_node("init_state_node", init_state_node)
#     graph.add_node("building_requirements_node", building_requirements_node)
#     graph.add_node("combine_results_node", combine_results_node)
    
#     # Add edges
#     graph.add_edge(START, "init_state_node")
    
#     # Add edges for parallel processing
#     graph.add_edge("init_state_node", "building_requirements_node")
   
#     graph.add_edge("building_requirements_node", "combine_results_node")
#     graph.add_edge("combine_results_node", END)
    
#     return graph.compile()

# # Create the graph instance for the LangGraph server
# graph = create_graph()

# # Main execution function
# def run_query(
#     html_document_id: str,
#     zone_code: str,
#     model_name: str = "gpt-4o-mini"
# ) -> Dict[str, Any]:
#     """Run the municipal code query with configurable parameters."""
#     # Create configuration
#     config = {
#         "configurable": {
#             "model_name": model_name,
#             "zone_code": zone_code
#         }
#     }
    
#     # Initial state
#     initial_state = {
#         "html_document_id": html_document_id,
#         "zone_code": zone_code,
#         "requirements": {},
#         "errors": {}
#     }
    
#     # Run the graph
#     final_state = graph.invoke(initial_state, config)
    
#     # Return the validated result
#     return final_state

# if __name__ == "__main__":
#     results = run_query(
#         html_document_id="bargersville_in",
#         zone_code="RR"
#     )
#     print("\nDevelopment Requirements:")
#     print(json.dumps(results, indent=2))