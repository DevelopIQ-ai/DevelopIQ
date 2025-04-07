"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";
import { feedbackStore } from "@/lib/feedback-store";

interface FlagModalProps {
  fieldName: string;
  originalValue: string | number | null;
  currentValue: string | number | null;
  onCorrectionSubmit: (correction: string, explanation: string) => void;
}

export function FlagModal({ fieldName, originalValue, currentValue, onCorrectionSubmit }: FlagModalProps) {
  const [correction, setCorrection] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isFlagged, setIsFlagged] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const feedback = feedbackStore.getFeedback(fieldName);
    if (feedback) {
      setCorrection(feedback.correction);
      setExplanation(feedback.explanation);
      setIsFlagged(true);
    }
  }, [fieldName]);

  const handleSubmit = () => {
    if (correction && explanation) {
      onCorrectionSubmit(correction, explanation);
      feedbackStore.saveFeedback(fieldName, {
        fieldName,
        originalValue,
        currentValue: correction,
        correction,
        explanation
      });
      setIsFlagged(true);
      setCorrection("");
      setExplanation("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className={`h-8 w-8 p-0 ${isFlagged ? 'text-red-500' : 'hover:bg-red-50'}`}>
          <Flag className={`h-4 w-4 ${isFlagged ? 'fill-current' : ''}`} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Incorrect Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Field Name</label>
            <p className="text-sm text-muted-foreground">{fieldName}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Original Value</label>
            <p className="text-sm text-muted-foreground">{originalValue === null ? "null" : originalValue}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Value</label>
            <p className="text-sm text-muted-foreground">{currentValue === null ? "null" : currentValue}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Correct Value</label>
            <Textarea
              value={correction}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCorrection(e.target.value)}
              placeholder="Enter the correct value"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Explanation/Source</label>
            <Textarea
              value={explanation}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setExplanation(e.target.value)}
              placeholder="Explain why this information is incorrect or provide a source"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!correction || !explanation}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 