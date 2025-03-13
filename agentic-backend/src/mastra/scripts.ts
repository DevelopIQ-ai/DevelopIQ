#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Import the TocEntry interface and the flattenTocForAnalysis function
import { TocEntry } from './workflows/codebook-workflow';  

// Define the flattenTocForAnalysis function (copied from codebook-workflow.ts)
function flattenTocForAnalysis(toc: TocEntry[]): any[] {
  const flattened: any[] = [];
  
  function traverse(entries: TocEntry[], path: string[] = []) {
    for (const entry of entries) {
      const currentPath = [...path, entry.title];
      
      const flatEntry = {
        id: entry.id,
        title: entry.title,
        type: entry.type,
        level: entry.level,
        path: currentPath.join(' > '),
        chapterNumber: entry.chapterNumber,
        sectionNumber: entry.sectionNumber
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

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // Check if a file path is provided as an argument
    const inputFilePath = process.argv[2] || path.join(__dirname, '..', '..', '.mastra', 'output', 'table_of_contents.json');
    
    // Check if output path is provided as the second argument
    const outputFilePath = process.argv[3] || path.join(__dirname, '..', '..', '.mastra', 'output', 'flattened_toc.json');
    
    console.log(`Reading table of contents from: ${inputFilePath}`);
    
    // Read and parse the table of contents JSON file
    const tocData = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8')) as TocEntry[];
    
    // Apply the flattening function
    const flattenedToc = flattenTocForAnalysis(tocData);
    
    // Write the flattened TOC to a file
    fs.writeFileSync(outputFilePath, JSON.stringify(flattenedToc, null, 2), 'utf-8');
    
    console.log(`Successfully flattened TOC with ${flattenedToc.length} section entries`);
    console.log(`Flattened TOC saved to: ${outputFilePath}`);
    
    // Also output to console if requested
    if (process.argv.includes('--print')) {
      console.log('\nFlattened TOC:');
      console.log(JSON.stringify(flattenedToc, null, 2));
    }
  } catch (error) {
    console.error('Error processing table of contents:', error);
    process.exit(1);
  }
}

main();