"""Query graph for municipal code data extraction."""

from __future__ import annotations
from typing import Dict, Any, TypedDict, Annotated
from RAG.query_models import PermittedUses
from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableConfig
import json
from agent_graphs.queries import (
    BUILDING_REQUIREMENTS_QUERIES,
    PARKING_QUERIES,
    SIGNAGE_QUERIES,
    LOT_REQUIREMENTS_QUERIES,
    BUILDING_PLACEMENT_QUERIES,
    LANDSCAPING_QUERIES,
    PERMITTED_USES_QUERIES,
    format_query,

)
from agent_graphs.models import Answer
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
    results: Annotated[Dict[str, Dict[str, Any]], dict_merge]

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
    raw_results = await retriever.execute_queries_in_parallel(questions, Answer)    
    results = {
        query_var: raw_results[i] 
        for i, query_var in enumerate(query_vars)
    }
    return {
        "results": {
            "building_requirements": results
        }
    }

async def parking_node(state: QuerierState, config: RunnableConfig) -> Dict[str, Any]:
    """Query parking requirements from the municipal code."""
    document_id = state["document_id"]
    zone_code = state["zone_code"]  
   
    queries = {
        "aisle_width": format_query(PARKING_QUERIES["aisle_width"], zone_code=zone_code),
        "curbing_requirements": format_query(PARKING_QUERIES["curbing_requirements"], zone_code=zone_code),
        "striping_requirements": format_query(PARKING_QUERIES["striping_requirements"], zone_code=zone_code),
        "drainage_requirements": format_query(PARKING_QUERIES["drainage_requirements"], zone_code=zone_code),
        "parking_stalls": format_query(PARKING_QUERIES["parking_stalls"], zone_code=zone_code)
    }
    
    retriever = QdrantRetriever(document_id=document_id)
    await retriever.initialize()

    # Get the questions list and keep track of which index corresponds to which query type
    questions = list(queries.values())
    query_vars = list(queries.keys())
    
    # Execute queries in parallel as before
    raw_results = await retriever.execute_queries_in_parallel(questions, Answer)    
    results = {
        query_var: raw_results[i] 
        for i, query_var in enumerate(query_vars)
    }
    return {
        "results": {
            "parking_requirements": results
        }
    }

async def signs_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
    """Query signage requirements from the municipal code."""
    document_id = state["document_id"]
    zone_code = state["zone_code"]  
   
    # Create a dictionary mapping query types to their queries
    queries = {
        "permitted_signs": format_query(SIGNAGE_QUERIES["permitted_signs"], zone_code=zone_code),
        "prohibited_signs": format_query(SIGNAGE_QUERIES["prohibited_signs"], zone_code=zone_code),
        "design_requirements": format_query(SIGNAGE_QUERIES["design_requirements"], zone_code=zone_code)
    }
    
    retriever = QdrantRetriever(document_id=document_id)
    await retriever.initialize()

    # Get the questions list and keep track of which index corresponds to which query type
    questions = list(queries.values())
    query_vars = list(queries.keys())
    
    # Execute queries in parallel as before
    raw_results = await retriever.execute_queries_in_parallel(questions, Answer)    
    results = {
        query_var: raw_results[i] 
        for i, query_var in enumerate(query_vars)
    }
    return {
        "results": {
            "signage_requirements": results
        }
    }
   
async def lot_requirements_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
    """Query lot requirements from the municipal code."""
    document_id = state["document_id"]
    zone_code = state["zone_code"]
    
    queries = {
        "density": format_query(LOT_REQUIREMENTS_QUERIES["density"], zone_code=zone_code),
        "lot_size": format_query(LOT_REQUIREMENTS_QUERIES["lot_size"], zone_code=zone_code),
        "lot_width": format_query(LOT_REQUIREMENTS_QUERIES["lot_width"], zone_code=zone_code),
        "lot_frontage": format_query(LOT_REQUIREMENTS_QUERIES["lot_frontage"], zone_code=zone_code),
        "living_area": format_query(LOT_REQUIREMENTS_QUERIES["living_area"], zone_code=zone_code)
    }   
    
    # Create a new retriever instance for this node
    retriever = QdrantRetriever(document_id=document_id)
    await retriever.initialize()

async def building_placement_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
    """Query building placement requirements from the municipal code."""
    document_id = state["document_id"]
    zone_code = state["zone_code"]
    
    # Create a new retriever instance for this node
    retriever = QdrantRetriever(document_id=document_id)
    await retriever.initialize()

    queries = {
        "front_setback": format_query(BUILDING_PLACEMENT_QUERIES["front_setback"], zone_code=zone_code),
        "street_side_setback": format_query(BUILDING_PLACEMENT_QUERIES["street_side_setback"], zone_code=zone_code),
        "side_yard_setback": format_query(BUILDING_PLACEMENT_QUERIES["side_yard_setback"], zone_code=zone_code),
        "rear_setback": format_query(BUILDING_PLACEMENT_QUERIES["rear_setback"], zone_code=zone_code),
        "accessory_building_setback": format_query(BUILDING_PLACEMENT_QUERIES["accessory_building_setback"], zone_code=zone_code)
    }

    questions = list(queries.values())
    query_vars = list(queries.keys())
    
    raw_results = await retriever.execute_queries_in_parallel(questions, Answer)    
    results = {
        query_var: raw_results[i] 
        for i, query_var in enumerate(query_vars)
    }
    return {
        "results": {
            "building_placement_requirements": results
        }
    }

async def landscaping_requirements_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
    """Query landscaping requirements from the municipal code."""
    document_id = state["document_id"]
    zone_code = state["zone_code"]
    
    # Create a new retriever instance for this node
    retriever = QdrantRetriever(document_id=document_id)
    await retriever.initialize()
    
    queries = {
        "plant_sizes": format_query(LANDSCAPING_QUERIES["plant_sizes"], zone_code=zone_code),
        "landscape_plan_review": format_query(LANDSCAPING_QUERIES["landscape_plan_review"], zone_code=zone_code),
        "species_variation": format_query(LANDSCAPING_QUERIES["species_variation"], zone_code=zone_code),
        "performance_guarantee": format_query(LANDSCAPING_QUERIES["performance_guarantee"], zone_code=zone_code)
    }
    
    questions = list(queries.values())
    query_vars = list(queries.keys())
    
    raw_results = await retriever.execute_queries_in_parallel(questions, Answer)    
    results = {
        query_var: raw_results[i] 
        for i, query_var in enumerate(query_vars)
    }
    return {
        "results": {
            "landscaping_requirements": results
        }
    }
    
# Permitted uses query node
async def permitted_uses_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
    """Query permitted uses from the municipal code."""
    html_document_id = state["html_document_id"]
    zone_code = state["zone_code"]
    configs = get_config(config)
    # Create a new retriever instance for this node
    retriever = QdrantRetriever(document_id=html_document_id)
    await retriever.initialize()
    
    queries = {
        "permitted_uses": format_query(PERMITTED_USES_QUERIES["permitted_uses"], zone_code=zone_code)
    }
    custom_assistant_prompt = """
            You are a helpful assistant that answers questions about a municipality's codebook.
            Sometimes, the content has tables, which are formatted in markdown.
            
            <TABLE DIRECTIONS>
                - Ensure you only rely on the content inside the table.
                - Scan every single row.
                - Do not make up any information.
                - Always check if the zone code is a column header; if it is, ensure you only look for cell values in that column that align with the question.
                - Ignore any columns that do not have the zone code as a header.
                - If asked about a specific row or column, ensure you only rely on the content inside that row or column.
                - If dealing with multiple tables, refer to that table's header row to determine which column to look at.
            </TABLE DIRECTIONS>

            <INDUSTRY EXPERT HINT>
            The answer is always in the context. 
            Permitted Uses and Special Exceptions are often found in the PERMITTED USES section, PERMITTED USES TABLE section, or in similar sections.
            </INDUSTRY EXPERT HINT>
            """
    
    questions = list(queries.values())
    query_vars = list(queries.keys())
    
    raw_results = await retriever.send_query(questions[0], Answer, custom_assistant_prompt)
    results = {
        query_var: raw_results[i] 
        for i, query_var in enumerate(query_vars)
    }
    
    return {
        "results": {
            "permitted_uses": results
        }
    }

def combine_results_node(state: QuerierState) -> Dict[str, Any]:
    """Combine results from parallel nodes into a consolidated schema."""
    # Get all requirements and errors
    results = state.get("results", {})
    return {
        **state,
        "results": results
    }

# Create the query graph
def create_graph() -> StateGraph:
    """Create the graph for municipal code querying."""
    querier_graph = StateGraph(QuerierState)
    
    # Add nodes
    querier_graph.add_node("init_state_node", init_state)
    querier_graph.add_node("building_requirements_node", building_requirements_node)
    querier_graph.add_node("parking_node", parking_node)
    querier_graph.add_node("signs_node", signs_node)
    querier_graph.add_node("lot_requirements_node", lot_requirements_node)
    querier_graph.add_node("building_placement_node", building_placement_node)
    querier_graph.add_node("landscaping_requirements_node", landscaping_requirements_node)
    querier_graph.add_node("combine_results_node", combine_results_node)
    
    # Add edges
    querier_graph.add_edge(START, "init_state_node")    
    querier_graph.add_edge("init_state_node", "building_requirements_node")
    querier_graph.add_edge("init_state_node", "parking_node")
    querier_graph.add_edge("init_state_node", "signs_node")
    querier_graph.add_edge("init_state_node", "lot_requirements_node")
    querier_graph.add_edge("init_state_node", "building_placement_node")
    querier_graph.add_edge("init_state_node", "landscaping_requirements_node")
    querier_graph.add_edge("building_requirements_node", "combine_results_node")
    querier_graph.add_edge("parking_node", "combine_results_node")
    querier_graph.add_edge("signs_node", "combine_results_node")
    querier_graph.add_edge("lot_requirements_node", "combine_results_node")
    querier_graph.add_edge("building_placement_node", "combine_results_node")
    querier_graph.add_edge("landscaping_requirements_node", "combine_results_node")
    querier_graph.add_edge("combine_results_node", END)
    return querier_graph.compile()

querier_graph = create_graph()
graph = querier_graph
# Main execution function
def run_query(
    document_id: str,
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
        "document_id": document_id,
        "zone_code": zone_code,
        "results": {}
    }
    
    # Run the graph
    final_state = graph.invoke(initial_state, config)
    
    # Return the validated result
    return final_state

if __name__ == "__main__":
    results = run_query(
        document_id="bargersville_in",
        zone_code="RR"
    )
    print("\nDevelopment Requirements:")
    print(json.dumps(results, indent=2))