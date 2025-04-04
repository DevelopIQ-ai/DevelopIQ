import { useState, useEffect, useRef } from 'react';
import { PropertyReportHandler } from "@/lib/report-handler";
import { mockPropertyData } from '@/app/report/mock-data';
import { fetchAttomData } from "@/lib/attom-data-fetcher";
import { fetchZoneomicsData } from "@/lib/zoneomics-data-fetcher";

interface GeneralPropertyInfoResult {
  generalPropertyInfoLoading: boolean;
  generalPropertyInfoError: string | null;
}

export const useGeneralPropertyInfo = (reportHandler: PropertyReportHandler | null): GeneralPropertyInfoResult => {
    const [generalPropertyInfoLoading, setGeneralPropertyInfoLoading] = useState(true);
    const [generalPropertyInfoError, setGeneralPropertyInfoError] = useState<string | null>(null);
    const hasRunEffect = useRef(false);

    useEffect(() => {
        // Only run the effect if reportHandler is not null and the effect hasn't run yet
        if (!reportHandler || hasRunEffect.current) return;
        
        hasRunEffect.current = true;
        let isMounted = true;
        
        async function fetchGeneralPropertyInfo() {
            const propertyAddress = localStorage.getItem("propertyAddress") || "";
            const isDemo = localStorage.getItem("isDemo") === "true";

            if (!reportHandler) {
                return;
            }

            if (isDemo) {
                console.log('DEMO');
                setTimeout(() => {
                    if (!isMounted) return;
                    
                    const propertyData = mockPropertyData[propertyAddress]["General Property Information"];
                    reportHandler.setGeneralInfo(propertyData);
                    console.log('PROPERTY DATA', propertyData);
                    setGeneralPropertyInfoLoading(false);
                }, 1500);
            } else {
                let attomSuccess = false;
                
                try {
                    console.log("Fetching ATTOM data for", propertyAddress);
                    await fetchAttomData(reportHandler, propertyAddress);
                    attomSuccess = true;
                
                    // Get location data from ATTOM response
                    const generalInfo = reportHandler.getGeneralInfo();
                    if (generalInfo) {
                        const geospatialInfo = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"];
                        const latitude = geospatialInfo.latitude?.value as string;
                        const longitude = geospatialInfo.longitude?.value as string;
            
                        // Fetch Zoneomics data if we have coordinates
                        if (latitude && longitude) {
                            try {
                                console.log("Found coordinates, fetching Zoneomics data:", { latitude, longitude });
                                await fetchZoneomicsData(reportHandler, latitude, longitude);
                                console.log("Zoneomics data fetch completed");
                            } catch (zoneomicsError) {
                                console.error("Error fetching Zoneomics data (isolated):", zoneomicsError);
                                // Don't set the main error state - we'll continue with just ATTOM data
                            }
                        } else {
                            console.log("No coordinates found in ATTOM data");
                        }
                    } else {
                        console.log("No general info found from ATTOM");
                    }
                } catch (error) {
                    if (!isMounted) return;
                    
                    console.error("Error in data fetching:", error);
                
                    // Only set the error if ATTOM also failed
                    if (!attomSuccess) {
                        setGeneralPropertyInfoError("Unfortunately, we were unable to fetch property information for your property. Please try again later.");
                    }
                } finally {
                    if (isMounted) {
                        setGeneralPropertyInfoLoading(false);
                    }
                }
            }
        }
        
        fetchGeneralPropertyInfo();
        
        return () => {
            isMounted = false;
        };
    }, [reportHandler]);

    return { generalPropertyInfoLoading, generalPropertyInfoError };
};
