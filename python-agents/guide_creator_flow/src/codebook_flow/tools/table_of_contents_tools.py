from typing import Type, Tuple, Dict, Any, Optional
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from bs4 import BeautifulSoup
import re
import json
import os

def normalize_whitespace(text):
    """
    Normalize whitespace in a string by replacing multiple spaces with a single space
    and stripping leading/trailing whitespace.
    """
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text.strip())

def load_html_from_storage(document_id: str) -> Tuple[Optional[str], Optional[Dict[str, Any]], Optional[BeautifulSoup]]:
    """
    Shared function to load HTML from storage and create BeautifulSoup object.
    
    Parameters:
        document_id (str): The ID of the HTML document to load
    
    Returns:
        Tuple containing:
        - HTML document as string (or None if error)
        - Error information (or None if successful)
        - BeautifulSoup object (or None if error)
    """
    storage_path = "./html_storage"
    html_file_path = f"{storage_path}/{document_id.lower()}.html"
    
    # Check if file exists
    if not os.path.exists(html_file_path):
        error_msg = f"File not found: {html_file_path}"
        print(error_msg)
        return None, {"error": error_msg}, None
    
    # Check file size
    file_size = os.path.getsize(html_file_path)
    if file_size == 0:
        error_msg = f"File is empty: {html_file_path} (0 bytes)"
        print(error_msg)
        return None, {"error": error_msg}, None
    
    try:
        with open(html_file_path, "r", encoding="utf-8") as f:
            html_document = f.read()
        
        print(f"File loaded: {html_file_path} ({len(html_document)} bytes)")
        
        soup = BeautifulSoup(html_document, 'html.parser')
        
        # Log basic HTML structure info
        title_elements = soup.select('.Title.rbox, .rbox.Title')
        if len(title_elements) > 0:
            title_texts = [elem.text.strip() for elem in title_elements]
                
        return html_document, None, soup
        
    except Exception as e:
        error_msg = f"Error loading HTML document: {e}"
        print(error_msg)
        return None, {"error": error_msg}, None


# Tool 1: Table of Contents Extractor Tool
class TableOfContentsExtractorInput(BaseModel):
    """Input schema for TableOfContentsExtractorTool."""
    html_document_id: str = Field(..., description="The ID of the municipal code document to parse")
    target_title: str = Field(..., description="The full name of the title to extract detailed contents for")

class TableOfContentsExtractorTool(BaseTool):
    name: str = "table_of_contents_extractor_tool"
    description: str = "Extracts detailed table of contents for a specific title from an HTML document"
    args_schema: Type[BaseModel] = TableOfContentsExtractorInput

    def _run(self, html_document_id: str, target_title: str) -> dict:
        """
        Extract detailed table of contents for a specific title from an HTML document.
        
        Returns:
            dict: A detailed hierarchical structure of the title, including all chapters and sections
        """
        # Load HTML using the shared function
        _, error, soup = load_html_from_storage(html_document_id)
        if error:
            return error
        
        # Find the specified title
        title_elements = soup.select('.Title.rbox, .rbox.Title')
        title_texts = [elem.text.strip() for elem in title_elements]
        
        # Normalize the target title and create a mapping of normalized titles to original titles
        normalized_target = normalize_whitespace(target_title)
        normalized_titles = {normalize_whitespace(title): title for title in title_texts}
        
        # Check if the normalized target exists in our normalized titles
        if normalized_target not in normalized_titles:
            # Try case-insensitive matching
            normalized_target_lower = normalized_target.lower()
            found = False
            for norm_title, orig_title in normalized_titles.items():
                if norm_title.lower() == normalized_target_lower:
                    # Found a case-insensitive match
                    target_title = orig_title
                    found = True
                    break
            
            if not found:
                error_msg = f"Target title not found: '{target_title}'. Available titles: {title_texts}"
                print(error_msg)
                return {"error": error_msg}
        else:
            # Use the original title that corresponds to the normalized one
            target_title = normalized_titles[normalized_target]
        
        title_entry = None
        
        for i, title_element in enumerate(title_elements):
            title_text = title_element.text.strip() or f"Title {i + 1}"
            
            # Compare using normalized whitespace
            if normalize_whitespace(title_text) == normalize_whitespace(target_title):
                print(f"Found target title: '{target_title}'")
                title_entry = {
                    "full_name": title_text,
                    "type": "Title",
                    "level": 0,
                    "children": [],
                    "id": f"title-{i}"
                }
                
                # Find chapters for this title
                next_element = title_element.find_next_sibling()
                chapter_elements = []
                while next_element and not next_element.select_one('.Title.rbox, .rbox.Title'):
                    if next_element.select_one('.Chapter.rbox, .rbox.Chapter'):
                        chapter_elements.append(next_element)
                    next_element = next_element.find_next_sibling()
                
                # If no chapters were found through siblings, try the general selector
                if not chapter_elements:
                    chapter_elements = soup.select('.Chapter.rbox, .rbox.Chapter')
                
                print(f"Number of chapters found: {len(chapter_elements)}")
                
                # Process chapters
                for j, chapter_element in enumerate(chapter_elements):
                    chapter_text = chapter_element.text.strip() or ""
                    
                    # Parse chapter info
                    chapter_match = re.search(r"CHAPTER\s+(\d+):\s*(.*)", chapter_text, re.IGNORECASE)
                    if not chapter_match:
                        continue
                    
                    chapter_number = chapter_match.group(1)
                    chapter_name = chapter_match.group(2).strip()                    
                    chapter_entry = {
                        "full_name": chapter_text,
                        "type": "Chapter",
                        "level": 1,
                        "children": [],
                        "id": f"chapter-{chapter_number}",
                        "chapterNumber": chapter_number,
                        "chapterName": chapter_name
                    }
                    
                    # Find sections for this chapter
                    next_chapter_element = chapter_element.find_next_sibling('.Chapter.rbox, .rbox.Chapter')
                    section_elements = []
                    
                    # Get sections between this chapter and the next chapter
                    current_element = chapter_element.find_next_sibling()
                    while current_element and current_element != next_chapter_element:
                        if current_element.select_one('.Section.toc-destination.rbox, .Section.rbox, .rbox.Section'):
                            section_elements.append(current_element)
                        current_element = current_element.find_next_sibling()
                    
                    # If no sections were found, try the general selector
                    if not section_elements:
                        section_elements = soup.select('.Section.toc-destination.rbox, .Section.rbox, .rbox.Section')
                                        
                    # Process sections
                    for k, section_element in enumerate(section_elements):
                        section_text = section_element.text.strip() or ""
                        
                        # Parse section info
                        section_match = re.search(r"§\s*(\d+)\.(\d+)\s*(.*)", section_text)
                        if not section_match:
                            continue
                        
                        section_chapter_number = section_match.group(1)
                        section_number = section_match.group(2)
                        section_name = section_match.group(3).strip()
                        
                        # Skip sections that don't belong to this chapter
                        if section_chapter_number != chapter_number:
                            continue
                        
                        
                        section_entry = {
                            "full_name": section_text,
                            "type": "Section",
                            "level": 2,
                            "id": f"chapter-{chapter_number}-section-{section_number}",
                            "sectionNumber": section_number,
                            "sectionName": section_name,
                            "fullSectionNumber": f"{chapter_number}.{section_number}"
                        }
                        
                        # Add the section to the chapter
                        chapter_entry["children"].append(section_entry)
                    
                    # Add the chapter to the title
                    title_entry["children"].append(chapter_entry)
                
                # We found the title, so break the loop
                break
        
        if not title_entry:
            return {"error": f"Failed to process title: {target_title}"}
        
        return title_entry


# Tool 2: Section Extractor Tool
# class SectionExtractorInput(BaseModel):
#     """Input schema for SectionExtractorTool."""
#     html_document_id: str = Field(..., description="The ID of the municipal code document to parse")
#     chapter_number: str = Field(..., description="The chapter number of the section to extract")
#     section_number: str = Field(..., description="The section number to extract")

# class SectionExtractorTool(BaseTool):
#     name: str = "section_extractor_tool"
#     description: str = "Extracts the complete content of a specific section from the municipal code"
#     args_schema: Type[BaseModel] = SectionExtractorInput

#     def _run(self, html_document_id: str, chapter_number: str, section_number: str) -> dict:
#         """
#         Extract the complete content of a specific section from the municipal code.
        
#         Returns:
#             dict: A dictionary containing the section metadata and content
#         """
#         # Load HTML using the shared function
#         _, error, soup = load_html_from_storage(html_document_id)
#         if error:
#             return error
        
#         # Find all section elements
#         section_elements = soup.select('.Section.toc-destination.rbox, .Section.rbox, .rbox.Section')
        
#         if len(section_elements) == 0:
#             return {
#                 "error": "No section elements found in the document",
#                 "section_number": f"{chapter_number}.{section_number}",
#                 "content": ""
#             }
        
#         # Look for the specific section
#         for section_element in section_elements:
#             section_text = section_element.text.strip() or ""
            
#             # Parse section info
#             section_match = re.search(r"§\s*(\d+)\.(\d+)\s*(.*)", section_text)
#             if not section_match:
#                 continue
            
#             section_chapter_num = section_match.group(1)
#             section_num = section_match.group(2)
#             section_name = section_match.group(3).strip()
            
#             # Check if this is the section we're looking for
#             if section_chapter_num == chapter_number and section_num == section_number:                
#                 content = self._extract_section_content(section_element)
                
#                 # Return the section with metadata and content
#                 return {
#                     "section_number": f"{chapter_number}.{section_number}",
#                     "section_title": section_name,
#                     "chapter_number": chapter_number,
#                     "content": content
#                 }
        
#         return {
#             "error": f"Section {chapter_number}.{section_number} not found in the document",
#             "section_number": f"{chapter_number}.{section_number}",
#             "content": ""
#         }

    
        

#     def _extract_section_content(self, section_element):
#         """
#         Extract the content text from a section element, including any nested tables, until the next section.
#         Returns one big string that includes leftover text and JSON-serialized tables (delimited).
#         """
#         # The heading (e.g. "§ 154.040  PERMITTED USE TABLE.")
#         section_title = section_element.get_text(strip=True)

#         content_chunks = []
#         next_element = section_element.next_sibling

#         while next_element:
#             # If we hit another .Section, that means a new section is starting
#             if next_element.name == 'div' and 'Section' in (next_element.get('class') or []):
#                 break

#             if next_element.name in ['div', 'p', 'ul', 'ol', 'table']:
#                 # If it's a <table> directly
#                 if next_element.name == 'table':
#                     table_data = self._parse_table(next_element)
#                     if table_data:
#                         # Convert to JSON, then wrap with delimiters
#                         table_json = json.dumps(table_data)
#                         content_chunks.append(f"--BEGIN-TABLE--\n{table_json}\n--END-TABLE--")
#                 else:
#                     # This element may contain nested tables
#                     nested_tables = next_element.find_all('table', recursive=True)
#                     for tbl in nested_tables:
#                         tbl_data = self._parse_table(tbl)
#                         if tbl_data:
#                             table_json = json.dumps(tbl_data)
#                             content_chunks.append(f"--BEGIN-TABLE--\n{table_json}\n--END-TABLE--")
#                         tbl.decompose()

#                     # After removing tables, any leftover text remains
#                     leftover = next_element.get_text(strip=True).replace('\xa0', ' ')
#                     if leftover:
#                         content_chunks.append(leftover)
            
#             next_element = next_element.next_sibling

#         # Merge them all into one giant string. Prepend the section title at the top.
#         final_string = section_title + "\n\n" + "\n".join(content_chunks)
#         return final_string


#     def _parse_table(self, table_element):
#         """
#         Parse an HTML table into a structured format that enhances AI understanding
#         without relying on any hardcoded patterns or assumptions.
        
#         Returns a dictionary with enhanced structural information about the table.
#         """
#         # Extract all rows
#         rows = table_element.find_all('tr')
#         if not rows:
#             return None
        
#         # First pass: collect raw data and basic structural information
#         table_data = []
#         row_metadata = []
        
#         for row_idx, row in enumerate(rows):
#             cells = row.find_all(['th', 'td'])
#             row_texts = [c.get_text(strip=True).replace('\xa0', ' ') for c in cells]
            
#             if not row_texts:
#                 continue
            
#             # Add the raw row data
#             table_data.append(row_texts)
            
#             # Collect structural metadata
#             spans = []
#             for cell in cells:
#                 # Check for column spans which often indicate headers/categories
#                 colspan = cell.get('colspan')
#                 if colspan and int(colspan) > 1:
#                     spans.append({
#                         'index': len(spans),
#                         'text': cell.get_text(strip=True).replace('\xa0', ' '),
#                         'colspan': int(colspan)
#                     })
            
#             # Record metadata about this row
#             row_metadata.append({
#                 'row_index': row_idx,
#                 'cell_count': len(row_texts),
#                 'spans': spans,
#                 'first_cell': row_texts[0] if row_texts else "",
#                 'is_all_caps': all(c.isupper() for c in row_texts[0] if c.isalpha()) if row_texts else False,
#                 'empty_cells': sum(1 for text in row_texts if not text)
#             })
        
#         # Return enhanced data structure
#         return {
#             'raw_data': table_data,
#             'row_metadata': row_metadata
#         }

# Tool 3: Chapter Extractor Tool
class ChapterExtractorInput(BaseModel):
    """Input schema for ChapterExtractorTool."""
    html_document_id: str = Field(..., description="The ID of the municipal code document to parse")
    chapter_number: str = Field(..., description="The chapter number to extract contents for. Parse the full_name and send in only the number, not the name.")

class ChapterExtractorTool(BaseTool):
    name: str = "chapter_extractor_tool"
    description: str = "Extracts detailed table of contents for a specific chapter from an HTML document"
    args_schema: Type[BaseModel] = ChapterExtractorInput

    def _run(self, html_document_id: str, chapter_number: str) -> dict:
        """
        Extract detailed table of contents for a specific chapter from an HTML document.
        
        Returns:
            dict: A detailed structure of the chapter, including all sections
        """
        # Load HTML using the shared function
        _, error, soup = load_html_from_storage(html_document_id)
        if error:
            return error
        
        # Find the specified chapter
        chapter_elements = soup.select('.Chapter.rbox, .rbox.Chapter')
        target_chapter = None
        chapter_text = ""
        
        for chapter_element in chapter_elements:
            chapter_text = chapter_element.text.strip()
            chapter_match = re.search(r"CHAPTER\s+(\d+):\s*(.*)", chapter_text, re.IGNORECASE)
            
            if chapter_match and chapter_match.group(1) == chapter_number:
                target_chapter = chapter_element
                chapter_name = chapter_match.group(2).strip()
                break
        
        if not target_chapter:
            return {"error": f"Chapter {chapter_number} not found"}
            
        # Create chapter entry
        chapter_entry = {
            "title": chapter_text,
            "type": "Chapter",
            "chapterNumber": chapter_number,
            "chapterName": chapter_name,
            "sections": []
        }
        
        # Find sections for this chapter
        next_chapter_element = target_chapter.find_next_sibling('.Chapter.rbox, .rbox.Chapter')
        section_elements = []
        
        # Get sections between this chapter and the next chapter
        current_element = target_chapter.find_next_sibling()
        while current_element and current_element != next_chapter_element:
            if current_element.select_one('.Section.toc-destination.rbox, .Section.rbox, .rbox.Section'):
                section_elements.append(current_element)
            current_element = current_element.find_next_sibling()
        
        # Process sections
        for section_element in section_elements:
            section_text = section_element.text.strip()
            section_match = re.search(r"§\s*(\d+)\.(\d+)\s*(.*)", section_text)
            
            if not section_match:
                continue
            
            section_chapter_number = section_match.group(1)
            section_number = section_match.group(2)
            section_name = section_match.group(3).strip()
            
            # Skip sections that don't belong to this chapter
            if section_chapter_number != chapter_number:
                continue
            
            # Get the section content
            content_element = section_element.find_next_sibling('div', class_='content')
            section_content = content_element.get_text(strip=True) if content_element else ""
            
            section_entry = {
                "title": section_text,
                "type": "Section",
                "sectionNumber": section_number,
                "sectionName": section_name,
                "fullSectionNumber": f"{chapter_number}.{section_number}",
                "content": section_content
            }
            
            chapter_entry["sections"].append(section_entry)
        
        return chapter_entry