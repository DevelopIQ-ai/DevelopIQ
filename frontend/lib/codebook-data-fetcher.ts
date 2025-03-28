import { PropertyReportHandler } from "@/lib/report-handler";
import { DevelopmentInfoSchema, DataPoint, DevelopmentInfo } from "@/schemas/views/development-info-schema";

interface Snippet {
  content: string;
  document_path: string;
  relevance_score: number;
  page_number: number | null;
}

interface PromptResponse {
  question: string;
  snippets: Snippet[];
}

interface ZoningApiResponse {
  county: string;
  state: string;
  zoning_code: string;
  analysis: Record<string, PromptResponse>;
  summary: Record<string, string>;
}

// Map of zoning prompts to their corresponding sections in the development info schema
const PROMPT_TO_SCHEMA_MAP = {
  byRightEntitlements: {
    section: "Zoning & Use Parameter" as const,
    subsection: "Permitted Use Matrix" as const,
    dataPoint: "permittedUses" as const,
  },
  conditionalUseThresholds: {
    section: "Zoning & Use Parameter" as const,
    subsection: "Permitted Use Matrix" as const,
    dataPoint: "restrictions" as const,
  },
  overlayDistrictImplications: {
    section: "Zoning & Use Parameter" as const,
    subsection: "Overlay District Implications" as const,
    dataPoint: "overlayDetails" as const,
  },
  environmentalOverlayStandards: {
    section: "Zoning & Use Parameter" as const,
    subsection: "Overlay District Implications" as const,
    dataPoint: "impactAssessment" as const,
  },
};

/**
 * Fetches zoning information from the ZeroEntropy API and updates the report data
 */
export async function fetchZoningData(
  handler: PropertyReportHandler,
  county: string,
  state: string,
  zoningCode: string
): Promise<void> {
  try {
    // Fetch zoning information from API
    const response = await fetch("/api/zero-entropy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        county,
        state,
        zoning_code: zoningCode,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch zoning data");
    }

    const data = await response.json() as ZoningApiResponse;
    
    // Process the data
    const developmentInfo = processZoningData(data);
    
    // Update the report handler with the development info
    handler.setDevelopmentInfo(developmentInfo);
    
  } catch (error) {
    console.error("Error fetching zoning data:", error);
    throw error;
  }
}

/**
 * Processes the API response and maps it to the DevelopmentInfo schema
 */
function processZoningData(data: ZoningApiResponse): DevelopmentInfo {
  // Initialize development info with defaults
  const developmentInfo = DevelopmentInfoSchema.parse({});
  
  // Extract the analysis results and AI summaries
  const { analysis, summary } = data;
  
  if (!analysis) {
    return developmentInfo;
  }

  // Process all prompts and map them to the appropriate schema locations
  for (const [promptKey, promptResponse] of Object.entries(analysis)) {
    const mapping = PROMPT_TO_SCHEMA_MAP[promptKey as keyof typeof PROMPT_TO_SCHEMA_MAP];
    
    if (mapping) {
      const { section, subsection, dataPoint } = mapping;
      
      try {
        // Type assertion to handle dynamic section access
        const sectionData = developmentInfo[section as keyof typeof developmentInfo];
        const subsectionData = sectionData?.[subsection as keyof typeof sectionData];
        
        if (subsectionData) {
          // First try to use the AI-generated summary if available
          let value: string | null = null;
          
          if (summary && summary[promptKey]) {
            value = summary[promptKey];
          } 
          // Fall back to extracting from snippets if no summary is available or if it indicates no information
          else if (promptResponse.snippets && promptResponse.snippets.length > 0 && 
                  (!value || value === "No relevant information found.")) {
            value = extractContentFromSnippets(promptResponse.snippets);
          }
          
          const source = `${data.county}, ${data.state} Zoning Code`;
          
          // Use the existing alias from the schema
          const existingDataPoint = subsectionData[dataPoint as keyof typeof subsectionData] as DataPoint | undefined;
          const alias = existingDataPoint?.alias || dataPoint;
          
          // Update the data point
          (subsectionData as Record<string, DataPoint>)[dataPoint] = createDataPoint(
            alias,
            value,
            source
          );
        }
      } catch (error) {
        console.error(`Error processing prompt ${promptKey}:`, error);
      }
    }
  }
  
  // We no longer need these special case extractions since we have AI summaries for each field
  // that are targeted to each specific prompt
  
  return developmentInfo;
}

/**
 * Creates a DataPoint object with the given values
 */
function createDataPoint(alias: string, value: string | null, source: string | null): DataPoint {
  return {
    alias,
    value,
    source,
  };
}

/**
 * Extracts content from snippets and formats it
 * This is now a fallback method if AI summarization fails
 */
function extractContentFromSnippets(snippets: Snippet[]): string | null {
  if (!snippets || snippets.length === 0) {
    return null;
  }
  
  // Get the top relevance snippet
  const topSnippet = snippets.sort((a, b) => 
    (b.relevance_score || 0) - (a.relevance_score || 0)
  )[0];
  
  return topSnippet.content || null;
}
