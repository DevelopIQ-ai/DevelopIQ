// app/api/development-info/route.js
import { NextResponse } from 'next/server';
import { Client } from "@langchain/langgraph-sdk";

interface LangGraphClient {
  invokeGraph: (params: {
    graphName: string;
    inputs: Record<string, unknown>;
    config: Record<string, unknown>;
  }) => Promise<Record<string, unknown>>;
}

// Get LangGraph client with server-side env variables
function getLangGraphClient(): LangGraphClient {
  const apiKey = process.env.LANGGRAPH_API_KEY;
  const apiUrl = process.env.LANGGRAPH_API_URL || "https://api.smith.langchain.com";
  
  if (!apiKey) {
    throw new Error("Missing LANGGRAPH_API_KEY environment variable");
  }
  
  return new Client({
    apiUrl,
    apiKey
  }) as unknown as LangGraphClient;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { municipality, state, zone_code } = body;
    
    // Validate required parameters
    if (!municipality) {
      return NextResponse.json(
        { status: 'error', error: 'Missing municipality parameter' },
        { status: 400 }
      );
    }
    
    if (!state) {
      return NextResponse.json(
        { status: 'error', error: 'Missing state parameter' },
        { status: 400 }
      );
    }
    
    if (!zone_code) {
      return NextResponse.json(
        { status: 'error', error: 'Missing zone_code parameter' },
        { status: 400 }
      );
    }
    
    console.log(`Processing municipal code for ${municipality}, ${state}, zone: ${zone_code}`);
    
    const client = getLangGraphClient();
    
    const documentId = `${municipality.toLowerCase().replace(/\s+/g, '_')}_${state.toLowerCase()}`;
    
    // 2. Process the document with first graph
    const initialState = {
      html_document_id: "",
      document_content: "",
      title_list: {},
      section_list: {},
      analysis_results: {}
    };
    
    const config = {
      configurable: {
        municipality,
        state,
        zone_code,
        use_html_cache: true,
        use_toc_cache: true,
        use_chunk_cache: false,
        model_name: "gpt-4o-mini",
        storage_path: "./html_storage"
      }
    };
    
    // Run the document processing graph
    const documentResult = await client.invokeGraph({
      graphName: "agent", // Name of your first graph
      inputs: initialState,
      config
    });
    
    // 3. Query requirements with second graph
    console.log(`Querying requirements for ${documentId}, zone: ${zone_code}`);
    
    const queryInitialState = {
      html_document_id: documentId,
      zone_code,
      requirements: {},
      errors: {}
    };
    
    const queryConfig = {
      configurable: {
        model_name: "gpt-4o-mini",
        zone_code
      }
    };
    
    // Run the query graph
    const queryResult = await client.invokeGraph({
      graphName: "query", // Name of your second graph
      inputs: queryInitialState,
      config: queryConfig
    });
    
    // Return combined results
    return NextResponse.json({
      status: 'success',
      documentProcessing: documentResult,
      requirements: queryResult
    });
    
  } catch (error) {
    console.error("Error processing development info:", error);
    return NextResponse.json(
      { status: 'error', error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}