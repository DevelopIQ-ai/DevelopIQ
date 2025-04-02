/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Ruler, Building2 } from "lucide-react"
import type { PropertyReportHandler } from "@/lib/report-handler"
import type { DevelopmentInfo, DataPoint, DataPointWithUnit } from "@/schemas/views/development-info-schema"

interface DevelopmentInfoTabProps {
  reportHandler: PropertyReportHandler | null
  developmentInfoLoading: boolean
  developmentInfoError: string | null
}

export function DevelopmentInfoTab({ reportHandler, developmentInfoLoading, developmentInfoError }: DevelopmentInfoTabProps) {
  const [reportData, setReportData] = useState<DevelopmentInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('dev-info useEffect');
    if (developmentInfoLoading) {
      console.log('dev-info useEffect: developmentInfoLoading is true');
      return
    }
    
    // When loading finishes, fetch data if we don't have it yet
    if (!reportData && reportHandler) {
      try {
        console.log(reportHandler)
        const data = reportHandler.getDevelopmentInfo()
        console.log('dev-info useEffect: data', data);
        setReportData(data)
        setIsLoading(false)
        console.log('dev-info useEffect: reportData and reportHandler are not null');
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load property data")
        setIsLoading(false)
        console.log('dev-info useEffect: error');
      }
    } else if (!reportHandler) {
      console.log('dev-info useEffect: reportHandler is null');
      setIsLoading(false)
    }
  }, [developmentInfoLoading, reportHandler, reportData])

  if (error || developmentInfoError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || developmentInfoError}</AlertDescription>
      </Alert>
    )
  }

  if (developmentInfoLoading || isLoading || !reportData) {
    console.log('dev-info render: developmentInfoLoading or isLoading or !reportData');
    if (developmentInfoLoading) {
      console.log('dev-info render: developmentInfoLoading is true');
    }
    if (isLoading) {
      console.log('dev-info render: isLoading is true');
    }
    if (!reportData) {
      console.log('dev-info render: reportData is null');
    }
    return <DevelopmentInfoSkeleton />
  }

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="grid gap-8">
        {reportData["Permitted Uses"] && (
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b px-6 py-4">
              <Building2 className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Permitted Uses</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {(reportData["Permitted Uses"] as any[]).map((dataPoint, index) => (
                  <div key={index} className="border border-gray-100 rounded p-4">
                    <h3 className="text-base font-medium mb-3">
                      {dataPoint.primary_use_classification.value}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Permitted Uses</h4>
                        <div className="space-y-1">
                          {dataPoint.permitted_uses.map((use: any, useIndex: number) => (
                            <div key={useIndex} className="border border-gray-100 rounded p-2 text-sm">
                              {use.value}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Special Exceptions</h4>
                        <div className="space-y-1">
                          {dataPoint.special_exceptions.map((exception: any, exceptionIndex: number) => (
                            <div key={exceptionIndex} className="border border-gray-100 rounded p-2 text-sm">
                              {exception.value}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {reportData["requirements"] && (
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b px-6 py-4">
              <Ruler className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Development Standards</h2>
            </div>
            <div className="p-4">
              {Object.entries(reportData["requirements"] as Record<string, any>).map(([subSectionTitle, subSectionData], subIndex, subArray) => (
                <div
                  key={subSectionTitle}
                  className={subIndex < subArray.length - 1 ? "mb-4 pb-4 border-b border-gray-100" : "mb-4"}
                >
                  <h3 className="mb-3 text-base font-medium">{getSectionTitle(subSectionTitle)}</h3>
                  <div className="space-y-1">
                    {Object.entries(subSectionData).map(([nestedTitle, nestedData]) => {
                      if (nestedData && typeof nestedData === "object" && "alias" in nestedData) {
                        return (
                          <div key={nestedTitle} className="border border-gray-100 rounded">
                            <DataPointDisplay dataPoint={nestedData as DataPoint} developmentInfoLoading={developmentInfoLoading} />
                          </div>
                        )
                      } else {
                        return (
                          <div key={nestedTitle} className="mb-2">
                            <div className="border border-gray-100 rounded divide-y divide-gray-100">
                              {Object.entries(nestedData as Record<string, DataPoint | DataPointWithUnit>).map(([dataPointKey, dataPoint]) => {
                                // Display logic for unit-based values vs summaries
                                if (dataPointKey === "summary" || dataPointKey === "requirements") {
                                  return (
                                    <DataPointDisplay key={dataPointKey} dataPoint={dataPoint} developmentInfoLoading={developmentInfoLoading} />
                                  )
                                } else if (dataPointKey === "signs" && Array.isArray(dataPoint)) {
                                  // Handle sign arrays for signage requirements
                                  return (
                                    <div key={dataPointKey} className="grid grid-cols-12 divide-x divide-gray-100">
                                      <div className="col-span-4 text-sm px-4 py-2">
                                        <span>{nestedTitle.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                                      </div>
                                      <div className="col-span-5 text-sm px-4 py-2">
                                        {developmentInfoLoading ? (
                                          <div className="flex items-center space-x-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            <span className="text-muted-foreground">Loading...</span>
                                          </div>
                                        ) : dataPoint.length > 0 ? (
                                          <div className="space-y-1">
                                            {dataPoint.map((sign: string, signIndex: number) => (
                                              <div key={signIndex} className="py-1">
                                                - {sign}
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="text-sm text-gray-500">No signs listed</div>
                                        )}
                                      </div>
                                      <div className="col-span-3 text-xs text-gray-500 px-4 py-2">
                                        Demo Data
                                      </div>
                                    </div>
                                  )
                                } else {
                                  if ('unit' in dataPoint) {
                                    return (
                                      <DataPointDisplayWithUnit key={dataPointKey} dataPoint={dataPoint as DataPointWithUnit} developmentInfoLoading={developmentInfoLoading} />
                                    )
                                  } else {
                                    return (
                                      <DataPointDisplay key={dataPointKey} dataPoint={dataPoint} developmentInfoLoading={developmentInfoLoading} />
                                    )
                                  }                
                                }
                              })}
                            </div>
                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getSectionTitle(title: string) {
  switch (title) {
    case "lot_requirements":
      return "Lot Requirements"
    case "building_placement_requirements":
      return "Building Placement Requirements"
    case "building_requirements":
      return "Building Requirements"
    case "landscaping_requirements":
      return "Landscaping Requirements"
    case "parking_requirements":
      return "Parking Requirements"
    case "signage_requirements":
      return "Signage Requirements"
    default:
      return title
  }
}

interface DataPointDisplayProps {
  dataPoint: DataPoint
  developmentInfoLoading: boolean
}

function parseTextValue(value: string): string {
  if (!value) return "";
  
  // Replace colon with colon followed by space
  let parsedValue = value.replace(/:/g, ": ");

  // Remove pairs of asterisks (often used for bold formatting in markdown)
  parsedValue = parsedValue.replace(/\*\*/g, "");
  
  return parsedValue;
}

function DataPointDisplay({ dataPoint, developmentInfoLoading }: DataPointDisplayProps) {
  const { alias, value, source } = dataPoint
  const displayValue = value === null ? "NOT FOUND" : value
  const displaySource = value === null ? "" : source

  return (
    <div className="grid grid-cols-12 divide-x divide-gray-100">
      <div className="col-span-4 text-sm px-4 py-2">
        <span>{alias}</span>
      </div>
      <div className="col-span-5 text-sm px-4 py-2 whitespace-pre-wrap">
        {developmentInfoLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <span className={value === null ? "text-red-500" : ""}>{parseTextValue(displayValue as string)}</span>
        )}
      </div>
      <div className="col-span-3 text-xs text-gray-500 px-4 py-2">
        {developmentInfoLoading ? (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        ) : (
          displaySource && <span>{displaySource}</span>
        )}
      </div>
    </div>
  )
}

interface DataPointDisplayWithUnitProps {
  dataPoint: DataPointWithUnit
  developmentInfoLoading: boolean
}

function DataPointDisplayWithUnit({ dataPoint, developmentInfoLoading }: DataPointDisplayWithUnitProps) {
  const { alias, value, source, unit } = dataPoint
  const displayValue = value === null ? "NOT FOUND" : value
  const displaySource = value === null ? "" : source
  const displayUnit = unit === null ? "x" : unit

  return (
    <div className="grid grid-cols-12 divide-x divide-gray-100">
      <div className="col-span-4 text-sm px-4 py-2">
        <span>{alias}</span>
      </div>
      <div className="col-span-5 text-sm px-4 py-2">
        {developmentInfoLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <span className={value === null ? "text-red-500" : ""}>{displayValue} {displayUnit}</span>
        )}
      </div>
      <div className="col-span-3 text-xs text-gray-500 px-4 py-2">
        {developmentInfoLoading ? (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        ) : (
          displaySource && <span>{displaySource}</span>
        )}
      </div>
    </div>
  )
}

// interface SignsDisplayProps {
//   dataPoint: DataPoint
//   isLoading: boolean
// }

// function SignsDisplay({ dataPoint, isLoading }: SignsDisplayProps) {
//   const { alias, value, source } = dataPoint
//   const displayValue = value === null ? "NOT FOUND" : value
//   const displaySource = value === null ? "" : source

//   return (
//     <div className="grid grid-cols-12 divide-x divide-gray-100">
//       <div className="col-span-4 text-sm px-4 py-2">
//         <span>{alias}</span>
//       </div>
//       <div className="col-span-5 text-sm px-4 py-2">
//         {isLoading ? (
//           <div className="flex items-center space-x-2">
//             <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//             <span className="text-muted-foreground">Loading...</span>
//           </div>
//         ) : (
//           <span className={value === null ? "text-red-500" : ""}>{displayValue}</span>
//         )}
//       </div>
//       <div className="col-span-3 text-xs text-gray-500 px-4 py-2">
//         {isLoading ? (
//           <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
//         ) : (
//           displaySource && <span>{displaySource}</span>
//         )}
//       </div>
//     </div>
//   )
// }

function DevelopmentInfoSkeleton() {
  // Create skeleton sections for each typical property section
  const skeletonSections = [
    "Permitted Uses",
    "Development Standards",
  ]

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="grid gap-8">
        {skeletonSections.map((title) => (
          <div key={title} className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b px-6 py-4">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
              <div className="h-6 w-48 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
            </div>
            <div className="p-4">
              {/* Subsection skeletons */}
              {[1, 2].map((i) => (
                <div key={i} className={i === 1 ? "mb-4 pb-4 border-b border-gray-100" : "mb-0"}>
                  <div className="mb-3 h-5 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="border border-gray-100 rounded">
                        <div className="grid grid-cols-12 divide-x divide-gray-100">
                          <div className="col-span-4 px-4 py-3">
                            <div className="h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                          </div>
                          <div className="col-span-5 px-4 py-3">
                            <div className="h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                          </div>
                          <div className="col-span-3 px-4 py-3">
                            <div className="h-3 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}