import { Step, Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { JSDOM } from "jsdom";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define interfaces for table of contents entries
export interface TocEntry {
  title: string;
  type: string;
  level: number;
  children: TocEntry[];
  content?: string; // Optional content for each section
  id?: string;      // Optional ID for referencing
  chapterNumber?: string;
  sectionNumber?: string;
  chapterName?: string;
  sectionName?: string;
}

//// STEP 1 //////

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
      const tableOfContents = extractTableOfContents(document);
      enrichTocWithContentAndIds(document, tableOfContents);
      // Save the table of contents to a JSON file
      const outputPath = path.join(__dirname, 'table_of_contents.json');
      fs.writeFileSync(outputPath, JSON.stringify(tableOfContents, null, 2), 'utf-8');
      console.log(`Table of contents saved to ${outputPath}`);
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
function extractTableOfContents(document: Document): TocEntry[] {
    const toc: TocEntry[] = [];
    const titleElements = document.querySelectorAll('.Title.rbox, .rbox.Title');
    for (let i = 0; i < titleElements.length; i++) {
      const titleElement = titleElements[i];
      const titleText = titleElement.textContent?.trim() || `Title ${i + 1}`;
      
      const titleEntry: TocEntry = {
        title: titleText,
        type: 'Title',
        level: 0,  // Titles are the top level
        children: [],
        id: `title-${i}`
      };
      
      const chapterElements = document.querySelectorAll('.Chapter.rbox, .rbox.Chapter');
      
      for (let j = 0; j < chapterElements.length; j++) {
        const chapterElement = chapterElements[j];
        const chapterText = chapterElement.textContent?.trim() || '';
        
        // Use regex to extract chapter number and name
        const chapterMatch = chapterText.match(/CHAPTER\s+(\d+):\s*(.*)/i);
        if (!chapterMatch) {
          continue;
        }
        
        const chapterNumber = chapterMatch[1];
        const chapterName = chapterMatch[2].trim();
        
        const chapterEntry: TocEntry = {
          title: chapterText,
          type: 'Chapter',
          level: 1,
          children: [],
          id: `chapter-${chapterNumber}`,
          chapterNumber: chapterNumber,  // Add this for reference
          chapterName: chapterName
        };
        
        // Find all sections directly (removed subchapter logic)
        const sectionElements = document.querySelectorAll('.Section.toc-destination.rbox, .Section.rbox, .rbox.Section');
        
        for (let k = 0; k < sectionElements.length; k++) {
          const sectionElement = sectionElements[k];
          const sectionText = sectionElement.textContent?.trim() || '';
          
          // Use regex to extract section information
          const sectionMatch = sectionText.match(/§\s*(\d+)\.(\d+)\s*(.*)/);
          if (!sectionMatch) {
            continue;
          }
          
          const sectionChapterNumber = sectionMatch[1];
          const sectionNumber = sectionMatch[2];
          const sectionName = sectionMatch[3].trim();
          
          // Skip sections that don't belong to this chapter
          if (sectionChapterNumber !== chapterNumber) {
            continue;
          }
          
          const sectionEntry: TocEntry = {
            title: sectionText,
            type: 'Section',
            level: 2,  // Directly under the chapter now
            children: [],
            id: `chapter-${chapterNumber}-section-${sectionNumber}`,
            sectionNumber: sectionNumber,  // Add this for reference
            sectionName: sectionName
          };
          
          // Add the section directly to the chapter's children
          chapterEntry.children.push(sectionEntry);
        }
        
        // Add the chapter to the title
        titleEntry.children.push(chapterEntry);
      }
      
      // Add the title to the TOC
      toc.push(titleEntry);
    }
    
    return toc;
  }
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

//// STEP 2 //////

import { documentAnalysisAgent } from "../agents";
import { tocEntrySchema } from "../agents";

const identifyRelevantSections = new Step({
    id: "identify-relevant-sections",
    description: "Analyzes TOC to identify sections likely to contain target information",
    inputSchema: z.object({
      tableOfContents: z.array(tocEntrySchema),
      targetDataType: z.string().describe("Type of data to find (zoning, entitlements, soil, etc.)")
    }),
    execute: async ({ context }) => {
      // Get previous step data
      const tocData = context?.getStepResult<{
        tableOfContents: TocEntry[],
        fullHtmlDocument: string
      }>("parse-html-extract-toc");
      
      // Get the target data type from trigger
      const triggerData = context?.getStepResult<{
        targetDataType: string
      }>("trigger");
  
      if (!tocData || !triggerData) {
        throw new Error("Required data not found");
      }
      const flattenedToc = flattenTocForAnalysis(tocData.tableOfContents);
      console.log('FLATTENED TOC', flattenedToc);
      const response = await documentAnalysisAgent.generate([
        {
          role: "user",
          content: `
            I need to find information about ${triggerData.targetDataType} in a document.
            Here is the table of contents:
            
            ${JSON.stringify(flattenedToc, null, 2)}
  
            Please identify which sections are most likely to contain information about ${triggerData.targetDataType}.
            For each section you identify, provide:
            1. The section ID
            2. The section title
            3. Your confidence level (1-5) that it contains relevant information
            4. A brief explanation of why you think it's relevant
            
            Format your response as a JSON array of objects with these properties:
            [
              {
                "sectionId": "id string",
                "sectionTitle": "title string",
                "confidenceLevel": number,
                "explanation": "explanation string"
              },
              ...
            ]
            
            Include only the JSON in your response, with no additional text.
          `
        }
      ]);
  
      // Parse the agent's response to extract the identified sections
      let relevantSections;
      try {
        // The agent should return a JSON string
        relevantSections = JSON.parse(response.text);
      } catch (error) {
        console.error("Failed to parse agent response as JSON:", error);
        // Fallback: Try to extract JSON from the response text
        const jsonMatch = response.text.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          try {
            relevantSections = JSON.parse(jsonMatch[0]);
          } catch (innerError) {
            throw new Error("Could not parse agent response into valid JSON");
          }
        } else {
          throw new Error("Agent did not return a valid JSON response");
        }
      }
  
      // Sort sections by confidence level (highest first)
      relevantSections.sort((a: any, b: any) => b.confidenceLevel - a.confidenceLevel);
  
      return {
        relevantSections,
        tableOfContents: tocData.tableOfContents,
        fullHtmlDocument: tocData.fullHtmlDocument,
        targetDataType: triggerData.targetDataType
      };
    }
  });
  
function flattenTocForAnalysis(toc: TocEntry[]): any[] {
    const flattened: any[] = [];
    
    function traverse(entries: TocEntry[], path: string[] = []) {
      for (const entry of entries) {
        const currentPath = [...path, entry.title];
        
        const flatEntry = {
        //   id: entry.id,
        //   title: entry.title,
        //   type: entry.type,
        //   level: entry.level,
          path: currentPath.join(' > '),
        //   chapterNumber: entry.chapterNumber,
        //   sectionNumber: entry.sectionNumber
        };
        
        if (entry.type === 'Section') {
          flattened.push(flatEntry);
        }
        
        if (entry.children && entry.children.length > 0) {
          traverse(entry.children, currentPath);
        }
      }
    }
    
    traverse(toc);
    return flattened;
  }
  
export { identifyRelevantSections, parseHTMLAndExtractTOC };