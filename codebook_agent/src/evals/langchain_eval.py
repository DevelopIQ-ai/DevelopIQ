from agent_graphs import querier_graph
from langchain_openai import ChatOpenAI
from langsmith import aevaluate, Client
from typing import Dict, Any
import asyncio
import logging
from openevals.llm import create_llm_as_judge
from src.evals.prompts import MATCHING_PROMPT
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

# Constants
DATASET_NAME = "Building Requirements Evaluation Dataset"
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

async def section_precision_evaluator(outputs: dict, reference_outputs: dict) -> dict:
    """
    Calculate what percentage of returned sections are in the reference data.
    Returns a score between 0.0 and 1.0.
    """
    actual_sections = set(outputs.get("section_list", []))
    reference_sections = set(reference_outputs.get("section_list", []))
    
    if not actual_sections:
        logger.warning("No sections found in the model output")
        return {"key": "section_precision", "score": None, "error": "No sections in output"}
    
    precision = len(actual_sections.intersection(reference_sections)) / len(actual_sections)
    return {"key": "section_precision", "score": precision}

async def answer_matching_evaluator(outputs: dict, reference_outputs: dict) -> dict:
    """
    Evaluate how well model outputs match reference outputs.
    Returns a score between 0.0 and 1.0 based on content matching.
    """
    try:
        # Extract answers from both dictionaries
        model_answer = outputs.get("answer", "")
        ground_truth_answer = reference_outputs.get("answer", "")
        
        # Handle empty answers
        if not model_answer:
            return {"key": "answer_matching", "score": 0.0, "error": "No answer provided in model output"}
        if not ground_truth_answer:
            return {"actual_answer": "answer_matching", "score": None, "error": "No answer found in reference output"}
        
        # Format the matching prompt
        formatted_prompt = MATCHING_PROMPT.format(
            outputs=model_answer,
            reference_outputs=ground_truth_answer
        )

        class ResponseSchema(BaseModel):
            score: float
            explanation: str
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        structured_llm = llm.with_structured_output(ResponseSchema)
        response: ResponseSchema = await structured_llm.ainvoke(formatted_prompt)
        score = response.score
        explanation = response.explanation
        
        return {
            "key": "answer_matching", 
            "score": score,
            "explanation": explanation
        }
    except Exception as e:
        logger.error(f"Error in answer matching evaluation: {e}")
        return {"key": "answer_matching", "score": None, "error": str(e)}



# Input transformation function
def transform_dataset_inputs(inputs: dict) -> dict:
    """Transform dataset inputs to the format expected by the node."""
    required_fields = ["zone_code", "document_id"]
    for field in required_fields:
        if field not in inputs:
            raise ValueError(f"Required field '{field}' missing from inputs")
    print("inputs", inputs)
    return {
        "document_id": inputs.get("document_id"),
        "zone_code": inputs.get("zone_code"),
    }


# Define an async wrapper function that returns a dictionary
async def run_node(inputs: dict) -> dict:
    try:
        target_node = querier_graph.nodes[NODE_NAME] 
        transformed_inputs = transform_dataset_inputs(inputs)
        result = await target_node.ainvoke(transformed_inputs)       
        # result = await target_node(state=transformed_inputs, config={})
        if isinstance(result, dict) and "results" in result:
            # If query_type is specified, return just that result
            query_type = inputs.get("query_type")
            if query_type and query_type in result["results"]:
                return result["results"][query_type]
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
            evaluators=[section_recall_evaluator, section_precision_evaluator, answer_matching_evaluator],
            experiment_prefix="building-requirements-evaluation"
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