import json
from bs4 import BeautifulSoup
import re


def extract_alp_table_of_contents_full(html_document_id: str, include_sections: bool = False, target_title: str = None, titles_only: bool = False):
    """
    Extract table of contents from an HTML document containing municipal code.
    
    Parameters:
        html_document (str): The HTML content of the municipal code document to parse
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
    storage_path = "./html_storage"
    html_file_path = f"{storage_path}/{html_document_id}.html"
    
    try:
        with open(html_file_path, "r", encoding="utf-8") as f:
            html_content = f.read()
    except Exception as e:
        print(f"Error loading HTML document: {e}")
        return {
            "error": f"Error loading HTML document: {e}"
        }
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
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
                import re
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
                        section_entry["content"] = extract_section_content(section_element)
                    
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

def alp_extract_section_content(section_element):
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
