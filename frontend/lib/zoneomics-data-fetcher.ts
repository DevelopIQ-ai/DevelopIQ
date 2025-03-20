import { PropertyReportHandler } from "@/lib/report-handler";
import type { DataPoint } from "@/schemas/views/general-property-info-schema";

interface ZoneomicsZoningData {
  zone_code: string | null;
  zone_name: string | null;
  zone_type: string | null;
  zone_sub_type: string | null;
}

function createDataPoint(alias: string, value: string | null, source: string): DataPoint {
  return {
    alias,
    value,
    source
  };
}

export async function fetchZoneomicsData(
  handler: PropertyReportHandler,
  latitude: string,
  longitude: string
): Promise<void> {
  try {
    console.log("Fetching Zoneomics data for", { latitude, longitude });
    const response = await fetch("/api/zoneomics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
      console.log("Failed to fetch Zoneomics data:", response.statusText);
      return;
    }

    const data = await response.json();
    if (data.error) {
      console.log("Zoneomics returned error:", data.error);
      return;
    }

    const zoningData: ZoneomicsZoningData = {
      zone_code: data.zone_code || null,
      zone_name: data.zone_name || null,
      zone_type: data.zone_type || null,
      zone_sub_type: data.zone_sub_type || null,
    };

    // Update the handler with Zoneomics data
    const generalInfo = handler.getGeneralInfo();
    if (generalInfo) {
      const regulatoryStatus = generalInfo["Property Identification & Legal Framework"]["Regulatory Status"];
      const zoningClassification = regulatoryStatus["Zoning Classification"];

      // Update or set zoning data based on scenarios
      if (zoningData.zone_code) {
        zoningClassification.siteZoningIdent = createDataPoint(
          "Site Zoning Identifier",
          zoningData.zone_code,
          "zoneomics"
        );
      }

      if (zoningData.zone_type) {
        zoningClassification.zoningType = createDataPoint(
          "Zoning Type",
          zoningData.zone_type,
          "zoneomics"
        );
      }

      // Always set these fields from Zoneomics as they are unique to this source
      zoningClassification.zoneName = createDataPoint(
        "Zone Name",
        zoningData.zone_name,
        "zoneomics"
      );

      zoningClassification.zoneSubType = createDataPoint(
        "Zone Subtype",
        zoningData.zone_sub_type,
        "zoneomics"
      );

      handler.setGeneralInfo(generalInfo);
    }
  } catch (error) {
    console.error("Error fetching Zoneomics data:", error);
    // Don't throw the error, just log it and continue
    return;
  }
} 