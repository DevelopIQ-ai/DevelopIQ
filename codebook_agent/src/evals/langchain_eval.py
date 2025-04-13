from langsmith import aevaluate, Client
from typing import Dict, Any
import asyncio
import logging
from src.agent_graphs import query_graph

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
DATASET_NAME = "Building Node Dataset"
NODE_NAME = "building_requirements_node"

# Simple evaluator that only calculates recall for sections
async def section_recall_evaluator(outputs: dict, reference_outputs: dict) -> dict:
    """
    Calculate what percentage of expected sections were found in the output.
    Returns a score between 0.0 and 1.0.
    """
    actual_sections = set(outputs.get("section_list", []))
    reference_sections = set(reference_outputs.get("section_list", []))
    
    if not reference_sections:
        logger.warning("No reference sections found in the expected output")
        return {"key": "section_recall", "score": None, "error": "No reference sections"}
    
    recall = len(actual_sections.intersection(reference_sections)) / len(reference_sections)
    return {"key": "section_recall", "score": recall}

# Input transformation function
def transform_dataset_inputs(inputs: dict) -> dict:
    """Transform dataset inputs to the format expected by the node."""
    required_fields = ["zone_code", "municipality", "query_type"]
    for field in required_fields:
        if field not in inputs:
            raise ValueError(f"Required field '{field}' missing from inputs")
    
    return {
        "zone_code": inputs.get("zone_code"),
        "html_document_id": f"{inputs.get('municipality')}_regulations",
        "query_type": inputs.get("query_type")
    }

# Define an async wrapper function that returns a dictionary
async def run_node(inputs: dict) -> dict:
    try:
        target_node = query_graph.nodes[NODE_NAME]
        transformed_inputs = transform_dataset_inputs(inputs)
    
        if hasattr(target_node, 'ainvoke'):
            result = await target_node.ainvoke(transformed_inputs)
            print("ainvoke")
        elif hasattr(target_node, 'arun'):
            result = await target_node.arun(transformed_inputs)
            print("arun")
        else:
            return {"error": "No suitable async method found on the node"}
        
        # Make sure result is a dictionary
        if not isinstance(result, dict):
            # If the result is not a dictionary, wrap it
            return {"section_list": result if isinstance(result, list) else []}
        return result
    except Exception as e:
        logger.error(f"Error running node: {str(e)}")
        return {"error": str(e)}

# Main evaluation function
async def evaluate_node():
    client = Client()
    
    if not client.has_dataset(dataset_name=DATASET_NAME):
        raise ValueError(f"Dataset '{DATASET_NAME}' not found")
    
    # Run evaluation
    try:
        results = await aevaluate(
            run_node,
            data=DATASET_NAME,
            evaluators=[section_recall_evaluator],
            experiment_prefix="section-recall-evaluation"
        )
        return results
    except Exception as e:
        logger.error(f"Evaluation failed: {str(e)}")
        raise

# Run the evaluation
if __name__ == "__main__":
    try:
        results = asyncio.run(evaluate_node())
        print(results)
        logger.info("Evaluation complete!")
    except Exception as e:
        logger.error(f"Evaluation failed: {str(e)}")