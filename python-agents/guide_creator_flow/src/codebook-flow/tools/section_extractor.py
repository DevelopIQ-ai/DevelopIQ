# from crewai.tools import BaseTool
# from pydantic import BaseModel, Field
# from typing import Optional, Type
# import re
# from bs4 import BeautifulSoup

# class SectionExtractorInput(BaseModel):
#     """Input schema for SectionExtractorTool."""
#     section_number: str = Field(..., description="The section number to find (e.g., '151.027')")
#     section_name: Optional[str] = Field(None, description="Optional section name to confirm correct section")
#     html_document: str = Field(..., description="The HTML content of the document to extract the section from")
    
# class SectionExtractorTool(BaseTool):
#     name: str = "section_extractor"
#     description: str = "Extract the content of a specific section from a municipal code book by its section number and name"
#     args_schema: Type[BaseModel] = SectionExtractorInput

#     def _run(self, section_number: str, section_name: Optional[str] = None, html_document: str = "") -> str:
#         """
#         Extract the content of a specific section from HTML content.
        
#         Args:
#             section_number: The section number to find (e.g., "151.027")
#             section_name: Optional section name to confirm correct section
#             html_document: HTML content of the document as a string
        
#         Returns:
#             The content of the specified section as a string
#         """
#         # Process HTML content
#         soup = BeautifulSoup(html_document, 'html.parser')
        
#         # Remove scripts and styles for cleaner text
#         for script in soup(["script", "style"]):
#             script.extract()
            
#         content = soup.get_text()
        
#         # Prepare section identifier pattern
#         section_pattern = r'§\s*' + re.escape(section_number)
#         if section_name:
#             # If name provided, match both number and name
#             section_pattern += r'\s+' + re.escape(section_name)
        
#         # Find the start of the specified section
#         section_match = re.search(section_pattern, content, re.IGNORECASE)
#         if not section_match:
#             return f"Section {section_number} not found in the document."
        
#         start_pos = section_match.start()
        
#         # Find the start of the next section (to know where current section ends)
#         next_section_match = re.search(r'§\s*\d+\.\d+', content[start_pos + 1:])
        
#         if next_section_match:
#             end_pos = start_pos + 1 + next_section_match.start()
#             section_content = content[start_pos:end_pos].strip()
#         else:
#             # If no next section found, take everything until the end or a reasonable amount
#             section_content = content[start_pos:].strip()
            
#             # Try to find a reasonable ending (like next chapter or title)
#             chapter_match = re.search(r'CHAPTER \d+:', section_content[100:])
#             if chapter_match:
#                 section_content = section_content[:100 + chapter_match.start()].strip()
        
#         return section_content