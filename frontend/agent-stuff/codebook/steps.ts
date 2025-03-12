import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import { JSDOM } from "jsdom";

// Define interfaces for table of contents entries
export interface TocEntry {
  title: string;
  type: string;
  level: number;
  children: TocEntry[];
  content?: string; // Optional content for each section
  id?: string;      // Optional ID for referencing
}

const parseHTMLAndExtractTOC = new Step({
  id: "parse-html-extract-toc",
  description: "Extract a table of contents from HTML based on special div elements",
  inputSchema: z.object({
    htmlContent: z.string().describe('The HTML content to parse'),
  }),
  execute: async ({ context }) => {
    const triggerData = context?.getStepResult<{
      htmlContent: string;
    }>("trigger");

    if (!triggerData) {
      throw new Error("HTML content not found");
    }
    
    try {
      const dom = new JSDOM(triggerData.htmlContent);
      const document = dom.window.document;
      
      // Extract the table of contents
      const tableOfContents = extractTableOfContents(document);
      
      // Add content and unique IDs to each section
      enrichTocWithContentAndIds(document, tableOfContents);
      
      return {
        tableOfContents,
        fullHtmlDocument: triggerData.htmlContent
      };
    } catch (error) {
      console.error('Error parsing HTML:', error);
      throw new Error(`Failed to parse HTML: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

// Function to extract the table of contents from the DOM
function extractTableOfContents(document: Document): TocEntry[] {
  // Get all top-level chapters
  const chapters = document.querySelectorAll('div.rbox.Chapter');
  const toc: TocEntry[] = [];

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const chapterTitle = chapter.textContent?.trim() || `Chapter ${i + 1}`;
    
    const chapterEntry: TocEntry = {
      title: chapterTitle,
      type: 'Chapter',
      level: 1,
      children: [],
      id: `chapter-${i}`
    };

    // Find subchapters within this chapter
    const subchapters = chapter.querySelectorAll('div.rbox.Subchapter');
    
    for (let j = 0; j < subchapters.length; j++) {
      const subchapter = subchapters[j];
      const subchapterTitle = subchapter.textContent?.trim() || `Subchapter ${j + 1}`;
      
      const subchapterEntry: TocEntry = {
        title: subchapterTitle,
        type: 'Subchapter',
        level: 2,
        children: [],
        id: `chapter-${i}-subchapter-${j}`
      };

      // Find sections within this subchapter
      const sections = subchapter.querySelectorAll('div.rbox.Section');
      
      for (let k = 0; k < sections.length; k++) {
        const section = sections[k];
        const sectionTitle = section.textContent?.trim() || `Section ${k + 1}`;
        
        const sectionEntry: TocEntry = {
          title: sectionTitle,
          type: 'Section',
          level: 3,
          children: [],
          id: `chapter-${i}-subchapter-${j}-section-${k}`
        };

        // Find subsections within this section
        const subsections = section.querySelectorAll('div.rbox.Subsection');
        
        for (let l = 0; l < subsections.length; l++) {
          const subsection = subsections[l];
          const subsectionTitle = subsection.textContent?.trim() || `Subsection ${l + 1}`;
          
          const subsectionEntry: TocEntry = {
            title: subsectionTitle,
            type: 'Subsection',
            level: 4,
            children: [],
            id: `chapter-${i}-subchapter-${j}-section-${k}-subsection-${l}`
          };

          sectionEntry.children.push(subsectionEntry);
        }

        subchapterEntry.children.push(sectionEntry);
      }

      chapterEntry.children.push(subchapterEntry);
    }

    toc.push(chapterEntry);
  }

  return toc;
}

// Function to enrich TOC entries with their content
function enrichTocWithContentAndIds(document: Document, toc: TocEntry[]) {
  // Recursive function to extract content for each entry
  function processEntry(entry: TocEntry) {
    // Set an ID on the DOM element if it doesn't have one
    const selector = `div.rbox.${entry.type}`;
    const elements = document.querySelectorAll(selector);
    
    // Find the matching element (this is simplified and might need refinement)
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.textContent?.trim().includes(entry.title)) {
        // Found our element, now extract its content
        entry.content = extractContent(element);
        
        // Add an ID to the element for later reference
        if (!element.id) {
          element.id = entry.id || `toc-entry-${Math.random().toString(36).substring(2, 9)}`;
        }
        break;
      }
    }
    
    // Process children recursively
    for (const child of entry.children) {
      processEntry(child);
    }
  }
  
  // Process each top-level entry
  for (const entry of toc) {
    processEntry(entry);
  }
}

// Helper function to extract content from an element
function extractContent(element: Element): string {
  // This is a simplified approach - you might need to refine this
  // to exclude nested section titles and only include actual content
  
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as Element;
  
  // Remove child sections
  const childSections = clone.querySelectorAll('div.rbox');
  childSections.forEach(section => section.remove());
  
  // Return the remaining text content
  return clone.textContent?.trim() || '';
}

export { parseHTMLAndExtractTOC };