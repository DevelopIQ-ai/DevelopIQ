import { useState, useEffect } from "react";
import { PropertyReportHandler } from "@/lib/report-handler";
import { reportStore } from "@/lib/report-store";
import type { DevelopmentInfo } from "@/schemas/views/development-info-schema";

interface DevelopmentInfoResult {
    developmentInfo: DevelopmentInfo | null;
    developmentInfoLoading: boolean;
    developmentInfoError: string | null;
}

export const useDevelopmentInfo = (reportHandler: PropertyReportHandler | null): DevelopmentInfoResult => {
    const [developmentInfo, setDevelopmentInfo] = useState<DevelopmentInfo | null>(null);
    const [developmentInfoLoading, setDevelopmentInfoLoading] = useState(true);
    const [developmentInfoError, setDevelopmentInfoError] = useState<string | null>(null);

    useEffect(() => {
        console.log("useDevelopmentInfo effect triggered", { reportHandler: !!reportHandler });
        
        if (!reportHandler) {
            console.log("No report handler, skipping");
            setDevelopmentInfoLoading(false);
            return;
        }

        // Check for stored data first
        const storedData = reportStore.getReportData();
        if (storedData?.developmentInfo) {
            console.log("Found stored development info");
            setDevelopmentInfo(storedData.developmentInfo);
            setDevelopmentInfoLoading(false);
            return;
        }

        const generalInfo = reportHandler.getGeneralInfo();
        console.log("General info available:", !!generalInfo);
        
        if (!generalInfo) {
            console.log("No general info, skipping");
            setDevelopmentInfoLoading(false);
            return;
        }

        const zoneCode = generalInfo["Property Identification & Legal Framework"]?.["Regulatory Status"]?.["Zoning Classification"]?.siteZoningIdent?.value;
        console.log("Zone code available:", !!zoneCode, { zoneCode });
        
        if (!zoneCode) {
            console.log("No zone code, skipping");
            setDevelopmentInfoLoading(false);
            return;
        }

        const fetchDevelopmentInfo = async () => {
            try {
                console.log("Starting development info fetch");
                const stateCode = generalInfo["Property Identification & Legal Framework"]?.["Geospatial Information"]?.countrySubd?.value;
                const municipality = generalInfo["Property Identification & Legal Framework"]?.["Geospatial Information"]?.locality?.value;

                console.log("Extracted parameters:", { stateCode, municipality, zoneCode });

                if (!stateCode || !municipality) {
                    throw new Error("Missing required parameters");
                }

                console.log("Making API call to fetch development info");
                const developmentInfo = await reportHandler.fetchDevelopmentInfo(
                    String(stateCode),
                    String(municipality),
                    String(zoneCode)
                );
                console.log("Development info fetched successfully");

                const currentData = reportStore.getReportData() || { generalPropertyInfo: null, developmentInfo: null };
                reportStore.saveReportData({
                    ...currentData,
                    developmentInfo
                });

                setDevelopmentInfo(developmentInfo);
                setDevelopmentInfoLoading(false);
            } catch (error) {
                console.error("Error fetching development info:", error);
                setDevelopmentInfoError(error instanceof Error ? error.message : "Failed to fetch development info");
                setDevelopmentInfoLoading(false);
            }
        };

        fetchDevelopmentInfo();
    }, [reportHandler]);

    return {
        developmentInfo,
        developmentInfoLoading,
        developmentInfoError
    };
};