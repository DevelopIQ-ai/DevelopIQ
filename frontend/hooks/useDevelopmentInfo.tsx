import { useState, useEffect } from "react";
import { PropertyReportHandler } from "@/lib/report-handler";

interface DevelopmentInfoResult {
    developmentInfoLoading: boolean;
    developmentInfoError: string | null;
}

export const useDevelopmentInfo = (reportHandler: PropertyReportHandler | null, generalPropertyInfoError: string | null): DevelopmentInfoResult => {
    const [developmentInfoLoading, setDevelopmentInfoLoading] = useState(true);
    const [developmentInfoError, setDevelopmentInfoError] = useState<string | null>(null);
    const [hasFetchedZoningCode, setHasFetchedZoningCode] = useState(false);

    useEffect(() => {
        const fetchDevelopmentInfo = async () => {
            try {
                console.log("Fetching development info");
                // Don't do anything if reportHandler is null
                if (!reportHandler) {
                    console.log("Report handler is null, waiting...");
                    return;
                }

                // If we already have development info, we're done
                if (reportHandler.getDevelopmentInfo()) {
                    console.log("Development info already exists in report handler");
                    setDevelopmentInfoLoading(false);
                    return;
                }

                if (generalPropertyInfoError) {
                    setDevelopmentInfoError(generalPropertyInfoError);
                    setDevelopmentInfoLoading(false);
                    console.log("Development info error set to:", generalPropertyInfoError);
                    return;
                }

                // Get the general info - required for API call parameters
                const generalInfo = reportHandler.getGeneralInfo();
                if (!generalInfo) {
                    console.log("General info not available yet, waiting...");
                    return;
                }

                // Extract required parameters from generalInfo
                console.log("Extracting required parameters from generalInfo");
                let stateCode;
                let municipality;
                let zoneCode;

                if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].countrySubd?.value) {
                    stateCode = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].countrySubd.value;
                }
                
                if (generalInfo["Property Identification & Legal Framework"] &&
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
                } 

                // If any required parameter is missing, log error and return
                if (!stateCode) {
                    console.log("Could not determine property state");
                    setDevelopmentInfoError("Could not determine property state");
                    setDevelopmentInfoLoading(false);
                    return;
                }

                if (!municipality) {
                    console.log("Could not determine property municipality");
                    setDevelopmentInfoError("Could not determine property municipality");
                    setDevelopmentInfoLoading(false);
                    return;
                }

                if (!zoneCode) {
                    console.log("Could not determine property zone code");
                    if (hasFetchedZoningCode) {
                        setDevelopmentInfoError("Could not determine property zone code");
                        setDevelopmentInfoLoading(false);
                        return;
                    }
                    else {
                        setHasFetchedZoningCode(true);
                    }
                }

                // console.log("INPUTS for development info API:", stateCode, municipality, zoneCode);
                // console.log("Fetching development info - this may take several minutes...");
                
                // // MOCK API CALL
                // console.log("STARTING mock development info API call (10 second delay)");
                // await new Promise(resolve => setTimeout(resolve, 10000));
                // console.log("COMPLETED mock development info API call");

                // // Mock API response
                // const result = {
                //     status: 'success',
                //     requirements: {
                //         "building_placement_requirements": {}
                //     },
                //     error: null
                // };

                if (stateCode && municipality && zoneCode) {
                    console.log("Fetching development info from API");
                    const response = await fetch('/api/development-info', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ state: stateCode, municipality, zone_code: zoneCode })
                    })

                    const result = await response.json();
                    console.log('result', result);
                    // Set development info in the report handler
                    if (result.status === 'success') {
                        console.log('Development info received successfully');
                        
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
                        
                        reportHandler.setDevelopmentInfo({ ...mockPermittedUses, "requirements": result.requirements.requirements });
                        
                        setDevelopmentInfoLoading(false);
                        setDevelopmentInfoError(null);
                        console.log("Development info loading set to FALSE");
                    } else if (!response.ok) {
                        throw new Error(result.error || "Unknown error fetching development info");
                    }
                }
            } catch (error) {
                console.error("Error in development info processing:", error);
                setDevelopmentInfoError("Unfortunately, we were unable to fetch development info for your property. Please try again later.");
                setDevelopmentInfoLoading(false);
            }
        };

        fetchDevelopmentInfo();

    }, [reportHandler, reportHandler?.getGeneralInfo(), generalPropertyInfoError]); // Only depend on reportHandler changes


    return { developmentInfoLoading, developmentInfoError };
}