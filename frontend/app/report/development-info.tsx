/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Ruler, Flag, FlagIcon } from "lucide-react"
import type { PropertyReportHandler } from "@/lib/report-handler"
import type { DevelopmentInfo, DataPoint, DataPointWithUnit } from "@/schemas/views/development-info-schema"
import FeedbackModal from "@/components/FeedbackModal"

interface DevelopmentInfoTabProps {
  reportHandler: PropertyReportHandler | null
  developmentInfoLoading: boolean
  developmentInfoError: string | null
}

export function DevelopmentInfoTab({ reportHandler, developmentInfoLoading, developmentInfoError }: DevelopmentInfoTabProps) {
  const [reportData, setReportData] = useState<DevelopmentInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [selectedField, setSelectedField] = useState('')
  const [selectedValue, setSelectedValue] = useState<string | number | null>(null)

  useEffect(() => {
    console.log('dev-info useEffect');
    if (developmentInfoError) {
      console.log('dev-info useEffect: developmentInfoError is true');
      setError(developmentInfoError);
      setIsLoading(false);
      return;
    }

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
  }, [developmentInfoLoading, reportHandler, reportData, developmentInfoError])

  const handleFlagClick = (fieldName: string, value: string | number | null) => {
    console.log("Flag clicked for:", fieldName, "with value:", value);
    setSelectedField(fieldName);
    setSelectedValue(value);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = (
    feedback: { correction: string; reason: string; source: string }, 
    fieldName: string
  ) => {
    console.log(`Feedback for ${fieldName}:`, feedback);
    
    // Store feedback in local storage
    try {
      // Get existing feedback from local storage
      const existingFeedbackJSON = localStorage.getItem('feedback');
      const existingFeedback = existingFeedbackJSON ? JSON.parse(existingFeedbackJSON) : {};
      
      // Add new feedback
      existingFeedback[fieldName] = {
        ...feedback,
        originalValue: selectedValue,
        timestamp: new Date().toISOString(),
      };
      
      // Save back to local storage
      localStorage.setItem('feedback', JSON.stringify(existingFeedback));
      console.log('Feedback saved to local storage');
    } catch (error) {
      console.error('Error saving feedback to local storage:', error);
    }
  };

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
                            <DataPointDisplay dataPoint={nestedData as DataPoint} developmentInfoLoading={developmentInfoLoading} onFlagClick={handleFlagClick} />
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
                                    <DataPointDisplay key={dataPointKey} dataPoint={dataPoint} developmentInfoLoading={developmentInfoLoading} onFlagClick={handleFlagClick} />
                                  )
                                } else if (dataPointKey === "signs" && Array.isArray(dataPoint)) {
                                  // Handle sign arrays for signage requirements
                                  const hasFeedback = hasFeedbackForField(nestedTitle);
                                  
                                  return (
                                    <div key={dataPointKey} className={`grid grid-cols-12 divide-x divide-gray-100 ${hasFeedback ? 'bg-orange-50' : ''}`}>
                                      <div className="col-span-4 text-sm px-4 py-2">
                                        <div className="flex justify-between items-center">
                                          <span>{nestedTitle.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                                          {!developmentInfoLoading && (
                                            <button 
                                              onClick={() => handleFlagClick(nestedTitle, dataPoint.join(', '))}
                                              className={`${hasFeedback ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} ml-2`}
                                              aria-label={`Flag issue with ${nestedTitle}`}
                                            >
                                              {hasFeedback ? <FlagIcon size={14} fill="currentColor" /> : <Flag size={14} />}
                                            </button>
                                          )}
                                        </div>
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
                                        
                                      </div>
                                    </div>
                                  )
                                } else {
                                  if ('unit' in dataPoint) {
                                    return (
                                      <DataPointDisplayWithUnit key={dataPointKey} dataPoint={dataPoint as DataPointWithUnit} developmentInfoLoading={developmentInfoLoading} onFlagClick={handleFlagClick} />
                                    )
                                  } else {
                                    return (
                                      <DataPointDisplay key={dataPointKey} dataPoint={dataPoint} developmentInfoLoading={developmentInfoLoading} onFlagClick={handleFlagClick} />
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
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        fieldName={selectedField}
        originalValue={selectedValue}
        onSubmit={handleFeedbackSubmit}
      />
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
  onFlagClick: (fieldName: string, value: string | number | null) => void
}

function parseTextValue(value: string): string {
  if (!value) return "";
  
  // Replace colon with colon followed by space
  let parsedValue = value.replace(/:/g, ": ");

  // Remove pairs of asterisks (often used for bold formatting in markdown)
  parsedValue = parsedValue.replace(/\*\*/g, "");
  
  return parsedValue;
}

// Add a function to check if feedback exists for a field
function hasFeedbackForField(fieldName: string): boolean {
  try {
    const feedbackJSON = localStorage.getItem('feedback');
    if (!feedbackJSON) return false;
    
    const feedback = JSON.parse(feedbackJSON);
    return !!feedback[fieldName];
  } catch (error) {
    console.error('Error checking feedback:', error);
    return false;
  }
}

// Update the DataPointDisplay component to highlight fields with feedback
function DataPointDisplay({ dataPoint, developmentInfoLoading, onFlagClick }: DataPointDisplayProps) {
  const { alias, value, source } = dataPoint
  const displayValue = value === null ? "NOT FOUND" : value
  const displaySource = value === null ? "" : source
  const hasFeedback = hasFeedbackForField(alias);

  return (
    <div className={`grid grid-cols-12 divide-x divide-gray-100 ${hasFeedback ? 'bg-orange-50' : ''}`}>
      <div className="col-span-4 text-sm px-4 py-2 relative">
        <div className="flex justify-between items-center">
          <span>{alias}</span>
          {!developmentInfoLoading && (
            <button 
              onClick={() => onFlagClick(alias, value)}
              className={`${hasFeedback ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} ml-2`}
              aria-label={`Flag issue with ${alias}`}
            >
              {hasFeedback ? <FlagIcon size={14} fill="currentColor" /> : <Flag size={14} />}
            </button>
          )}
        </div>
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
  onFlagClick: (fieldName: string, value: string | number | null) => void
}

// Similarly update the DataPointDisplayWithUnit component
function DataPointDisplayWithUnit({ dataPoint, developmentInfoLoading, onFlagClick }: DataPointDisplayWithUnitProps) {
  const { alias, value, source, unit } = dataPoint
  const displayValue = value === null ? "NOT FOUND" : value
  const displaySource = value === null ? "" : source
  const displayUnit = unit === null ? "x" : unit
  const hasFeedback = hasFeedbackForField(alias);

  return (
    <div className={`grid grid-cols-12 divide-x divide-gray-100 ${hasFeedback ? 'bg-orange-50' : ''}`}>
      <div className="col-span-4 text-sm px-4 py-2 relative">
        <div className="flex justify-between items-center">
          <span>{alias}</span>
          {!developmentInfoLoading && (
            <button 
              onClick={() => onFlagClick(alias, value)}
              className={`${hasFeedback ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} ml-2`}
              aria-label={`Flag issue with ${alias}`}
            >
              {hasFeedback ? <FlagIcon size={14} fill="currentColor" /> : <Flag size={14} />}
            </button>
          )}
        </div>
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