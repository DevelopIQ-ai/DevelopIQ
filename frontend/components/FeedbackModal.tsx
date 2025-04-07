import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  originalValue?: string | number | null;
  onSubmit: (feedback: { correction: string; reason: string; source: string }, fieldName: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  fieldName,
  originalValue = "N/A",
  onSubmit,
}) => {
  const [correction, setCorrection] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [source, setSource] = React.useState('');

  // Load existing feedback when the modal opens or fieldName changes
  useEffect(() => {
    if (isOpen && fieldName) {
      try {
        const feedbackJSON = localStorage.getItem('feedback');
        if (feedbackJSON) {
          const allFeedback = JSON.parse(feedbackJSON);
          const existingFeedback = allFeedback[fieldName];
          
          if (existingFeedback) {
            setCorrection(existingFeedback.correction || '');
            setReason(existingFeedback.reason || '');
            setSource(existingFeedback.source || '');
          } else {
            // Reset form if no existing feedback
            setCorrection('');
            setReason('');
            setSource('');
          }
        }
      } catch (error) {
        console.error('Error loading feedback from localStorage:', error);
      }
    }
  }, [isOpen, fieldName]);

  const handleSubmit = () => {
    onSubmit({ correction, reason, source }, fieldName);
    setCorrection('');
    setReason('');
    setSource('');
    onClose();
  };

  const isFormValid = correction.trim() && reason.trim() && source.trim();
  const displayOriginalValue = originalValue === null ? "NOT FOUND" : String(originalValue);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-orange-500 border-2">
        <DialogHeader>
          <DialogTitle>Report an issue with &quot;{fieldName}&quot;</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="py-4 space-y-4 px-1">
            <div className="space-y-2">
              <Label htmlFor="original-value">Original Value</Label>
              <div className="p-3 bg-gray-100 rounded-md border border-gray-200 text-gray-700 min-h-[40px]">
                {displayOriginalValue}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="correction">Correction</Label>
              <Textarea
                id="correction"
                placeholder="What is the correct information for this field?"
                value={correction}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCorrection(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Why do you believe this information is incorrect?"
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="Point us in the right direction."
                value={source}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSource(e.target.value)}
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>Submit Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal; 