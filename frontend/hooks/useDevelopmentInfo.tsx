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

    const zoningCode = reportHandler?.getGeneralInfo()?.["Property Identification & Legal Framework"]?.["Regulatory Status"]?.["Zoning Classification"]?.siteZoningIdent?.value;

    useEffect(() => {
        const fetchDevelopmentInfo = async () => {
            try {
                // Don't do anything if reportHandler is null
                if (!reportHandler) {
                    return;
                }

                // If we already have development info, we're done
                if (reportHandler.getDevelopmentInfo()) {
                    setDevelopmentInfoLoading(false);
                    return;
                }
                // Check if development info exists in local storage
                try {
                    const storedDevelopmentInfo = localStorage.getItem('developmentInfo');
                    if (storedDevelopmentInfo) {
                        const parsedInfo = JSON.parse(storedDevelopmentInfo);
                        console.log("parsedInfo", parsedInfo);
                        reportHandler.setDevelopmentInfo(parsedInfo);
                        setDevelopmentInfoLoading(false);
                        return;
                    }
                } catch (storageError) {
                    console.error("Error reading development info from local storage:", storageError);
                    // Continue with API call if local storage fails
                }

                if (generalPropertyInfoError) {
                    setDevelopmentInfoError(generalPropertyInfoError);
                    setDevelopmentInfoLoading(false);
                    return;
                }

                // Get the general info - required for API call parameters
                const generalInfo = reportHandler.getGeneralInfo();
                if (!generalInfo) {
                    return;
                }

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
                    setDevelopmentInfoError("Could not determine property state");
                    setDevelopmentInfoLoading(false);
                    return;
                }

                if (!municipality) {
                    setDevelopmentInfoError("Could not determine property municipality");
                    setDevelopmentInfoLoading(false);
                    return;
                }

                if (!zoneCode) {
                    if (hasFetchedZoningCode) {
                        setDevelopmentInfoError("Could not determine property zone code");
                        setDevelopmentInfoLoading(false);
                        return;
                    }
                    else {
                        setHasFetchedZoningCode(true);
                    }
                }

                if (stateCode && municipality && zoneCode) {
                    console.log("Fetching development info from API");
                    const response = await fetch('/api/development-info', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ state: stateCode, municipality, zone_code: zoneCode })
                    })
                    console.log('response', response);
                    const result = await response.json();
                    if (result.status === 'success') {
                        const developmentInfo = result.requirements
                        try {
                            localStorage.setItem('developmentInfo', JSON.stringify(developmentInfo));
                        } catch (storageError) {
                            console.error('Failed to save development info to local storage:', storageError);
                        }
                        reportHandler.setDevelopmentInfo(developmentInfo);
                        setDevelopmentInfoLoading(false);
                        setDevelopmentInfoError(null);
                    } else if (!response.ok) {
                        throw new Error(result.error || "Unknown error fetching development info");
                    }
                }
            } catch (error) {
                console.error("Error fetching development info:", error);
                setDevelopmentInfoError("Unfortunately, we were unable to fetch development info for your property. Please try again later.");
                setDevelopmentInfoLoading(false);
            }
        };

        fetchDevelopmentInfo();

    }, [zoningCode]); // Only depend on reportHandler changes

    // You might want to add a mutation function here to handle feedback submission
    // For example:

    return { developmentInfoLoading, developmentInfoError };
}