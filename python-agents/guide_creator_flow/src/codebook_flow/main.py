#!/usr/bin/env python
import json
from random import randint
from typing import Dict, List, Any
import os
from dotenv import load_dotenv
import time

from pydantic import BaseModel

from crewai.flow.flow import Flow, listen, start
from bs4 import BeautifulSoup
from crewai import Crew, Task, Agent
import agentops
from crews.extraction_crew.extraction_crew import ExtractionCrew
from instructions import hints
from alp_scraper import scrape_html_from_alp
import requests
from openai import OpenAI
from alp_html_processor import extract_table_of_contents

load_dotenv()

agentops.init(
    api_key=os.environ.get('AGENTOPS_API_KEY'),
    default_tags=['crewai']
)

input_municipality = "Bargersville"
input_state = "IN"
storage_path = "./html_storage"
html_content = ""
# Get test mode from environment variables
test_mode = os.environ.get('TEST_MODE', 'False').lower() == 'true'

def get_html_document_id():
    """
    Retrieves an HTML document from a municipal code website or falls back to a local file.
    Stores the HTML in a temporary file and returns a reference ID.
    Returns:
        str: A document ID reference to the stored HTML
    """
    municipality = input_municipality
    state = input_state
    document_id = f"{municipality.lower().replace(' ', '_')}_{state.lower()}"
    
    # Create a storage directory if it doesn't exist
    os.makedirs(storage_path, exist_ok=True)
    
    # In test mode, check if the file already exists in storage and use it
    if test_mode:
        storage_file_path = f"{storage_path}/{document_id}.html"
        if os.path.exists(storage_file_path):
            print(f"Test mode: Using existing HTML document with ID: {document_id}")
            return document_id
    
    # Only try to fetch from web if not in test mode
    if not test_mode:
        try:
            # Try to get the HTML from the web
            html_url = scrape_html_from_alp(municipality, state)
            response = requests.get(html_url)
            response.raise_for_status()
            
            if response.status_code == 200:
                print("Successfully fetched HTML document")
                html_content = response.text            
                with open(f"{storage_path}/{document_id}.html", "w", encoding="utf-8") as f:
                    f.write(html_content)
                print(f"HTML document stored with ID: {document_id}")
                return document_id
        except Exception as e:
            print(f"Error fetching URL: {e}")
    
    # Fallback logic - try to use existing file in storage first
    storage_file_path = f"{storage_path}/{document_id}.html"
    if os.path.exists(storage_file_path):
        print(f"Using existing HTML document with ID: {document_id}")
        return document_id
    
    # If no existing file, try the gas-city.html fallback
    try:
        with open("gas-city.html", "r", encoding="utf-8") as f:
            html_content = f.read()
        # Store the fallback content
        with open(storage_file_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        print(f"Using fallback HTML document with ID: {document_id}")
        return document_id
    except Exception as e:
        print(f"Error reading fallback file: {e}")
        return None


class ContentState(BaseModel):
    html_document_id: str = ""
    title_list: Dict[str, Any] = {}
    extracted_sections: Dict[str, Any] = {}
    analysis_results: Dict[str, Any] = {}
    zone_code: str = "RR"


class ContentFlow(Flow[ContentState]):

    @start()
    def retrieve_and_process_html_document(self):
        print("Getting HTML document")
        self.state.html_document_id = get_html_document_id()
        self.state.title_list = extract_table_of_contents(self.state.html_document_id, titles_only=True)
        print("Title list extracted")
   
    @listen(retrieve_and_process_html_document)
    def get_relevant_sections(self):
        print("Getting relevant sections")
        info = "permitted_use"
        result = (
            ExtractionCrew()
            .crew()
            .kickoff(inputs={
                "title_list": self.state.title_list, 
                "topic": "Permitted Uses", 
                "html_document_id": self.state.html_document_id,
                "zone_code": self.state.zone_code,
                "title_finding_hint": hints[info]["title_finding_hint"],
                "section_finding_hint": hints[info]["section_finding_hint"],
                "analysis_goal": hints[info]["analysis_goal"],
                "analysis_process": hints[info]["analysis_process"],
                "verification_hint": hints[info]["verification_hint"],
                "examples": hints[info]["examples"],
                "expected_output": hints[info]["expected_output"]
            })
        )
        print(result)
        print("Relevant sections extracted")
        

def kickoff():
    if test_mode:
        print("Running in test mode - will use existing HTML files")
    content_flow = ContentFlow()
    content_flow.kickoff()
    agentops.end_session(end_state="Success")

def plot():
    content_flow = ContentFlow()
    content_flow.plot()

if __name__ == "__main__":
    kickoff()
    # agentops.end_session(end_state="Success")
