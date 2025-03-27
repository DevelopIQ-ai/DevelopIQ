import json
from bs4 import BeautifulSoup
import re


def load_html_from_storage(html_document_id):
    """
    Load HTML document from storage and return a BeautifulSoup object.
    
    Args:
        html_document_id (str): The ID of the HTML document to load
    
    Returns:
        BeautifulSoup: A BeautifulSoup object of the HTML document, or None if loading fails
    """
    storage_path = "./html_storage"
    html_file_path = f"{storage_path}/{html_document_id}.html"
    
    try:
        with open(html_file_path, "r", encoding="utf-8") as f:
            html_content = f.read()
        return BeautifulSoup(html_content, 'html.parser')
    except Exception as e:
        print(f"Error loading HTML document: {e}")
        return None


def parse_table(table_element):
    """
    Parse an HTML table into a structured format.
    """
    # Extract all rows
    rows = table_element.find_all('tr')
    if not rows:
        return None
    
    # First pass: collect raw data and basic structural information
    table_data = []
    row_metadata = []
    
    for row_idx, row in enumerate(rows):
        cells = row.find_all(['th', 'td'])
        row_texts = [c.get_text(strip=True).replace('\xa0', ' ') for c in cells]
        
        if not row_texts:
            continue
        
        # Add the raw row data
        table_data.append(row_texts)
        
        # Collect structural metadata
        spans = []
        for cell in cells:
            # Check for column spans which often indicate headers/categories
            colspan = cell.get('colspan')
            if colspan and int(colspan) > 1:
                spans.append({
                    'index': len(spans),
                    'text': cell.get_text(strip=True).replace('\xa0', ' '),
                    'colspan': int(colspan)
                })
        
        # Record metadata about this row
        row_metadata.append({
            'row_index': row_idx,
            'cell_count': len(row_texts),
            'spans': spans,
            'first_cell': row_texts[0] if row_texts else "",
            'is_all_caps': all(c.isupper() for c in row_texts[0] if c.isalpha()) if row_texts else False,
            'empty_cells': sum(1 for text in row_texts if not text)
        })
    
    # Return enhanced data structure
    return {
        'raw_data': table_data,
        'row_metadata': row_metadata
    }


def extract_section_text(section_element):
    """
    Extract the content text from a section element, including any nested tables,
    until the next section.
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
                table_data = parse_table(next_element)
                if table_data:
                    # Convert to JSON, then wrap with delimiters
                    table_json = json.dumps(table_data)
                    content_chunks.append(f"--BEGIN-TABLE--\n{table_json}\n--END-TABLE--")
            else:
                nested_tables = []
                for table in next_element.find_all('table', recursive=True):
                    header_parent = table.find_parent('div', class_='xsl-table--header')
                    if not header_parent:
                        nested_tables.append(table)
                for tbl in nested_tables:
                    tbl_data = parse_table(tbl)
                    if tbl_data:
                        table_json = json.dumps(tbl_data)
                        content_chunks.append(f"--BEGIN-TABLE--\n{table_json}\n--END-TABLE--")
                    tbl.decompose()
                
                # After removing tables, any leftover text remains
                leftover = next_element.get_text(strip=True).replace('\xa0', ' ')
                if leftover:
                    content_chunks.append(leftover)
        
        next_element = next_element.next_sibling
    
    # Merge them all into one giant string. Prepend the section title at the top.
    final_string = section_title + "\n\n" + "\n".join(content_chunks)
    return final_string


def extract_section_content(html_document_id, section_number):
    """
    Extract the complete content of a specific section from the municipal code.
    
    Args:
        html_document_id (str): The ID of the HTML document to load
        section_number (str): The section number to extract (e.g., "154.040")
    
    Returns:
        dict: A dictionary containing the section metadata and content
    """
    # Load HTML
    soup = load_html_from_storage(html_document_id)
    if not soup:
        return {"error": f"Could not load HTML document: {html_document_id}"}
    
    # Parse the section number into chapter and section parts
    section_parts = section_number.split(".")
    if len(section_parts) != 2:
        return {"error": f"Invalid section number format: {section_number}"}
    
    chapter_number = section_parts[0]
    section_num = section_parts[1]
    
    # Find all section elements
    section_elements = soup.select('.Section.toc-destination.rbox, .Section.rbox, .rbox.Section')
    
    if len(section_elements) == 0:
        return {
            "error": "No section elements found in the document",
            "section_number": section_number,
            "content": ""
        }
    
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
        if section_chapter_num == chapter_number and curr_section_num == section_num:
            content = extract_section_text(section_element)
            
            # Return the section with metadata and content
            return {
                "section_number": section_number,
                "section_title": section_name,
                "chapter_number": chapter_number,
                "content": content
            }
    
    return {
        "error": f"Section {section_number} not found in the document",
        "section_number": section_number,
        "content": ""
    }


def extract_alp_section_content_from_section_element(section_element):
    """
    Extract the content text from a section element.
    
    Parameters:
        section_element: BeautifulSoup element representing a section
        
    Returns:
        str: The text content of the section
    """
    # Get all text in the section, excluding the title
    content_elements = section_element.find_all(text=True, recursive=True)
    content = " ".join([elem.strip() for elem in content_elements if elem.strip()])
    
    # Remove the section title from the content
    section_title = section_element.select_one('.Section-title')
    if section_title:
        title_text = section_title.text.strip()
        content = content.replace(title_text, "", 1).strip()
    
    return content


def extract_alp_section_content_from_section_number(html_document_id, section_number):
    """
    Extract the content text from a section element based on the section number.
    This is a simplified wrapper around extract_section_content.
    
    Parameters:
        html_document_id (str): The ID of the HTML document to parse
        section_number (str): The section number to extract
    
    Returns:
        str: The text content of the section
    """
    section_data = extract_section_content(html_document_id, section_number)
    if "error" in section_data:
        return section_data
    return section_data["content"]


def extract_alp_table_of_contents_full(html_document_id, include_sections=False, target_title=None, titles_only=False):
    """
    Extract table of contents from an HTML document containing municipal code.
    
    Parameters:
        html_document_id (str): The ID of the HTML document to parse
        include_sections (bool, optional): Whether to include section content in the output.
                                          Default is False.
        target_title (str, optional): If provided, only extract this specific title.
                                      If None, extract all titles. Default is None.
        titles_only (bool, optional): If True, only extract titles without chapters or sections.
                                     Default is False.
    
    Returns:
        list: A list of dictionaries representing the table of contents structure
              with titles, and optionally chapters and sections based on parameters
    """
    # Load HTML
    soup = load_html_from_storage(html_document_id)
    if not soup:
        return {"error": f"Could not load HTML document: {html_document_id}"}
    
    toc = []
    
    # Extract titles
    title_elements = soup.select('.Title.rbox, .rbox.Title')
    for i, title_element in enumerate(title_elements):
        title_text = title_element.text.strip() or f"Title {i + 1}"
        if target_title and title_text != target_title:
            print(f"Skipping title {title_text} because it is not the target title ({target_title})")
            continue

        title_entry = {
            "title": title_text,
            "type": "Title",
            "level": 0,
            "id": f"title-{i}"
        }
        
        # If titles_only is True, don't extract chapters and sections
        if not titles_only:
            title_entry["children"] = []
            
            # Find the next sibling element that contains chapters for this title
            # This assumes chapters follow their respective titles in the document
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
                        "title": section_text,
                        "type": "Section",
                        "level": 2,
                        "id": f"chapter-{chapter_number}-section-{section_number}",
                        "sectionNumber": section_number,
                        "sectionName": section_name,
                    }
                    
                    # Add section content if requested
                    if include_sections:
                        section_entry["content"] = extract_alp_section_content_from_section_element(section_element)
                    
                    # Add the section to the chapter
                    chapter_entry["children"].append(section_entry)
                
                # Add the chapter to the title
                title_entry["children"].append(chapter_entry)
        
        # Add the title to the TOC
        toc.append(title_entry)
    
    # Save the TOC to a file
    with open("./toc.json", "w") as toc_file:
        json.dump(toc, toc_file, indent=2)
    
    return toc