import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface SubmitEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasFeedback: boolean;
  onSubmit: (reviewerName: string) => void;
}

export default function SubmitEvaluationDialog({
  open,
  onOpenChange,
  hasFeedback,
  onSubmit,
}: SubmitEvaluationDialogProps) {
  const [reviewerName, setReviewerName] = useState<string>("");
  const [additionalComments, setAdditionalComments] = useState<string>("");
  const [score, setScore] = useState<number>(75);

  const handleSubmit = () => {
    if (!reviewerName.trim()) {
      alert("Please enter your name");
      return;
    }
    // We could modify the onSubmit to include comments and score
    // For now, we'll just show them in the alert
    alert(`Evaluation by ${reviewerName}\nScore: ${score}/100\nComments: ${additionalComments}`);
    onSubmit(reviewerName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-lg">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Submit Evaluation</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Your feedback helps us improve our property assessment reports.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reviewer-name" className="text-sm font-medium">
              Reviewer Name
            </Label>
            <Input
              id="reviewer-name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full"
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="score" className="text-sm font-medium">
              Score (out of 100)
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                id="score"
                value={[score]}
                min={0}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={(value) => setScore(value[0])}
              />
              <span className="w-12 text-center font-medium">{score}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additional-comments" className="text-sm font-medium">
              Additional Comments
            </Label>
            <Textarea
              id="additional-comments"
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              className="w-full min-h-[100px]"
              placeholder="Please share any additional thoughts or suggestions..."
            />
          </div>
          
          <div className={`p-4 rounded-md ${hasFeedback ? 'bg-green-50' : 'bg-amber-50'}`}>
            {hasFeedback ? (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Feedback Ready</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your feedback has been recorded and is ready to submit. Thank you for your valuable input!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">No Feedback Recorded</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Please provide feedback on the report before submitting your evaluation. Your insights are important to us.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="pt-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!hasFeedback}
            className={hasFeedback ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Submit Evaluation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 