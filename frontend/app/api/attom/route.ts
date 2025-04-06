// app/api/property/route.ts
import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { ZodType } from "zod";
import { ExpandedProfileSchema } from "@/schemas/endpoints/attom-expanded-profile";
import { BasicProfileSchema } from "@/schemas/endpoints/attom-basic-profile";
const BASE_URL = "https://api.gateway.attomdata.com/propertyapi/v1.0.0";

// Map endpoints to their corresponding schemas
const endpointSchemas: Record<string, ZodType<unknown>> = {
  "property/expandedprofile": ExpandedProfileSchema,
  "property/basicprofile": BasicProfileSchema,
};

function logEndpoint(
  endpoint: string,
  status: "SUCCESS" | "FAILED" | "EMPTY",
  error?: AxiosError | Error
) {
  const name = endpoint.split("/").pop() || endpoint;
  let message = `[ATTOM] ${name}: ${status}`;
  if (error) {
    const axiosError = error as AxiosError;
    const response = axiosError.response;
    message += ` (${response?.status || error.name}: ${response?.data || error.message})`;
  }
  console.log(message);
}

/**
 * A reusable class for calling the Attom API and validating the response.
 */
class AttomFetcher<T> {
  constructor(public endpoint: string, public schema: ZodType<T>) {}

  async fetch(params: Record<string, string | number>): Promise<T> {
    const url = `${BASE_URL}/${this.endpoint}`;
    try {
      const response = await axios.get(url, {
        headers: {
          accept: "application/json",
          apikey: process.env.ATTOM_API_KEY as string,
        },
        params,
      });
      logEndpoint(this.endpoint, "SUCCESS");
      const validatedData = this.schema.parse(response.data);
      return validatedData;
    } catch (error: unknown) {
      logEndpoint(this.endpoint, "FAILED", error as Error);
      throw error;
    }
  }
}

export async function POST(request: Request) {
  try {
    const { endpoint, params } = await request.json();

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint is required." }, { status: 400 });
    }

    // Get the schema for this endpoint, or use a default if not found
    const schema = endpointSchemas[endpoint] || endpointSchemas["*"];

    const fetcher = new AttomFetcher(endpoint, schema);
    const validatedData = await fetcher.fetch(params);

    return NextResponse.json(validatedData);
  } catch (error: unknown) {
    console.error("[ATTOM] API Error:", (error as Error).message);
    return NextResponse.json(
      { error: "Failed to fetch and validate property data" },
      { status: 500 }
    );
  }
}