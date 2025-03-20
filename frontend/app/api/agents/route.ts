// app/api/agents/route.ts
import { NextResponse } from "next/server";
import { researchWorkflow } from "@/lib/mastra/research-agent";

// Updated generateResponse function to use workflow
async function generateResponse(location: string) {
    const { runId, start } = researchWorkflow.createRun();
  
    console.log('Run:', runId);
  
    const workflowResult = await start({
      triggerData: {
        location: location,
      },
    });
  
    return workflowResult;
}
  
export async function POST(request: Request) {
  try {
    const { location } = await request.json();

    const result = await generateResponse(location);
    return NextResponse.json(result.results['fetch-news']);
  } catch (error: unknown) {
    console.error("[ATTOM] API Error:", (error as Error).message);
    return NextResponse.json(
      { error: "Failed to fetch and validate property data" },
      { status: 500 }
    );
  }
}