#!/usr/bin/env python
import json
from random import randint
import subprocess
from typing import Dict, List, Any
import os
from dotenv import load_dotenv
import time
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
    
    # @listen(get_section_list)
    # def extract_section_content_and_chunk(self):
    #     print("Extracting section content and chunking")
        
    #     retriever = CodebookRetriever()
    #     retriever.process_all_sections(self.state.section_list)
       

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
    # crew = DevStandardsCrew().crew()
    # result = crew.kickoff(inputs={
    #         "section_list": "{'selected_title': 'TITLE XV: LAND USAGE', 'selected_chapter': 'CHAPTER 154: DEVELOPMENT CODE', 'chapter_name': 'DEVELOPMENT CODE', 'chapter_reason': 'This chapter is specifically focused on development codes and standards, making it highly relevant to the query about Development Standards.', 'chapter_contents': '§ 154.001 TITLE.\n§ 154.002 ENACTMENT.\n§ 154.003 PURPOSE.\n§ 154.004 SCOPE.\n§ 154.005 RELATIONSHIP TO OTHER ORDINANCES OR AGREEMENTS.\n§ 154.006 INCORPORATION OF OTHER DOCUMENTS.\n§ 154.007 DEFINITIONS.\n§ 154.008 PUBLIC UTILITY INSTALLATIONS.\n§ 154.009 ZONING MAP.\n§ 154.010 NONCONFORMING REGULATIONS.\n§ 154.011 NONCONFORMING USES.\n§ 154.012 NONCONFORMING BUILDINGS OR STRUCTURES.\n§ 154.013 NONCONFORMING LOTS OF RECORD.\n§ 154.014 REPAIRS AND MAINTENANCE.\n§ 154.015 EFFECTIVE DATE; TRANSITIONAL PROVISIONS.\n§ 154.030 ESTABLISHMENT OF ZONING DISTRICTS.\n§ 154.031 RURAL DISTRICTS STANDARDS AND USES.\n§ 154.032 RESIDENTIAL DISTRICTS STANDARDS AND USES.\n§ 154.033 COMMERCIAL DISTRICTS STANDARDS AND USES.\n§ 154.034 INDUSTRIAL DEVELOPMENT STANDARDS AND USES.\n§ 154.035 SPECIAL DISTRICT DEVELOPMENT STANDARDS.\n§ 154.036 FLOODPLAIN REGULATIONS.\n§ 154.037 ARTERIAL CORRIDOR OVERLAY.\n§ 154.038 I-69 INTERCHANGE OVERLAY.\n§ 154.039 PERMITTED USES.\n§ 154.040 PERMITTED USE TABLE.\n§ 154.041 USE LIMITATION NOTES.\n§ 154.042 USE DESCRIPTIONS.\n§ 154.060 ACCESSORY DWELLING UNIT.\n§ 154.061 ADULT BUSINESSES.\n§ 154.062 BED AND BREAKFAST.\n§ 154.063 CHILDCARE FACILITIES.\n§ 154.064 DRIVE-THROUGH FACILITIES.\n§ 154.065 HELIPORTS AND HELIPADS.\n§ 154.066 HOME OCCUPATIONS.\n§ 154.067 MANUFACTURED HOME PARKS.\n§ 154.068 OUTDOOR SALES DISPLAY.\n§ 154.069 OUTDOOR EATING AREAS.\n§ 154.070 OUTDOOR STORAGE.\n§ 154.071 SHORT-TERM RENTALS.\n§ 154.072 SMALL CELL FACILITIES.\n§ 154.073 SOLAR ENERGY CONVERSION SYSTEMS AS ACCESSORY USES.\n§ 154.074 SOLAR ENERGY CONVERSION SYSTEMS AS PRIMARY USES.\n§ 154.075 TEMPORARY USES.\n§ 154.076 VEHICLE STORAGE.\n§ 154.077 WIND ENERGY CONVERSION SYSTEMS AS ACCESSORY USES.\n§ 154.078 WIND ENERGY CONVERSION AS A PRIMARY USE.\n§ 154.079 WIRELESS COMMUNICATION FACILITIES.\n§ 154.090 ACCESSORY BUILDINGS AND STRUCTURES.\n§ 154.091 BUILDING STANDARDS.\n§ 154.092 FENCES AND WALLS.\n§ 154.093 HEIGHT STANDARDS.\n§ 154.094 LOT STANDARDS.\n§ 154.095 PERFORMANCE STANDARDS.\n§ 154.096 PROPERTY MAINTENANCE STANDARDS.\n§ 154.097 EXCAVATIONS OR HOLES.\n§ 154.098 SETBACK STANDARDS.\n§ 154.099 VISION CLEARANCE STANDARDS.\n§ 154.100 YARD STANDARDS.\n§ 154.110 LANDSCAPE STANDARDS.\n§ 154.111 LIGHTING.\n§ 154.112 PARKING STANDARDS.\n§ 154.113 SIGNAGE.\n§ 154.130 ESTABLISHMENT OF CONTROLS.\n§ 154.131 SUBDIVISION TYPES.\n§ 154.132 APPROVAL PROCESS OVERVIEW.\n§ 154.133 SKETCH PLAN REVIEW PROCEDURE.\n§ 154.134 SKETCH PLAN SUBMITTAL REQUIREMENTS.\n§ 154.135 PRIMARY PLAT APPROVAL PROCEDURE.\n§ 154.136 PRIMARY PLAT SUBMITTAL REQUIREMENTS.\n§ 154.137 CONSTRUCTION PLAN APPROVAL PROCEDURE.\n§ 154.138 CONSTRUCTION PLAN SUBMITTAL REQUIREMENTS.\n§ 154.139 SECONDARY PLAT APPROVAL PROCEDURE.\n§ 154.140 SECONDARY PLAT SUBMITTAL REQUIREMENTS.\n§ 154.141 AS-BUILT DRAWINGS SUBMITTAL REQUIREMENTS.\n§ 154.142 COMMERCIAL AND INDUSTRIAL SUBDIVISIONS.\n§ 154.143 RE-SUBDIVISION OF LAND.\n§ 154.144 VACATION OF PLATS.\n§ 154.145 MODIFICATIONS.\n§ 154.146 DESIGN PRINCIPLES AND STANDARDS.\n§ 154.147 RESIDENTIAL ARCHITECTURAL STANDARDS.\n§ 154.148 BUSINESS AND MIXED-USE ARCHITECTURAL STANDARDS.\n§ 154.149 INDUSTRIAL ARCHITECTURAL STANDARDS.\n§ 154.150 BLOCK STANDARDS.\n§ 154.151 DRAINAGE STANDARDS.\n§ 154.152 EASEMENT STANDARDS.\n§ 154.153 MONUMENT AND MARKER STANDARDS.\n§ 154.154 OPEN SPACE AND AMENITY STANDARDS.\n§ 154.155 PEDESTRIAN NETWORK STANDARDS.\n§ 154.156 STREET AND RIGHT-OF-WAY STANDARDS.\n§ 154.157 STREET STANDARDS.\n§ 154.158 STREET LIGHT STANDARDS.\n§ 154.159 STREET SIGN STANDARDS.\n§ 154.160 UTILITY STANDARDS.\n§ 154.161 SURETY STANDARDS.\n§ 154.162 APPEAL.\n§ 154.163 PLAT CERTIFICATES AND DEED OF DEDICATION.\n§ 154.180 PROCESS.\n§ 154.181 PERMITS.\n§ 154.182 ADMINISTRATION.\n§ 154.183 ENFORCEMENT.'}",
    #         "zone_code": "RR",
    #         "html_document_id": "bargersville_in",
    #         "subtopic": "LOT REQUIREMENTS",
    #         "section_finding_hint": "Look for sections discussing minimum lot sizes, lot width, lot coverage, and lot area requirements.",
    #     })
    