"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PopulationMetrics } from "@/components/population-metrics";
import { PopulationGraphs } from "@/components/population-graphs";
import { AlertCircle, Users2 } from "lucide-react";
import "@/styles/report.css";
import { useMarketResearchData } from "@/hooks/useMarketResearchData";
import { PropertyReportHandler } from "@/lib/report-handler";

export function MarketResearchTab({ reportHandler, county, state }: { reportHandler: PropertyReportHandler, county: string | null, state: string | null }) {
  const [startYear, setStartYear] = useState(2013);
  const [endYear, setEndYear] = useState(2023);
  const [selectedYearRange, setSelectedYearRange] = useState<string>("10-year-data");
  
  const { 
    marketData, 
    yearlyPopulationData, 
    populationPyramidData, 
    msaName, 
    loading, 
    error 
  } = useMarketResearchData(reportHandler, county, state, startYear, endYear);
  
  const handleFiveYears = () => {
    setStartYear(2018);
    setEndYear(2023);
    setSelectedYearRange("5-year-data");
  }

  const handleTenYears = () => {
    setStartYear(2013);
    setEndYear(2023);
    setSelectedYearRange("10-year-data");
  }

  const FiveYearsButton = () => {
    return (
        <button 
            onClick={handleFiveYears} 
            className={`text-sm px-2 py-1 rounded-md ${selectedYearRange === "5-year-data" ? "bg-primary text-white" : "bg-white text-[#f97316] border border-primary"}`}>
                Last 5 Years
        </button>
    );
  }

  const TenYearsButton = () => {
    return (
        <button 
            onClick={handleTenYears} 
            className={`text-sm px-2 py-1 rounded-md ${selectedYearRange === "10-year-data" ? "bg-primary text-white" : "bg-white text-[#f97316] border border-primary"}`}>
                Last 10 Years
        </button>
    );
  }

  if (loading && !marketData) {
    return <MarketResearchSkeleton />
  }

  if (error) {
    return <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  }

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="grid gap-8">
        {marketData && (
            <div className="rounded-lg border bg-card shadow-sm">
                <div className="flex flex-row justify-between items-center gap-2 border-b md:col-span-2 col-span-1 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Users2 className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Population Demographics</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <TenYearsButton />
                        <FiveYearsButton />
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-sm text-muted-foreground mt-2 mb-6">Showing data for {county}, {state} → {msaName}</p>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mb-6">
                        <PopulationMetrics marketData={marketData} startYear={startYear} endYear={endYear} />
                        <PopulationGraphs yearlyPopulationData={yearlyPopulationData} populationPyramidData={populationPyramidData} endYear={endYear} />
                    </div>
                </div>
            </div>
          )}
      </div>
    </div>
  );
}

function MarketResearchSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="grid gap-8">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex flex-row justify-between items-center gap-2 border-b md:col-span-2 col-span-1 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
              <div className="h-6 w-48 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
              <div className="h-8 w-24 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
            </div>
          </div>
          <div className="p-4">
            <div className="h-4 w-64 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton mt-2 mb-6" />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mb-6">
              {/* Population Metrics skeleton */}
              <div className="space-y-4">
                {/* Population Change */}
                <div className="rounded-lg border p-4">
                  <div className="h-5 w-40 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton mb-3" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-8 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                        <div className="h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Age Demographics */}
                <div className="rounded-lg border p-4">
                  <div className="h-5 w-40 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton mb-3" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-8 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                        <div className="h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Population Graphs skeleton */}
              <div className="space-y-4">
                {/* Population Growth Chart */}
                <div className="rounded-lg border p-4">
                  <div className="h-5 w-40 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton mb-3" />
                  <div className="h-48 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                </div>
                
                {/* Population Pyramid */}
                <div className="rounded-lg border p-4">
                  <div className="h-5 w-40 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton mb-3" />
                  <div className="h-64 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}