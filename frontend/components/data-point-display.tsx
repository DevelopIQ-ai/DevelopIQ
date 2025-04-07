import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { FlagModal } from "@/components/flag-modal";
import { feedbackStore } from "@/lib/feedback-store";

interface DataPoint {
  alias: string;
  value: string | number | null;
  source: string | null;
  unit?: string;
}

interface DataPointDisplayProps {
  dataPoint: DataPoint;
  generalPropertyInfoLoading?: boolean;
  developmentInfoLoading?: boolean;
}

export function DataPointDisplay({ dataPoint, generalPropertyInfoLoading, developmentInfoLoading }: DataPointDisplayProps) {
  const [isFlagged, setIsFlagged] = useState(false);
  const [displayValue, setDisplayValue] = useState<string | number | null>(dataPoint.value);
  const isLoading = generalPropertyInfoLoading || developmentInfoLoading;

  useEffect(() => {
    const feedback = feedbackStore.getFeedback(dataPoint.alias);
    const correction = feedbackStore.getCorrection(dataPoint.alias);
    
    if (feedback) {
      setIsFlagged(true);
    }
    
    if (correction) {
      setDisplayValue(correction.value);
    }
  }, [dataPoint.alias]);

  const handleCorrectionSubmit = (correction: string, explanation: string) => {
    // TODO: Implement API call to submit correction
    console.log("Correction submitted:", {
      field: dataPoint.alias,
      currentValue: dataPoint.value,
      correction,
      explanation
    });
    feedbackStore.saveCorrection(dataPoint.alias, correction);
    setDisplayValue(correction);
    setIsFlagged(true);
  };

  const formatValue = (value: string | number | null) => {
    if (value === null) return "NOT FOUND";
    if (dataPoint.unit) {
      return `${value} ${dataPoint.unit}`;
    }
    return value;
  };

  return (
    <div className={`grid grid-cols-12 divide-x divide-gray-100 ${isFlagged ? 'flagged-field p-2' : ''}`}>
      <div className="col-span-4 text-sm px-4 py-2">
        <span>{dataPoint.alias}</span>
      </div>
      <div className="col-span-5 text-sm px-4 py-2">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <span className={displayValue === null ? "text-red-500" : ""}>
            {formatValue(displayValue)}
          </span>
        )}
      </div>
      <div className="col-span-3 text-xs text-gray-500 px-4 py-2 flex items-center justify-between">
        {dataPoint.source && (
          <span className="text-gray-400">{dataPoint.source}</span>
        )}
        {dataPoint.value !== null && (
          <FlagModal 
            fieldName={dataPoint.alias}
            originalValue={dataPoint.value}
            currentValue={displayValue}
            onCorrectionSubmit={handleCorrectionSubmit}
          />
        )}
      </div>
    </div>
  );
} 