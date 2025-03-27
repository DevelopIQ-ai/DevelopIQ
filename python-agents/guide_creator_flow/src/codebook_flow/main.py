#!/usr/bin/env python
import json
from random import randint
import subprocess
from typing import Dict, List, Any
import os
from dotenv import load_dotenv
import time

from codebook_helpers import extract_alp_section_content_from_section_number
# from rag.rag import CodebookRetriever

from pydantic import BaseModel

from crewai.flow.flow import Flow, listen, start
from bs4 import BeautifulSoup
import agentops
from crews.search_crew.search_crew import SearchCrew
from crews.search_crew.search_hints import search_hints
from alp_scraper import scrape_html_from_alp
import requests
from codebook_helpers import extract_alp_table_of_contents_full
from rag.codebook_retriever import CodebookRetriever
load_dotenv()

agentops.init(
    api_key=os.environ.get('AGENTOPS_API_KEY'),
    default_tags=['crewai']
)

input_municipality = "Bargersville"
input_state = "IN"
storage_path = "./html_storage"
html_content = ""
model = "gpt-4o-mini"

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
    section_list: Dict[str, Any] = {}


class ContentFlow(Flow[ContentState]):

    @start()
    def retrieve_and_process_html_document(self):
        print("Getting HTML document")
        self.state.html_document_id = get_html_document_id()
        self.state.title_list = extract_alp_table_of_contents_full(self.state.html_document_id, titles_only=True)
        print("Title list extracted")
   
    @listen(retrieve_and_process_html_document)
    def get_section_list(self):
        print("Getting relevant sections")
        
        crew = SearchCrew().crew()
        result = crew.kickoff(inputs={
            "topic": "Development Standards",
            "zone_code": self.state.zone_code,
            "title_list": self.state.title_list,
            "html_document_id": self.state.html_document_id,
            "title_finding_hint": search_hints["title_finding_hint"],
            "chapter_finding_hint": search_hints["chapter_finding_hint"],
        })
        
        self.state.section_list = result
        print("Section list extracted", result)
    
    @listen(get_section_list)
    def extract_section_content_and_chunk(self):
        print("Extracting section content and chunking")
        
        retriever = CodebookRetriever(html_document_id=self.state.html_document_id)
        # retriever.process_all_sections(self.state.section_list)
       

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
    # kickoff()
    section_list =  {
  "selected_title": "TITLE XV: LAND USAGE",
  "selected_chapter": "CHAPTER 154: DEVELOPMENT CODE",
  "chapter_reason": "This chapter contains specific regulations and standards regarding development, directly addressing the user's inquiry about Development Standards.",
  "chapter_contents": [
    {"section_number": "154.015", "section_name": "EFFECTIVE DATE; TRANSITIONAL PROVISIONS."},
    {"section_number": "154.030", "section_name": "ESTABLISHMENT OF ZONING DISTRICTS."},
    {"section_number": "154.031", "section_name": "RURAL DISTRICTS STANDARDS AND USES."},
    {"section_number": "154.032", "section_name": "RESIDENTIAL DISTRICTS STANDARDS AND USES."},
    {"section_number": "154.033", "section_name": "COMMERCIAL DISTRICTS STANDARDS AND USES."},
    {"section_number": "154.034", "section_name": "INDUSTRIAL DEVELOPMENT STANDARDS AND USES."},
    {"section_number": "154.035", "section_name": "SPECIAL DISTRICT DEVELOPMENT STANDARDS."},
    {"section_number": "154.036", "section_name": "FLOODPLAIN REGULATIONS."},
    {"section_number": "154.037", "section_name": "ARTERIAL CORRIDOR OVERLAY."},
    {"section_number": "154.038", "section_name": "I-69 INTERCHANGE OVERLAY."},
    {"section_number": "154.039", "section_name": "PERMITTED USES."},
    {"section_number": "154.040", "section_name": "PERMITTED USE TABLE."},
    {"section_number": "154.113", "section_name": "SIGNAGE."},
  ]
}

    sections = section_list["chapter_contents"]
    zone_code = "R-R"
    html_id = "bargersville_in"
    subtopic = "LOT REQUIREMENTS"
    retriever = CodebookRetriever(html_document_id=html_id)
    retriever.process_all_sections(sections, extract_alp_section_content_from_section_number)
    answer = retriever.query_codebook("What uses are allowed in the R-R zone? Specifically list them. If the cell value in the R-R column is 'P', then they are permitted. If they are an 'S' or are empty, then they are not. Hint: The information likely comes from a table in section 154.040.")
    print(answer)

    # content = extract_alp_section_content_from_section_number("bargersville_in", "154.040")
    # print(content)

    