import { useState, useEffect } from "react";
import { PropertyReportHandler } from "@/lib/report-handler";

interface DevelopmentInfoResult {
    developmentInfoLoading: boolean;
    developmentInfoError: string | null;
}

export const useDevelopmentInfo = (reportHandler: PropertyReportHandler | null): DevelopmentInfoResult => {
    const [developmentInfoLoading, setDevelopmentInfoLoading] = useState(true);
    const [developmentInfoError, setDevelopmentInfoError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDevelopmentInfo() {
            if (!reportHandler) {
                return; // Only proceed when generalInfoLoaded is true and reportHandler exists
            }

            const generalInfo = reportHandler.getGeneralInfo();
            if (!generalInfo) {
                setDevelopmentInfoError("No general info available, unable to fetch development info");
                setDevelopmentInfoLoading(false); // Signal completion even if we didn't do anything
                return;
            }

            try {
                const generalInfo = reportHandler.getGeneralInfo();

                // If generalInfo doesn't exist, don't proceed
                if (!generalInfo) {
                    console.log("No general info available, skipping development info fetch");
                    setDevelopmentInfoError("No general info available, unable to fetch development info");
                    setDevelopmentInfoLoading(false); // Signal completion even if we didn't do anything
                    return;
                }

                // Extract required parameters from generalInfo
                let stateCode;
                let municipality;
                let zoneCode;

                // Try to extract state
                if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].countrySubd?.value) {
                    stateCode = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].countrySubd.value;
                }

                // Try to extract municipality
                if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].munName?.value) {
                    municipality = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].munName.value;
                } else if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].locality?.value) {
                    municipality = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].locality.value;
                }

                // Try to extract zone code
                if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].siteZoningIdent?.value) {
                    zoneCode = generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].siteZoningIdent.value;
                } else if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].zoneSubType?.value) {
                    zoneCode = generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].zoneSubType.value;
                }

                // If any required parameter is missing, log error and return
                if (!stateCode) {
                    console.error("Missing state code from property data");
                    setDevelopmentInfoError("Could not determine property state");
                    setDevelopmentInfoLoading(false); // Signal completion even though we had an error
                    return;
                }

                if (!municipality) {
                    console.error("Missing municipality from property data");
                    setDevelopmentInfoError("Could not determine property municipality");
                    setDevelopmentInfoLoading(false); // Signal completion even though we had an error
                    return;
                }

                if (!zoneCode) {
                    console.error("Missing zone code from property data");
                    setDevelopmentInfoError("Could not determine property zone code");
                    setDevelopmentInfoLoading(false); // Signal completion even though we had an error
                    return;
                }
                console.log("INPUTS: ", stateCode, municipality, zoneCode);
                // Start loading
                setDevelopmentInfoLoading(true);
                console.log('DEVELOPMENT INFO ERROR: ', developmentInfoError);
                console.log(`Fetching development info for ${municipality}, ${stateCode}, zone: ${zoneCode}`);

                // Call API route
                const response = await fetch('/api/development-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        municipality: municipality,
                        state: stateCode,
                        zone_code: zoneCode
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const result = await response.json();
                console.log('DEVELOPMENT INFO: ', result);

                // Set development info in the report handler
                if (result.status === 'success' && result.requirements) {
                    console.log('DEVELOPMENT INFO: ', result.requirements);
                    reportHandler.setDevelopmentInfo(result.requirements);
                } else if (result.status === 'error') {
                    throw new Error(result.error || "Unknown error fetching development info");
                }
            } catch (error) {
                console.error("Error fetching development info:", error);
                setDevelopmentInfoError(
                    error instanceof Error ? error.message : "An unexpected error occurred"
                );
            } finally {
                setDevelopmentInfoLoading(false);
            }
        }

        fetchDevelopmentInfo();
    }, [reportHandler]);

    return { developmentInfoLoading, developmentInfoError };
}