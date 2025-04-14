from langsmith import Client
from dotenv import load_dotenv
import os
from src.datasets.building_requirements import building_requirements_dataset_json

load_dotenv()

# Dataset examples
from langsmith import Client
from dotenv import load_dotenv
import os

load_dotenv()

# Dataset examples
def main():

    examples = building_requirements_dataset_json
    client = Client(api_key=os.getenv("LANGCHAIN_API_KEY"), api_url=os.getenv("LANGCHAIN_API_URL"))
    DATASET_NAME = "Building Requirements Evaluation Dataset"
    
    # Check if dataset exists and create it if it doesn't
    try:
        dataset = client.read_dataset(dataset_name=DATASET_NAME)
        print(f"Found existing dataset '{DATASET_NAME}' with ID: {dataset.id}")
        
        # Get existing examples only if the dataset already exists
        existing_examples = list(client.list_examples(dataset_id=dataset.id))
        
        # Prepare for updates if dataset exists
        new_examples = []
        update_examples = []
        
        for example in examples:
            # Generate a unique identifier based on inputs for matching
            example_key = f"{example['inputs']['document_id']}_{example['inputs']['query_type']}_{example['inputs']['zone_code']}"
            
            # Look for a matching example in existing examples
            matching_example = next(
                (ex for ex in existing_examples if 
                f"{ex.inputs.get('document_id', '')}_{ex.inputs.get('query_type', '')}_{ex.inputs.get('zone_code', '')}" == example_key),
                None
            )
            
            if matching_example:
                # Example exists, prepare update
                update = {
                    "id": matching_example.id,
                    "outputs": example["outputs"],
                    "metadata": example["metadata"] if "metadata" in example else None
                }
                update_examples.append(update)
            else:
                # New example, add to create list
                new_examples.append(example)
        
        # Create new examples if any
        if new_examples:
            result = client.create_examples(
                dataset_id=dataset.id,
                examples=new_examples
            )
            print(f"Created {result.get('count', 0)} new examples")
        
        # Update existing examples if any
        if update_examples:
            result = client.update_examples(
                dataset_id=dataset.id,
                updates=update_examples
            )
            print(f"Updated {result.get('count', 0)} existing examples")
            
    except Exception as e:
        # Dataset doesn't exist, create a new one with all examples
        dataset = client.create_dataset(
            dataset_name=DATASET_NAME, 
            description="Dataset for evaluating building requirements node"
        )
        print(f"Created new dataset '{DATASET_NAME}' with ID: {dataset.id}")
        
        # Add all examples to the new dataset
        result = client.create_examples(
            dataset_id=dataset.id,
            examples=examples
        )
        print(f"Created {result.get('count', 0)} examples in new dataset")
    
    # Count and report the final number of examples
    final_count = len(list(client.list_examples(dataset_id=dataset.id)))
    print(f"Dataset '{DATASET_NAME}' now has a total of {final_count} examples")

if __name__ == "__main__":
    print(f"Number of examples in building_requirements_dataset_json: {len(building_requirements_dataset_json)}")

    main()