// app/api/development-info/route.js
import { NextResponse } from 'next/server';
import { Client } from "@langchain/langgraph-sdk";

// Get LangGraph client with server-side env variables
function getLangGraphClient() {
  const apiKey = process.env.LANGGRAPH_API_KEY;
  const apiUrl = process.env.LANGGRAPH_API_URL;
  
  if (!apiKey) {
    throw new Error("Missing LANGGRAPH_API_KEY environment variable");
  }

  if (!apiUrl) {
    throw new Error("Missing LANGGRAPH_API_URL environment variable");
  }
  
  return new Client({
    apiUrl,
    apiKey
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("BODY: ", body);
    const { municipality, state, zone_code } = body;

    console.log("MUNICIPALITY: ", municipality);
    console.log("STATE: ", state);
    console.log("ZONE CODE: ", zone_code);
    
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
        municipality: "Bargersville",
        state: "IN",
        zone_code: "RR",
        use_html_cache: true,
        use_toc_cache: true,
        use_chunk_cache: true,
        model_name: "gpt-4o-mini",
        storage_path: "./html_storage"
      }
    };
    
    const documentResult = await client.runs.wait(
      null,  // null for stateless run
      "extract_and_index_graph", // Assistant ID/Graph name
      {
        input: initialState,
        config
      }
    );
    
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
    
    // Execute the second graph using wait method
    const queryResult = await client.runs.wait(
      null, // null for stateless run
      "query_graph", // Assistant ID/Graph name
      {
        input: queryInitialState,
        config: queryConfig
      }
    );
    
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