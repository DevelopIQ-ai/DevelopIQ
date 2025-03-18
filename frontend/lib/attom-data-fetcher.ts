// propertyDataFetcher.ts

import { ExpandedProfileSchema } from "@/schemas/endpoints/attom-expanded-profile";
import { mapAttomProfileToGeneralPropertyInfo } from "@/schemas/mappings/attom-expanded-profile-mapping";
import type { GeneralPropertyInfo } from "@/schemas/views/general-property-info-schema";
import { PropertyReportHandler } from "@/lib/report-handler";
import type { PropertyExpandedProfile } from "@/schemas/endpoints/attom-expanded-profile";

export async function fetchAttomData(handler: PropertyReportHandler, propertyAddress: string): Promise<{
  handler: PropertyReportHandler;
  propertyAddress: string;
}> {
  const mode = process.env.NEXT_PUBLIC_MODE;
  const endpoint = mode === "test" ? "/api/mock-attom" : "/api/attom";
  const params = { address: propertyAddress };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint: "property/expandedprofile", params }),
  });
  if (!response.ok) {
    console.error("Failed to fetch property data", response);
    throw new Error("Failed to fetch property data");
  }
  const data = await response.json();
  const validatedEndpoint: PropertyExpandedProfile = ExpandedProfileSchema.parse(data);
  const mappedData: GeneralPropertyInfo = mapAttomProfileToGeneralPropertyInfo(validatedEndpoint);
  const validatedData: GeneralPropertyInfo = PropertyReportHandler.validateGeneralInfo(mappedData);
  handler.setGeneralInfo(validatedData);

  return { handler, propertyAddress };
}


