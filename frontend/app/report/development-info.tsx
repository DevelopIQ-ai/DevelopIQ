/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Ruler, Flag, FlagIcon } from "lucide-react"
import type { PropertyReportHandler } from "@/lib/report-handler"
import type { DevelopmentInfo, RegulationAnswer } from "@/schemas/views/development-info-schema"
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
    if (developmentInfoError) {
      setError(developmentInfoError);
      setIsLoading(false);
      return;
    }

    if (developmentInfoLoading) {
      return
    }

    // When loading finishes, fetch data if we don't have it yet
    if (!reportData && reportHandler) {
      try {
        const data = reportHandler.getDevelopmentInfo()
        console.log("data", data);
        setReportData(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load property data")
        setIsLoading(false)
      }
    } else if (!reportHandler) {
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
    return <DevelopmentInfoSkeleton />
  }

  // Check if the new structure with "results" is present
  const requirementsData = reportData.results;
  console.log("requirementsData", requirementsData);
  
  if (!requirementsData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Development information is in an unexpected format</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="grid gap-8">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <Ruler className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Development Standards</h2>
          </div>
          <div className="p-4">
            {Object.entries(requirementsData).map(([sectionTitle, sectionData], sectionIndex, sectionsArray) => {            
              return (
                <div
                  key={sectionTitle}
                  className={sectionIndex < sectionsArray.length - 3 ? "mb-4 pb-4 border-b border-gray-100" : "mb-4"}
                >
                  <h3 className="mb-3 text-base font-medium">{formatFieldName(sectionTitle)}</h3>
                  <div className="space-y-1">
                    <div className="border border-gray-100 rounded divide-y divide-gray-100">
                      {Object.entries(sectionData as Record<string, RegulationAnswer>).map(([fieldName, fieldData]) => (
                        <RegulationAnswerDisplay 
                          key={fieldName}
                          data={fieldData}
                          title={formatFieldName(fieldName)} 
                          developmentInfoLoading={developmentInfoLoading}
                          onFlagClick={handleFlagClick} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

function formatFieldName(field: string): string {
  // Convert snake_case to Title Case
  return field.replace(/_/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

function parseTextValue(value: string): string {
  if (!value) return "";
  
  // Replace colon with colon followed by space
  let parsedValue = value.replace(/:/g, ": ");

  // Remove pairs of asterisks (often used for bold formatting in markdown)
  parsedValue = parsedValue.replace(/\*\*/g, "");
  
  return parsedValue;
}

// Function to check if feedback exists for a field
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

interface RegulationAnswerDisplayProps {
  data: RegulationAnswer
  title: string
  developmentInfoLoading: boolean
  onFlagClick: (fieldName: string, value: string | number | null) => void
}

function RegulationAnswerDisplay({ data, title, developmentInfoLoading, onFlagClick }: RegulationAnswerDisplayProps) {
  const { answer, section_list } = data
  const hasFeedback = hasFeedbackForField(title);
  
  return (
    <div className={`grid grid-cols-12 divide-x divide-gray-100 ${hasFeedback ? 'bg-orange-50' : ''}`}>
      <div className="col-span-3 text-sm px-4 py-2 relative">
        <div className="flex justify-between items-center">
          <span>{title}</span>
          {!developmentInfoLoading && (
            <button 
              onClick={() => onFlagClick(title, answer)}
              className={`${hasFeedback ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} ml-2`}
              aria-label={`Flag issue with ${title}`}
            >
              {hasFeedback ? <FlagIcon size={14} fill="currentColor" /> : <Flag size={14} />}
            </button>
          )}
        </div>
      </div>
      <div className="col-span-6 text-sm px-4 py-2 whitespace-pre-wrap">
        {developmentInfoLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <span>{parseTextValue(answer)}</span>
        )}
      </div>
      <div className="col-span-3 text-xs text-gray-500 px-4 py-2">
        {developmentInfoLoading ? (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        ) : (
          section_list && section_list.length > 0 ? (
            <div>
              <span>Sections: {section_list.join(", ")}</span>
            </div>
          ) : (
            <span>No sections referenced</span>
          )
        )}
      </div>
    </div>
  )
}

function DevelopmentInfoSkeleton() {
  // Create skeleton sections for each typical property section
  const skeletonSections = [
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
                          <div className="col-span-3 px-4 py-3">
                            <div className="h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 loading-skeleton" />
                          </div>
                          <div className="col-span-6 px-4 py-3">
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