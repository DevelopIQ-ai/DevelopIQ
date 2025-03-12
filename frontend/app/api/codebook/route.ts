import { NextRequest, NextResponse } from "next/server";
import { runCodebookWorkflow } from "@/agent-stuff";

/**
 * API endpoint to parse HTML and extract table of contents using the codebook workflow
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { html } = body;

    if (!html || typeof html !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid 'html' parameter" },
        { status: 400 }
      );
    }

    // Run the codebook workflow
    const result = await runCodebookWorkflow(html);

    // Return the workflow result
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in codebook API:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to process HTML", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 