"""Query graph for municipal code data extraction."""

from __future__ import annotations
import os
import operator
from typing import Dict, Any, Annotated, TypedDict, Optional
from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableConfig
import json

from src.RAG.codebook_retriever import CodebookRetriever
from src.RAG.queries import (
    SIGNAGE_QUERIES,
    PARKING_QUERIES,
    LOT_REQUIREMENTS_QUERIES,
    BUILDING_PLACEMENT_QUERIES,
    BUILDING_REQUIREMENTS_QUERIES,
    LANDSCAPING_QUERIES,
    PERMITTED_USES_QUERIES,
    format_query
)
from src.RAG.query_models import (
    SignList, 
    DesignRequirements, 
    SignageRequirements,
    AisleWidth,
    SummaryRequirement,
    ParkingRequirements,
    UnitsPerAcre,
    SquareFeet,
    Feet,
    Percentage,
    Summary,
    LotRequirements,
    BuildingPlacementRequirements,
    BuildingRequirements,
    LandscapingRequirements,
    QueryResult,
    PermittedUses,
    PermittedUsesList
)
from agent_graphs.configurations import Configuration

# Custom reducer function for dictionary merge
def dict_merge(existing: Dict[str, Any], new: Dict[str, Any]) -> Dict[str, Any]:
    """Merge two dictionaries without overwriting the existing one."""
    result = existing.copy()
    for key, value in new.items():
        if key not in result:
            result[key] = value
    return result

# Define the state with reducer functions
class MunicipalCodeState(TypedDict):
    html_document_id: str
    zone_code: str
    requirements: Annotated[Dict[str, Any], dict_merge]  # Use custom reducer for requirements
    errors: Annotated[Dict[str, str], dict_merge]  # Use custom reducer for errors

# Helper function to create a new retriever instance
def get_retriever(html_document_id: str):
    """Create a new CodebookRetriever instance."""
    try:
        retriever = CodebookRetriever(html_document_id=html_document_id)
        print("Created new retriever instance")
        return retriever
    except Exception as e:
        print(f"Error creating retriever: {str(e)}")
        return None

# Configuration handler
def get_config(config: RunnableConfig) -> Configuration:
    """Get the full configuration object."""
    return Configuration.from_runnable_config(config)

# Initialization node
def init_state_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
    """Initialize the query state."""
    configuration = get_config(config)
    html_document_id = f"{configuration.municipality.lower().replace(' ', '_')}_{configuration.state.lower()}"
    zone_code = configuration.zone_code
    # Return updated state with initial values

    # Create retriever but don't store it in state
    retriever = get_retriever(html_document_id)
    if not retriever:
        return {
            **state, 
            "html_document_id": html_document_id, 
            "zone_code": zone_code, 
            "requirements": {},
            "errors": {"initialization": "Failed to create retriever"}
        }
    
    return {
        **state, 
        "html_document_id": html_document_id, 
        "zone_code": zone_code, 
        "requirements": {},
        "errors": {}
    }

# Building requirements query node
async def building_requirements_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
    """Query building requirements from the municipal code."""
    html_document_id = state["html_document_id"]
    zone_code = state["zone_code"]
    
    # Create a new retriever instance for this node
    retriever = get_retriever(html_document_id)
    if not retriever:
        return {
            "errors": {
                "building_requirements": "Failed to get retriever"
            }
        }
    
    try:
        # Query for building height
        height_query = format_query(BUILDING_REQUIREMENTS_QUERIES["building_height"], zone_code=zone_code)
        height_result, height_source = await retriever.query_codebook(height_query, Feet)
        
        coverage_query = format_query(BUILDING_REQUIREMENTS_QUERIES["lot_coverage"], zone_code=zone_code)
        coverage_result, coverage_source = await retriever.query_codebook(coverage_query, Percentage)
        
        # Create Pydantic model for building requirements
        building_reqs = BuildingRequirements(
            **{
                "Maximum Building Height": {
                    "feet": height_result,
                    "source": height_source
                },
                "Maximum Lot Coverage": {
                    "percentage": coverage_result,
                    "source": coverage_source
                }
            }
        )
        
        # Return only the requirements we're updating
        return {
            "requirements": {
                "building_requirements": building_reqs.model_dump()
            }
        }
    
    except Exception as e:
        error_message = f"Error querying building requirements: {str(e)}"
        print(error_message)
        
        # Return only the error we're adding
        return {
            "errors": {
                "building_requirements": error_message
            }
        }


# # Signage requirements query node
# async def signs_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
#     """Query signage requirements from the municipal code."""
#     html_document_id = state["html_document_id"]
#     zone_code = state["zone_code"]
    
#     # Create a new retriever instance for this node
#     retriever = get_retriever(html_document_id)
#     if not retriever:
#         return {
#             "errors": {
#                 "signage_requirements": "Failed to get retriever"
#             }
#         }
    
#     try:
#         # Query for permitted sign types
#         permitted_signs_query = format_query(SIGNAGE_QUERIES["permitted_signs"], zone_code=zone_code)
#         permitted_signs_result, permitted_signs_source = await retriever.query_codebook(permitted_signs_query, SignList)
        
#         # Query for prohibited sign types
#         prohibited_signs_query = format_query(SIGNAGE_QUERIES["prohibited_signs"], zone_code=zone_code)
#         prohibited_signs_result, prohibited_signs_source = await retriever.query_codebook(prohibited_signs_query, SignList)
        
#         # Query for design requirements
#         design_requirements_query = format_query(SIGNAGE_QUERIES["design_requirements"], zone_code=zone_code)
#         design_requirements_result, design_requirements_source = await retriever.query_codebook(design_requirements_query, DesignRequirements)
        
#         signage_requirements = SignageRequirements(
#             **{
#                 "Permitted Sign Types": {
#                     "signs": permitted_signs_result,
#                     "source": permitted_signs_source
#                 },
#                 "Prohibited Sign Types": {
#                     "signs": prohibited_signs_result,
#                     "source": prohibited_signs_source
#                 },
#                 "Design Requirements": {
#                     "requirements": design_requirements_result,
#                     "source": design_requirements_source
#                 }
#             }
#         )
        
#         # Return only the requirements we're updating
#         return {
#             "requirements": {
#                 "signage_requirements": signage_requirements.model_dump()
#             }
#         }
    
#     except Exception as e:
#         # Handle errors
#         error_message = f"Error querying signage requirements: {str(e)}"
#         print(error_message)
        
#         # Return only the error we're adding
#         return {
#             "errors": {
#                 "signage_requirements": error_message
#             }
#         }

# Parking requirements query node
async def parking_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
    """Query parking requirements from the municipal code."""
    html_document_id = state["html_document_id"]
    zone_code = state["zone_code"]
    
    # Create a new retriever instance for this node
    retriever = get_retriever(html_document_id)
    if not retriever:
        return {
            "errors": {
                "parking_requirements": "Failed to get retriever"
            }
        }
    
    try:
        # Query for aisle width
        aisle_width_query = format_query(PARKING_QUERIES["aisle_width"], zone_code=zone_code)
        aisle_width_result, aisle_width_source = await retriever.query_codebook(aisle_width_query, AisleWidth)
        
        # Query for curbing requirements
        curbing_query = format_query(PARKING_QUERIES["curbing_requirements"], zone_code=zone_code)
        curbing_result, curbing_source = await retriever.query_codebook(curbing_query, SummaryRequirement)
        
        # Query for striping requirements
        striping_query = format_query(PARKING_QUERIES["striping_requirements"], zone_code=zone_code)
        striping_result, striping_source = await retriever.query_codebook(striping_query, SummaryRequirement)
        
        # Query for drainage requirements
        drainage_query = format_query(PARKING_QUERIES["drainage_requirements"], zone_code=zone_code)
        drainage_result, drainage_source = await retriever.query_codebook(drainage_query, SummaryRequirement)
        
        # Query for required parking stalls
        stalls_query = format_query(PARKING_QUERIES["parking_stalls"], zone_code=zone_code)
        stalls_result, stalls_source = await retriever.query_codebook(stalls_query, SummaryRequirement)
        
        # Create Pydantic model for parking requirements
        parking_requirements = ParkingRequirements(
            **{
                "Minimum Aisle Width": {
                    "feet": aisle_width_result,
                    "source": aisle_width_source
                },
                "Curbing Requirements": {
                    "summary": curbing_result,
                    "source": curbing_source
                },
                "Striping Requirements": {
                    "summary": striping_result,
                    "source": striping_source
                },
                "Drainage Requirements": {
                    "summary": drainage_result,
                    "source": drainage_source
                },
                "Parking Stalls Required": {
                    "summary": stalls_result,
                    "source": stalls_source
                }
            }
        )
        
        # Return only the requirements we're updating
        return {
            "requirements": {
                "parking_requirements": parking_requirements.model_dump()
            }
        }
    
    except Exception as e:
        # Handle errors
        error_message = f"Error querying parking requirements: {str(e)}"
        print(error_message)
        
        # Return only the error we're adding
        return {
            "errors": {
                "parking_requirements": error_message
            }
        }

# # Lot requirements query node
# async def lot_requirements_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
#     """Query lot requirements from the municipal code."""
#     html_document_id = state["html_document_id"]
#     zone_code = state["zone_code"]
    
#     # Create a new retriever instance for this node
#     retriever = get_retriever(html_document_id)
#     if not retriever:
#         return {
#             "errors": {
#                 "lot_requirements": "Failed to get retriever"
#             }
#         }
    
#     try:
#         # Query for density
#         density_query = format_query(LOT_REQUIREMENTS_QUERIES["density"], zone_code=zone_code)
#         density_result, density_source = await retriever.query_codebook(density_query, UnitsPerAcre)
        
#         # Query for lot size
#         lot_size_query = format_query(LOT_REQUIREMENTS_QUERIES["lot_size"], zone_code=zone_code)
#         lot_size_result, lot_size_source = await retriever.query_codebook(lot_size_query, SquareFeet)
        
#         # Query for lot width
#         lot_width_query = format_query(LOT_REQUIREMENTS_QUERIES["lot_width"], zone_code=zone_code)
#         lot_width_result, lot_width_source = await retriever.query_codebook(lot_width_query, Feet)
        
#         # Query for lot frontage
#         lot_frontage_query = format_query(LOT_REQUIREMENTS_QUERIES["lot_frontage"], zone_code=zone_code)
#         lot_frontage_result, lot_frontage_source = await retriever.query_codebook(lot_frontage_query, Feet)
        
#         # Query for living area
#         living_area_query = format_query(LOT_REQUIREMENTS_QUERIES["living_area"], zone_code=zone_code)
#         living_area_result, living_area_source = await retriever.query_codebook(living_area_query, SquareFeet)
        
#         # Create Pydantic model for lot requirements
#         lot_requirements = LotRequirements(
#             **{
#                 "Maximum Density": {
#                     "units": density_result,
#                     "source": density_source
#                 },
#                 "Minimum Lot Size": {
#                     "square_feet": lot_size_result,
#                     "source": lot_size_source
#                 },
#                 "Minimum Lot Width": {
#                     "feet": lot_width_result,
#                     "source": lot_width_source
#                 },
#                 "Minimum Lot Frontage": {
#                     "feet": lot_frontage_result,
#                     "source": lot_frontage_source
#                 },
#                 "Minimum Living Area": {
#                     "square_feet": living_area_result,
#                     "source": living_area_source
#                 }
#             }
#         )
        
#         # Return only the requirements we're updating
#         return {
#             "requirements": {
#                 "lot_requirements": lot_requirements.model_dump()
#             }
#         }
    
#     except Exception as e:
#         error_message = f"Error querying lot requirements: {str(e)}"
#         print(error_message)
        
#         # Return only the error we're adding
#         return {
#             "errors": {
#                 "lot_requirements": error_message
#             }
#         }

# # Building placement requirements query node
# async def building_placement_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
#     """Query building placement requirements from the municipal code."""
#     html_document_id = state["html_document_id"]
#     zone_code = state["zone_code"]
    
#     # Create a new retriever instance for this node
#     retriever = get_retriever(html_document_id)
#     if not retriever:
#         return {
#             "errors": {
#                 "building_placement_requirements": "Failed to get retriever"
#             }
#         }
    
#     try:
#         # Query for front setback
#         front_setback_query = format_query(BUILDING_PLACEMENT_QUERIES["front_setback"], zone_code=zone_code)
#         front_setback_result, front_setback_source = await retriever.query_codebook(front_setback_query, Feet)
        
#         # Query for street side setback
#         street_side_query = format_query(BUILDING_PLACEMENT_QUERIES["street_side_setback"], zone_code=zone_code)
#         street_side_result, street_side_source = await retriever.query_codebook(street_side_query, Feet)
        
#         # Query for side yard setback
#         side_yard_query = format_query(BUILDING_PLACEMENT_QUERIES["side_yard_setback"], zone_code=zone_code)
#         side_yard_result, side_yard_source = await retriever.query_codebook(side_yard_query, Feet)
        
#         # Query for rear setback
#         rear_setback_query = format_query(BUILDING_PLACEMENT_QUERIES["rear_setback"], zone_code=zone_code)
#         rear_setback_result, rear_setback_source = await retriever.query_codebook(rear_setback_query, Feet)
        
#         # Query for accessory building setback
#         accessory_query = format_query(BUILDING_PLACEMENT_QUERIES["accessory_building_setback"], zone_code=zone_code)
#         accessory_result, accessory_source = await retriever.query_codebook(accessory_query, Feet)
        
#         # Create Pydantic model for building placement requirements
#         building_placement_requirements = BuildingPlacementRequirements(
#             **{
#                 "Minimum Front Setback": {
#                     "feet": front_setback_result,
#                     "source": front_setback_source
#                 },
#                 "Minimum Street Side Setback": {
#                     "feet": street_side_result,
#                     "source": street_side_source
#                 },
#                 "Minimum Side Yard Setback": {
#                     "feet": side_yard_result,
#                     "source": side_yard_source
#                 },
#                 "Minimum Rear Setback": {
#                     "feet": rear_setback_result,
#                     "source": rear_setback_source
#                 },
#                 "Accessory Building Setback": {
#                     "feet": accessory_result,
#                     "source": accessory_source
#                 }
#             }
#         )
        
#         # Return only the requirements we're updating
#         return {
#             "requirements": {
#                 "building_placement_requirements": building_placement_requirements.model_dump()
#             }
#         }
    
#     except Exception as e:
#         error_message = f"Error querying building placement requirements: {str(e)}"
#         print(error_message)
        
#         # Return only the error we're adding
#         return {
#             "errors": {
#                 "building_placement_requirements": error_message
#             }
#         }

# # Landscaping requirements query node
# async def landscaping_requirements_node(state: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
#     """Query landscaping requirements from the municipal code."""
#     html_document_id = state["html_document_id"]
#     zone_code = state["zone_code"]
    
#     # Create a new retriever instance for this node
#     retriever = get_retriever(html_document_id)
#     if not retriever:
#         return {
#             "errors": {
#                 "landscaping_requirements": "Failed to get retriever"
#             }
#         }
    
#     try:
#         # Query for plant sizes
#         plant_sizes_query = format_query(LANDSCAPING_QUERIES["plant_sizes"], zone_code=zone_code)
#         plant_sizes_result, plant_sizes_source = await retriever.query_codebook(plant_sizes_query, Feet)
        
#         # Query for landscape plan review
#         plan_review_query = format_query(LANDSCAPING_QUERIES["landscape_plan_review"], zone_code=zone_code)
#         plan_review_result, plan_review_source = await retriever.query_codebook(plan_review_query, Summary)
        
#         # Query for species variation
#         species_query = format_query(LANDSCAPING_QUERIES["species_variation"], zone_code=zone_code)
#         species_result, species_source = await retriever.query_codebook(species_query, Summary)
        
#         # Query for performance guarantee
#         guarantee_query = format_query(LANDSCAPING_QUERIES["performance_guarantee"], zone_code=zone_code)
#         guarantee_result, guarantee_source = await retriever.query_codebook(guarantee_query, Summary)
        
#         # Create Pydantic model for landscaping requirements
#         landscaping_reqs = LandscapingRequirements(
#             **{
#                 "Minimum Plant Sizes": {
#                     "feet": plant_sizes_result,
#                     "source": plant_sizes_source
#                 },
#                 "Landscape Plan Review Summary": {
#                     "summary": plan_review_result,
#                     "source": plan_review_source
#                 },
#                 "Species Variation Requirement Summary": {
#                     "summary": species_result,
#                     "source": species_source
#                 },
#                 "Performance Guarantee Warranty Requirements Summary": {
#                     "summary": guarantee_result,
#                     "source": guarantee_source
#                 }
#             }
#         )
        
#         # Return only the requirements we're updating
#         return {
#             "requirements": {
#                 "landscaping_requirements": landscaping_reqs.model_dump()
#             }
#         }
    
#     except Exception as e:
#         error_message = f"Error querying landscaping requirements: {str(e)}"
#         print(error_message)
        
#         # Return only the error we're adding
#         return {
#             "errors": {
#                 "landscaping_requirements": error_message
#             }
#         }

# Function to combine results from parallel nodes
def combine_results_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Combine results from parallel nodes into a consolidated schema."""
    # Get all requirements and errors
    requirements = state.get("requirements", {})
    errors = state.get("errors", {})
    
    try:
        # Create the final QueryResult with all nested data
        result = QueryResult(
            signage_requirements=requirements.get("signage_requirements"),
            parking_requirements=requirements.get("parking_requirements"),
            lot_requirements=requirements.get("lot_requirements"),
            building_placement_requirements=requirements.get("building_placement_requirements"),
            building_requirements=requirements.get("building_requirements"),
            landscaping_requirements=requirements.get("landscaping_requirements"),
            permitted_uses=requirements.get("permitted_uses"),
            errors=errors
        )
        
        # Return the model as a dictionary
        return {
            "html_document_id": state.get("html_document_id", ""),
            "zone_code": state.get("zone_code", ""),
            "result": result.model_dump()
        }
    except Exception as e:
        # If validation fails, add error
        error_message = f"Error validating results: {str(e)}"
        print(error_message)
        
        return {
            "html_document_id": state.get("html_document_id", ""),
            "zone_code": state.get("zone_code", ""),
            "errors": {**errors, "validation": error_message}
        }

# Create the query graph
def create_graph() -> StateGraph:
    """Create the graph for municipal code querying."""
    graph = StateGraph(MunicipalCodeState)
    
    # Add nodes
    graph.add_node("init_state_node", init_state_node)
    graph.add_node("building_requirements_node", building_requirements_node)

    # graph.add_node("signs_node", signs_node)
    # graph.add_node("parking_node", parking_node)
    # graph.add_node("lot_requirements_node", lot_requirements_node)
    # graph.add_node("building_placement_node", building_placement_node)
    # graph.add_node("landscaping_requirements_node", landscaping_requirements_node)
    # graph.add_node("permitted_uses_node", permitted_uses_node)
    graph.add_node("combine_results_node", combine_results_node)
    
    # Add edges
    graph.add_edge(START, "init_state_node")
    
    # Add edges for parallel processing
    graph.add_edge("init_state_node", "building_requirements_node")
    # graph.add_edge("init_state_node", "signs_node")
    # graph.add_edge("init_state_node", "parking_node")
    # graph.add_edge("init_state_node", "lot_requirements_node")
    # graph.add_edge("init_state_node", "building_placement_node")
    # graph.add_edge("init_state_node", "landscaping_requirements_node")
    # graph.add_edge("init_state_node", "permitted_uses_node")
    
    # Join parallel paths
    graph.add_edge("building_requirements_node", "combine_results_node")
    # graph.add_edge("signs_node", "combine_results_node")
    # graph.add_edge("parking_node", "combine_results_node")
    # graph.add_edge("lot_requirements_node", "combine_results_node")
    # graph.add_edge("building_placement_node", "combine_results_node")
    # graph.add_edge("landscaping_requirements_node", "combine_results_node")
    # graph.add_edge("permitted_uses_node", "combine_results_node")
    graph.add_edge("combine_results_node", END)
    
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