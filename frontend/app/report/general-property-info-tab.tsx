/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, FileText, MapPin, Building, Ruler, Shield, Leaf, DollarSign } from "lucide-react"
import type { PropertyReportHandler } from "@/lib/report-handler"
import "@/styles/report.css";
import type { GeneralPropertyInfo } from "@/schemas/views/general-property-info-schema"
import type { DataPoint } from "@/schemas/views/general-property-info-schema"

interface GeneralPropertyTabProps {
  reportHandler: PropertyReportHandler | null
  generalPropertyInfoLoading: boolean
  generalPropertyInfoError: string | null
}

export function GeneralPropertyTab({ reportHandler, generalPropertyInfoLoading, generalPropertyInfoError }: GeneralPropertyTabProps) {
  const [reportData, setReportData] = useState<GeneralPropertyInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGeneralPropertyInfo = async () => {
      if (generalPropertyInfoLoading) {
        return
      }
      
      // If we already have report data, we're done
      if (reportData) {
        setIsLoading(false)
        return
      }
      
      // Check if general property info exists in local storage
      try {
        const storedGeneralInfo = localStorage.getItem('generalPropertyInfo')
        if (storedGeneralInfo) {
          const parsedInfo = JSON.parse(storedGeneralInfo)
          console.log("General property info loaded from local storage")
          setReportData(parsedInfo)
          
          // Also set it in the report handler if available
          if (reportHandler) {
            reportHandler.setGeneralInfo(parsedInfo)
          }
          
          setIsLoading(false)
          return
        }
      } catch (storageError) {
        console.error("Error reading general property info from local storage:", storageError)
        // Continue with normal flow if local storage fails
      }
      
      // When loading finishes, fetch data if we don't have it yet
      if (!reportData && reportHandler) {
        try {
          const data = reportHandler.getGeneralInfo()
          setReportData(data)
          
          // Save general property info to local storage
          try {
            localStorage.setItem('generalPropertyInfo', JSON.stringify(data))
            console.log('General property info saved to local storage')
          } catch (storageError) {
            console.error('Failed to save general property info to local storage:', storageError)
          }
          
          setIsLoading(false)
        } catch (err) {
          console.log(err)
          setError("Unfortunately, we were unable to fetch property information for your property. Please try again later.")
          setIsLoading(false)
        }
      } else if (!reportHandler) {
        setIsLoading(false)
      }
    }
    
    loadGeneralPropertyInfo()
  }, [generalPropertyInfoLoading, reportHandler, reportData])

  if (generalPropertyInfoError || error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || generalPropertyInfoError}</AlertDescription>
      </Alert>
    )
  }

  if (generalPropertyInfoLoading || isLoading || !reportData) {
    return <PropertyReportSkeleton />
  }

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="grid gap-8">
        {Object.entries(reportData).map(([sectionTitle, sectionData]) => (
          <PropertyReportSection
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
    case "Property Identification & Legal Framework":
      return <FileText className="h-5 w-5" />
    case "Physical Site Characteristics":
      return <MapPin className="h-5 w-5" />
    case "Zoning & Entitlements":
      return <Ruler className="h-5 w-5" />
    case "Construction & Systems Profile":
      return <Building className="h-5 w-5" />
    case "Environmental & Geotechnical":
      return <Leaf className="h-5 w-5" />
    case "Development Economics":
      return <DollarSign className="h-5 w-5" />
    case "Insurance & Risk Assessment":
      return <Shield className="h-5 w-5" />
    default:
      return <FileText className="h-5 w-5" />
  }
}

interface PropertyReportSectionProps {
  title: string
  icon: React.ReactNode
  data: Record<string, any>
  isLoading: boolean
}

function PropertyReportSection({ title, icon, data, isLoading }: PropertyReportSectionProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-4">
        {Object.entries(data).map(([subSectionTitle, subSectionData], subIndex, subArray) => (
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
        ))}
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

function PropertyReportSkeleton() {
  // Create skeleton sections for each typical property section
  const skeletonSections = [
    "Property Identification & Legal Framework",
    "Physical Site Characteristics",
    "Zoning & Entitlements",
    "Construction & Systems Profile"
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

