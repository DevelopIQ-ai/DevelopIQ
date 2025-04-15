from bs4 import BeautifulSoup
import re
import math
from io import StringIO
import pandas as pd
from tabulate import tabulate

def parse_table(table_element, output_dir="./tables"):
    """
    Parse an HTML table into a structured format that's easily readable by LLMs.
    
    Args:
        table_element: A BeautifulSoup table element
        output_dir: Directory to save the parsed table
        
    Returns:
        A dictionary containing the structured table data
    """
    import os
    import json
    import uuid
    
    # Extract all rows
    rows = table_element.find_all('tr')
    if not rows:
        return None
    
    # Extract headers (assuming first row contains headers)
    header_row = rows[0]
    header_cells = header_row.find_all(['th', 'td'])
    headers = [cell.get_text(strip=True).replace('\xa0', ' ') for cell in header_cells]
    
    # Process data rows
    table_rows = []
    for row_idx, row in enumerate(rows[1:], 1):  # Skip header row
        cells = row.find_all(['th', 'td'])
        
        # Skip empty rows
        if not cells:
            continue
            
        # Create a dictionary for each row with column headers as keys
        row_data = {}
        for col_idx, cell in enumerate(cells):
            # Get cell text
            cell_text = cell.get_text(strip=True).replace('\xa0', ' ')
            
            # Handle potential index issues (more cells than headers)
            if col_idx < len(headers):
                column_name = headers[col_idx]
            else:
                column_name = f"Column_{col_idx + 1}"
                
            # Store metadata about cell structure
            cell_info = {
                "value": cell_text,
                "metadata": {}
            }
            
            # Check for column spans
            colspan = cell.get('colspan')
            if colspan and int(colspan) > 1:
                cell_info["metadata"]["colspan"] = int(colspan)
                
            # Check for row spans
            rowspan = cell.get('rowspan')
            if rowspan and int(rowspan) > 1:
                cell_info["metadata"]["rowspan"] = int(rowspan)
                
            row_data[column_name] = cell_info
            
        table_rows.append(row_data)
    
    # Create a structured representation
    result = {
        "headers": headers,
        "rows": table_rows,
        "table_metadata": {
            "num_rows": len(table_rows),
            "num_columns": len(headers)
        }
    }
    
    # Save to file
    filename = f"table_{uuid.uuid4().hex[:8]}.json"
    filepath = os.path.join(output_dir, filename)
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Write to file
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print(f"Table saved to {filepath}")
    except Exception as e:
        print(f"Error saving table to file: {e}")
        
    return result

def normalize_table(html_content):
    html_content = StringIO(str(html_content))
    # Load tables
    tables = pd.read_html(html_content)

    # Create a set to track seen rows
    seen_rows = set()
    combined_rows = []

    # Process all tables and combine into a single collection
    table = tables[0]
    if table.empty:
        return None
    
    # Process only rows that don't have the same value in all columns
    for idx in range(len(table)):
        row = table.iloc[idx]
        
        # Skip rows where all values are the same
        if row.nunique() == 1:
            continue
            
        # This is a regular data row
        row_data = []
        for cell in row:
            # Replace NaN with empty string
            if pd.isna(cell) or (isinstance(cell, str) and cell.lower() in ['nan', 'na']):
                cell = ''
            else:
                # Convert to string but keep commas
                cell = str(cell)
            row_data.append(cell)
        
        # Skip rows where all values are empty
        if all(cell == '' for cell in row_data):
            continue
            
        row_tuple = tuple(row_data)
        
        # Add to combined rows if not a duplicate
        if row_tuple not in seen_rows:
            seen_rows.add(row_tuple)
            combined_rows.append(row_data)

    # Implement tabulate with the combined rows
    if combined_rows:
        # Assuming first row contains headers
        headers = combined_rows[0]
        data = combined_rows[1:] if len(combined_rows) > 1 else []
        
        # Create and print the table
        markdown_table = tabulate(data, headers=headers, tablefmt='pretty')
    else:
        markdown_table = ""

    return markdown_table

def load_html(html_content):

    try:
        return BeautifulSoup(html_content, 'html.parser')
    except Exception as e:
        print(f"Error loading HTML document: {e}")
        return None
    
def clean_nans(obj):
    if isinstance(obj, float) and math.isnan(obj):
        return None
    elif isinstance(obj, dict):
        return {k: clean_nans(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nans(i) for i in obj]
    else:
        return obj

def extract_section_text(section_element):
    """
    Extract the content text from a section element, including any nested tables,
    until the next section.
    
    Args:
        section_element: BeautifulSoup element representing a section
    
    Returns:
        str: Text content of the section with preserved structure
    """
    # The heading (e.g. "§ 154.040 PERMITTED USE TABLE.")
    section_title = section_element.get_text(strip=True)
    
    content_chunks = []
    next_element = section_element.next_sibling
    
    while next_element:
        # If we hit another .Section, that means a new section is starting
        if next_element.name == 'div' and 'Section' in (next_element.get('class') or []):
            break
        
        if next_element.name in ['div', 'p', 'ul', 'ol', 'table']:
            # If it's a <table> directly
            if next_element.name == 'table':
                table_data = normalize_table(next_element)
                if table_data:
                    # Convert to JSON, then wrap with delimiters
                    # table_json = json.dumps(table_data)
                    content_chunks.append(f"\n\n{table_data}\n\n")
            else:
                nested_tables = []
                for table in next_element.find_all('table', recursive=True):
                    header_parent = table.find_parent('div', class_='xsl-table--header')
                    if not header_parent:
                        nested_tables.append(table)
                for tbl in nested_tables:
                    tbl_data = normalize_table(tbl)
                    if tbl_data:
                        # table_json = json.dumps(tbl_data)
                        content_chunks.append(f"\n\n{tbl_data}\n\n")
                    tbl.decompose()
                
                # After removing tables, any leftover text remains
                leftover = next_element.get_text(strip=True).replace('\xa0', ' ')
                if leftover:
                    content_chunks.append(leftover)
        
        next_element = next_element.next_sibling
    
    # Merge them all into one giant string. Prepend the section title at the top.
    final_string = section_title + "\n" + "\n".join(content_chunks) + "块"
    return final_string

def find_section_element(soup, chapter_number, section_number):
    """
    Helper function to find a specific section element in a BeautifulSoup object.
    
    Args:
        soup: BeautifulSoup object of the HTML document
        chapter_number (str): Chapter number to find
        section_number (str): Section number to find
    
    Returns:
        tuple: (section_element, section_name) if found, (None, None) if not found
    """
    # Find all section elements
    section_elements = soup.select('.Section.toc-destination.rbox, .Section.rbox, .rbox.Section')
    
    if len(section_elements) == 0:
        return None, None
    
    # Look for the specific section
    for section_element in section_elements:
        section_text = section_element.text.strip() or ""
        
        # Parse section info
        section_match = re.search(r"§\s*(\d+)\.(\d+)\s*(.*)", section_text)
        if not section_match:
            continue
        
        section_chapter_num = section_match.group(1)
        curr_section_num = section_match.group(2)
        section_name = section_match.group(3).strip()
        
        # Check if this is the section we're looking for
        if section_chapter_num == chapter_number and curr_section_num == section_number:
            return section_element, section_name
    
    return None, None

def get_section_content(html_content, section_number):
    """
    Extract the complete content of a specific section from the municipal code.
    
    Args:
        html_document_id (str): The ID of the HTML document to load
        section_number (str): The section number to extract (e.g., "154.040")
    
    Returns:
        dict: A dictionary containing the section metadata and content or error information
    """
    # Load HTML
    soup = load_html(html_content)
    
    # Parse the section number into chapter and section parts
    section_parts = section_number.split(".")
    if len(section_parts) != 2:
        return {"error": f"Invalid section number format: {section_number}"}
    
    chapter_number = section_parts[0]
    section_num = section_parts[1]
    
    # Find the section element
    section_element, section_name = find_section_element(soup, chapter_number, section_num)
    
    if not section_element:
        return {
            "error": f"Section {section_number} not found in the document",
            "section_number": section_number,
            "content": ""
        }
    
    # Extract content
    content = extract_section_text(section_element)
    return {
        "section_number": section_number,
        "section_title": section_name,
        "chapter_number": chapter_number,
        "content": content
    }

def extract_table_of_contents(html_content, hierarchy_depth="titles_only", target_title=None, 
                              target_chapter=None, include_content=False):
    """
    Extract table of contents from an HTML document containing municipal code.
    
    Args:
        html_document_id (str): The ID of the HTML document to parse
        hierarchy_depth (str): Depth of hierarchy to extract:
                              - "titles_only" for titles only
                              - "titles_and_chapters" for titles and chapters only
                              - "full" for complete hierarchy with sections (default)
        target_title (str, optional): If provided, only extract this specific title.
                                      If None, extract all titles.
        target_chapter (str, optional): If provided, only extract sections from this chapter number.
                                       Takes precedence over hierarchy_depth and creates a flat list of
                                       sections from the specified chapter.
        include_content (bool, optional): Whether to include section content.
                                          Only applies when hierarchy_depth="full" or target_chapter is set.
    
    Returns:
        list or dict: A list of dictionaries representing the TOC structure or sections,
                     or an error dictionary if loading fails
    """
    # Parameter validation
    valid_hierarchy_depths = ["titles_only", "titles_and_chapters", "full"]
    if hierarchy_depth not in valid_hierarchy_depths:
        return {"error": f"Invalid hierarchy_depth. Must be one of {valid_hierarchy_depths}"}
    
    # Load HTML
    soup = load_html(html_content)
    if not soup:
        return {"error": f"Could not load HTML document"}
    
    # Special case: If target_chapter is provided, return a flat list of sections for that chapter
    if target_chapter:
        section_elements = soup.select('.Section.toc-destination.rbox, .Section.rbox, .rbox.Section')
        chapter_sections = []
        
        for section_element in section_elements:
            section_text = section_element.text.strip() or ""
            
            # Parse section info
            section_match = re.search(r"§\s*(\d+)\.(\d+)\s*(.*)", section_text)
            if not section_match:
                continue
            
            section_chapter_num = section_match.group(1)
            section_number = section_match.group(2)
            section_name = section_match.group(3).strip()
            
            # Only include sections from the target chapter
            if section_chapter_num == target_chapter:
                section_entry = {
                    "title": section_text,
                    "type": "Section",
                    "level": 2,
                    "id": f"chapter-{target_chapter}-section-{section_number}",
                    "sectionNumber": section_number,
                    "sectionName": section_name,
                    "chapterNumber": target_chapter,
                }
                
                # Include section content if requested
                if include_content:
                    section_entry["content"] = extract_section_text(section_element)
                
                chapter_sections.append(section_entry)
        
        if not chapter_sections:
            return {"error": f"No sections found for Chapter {target_chapter}"}
        
        # Sort sections by section number
        chapter_sections.sort(key=lambda s: int(s["sectionNumber"]))
        
        return chapter_sections
    
    # Normal TOC processing if no target_chapter is specified
    toc = []
    
    # Extract titles
    title_elements = soup.select('.Title.rbox, .rbox.Title')
    for i, title_element in enumerate(title_elements):
        title_text = title_element.text.strip() or f"Title {i + 1}"
        if target_title and title_text != target_title:
            continue

        title_entry = {
            "title": title_text,
            "type": "Title",
            "level": 0,
            "id": f"title-{i}"
        }
        
        # If titles_only, don't extract chapters or sections
        if hierarchy_depth == "titles_only":
            # Add the title to the TOC without children
            toc.append(title_entry)
            continue
        
        # For titles_and_chapters or full, add chapters
        title_entry["children"] = []
        
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
                "title": chapter_text,
                "type": "Chapter",
                "level": 1,
                "id": f"chapter-{chapter_number}",
                "chapterNumber": chapter_number,
                "chapterName": chapter_name
            }
            
            # Only process sections if hierarchy_depth is "full"
            if hierarchy_depth == "full":
                chapter_entry["children"] = []
                
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
                    
                    # Create section entry with metadata
                    section_entry = {
                        "title": section_text,
                        "type": "Section",
                        "level": 2,
                        "id": f"chapter-{chapter_number}-section-{section_number}",
                        "sectionNumber": section_number,
                        "sectionName": section_name,
                    }
                    
                    # Include section content if requested
                    if include_content:
                        section_entry["content"] = extract_section_text(section_element)
                    
                    # Add the section to the chapter
                    chapter_entry["children"].append(section_entry)
                
                # Sort sections by section number
                chapter_entry["children"].sort(key=lambda s: int(s["sectionNumber"]))
            
            # Add the chapter to the title
            title_entry["children"].append(chapter_entry)
        
        # Sort chapters by chapter number
        title_entry["children"].sort(key=lambda c: int(c["chapterNumber"]))
        
        # Add the title to the TOC
        toc.append(title_entry)

    
    return toc



