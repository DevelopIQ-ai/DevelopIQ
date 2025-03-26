import os
import json
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from typing import List, Dict, Any

class CodebookUtils:
    """
    Utility class for working with the CodebookRetriever
    
    This class assumes that you already have a working CodebookRetriever
    instance and provides additional utility functions.
    """
    
    def __init__(self, retriever):
        """
        Initialize with an existing CodebookRetriever instance
        
        Args:
            retriever: An initialized CodebookRetriever instance
        """
        self.retriever = retriever
        
    def list_sections(self):
        """
        List all sections in the database
        
        Returns:
            list: List of unique sections in the database
        """
        results = self.retriever.collection.get(
            include=["metadatas"],
            limit=10000  # Adjust based on your DB size
        )
        
        # Extract unique sections from metadatas
        unique_sections = {}
        for meta in results['metadatas']:
            section_number = meta.get('section_number')
            if section_number and section_number not in unique_sections:
                unique_sections[section_number] = meta.get('section_name', 'Unknown')
        
        # Return as list of dicts
        return [
            {"section_number": num, "section_name": name}
            for num, name in unique_sections.items()
        ]
    
    def view_section_content(self, section_number):
        """
        Retrieve the content of a specific section
        
        Args:
            section_number: The section number to retrieve
            
        Returns:
            list: The content chunks for that section
        """
        results = self.retriever.collection.get(
            where={"section_number": section_number},
            include=["documents"]
        )
        
        return results['documents']
    
    def database_stats(self):
        """
        Get statistics about the database
        
        Returns:
            dict: Database statistics
        """
        # Get all metadatas
        results = self.retriever.collection.get(
            include=["metadatas", "documents"],
            limit=10000  # Adjust based on your DB size
        )
        
        # Count unique sections
        unique_sections = set()
        section_chunks = {}
        section_sizes = {}
        
        for i, meta in enumerate(results['metadatas']):
            section_number = meta.get('section_number')
            if section_number:
                unique_sections.add(section_number)
                
                # Count chunks per section
                if section_number not in section_chunks:
                    section_chunks[section_number] = 0
                section_chunks[section_number] += 1
                
                # Calculate total content size
                if section_number not in section_sizes:
                    section_sizes[section_number] = 0
                section_sizes[section_number] += len(results['documents'][i])
        
        return {
            "total_chunks": len(results['documents']),
            "unique_sections": len(unique_sections),
            "section_numbers": list(unique_sections),
            "chunks_per_section": section_chunks,
            "content_size_per_section": section_sizes,
            "average_chunk_size": sum(len(doc) for doc in results['documents']) / len(results['documents']) if results['documents'] else 0
        }
    
    def visualize_sections(self, output_path=None):
        """
        Create a visualization of sections by size
        
        Args:
            output_path: Path to save the visualization, or None to display
            
        Returns:
            None
        """
        stats = self.database_stats()
        
        if not stats:
            print("No data available for visualization")
            return
        
        # Create a DataFrame for visualization
        df = pd.DataFrame({
            'Section': list(stats['chunks_per_section'].keys()),
            'Chunks': list(stats['chunks_per_section'].values()),
            'Size (bytes)': list(stats['content_size_per_section'].values())
        })
        
        # Sort by size
        df = df.sort_values('Size (bytes)', ascending=False)
        
        # Create the visualization
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 8))
        
        # Plot chunks per section
        ax1.bar(df['Section'], df['Chunks'], color='skyblue')
        ax1.set_title('Chunks per Section')
        ax1.set_xlabel('Section Number')
        ax1.set_ylabel('Number of Chunks')
        ax1.set_xticklabels(df['Section'], rotation=45, ha='right')
        
        # Plot size per section
        ax2.bar(df['Section'], df['Size (bytes)'] / 1024, color='lightgreen')  # Convert to KB
        ax2.set_title('Size per Section (KB)')
        ax2.set_xlabel('Section Number')
        ax2.set_ylabel('Size (KB)')
        ax2.set_xticklabels(df['Section'], rotation=45, ha='right')
        
        plt.tight_layout()
        
        if output_path:
            plt.savefig(output_path)
            print(f"Visualization saved to {output_path}")
        else:
            plt.show()
    
    def test_with_questions(self, questions):
        """
        Test the system with a list of questions
        
        Args:
            questions: List of questions to test
            
        Returns:
            list: Results for each question
        """
        results = []
        
        for question in questions:
            print(f"\nTesting: {question}")
            try:
                result = self.retriever.query_codebook(question)
                results.append({
                    'question': question,
                    'answer': result['answer'],
                    'sources': result['sources']
                })
                
                # Print the result
                print(f"Answer: {result['answer'][:2000]}...")  # Truncate long answers
                print("Sources:")
                for source in result['sources']:
                    print(f"- Section {source['section_number']}: {source['section_name']}")
            except Exception as e:
                print(f"Error processing question: {str(e)}")
                results.append({
                    'question': question,
                    'error': str(e)
                })
        
        return results
    
    def save_test_results(self, results, output_file):
        """
        Save test results to a file
        
        Args:
            results: Test results
            output_file: File to save results to
        """
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"Test results saved to {output_file}")
    
    def interactive_query(self):
        """
        Start an interactive query session
        """
        print("\n=== City Codebook Query System ===")
        print("Type 'exit' to quit, 'help' for commands")
        
        while True:
            command = input("\nEnter a question or command: ").strip()
            
            if command.lower() == 'exit':
                print("Exiting query system")
                break
            elif command.lower() == 'help':
                print("\nAvailable commands:")
                print("  help         - Show this help")
                print("  exit         - Exit the query system")
                print("  sections     - List all sections in the database")
                print("  stats        - Show database statistics")
                print("  view <sec#>  - View content of a specific section")
                print("  Any other input will be treated as a question to the codebook")
            elif command.lower() == 'sections':
                sections = self.list_sections()
                print("\nAvailable Sections:")
                for section in sections:
                    print(f"  {section['section_number']}: {section['section_name']}")
            elif command.lower() == 'stats':
                stats = self.database_stats()
                print("\nDatabase Statistics:")
                print(f"  Total Chunks: {stats.get('total_chunks', 'N/A')}")
                print(f"  Unique Sections: {stats.get('unique_sections', 'N/A')}")
                print(f"  Average Chunk Size: {stats.get('average_chunk_size', 'N/A'):.1f} characters")
            elif command.lower().startswith('view '):
                section_number = command[5:].strip()
                content = self.view_section_content(section_number)
                print(f"\nContent for Section {section_number}:")
                for i, chunk in enumerate(content):
                    print(f"\n--- Chunk {i+1} ---")
                    print(chunk[:500] + "..." if len(chunk) > 500 else chunk)
            else:
                # Treat as a question
                print("\nProcessing your question...")
                try:
                    result = self.retriever.query_codebook(command)
                    print("\nAnswer:")
                    print(result['answer'])
                    print("\nSources:")
                    for source in result['sources']:
                        print(f"- Section {source['section_number']}: {source['section_name']}")
                except Exception as e:
                    print(f"Error: {str(e)}")


def sample_usage():
    """
    Example usage of CodebookUtils
    """
    from rag import CodebookRetriever
    
    # Initialize your retriever
    retriever = CodebookRetriever(html_document_id="bargersville_in")
    
    # Create utils
    utils = CodebookUtils(retriever)
    
    # Example: List all sections
    sections = utils.list_sections()
    print(f"Found {len(sections)} sections")
    
    # Example: Start interactive session
    utils.interactive_query()


if __name__ == "__main__":
    sample_usage()