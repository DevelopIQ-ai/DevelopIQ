// app/api/development-info/route.ts
import { NextResponse } from 'next/server';
import { Client } from "@langchain/langgraph-sdk";

// Define the expected response type from the extractor graph
interface ExtractorGraphResponse {
  document_id: string;
  // Add other fields that might be in the response
  [key: string]: any;
}

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
        
    // Process the document with first graph
    const initialState = {
      municipality: municipality,
      state_code: state,
      zone_code: zone_code,
    };
    
    const config = {
      configurable: {
        model_name: "gpt-4o-mini",
      }
    };
    
    // Execute the graph and type the response
    const documentResult = await client.runs.wait(
      null,  // null for stateless run
      "extractor_graph", // Assistant ID/Graph name
      {
        input: initialState,
        config
      }
    );
    
    const typedResult = documentResult as ExtractorGraphResponse;
    
    // Check if document_id exists in the response
    if (!typedResult.document_id) {
      throw new Error("Extractor graph failed to provide a document_id");
    }
    
    // Now document_id is safely typed and verified
    const document_id = typedResult.document_id;

    const queryInitialState = {
      document_id: document_id,
      zone_code: zone_code,
      requirements: {},
    };
    
    const queryResult = await client.runs.wait(
      null, // null for stateless run
      "querier_graph", // Assistant ID/Graph name
      {
        input: queryInitialState,
        config
      }
    );  

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