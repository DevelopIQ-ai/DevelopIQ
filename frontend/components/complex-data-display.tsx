import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { FlagModal } from "@/components/flag-modal"
import { feedbackStore } from "@/lib/feedback-store"

interface ComplexDataDisplayProps {
  data: Record<string, unknown>
  title: string
  isLoading?: boolean
}

export function ComplexDataDisplay({ data, title, isLoading = false }: ComplexDataDisplayProps) {
  const [flaggedItems, setFlaggedItems] = useState<Set<string>>(new Set())
  const [displayData, setDisplayData] = useState<Record<string, unknown>>(data)
  const [originalValues, setOriginalValues] = useState<Record<string, string | number | null>>({})

  useEffect(() => {
    // Initialize display data with any corrections from feedback store
    const correctedData = { ...data }
    const originalVals: Record<string, string | number | null> = {}
    
    const extractOriginalValues = (obj: Record<string, unknown>, parentKey: string = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          if ('value' in value) {
            originalVals[fullKey] = (value as { value: unknown }).value as string | number | null;
          } else {
            extractOriginalValues(value as Record<string, unknown>, fullKey);
          }
        } else {
          originalVals[fullKey] = value as string | number | null;
        }
      });
    };

    extractOriginalValues(data);
    console.log('Original values:', originalVals);

    const keys = Array.from(Object.keys(data))
    keys.forEach(key => {
      const fullKey = `${title}.${key}`
      const correction = feedbackStore.getCorrection(fullKey)
      if (correction) {
        correctedData[key] = correction.value
        setFlaggedItems(prev => new Set([...Array.from(prev), fullKey]))
      }
    })
    setDisplayData(correctedData)
    setOriginalValues(originalVals)
  }, [data, title])

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    )
  }

  const handleCorrectionSubmit = (field: string, correction: string, explanation: string) => {
    // TODO: Implement API call to submit correction
    console.log("Correction submitted:", {
      field,
      currentValue: data[field],
      correction,
      explanation
    });
    const fullKey = `${title}.${field}`
    feedbackStore.saveCorrection(fullKey, correction);
    setDisplayData(prev => ({ ...prev, [field]: correction }));
    setFlaggedItems(prev => new Set([...Array.from(prev), fullKey]));
  };

  const renderData = (data: unknown, parentKey: string = ''): React.ReactNode => {
    if (Array.isArray(data)) {
      return (
        <div className="space-y-1">
          {data.map((item, index) => (
            <div key={index} className="py-1">
              - {typeof item === 'object' ? renderData(item, `${parentKey}[${index}]`) : String(item)}
            </div>
          ))}
        </div>
      )
    }

    if (typeof data === 'object' && data !== null) {
      if ('value' in data) {
        const value = (data as { value: unknown }).value
        return value === null ? 'null' : String(value)
      }

      return (
        <div className="space-y-1">
          {Object.entries(data).map(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            const isFlagged = flaggedItems.has(fullKey);
            const displayValue = typeof value === 'object' && value !== null && 'value' in value 
              ? (value as { value: unknown }).value 
              : value;
            
            return (
              <div key={key} className={`pl-2 ${isFlagged ? 'flagged-field p-2' : ''}`}>
                <div className="text-sm flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      {renderData(value, fullKey)}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  {typeof value !== 'object' && value !== null && (
                    <FlagModal 
                      fieldName={title}
                      originalValue={originalValues[fullKey]}
                      currentValue={displayValue}
                      onCorrectionSubmit={(correction, explanation) => 
                        handleCorrectionSubmit(fullKey, correction, explanation)
                      }
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return data === null ? 'null' : String(data)
  }

  return (
    <div className="border border-gray-100 rounded divide-y divide-gray-100">
      <div className="grid grid-cols-12 divide-x divide-gray-100">
        <div className="col-span-4 text-sm px-4 py-2">
          <span>{title.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
        </div>
        <div className="col-span-5 text-sm px-4 py-2">
          {renderData(displayData)}
        </div>
        <div className="col-span-3 text-xs text-gray-500 px-4 py-2">
        </div>
      </div>
    </div>
  )
} 