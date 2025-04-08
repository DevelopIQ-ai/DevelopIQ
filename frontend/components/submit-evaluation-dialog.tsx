/* eslint-disable */

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
import * as XLSX from 'xlsx';

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

  // Function to flatten nested objects for Excel export
  const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
    let result: Record<string, string> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const prefixKey = prefix ? `${prefix} - ${key}` : key;
        const formattedKey = prefixKey.replace(/([A-Z])/g, ' $1').trim();
        
        if (value === null || value === undefined) {
          result[formattedKey] = "N/A";
        } else if (typeof value === 'object') {
          // Check if it's an empty object
          if (Object.keys(value).length === 0) {
            result[formattedKey] = "No data";
          } else if (value.alias && 'value' in value) {
            // Special case for objects with alias and value properties
            result[`${formattedKey} (${value.alias})`] = value.value === null ? "N/A" : String(value.value);
          } else {
            // Check if this is a leaf object with unit values
            const isUnitObject = Object.keys(value).some(k => 
              ['feet', 'percentage', 'units', 'square_feet'].includes(k));
            
            if (isUnitObject) {
              // Handle unit objects directly
              for (const unitKey in value) {
                result[`${formattedKey} (${unitKey})`] = String(value[unitKey]);
              }
            } else {
              // Recursively flatten deeper objects
              const flattenedChild = flattenObject(value, formattedKey);
              result = { ...result, ...flattenedChild };
            }
          }
        } else {
          // Handle primitive values
          result[formattedKey] = String(value);
        }
      }
    }
    
    return result;
  };

  const exportToExcel = () => {
    try {
      // Get data from localStorage
      const propertyAddress = localStorage.getItem("propertyAddress") || "Unknown Address";
      const feedbackJson = localStorage.getItem("feedback");
      const propertyDataJson = localStorage.getItem("generalPropertyInfo");
      const developmentInfoJson = localStorage.getItem("developmentInfo");
      const newsArticlesJson = localStorage.getItem("newsArticles");
      
      // Create base data for Excel
      const data = [
        ["Property Assessment Evaluation"],
        [""],
        ["Property Address", propertyAddress],
        ["Reviewer Name", reviewerName],
        ["Additional Comments", additionalComments],
        [""],
        ["Detailed Feedback"],
      ];
      
      // Add feedback data
      addFeedbackData(data, feedbackJson);
      
      // Add report data sections
      data.push([""], [""], ["REPORT DATA"], [""]);
      
      // Add property, development, and news data
      addPropertyData(data, propertyDataJson);
      addDevelopmentData(data, developmentInfoJson);
      addNewsArticlesData(data, newsArticlesJson);
      
      // Generate and download Excel file
      return generateExcelFile(data);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("There was an error exporting to Excel. Please try again.");
      return null;
    }
  };

  // Helper function to add feedback data to Excel
  const addFeedbackData = (data: any[][], feedbackJson: string | null) => {
    if (feedbackJson) {
      try {
        const feedbackData = JSON.parse(feedbackJson);
        console.log("Feedback data:", feedbackData);
        // Add header row for feedback table
        data.push(["Property Attribute", "Original Value", "Correction", "Reason", "Source", "Timestamp"]);
        
        // Process feedback data based on the structure
        if (Array.isArray(feedbackData)) {
            console.log("Feedback data is an array");
            feedbackData.forEach(item => {
            console.log("Item:", item);
            if (item && typeof item === 'object') {
              const propertyName = Object.keys(item)[0] || '';
              const details = item[propertyName] || {};
              
              const originalValue = details.originalValue || '';
              const correction = details.correction || '';
              const reason = details.reason || '';
              const source = details.source || '';
              const timestamp = details.timestamp || '';
              
              data.push([propertyName, originalValue, correction, reason, source, timestamp]);
            }
          });
        } else if (feedbackData && typeof feedbackData === 'object') {
          // If it's an object with multiple property feedbacks
          Object.entries(feedbackData).forEach(([propertyName, details]) => {
            if (details && typeof details === 'object') {
              // Type assertion to tell TypeScript about the expected structure
              const typedDetails = details as {
                originalValue?: string;
                correction?: string;
                reason?: string;
                source?: string;
                timestamp?: string;
              };
              
              data.push([
                propertyName, 
                typedDetails.originalValue || '', 
                typedDetails.correction || '', 
                typedDetails.reason || '', 
                typedDetails.source || '', 
                typedDetails.timestamp || ''
              ]);
            }
          });
        }
      } catch (e) {
        data.push(["Feedback", "Error processing feedback data"]);
      }
    } else {
      data.push(["Feedback", "No feedback provided"]);
    }
  };

  // Helper function to add property data to Excel
  const addPropertyData = (data: any[][], propertyDataJson: string | null) => {
    data.push(["General Property Information"]);
    
    if (propertyDataJson) {
      try {
        const propertyData = JSON.parse(propertyDataJson);
        data.push(["Property Attribute", "Value"]);
        
        const flattenedPropertyData = flattenObject(propertyData);
        Object.entries(flattenedPropertyData).forEach(([key, value]) => {
          data.push([key, value]);
        });
      } catch (e) {
        data.push(["Property Data", "Error parsing property data"]);
      }
    } else {
      data.push(["Property Data", "No property data available"]);
    }
  };

  // Helper function to add development data to Excel
  const addDevelopmentData = (data: any[][], developmentInfoJson: string | null) => {
    data.push([""], ["Development Information"]);
    
    if (developmentInfoJson) {
      try {
        const developmentInfo = JSON.parse(developmentInfoJson);
        data.push(["Development Attribute", "Value"]);
        
        const flattenedInfo = flattenObject(developmentInfo);
        Object.entries(flattenedInfo).forEach(([key, value]) => {
          data.push([key, value]);
        });
      } catch (e) {
        data.push(["Development Info", "Error parsing development information"]);
      }
    } else {
      data.push(["Development Info", "No development information available"]);
    }
  };

  // Helper function to add news articles to Excel
  const addNewsArticlesData = (data: any[][], newsArticlesJson: string | null) => {
    data.push([""], ["News Articles"]);
    
    if (newsArticlesJson) {
      try {
        const newsArticles = JSON.parse(newsArticlesJson);
        
        if (Array.isArray(newsArticles) && newsArticles.length > 0) {
          data.push(["Title", "Source", "Date", "Summary"]);
          
          newsArticles.forEach(article => {
            data.push([
              article.title || "",
              article.source || "",
              article.date || "",
              article.summary || ""
            ]);
          });
        } else {
          data.push(["News Articles", "No news articles found"]);
        }
      } catch (e) {
        data.push(["News Articles", "Error parsing news articles"]);
      }
    } else {
      data.push(["News Articles", "No news articles available"]);
    }
  };

  // Helper function to generate and download Excel file
  const generateExcelFile = (data: any[][]) => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const wscols = [
      { wch: 25 },  // A
      { wch: 80 }   // B
    ];
    ws['!cols'] = wscols;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Evaluation");
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Convert to Blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Create download URL
    const url = URL.createObjectURL(blob);
    
    // Open in new tab
    window.open(url, '_blank');
    
    return url;
  };

  const handleSubmit = () => {
    if (!reviewerName.trim()) {
      alert("Please enter your name");
      return;
    }
    
    // Export to Excel and get the URL
    const excelUrl = exportToExcel();
    
    if (excelUrl) {
      console.log("Excel URL:", excelUrl);      
      onSubmit(reviewerName);
    }
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