from langsmith import evaluate

from langsmith import aevaluate
from typing import Dict, Any
import asyncio
from agent import query_graph

# Simple evaluator that only calculates recall for sections
async def section_recall_evaluator(outputs: dict, reference_outputs: dict) -> dict:
    """
    Calculate what percentage of expected sections were found in the output.
    Returns a score between 0.0 and 1.0.
    """
    actual_sections = set(outputs.get("section_list", []))
    reference_sections = set(reference_outputs.get("section_list", []))
    
    if not reference_sections:
        return {"key": "section_recall", "score": 0.0}
    
    recall = len(actual_sections.intersection(reference_sections)) / len(reference_sections)
    return {"key": "section_recall", "score": recall}

# Input transformation function
def transform_dataset_inputs(inputs: dict) -> dict:
    """Transform dataset inputs to the format expected by the node."""
    return {
        "zone_code": inputs.get("zone_code"),
        "html_document_id": f"{inputs.get('municipality')}_regulations",
        "query_type": inputs.get("query_type")
    }

# Main evaluation function
async def evaluate_node():
    # Get the specific node
    target_node = query_graph.nodes["building_requirements_node"]
    
    # Create evaluation pipeline
    evaluation_target = lambda inputs: target_node(transform_dataset_inputs(inputs))
    
    # Run evaluation
    results = await aevaluate(
        evaluation_target,
        data="Building Node Dataset",
        evaluators=[section_recall_evaluator],
        experiment_prefix="section-recall-evaluation"
    )
    
    return results

# Run the evaluation
if __name__ == "__main__":
    results = asyncio.run(evaluate_node())
    print(f"Evaluation complete! View results at: {results.url}")