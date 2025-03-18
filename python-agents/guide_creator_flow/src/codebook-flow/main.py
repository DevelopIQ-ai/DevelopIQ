#!/usr/bin/env python
import json
from random import randint
from typing import Dict, List, Any
import os
from dotenv import load_dotenv

from pydantic import BaseModel

from crewai.flow.flow import Flow, listen, start
from bs4 import BeautifulSoup
from crewai import Crew, Task, Agent
import agentops
from crews.extraction_crew.extraction_crew import ExtractionCrew
from instructions import hints


# Initialize agentops with API key and tags - this automatically starts a session
# Load environment variables
load_dotenv()

agentops.init(
    api_key=os.environ.get('AGENTOPS_API_KEY'),
    default_tags=['crewai']
)


def get_html_document():
        with open("gas_city.html", "r") as f:
            return f.read()
    
def get_table_of_contents(html_document: str):
    """Extract table of contents from HTML document."""
    soup = BeautifulSoup(html_document, 'html.parser')
    
    # Define a function similar to your extractTableOfContents
    toc = []
    
    # Extract titles
    title_elements = soup.select('.Title.rbox, .rbox.Title')
    for i, title_element in enumerate(title_elements):
        title_text = title_element.text.strip() or f"Title {i + 1}"
        
        title_entry = {
            "title": title_text,
            "type": "Title",
            "level": 0,
            "children": [],
            "id": f"title-{i}"
        }
        
        # Extract chapters
        chapter_elements = soup.select('.Chapter.rbox, .rbox.Chapter')
        for j, chapter_element in enumerate(chapter_elements):
            chapter_text = chapter_element.text.strip() or ""
            
            # Parse chapter info
            import re
            chapter_match = re.search(r"CHAPTER\s+(\d+):\s*(.*)", chapter_text, re.IGNORECASE)
            if not chapter_match:
                print(f"Chapter {j} doesn't match expected format: {chapter_text}")
                continue
            
            chapter_number = chapter_match.group(1)
            chapter_name = chapter_match.group(2).strip()
            
            chapter_entry = {
                "title": chapter_text,
                "type": "Chapter",
                "level": 1,
                "children": [],
                "id": f"chapter-{chapter_number}",
                "chapterNumber": chapter_number,
                "chapterName": chapter_name
            }
            
            # Extract sections
            section_elements = soup.select('.Section.toc-destination.rbox, .Section.rbox, .rbox.Section')
            for k, section_element in enumerate(section_elements):
                section_text = section_element.text.strip() or ""
                
                # Parse section info
                section_match = re.search(r"§\s*(\d+)\.(\d+)\s*(.*)", section_text)
                if not section_match:
                    print(f"Section {k} doesn't match expected format: {section_text}")
                    continue
                
                section_chapter_number = section_match.group(1)
                section_number = section_match.group(2)
                section_name = section_match.group(3).strip()
                
                # Skip sections that don't belong to this chapter
                if section_chapter_number != chapter_number:
                    continue
                
                section_entry = {
                    "title": section_text,
                    "type": "Section",
                    # "level": 2,
                    # "children": [],
                    # "id": f"chapter-{chapter_number}-section-{section_number}",
                    # "sectionNumber": section_number,
                    # "sectionName": section_name,
                    # "content": extract_content(section_element)
                }
                
                # Add the section to the chapter
                chapter_entry["children"].append(section_entry)
            
            # Add the chapter to the title
            title_entry["children"].append(chapter_entry)
        
        # Add the title to the TOC
        toc.append(title_entry)
        with open("./toc.json", "w") as toc_file:
            json.dump(toc, toc_file, indent=2)
        return toc

def extract_content(element):
    """Extract content from an element."""
    # This is simplified - you would need to adapt it to BeautifulSoup
    return element.text.strip()

# def identify_relevant_sections(toc_json):
#     """Identify sections in TOC likely to contain target information."""
#     toc = json.loads(toc_json)
    
#     # Flatten the TOC for analysis
#     flattened_toc = []
    
#     def traverse(entries, path=None):
#         if path is None:
#             path = []
        
#         for entry in entries:
#             current_path = path + [entry["title"]]
            
#             if entry["type"] == "Section":
#                 flattened_toc.append({
#                     "id": entry.get("id"),
#                     "title": entry["title"],
#                     "type": entry["type"],
#                     "level": entry["level"],
#                     "path": " > ".join(current_path),
#                     "chapterNumber": entry.get("chapterNumber"),
#                     "sectionNumber": entry.get("sectionNumber"),
#                     "content": entry.get("content", "")
#                 })
            
#             if "children" in entry and entry["children"]:
#                 traverse(entry["children"], current_path)
    
#     traverse(toc)
    
#     # This would be done by the AI agent in CrewAI
#     # For demonstration purposes, returning a simple result
#     return json.dumps(flattened_toc, indent=2)
        
class ContentState(BaseModel):
    html_document: str = ""
    table_of_contents: Dict[str, Any] = {}
    relevant_sections: List[str] = []

class ContentFlow(Flow[ContentState]):

    @start()
    def retrieve_and_process_html_document(self):
        print("Getting HTML document")
        self.state.html_document = get_html_document()
        self.state.table_of_contents = get_table_of_contents(self.state.html_document)

    @listen(retrieve_and_process_html_document)
    def get_relevant_sections(self):
        print("Getting relevant sections")
        result = (
            ExtractionCrew()
            .crew()
            .kickoff(inputs={
                "table_of_contents": self.state.table_of_contents, 
                "topic": "Permitted Use Matrix", 
                "hint": hints["permitted_use_matrix_extraction_hint"],
                "html_document": self.state.html_document
            })
        )
        print("Relevant sections generated", result.raw)
        self.state.relevant_sections = result.raw


def kickoff():
    content_flow = ContentFlow()
    content_flow.kickoff()
    agentops.end_session(end_state="Success")

def plot():
    content_flow = ContentFlow()
    content_flow.plot()

if __name__ == "__main__":
    # No need to call start_session as it's already started by init()
    kickoff()
    # agentops.end_session(end_state="Success")
