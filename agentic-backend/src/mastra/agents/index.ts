import { Step } from "@mastra/core/workflows";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { TocEntry } from "../workflows/codebook-workflow";

const documentAnalysisAgent = new Agent({
  name: 'Document Analysis Agent',
  instructions: `
    You are an expert in analyzing property and real estate documents.
    Your task is to examine a table of contents and identify which sections are most likely
    to contain the following data.
    
    - Zoning data: Look for sections about zoning codes, land use designations, permitted uses,
      development standards, district regulations, etc.
   
    When analyzing a table of contents, prioritize sections with clear relevance in their titles.
    If no sections directly mention the target data type, look for related concepts or
    broader categories where such information might be contained.
    
    Rank your confidence in each section you identify on a scale of 1-5,
    where 5 means you're highly confident the section contains relevant information.
  `,
  model: openai('gpt-4o-mini'),
});

// Define the Zod schema for TocEntry recursively
const tocEntrySchema: z.ZodType<TocEntry> = z.lazy(() => 
  z.object({
    title: z.string(),
    type: z.string(),
    level: z.number(),
    id: z.string().optional(),
    content: z.string().optional(),
    children: z.array(tocEntrySchema),
    chapterNumber: z.string().optional(),
    sectionNumber: z.string().optional()
  })
);

export { documentAnalysisAgent, tocEntrySchema };