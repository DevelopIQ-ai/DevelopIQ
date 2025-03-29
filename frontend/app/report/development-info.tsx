/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Ruler, Building2 } from "lucide-react"
import type { PropertyReportHandler } from "@/lib/report-handler"
import type { DevelopmentInfo } from "@/schemas/views/development-info-schema"
import type { DataPoint } from "@/schemas/views/development-info-schema"

interface DevelopmentInfoTabProps {
  reportHandler: PropertyReportHandler | null
  parentLoading: boolean
}

export function DevelopmentInfoTab({ reportHandler, parentLoading = false }: DevelopmentInfoTabProps) {
  const [reportData, setReportData] = useState<DevelopmentInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (parentLoading) {
      return
    }
    
    // When parent finishes loading, fetch data if we don't have it yet
    if (!reportData && reportHandler) {
      try {
        const data = reportHandler.getDevelopmentInfo()
        setReportData(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load property data")
        setIsLoading(false)
      }
    } else if (!reportHandler) {
      setIsLoading(false)
    }
  }, [parentLoading, reportHandler, reportData])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading || !reportData) {
    return <DevelopmentInfoSkeleton />
  }

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="grid gap-8">
        {Object.entries(reportData).map(([sectionTitle, sectionData]) => (
          <DevelopmentSection
            key={sectionTitle}
            title={sectionTitle}
            icon={getSectionIcon(sectionTitle)}
            data={sectionData}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}

function getSectionIcon(title: string) {
  switch (title) {
    case "Permitted Uses":
      return <Building2 className="h-5 w-5" />
    case "Development Standards":
      return <Ruler className="h-5 w-5" />
    default:
      return <Ruler className="h-5 w-5" />
  }
}

interface DevelopmentSectionProps {
  title: string
  icon: React.ReactNode
  data: Record<string, any> | any[]
  isLoading: boolean
}

function DevelopmentSection({ title, icon, data, isLoading }: DevelopmentSectionProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-4">
        {Array.isArray(data) ? (
          // Handle array data
          <div className="">
            {data.map((dataPoint, index) => (
              <div className="border border-gray-100 rounded" key={index}>
                {Object.entries(dataPoint).map(([nestedTitle, nestedData]) => {
                  // Check if nestedData is an object with datapoints or a datapoint itself
                  if (nestedData && typeof nestedData === "object" && "alias" in nestedData) {
                    // It's a datapoint
                    return (
                      <div key={nestedTitle} className="border border-gray-100 rounded">
                        <DataPointDisplay dataPoint={nestedData as DataPoint} isLoading={isLoading} />
                      </div>
                    )
                  } else {
                    // It's a nested section
                    return (
                      <div key={nestedTitle} className="mb-2">
                        {/* <h4 className="mb-1 text-sm font-medium text-gray-600">{nestedTitle}</h4> */}
                        <div className="border border-gray-100 rounded divide-y divide-gray-100">
                          {Object.entries(nestedData as Record<string, DataPoint>).map(([dataPointKey, dataPoint]) => (
                            <DataPointDisplay key={dataPointKey} dataPoint={dataPoint} isLoading={isLoading} />
                          ))}
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            ))}
          </div>
        ) : (
          // Handle object data (original implementation)
          Object.entries(data).map(([subSectionTitle, subSectionData], subIndex, subArray) => (
            <div
              key={subSectionTitle}
              className={subIndex < subArray.length - 1 ? "mb-4 pb-4 border-b border-gray-100" : "mb-0"}
            >
              <h3 className="mb-3 text-base font-medium">{subSectionTitle}</h3>
              <div className="space-y-1">
                {Object.entries(subSectionData).map(([nestedTitle, nestedData]) => {
                  // Check if nestedData is an object with datapoints or a datapoint itself
                  if (nestedData && typeof nestedData === "object" && "alias" in nestedData) {
                    // It's a datapoint
                    return (
                      <div key={nestedTitle} className="border border-gray-100 rounded">
                        <DataPointDisplay dataPoint={nestedData as DataPoint} isLoading={isLoading} />
                      </div>
                    )
                  } else {
                    // It's a nested section
                    return (
                      <div key={nestedTitle} className="mb-2">
                        <h4 className="mb-1 text-sm font-medium text-gray-600">{nestedTitle}</h4>
                        <div className="border border-gray-100 rounded divide-y divide-gray-100">
                          {Object.entries(nestedData as Record<string, DataPoint>).map(([dataPointKey, dataPoint]) => (
                            <DataPointDisplay key={dataPointKey} dataPoint={dataPoint} isLoading={isLoading} />
                          ))}
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

interface DataPointDisplayProps {
  dataPoint: DataPoint
  isLoading: boolean
}

function DataPointDisplay({ dataPoint, isLoading }: DataPointDisplayProps) {
  const { alias, value, source } = dataPoint
  const displayValue = value === null ? "NOT FOUND" : value
  const displaySource = value === null ? "" : source

  return (
    <div className="grid grid-cols-12 divide-x divide-gray-100">
      <div className="col-span-4 text-sm px-4 py-2">
        <span>{alias}</span>
      </div>
      <div className="col-span-5 text-sm px-4 py-2">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <span className={value === null ? "text-red-500" : ""}>{displayValue}</span>
        )}
      </div>
      <div className="col-span-3 text-xs text-gray-500 px-4 py-2">
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        ) : (
          displaySource && <span>{displaySource}</span>
        )}
      </div>
    </div>
  )
}

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