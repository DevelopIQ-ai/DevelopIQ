import { useState, useEffect } from "react";
import { PropertyReportHandler } from "@/lib/report-handler";

interface DevelopmentInfoResult {
    developmentInfoLoading: boolean;
    developmentInfoError: string | null;
    submitFeedback: (fieldName: string, feedback: string) => Promise<boolean>;
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
                    // Set development info in the report handler
                    if (result.status === 'success') {
                        
                       
                        const developmentInfo = {"requirements": result.requirements.requirements };
                        
                        // Save development info to local storage
                        try {
                            localStorage.setItem('developmentInfo', JSON.stringify(developmentInfo));
                        } catch (storageError) {
                            console.error('Failed to save development info to local storage:', storageError);
                        }
                        
                        reportHandler.setDevelopmentInfo(developmentInfo);
                        
                        setDevelopmentInfoLoading(false);
                        setDevelopmentInfoError(null);console.log("Development info loading set to FALSE");
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
    
    const submitFeedback = async (fieldName: string, feedback: string) => {
        try {
            // This would be your API call to submit feedback
            // await fetch('/api/feedback', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ fieldName, feedback, section: 'development-info' }),
            // });
            
            // For now, we'll just log it
            console.log(`Feedback submitted for ${fieldName}: ${feedback}`);
            return true;
        } catch (error) {
            console.error('Error submitting feedback:', error);
            return false;
        }
    };

    return { developmentInfoLoading, developmentInfoError, submitFeedback };
}