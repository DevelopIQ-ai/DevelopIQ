import { useState, useEffect } from "react";
import { PropertyReportHandler } from "@/lib/report-handler";

interface DevelopmentInfoResult {
    developmentInfoLoading: boolean;
    developmentInfoError: string | null;
}

export const useDevelopmentInfo = (reportHandler: PropertyReportHandler | null): DevelopmentInfoResult => {
    const [developmentInfoLoading, setDevelopmentInfoLoading] = useState(true);
    const [developmentInfoError, setDevelopmentInfoError] = useState<string | null>(null);
    const [attemptCount, setAttemptCount] = useState(0);
    const [apiCallMade, setApiCallMade] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        async function fetchDevelopmentInfo() {
            console.log("Fetching development info");
            if (!reportHandler) {
                // Schedule another attempt if reportHandler not available
                if (isMounted) {
                    timeoutId = setTimeout(() => setAttemptCount(prev => prev + 1), 2000);
                }
                return;
            }

            const generalInfo = reportHandler.getGeneralInfo();
            if (!generalInfo) {
                if (isMounted) {
                    // Schedule another attempt if no general info
                    timeoutId = setTimeout(() => setAttemptCount(prev => prev + 1), 2000);
                }
                return;
            }

            // Only proceed with API call if we haven't made one yet
            if (apiCallMade) {
                setDevelopmentInfoLoading(false);
                return;
            }

            try {
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
                    if (isMounted) {
                        setDevelopmentInfoError("Could not determine property state");
                        setDevelopmentInfoLoading(false);
                        timeoutId = setTimeout(() => setAttemptCount(prev => prev + 1), 2000);
                    }
                    return;
                }

                if (!municipality) {
                    console.error("Missing municipality from property data");
                    if (isMounted) {
                        setDevelopmentInfoError("Could not determine property municipality");
                        setDevelopmentInfoLoading(false);
                        timeoutId = setTimeout(() => setAttemptCount(prev => prev + 1), 2000);
                    }
                    return;
                }

                if (!zoneCode) {
                    // console.error("Missing zone code from property data");
                    // if (isMounted) {
                    //     setDevelopmentInfoError("Could not determine property zone code");
                    //     setDevelopmentInfoLoading(false);
                    //     timeoutId = setTimeout(() => setAttemptCount(prev => prev + 1), 2000);
                    // }
                    // return;
                    zoneCode = "RR";
                }

                console.log("INPUTS: ", stateCode, municipality, zoneCode);
                if (isMounted) {
                    setDevelopmentInfoLoading(true);
                    setDevelopmentInfoError(null);
                    // Mark that we're making the API call
                    setApiCallMade(true);
                }
                
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

                if (isMounted) {
                    // Set development info in the report handler
                    if (result.status === 'success' && result.requirements) {
                        console.log('DEVELOPMENT INFO: ', result.requirements);
                        const mockPermittedUses = {
                            "Permitted Uses": [
                                {
                                    "primary_use_classification": {
                                        value: "Residential",
                                        alias: "Primary Use Classification",
                                        source: null
                                    },
                                    "permitted_uses": [
                                        {
                                            value: "Single Family Residential",
                                            alias: "Permitted Use",
                                            source: null
                                        }
                                    ],
                                    "special_exceptions": [
                                        {
                                            value: "Special Exceptions",
                                            alias: "Special Exception",
                                            source: null
                                        }
                                    ]
                                }
                            ]
                        };
                        reportHandler.setDevelopmentInfo({...mockPermittedUses, "requirements": result.requirements.requirements});
                    } else if (result.status === 'error') {
                        throw new Error(result.error || "Unknown error fetching development info");
                    }
                }
            } catch (error) {
                console.error("Error fetching development info:", error);
                if (isMounted) {
                    setDevelopmentInfoError(
                        error instanceof Error ? error.message : "An unexpected error occurred"
                    );
                    // No more retry after API failure
                }
            } finally {
                if (isMounted) {
                    setDevelopmentInfoLoading(false);
                }
            }
        }

        fetchDevelopmentInfo();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [reportHandler, attemptCount]);

    return { developmentInfoLoading, developmentInfoError };
}