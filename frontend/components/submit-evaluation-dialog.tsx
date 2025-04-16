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
import { CheckCircle2, AlertTriangle, Upload, FileUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import * as XLSX from 'xlsx';

interface SubmitEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasFeedback: boolean;
  onSubmit: (reviewerName: string, s3Url?: string) => void;
}

export default function SubmitEvaluationDialog({
  open,
  onOpenChange,
  hasFeedback,
  onSubmit,
}: SubmitEvaluationDialogProps) {
  const [reviewerName, setReviewerName] = useState<string>("");
  const [additionalComments, setAdditionalComments] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

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

  // Create Excel workbook data
  const createExcelData = () => {
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
    
    return {
      data,
      propertyAddress
    };
  };

  // Helper function to add feedback data to Excel
  const addFeedbackData = (data: any[][], feedbackJson: string | null) => {
    if (feedbackJson) {
      try {
        const feedbackData = JSON.parse(feedbackJson);
        // Add header row for feedback table
        data.push(["Property Attribute", "Original Value", "Correction", "Reason", "Source", "Timestamp"]);
        
        // If it's an object with multiple property feedbacks
        if (feedbackData && typeof feedbackData === 'object' && !Array.isArray(feedbackData)) {
          Object.entries(feedbackData).forEach(([propertyName, details]) => {
            if (details && typeof details === 'object') {
              // Type assertion to tell TypeScript about the expected structure
              const typedDetails = details as {
                originalValue?: string | number | null;
                correction?: string;
                reason?: string;
                source?: string;
                timestamp?: string;
              };
              
              data.push([
                propertyName, 
                typedDetails.originalValue !== null ? String(typedDetails.originalValue || '') : 'NOT FOUND', 
                typedDetails.correction || '', 
                typedDetails.reason || '', 
                typedDetails.source || '', 
                typedDetails.timestamp || ''
              ]);
            }
          });
        } else if (Array.isArray(feedbackData)) {
          feedbackData.forEach(item => {
            if (item && typeof item === 'object') {
              const propertyName = Object.keys(item)[0] || '';
              const details = item[propertyName] || {};
              
              const originalValue = details.originalValue !== null ? String(details.originalValue || '') : 'NOT FOUND';
              const correction = details.correction || '';
              const reason = details.reason || '';
              const source = details.source || '';
              const timestamp = details.timestamp || '';
              
              data.push([propertyName, originalValue, correction, reason, source, timestamp]);
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
    data.push([""], ["General Property Information"]);
    
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

  // Helper function to add development data to Excel - updated for new structure
  const addDevelopmentData = (data: any[][], developmentInfoJson: string | null) => {
    data.push([""], ["Development Information"]);
    
    if (developmentInfoJson) {
      try {
        const developmentInfo = JSON.parse(developmentInfoJson);
        data.push(["Requirement Category", "Attribute", "Value", "Referenced Sections"]);
        
        // Extract results data from the new structure
        const resultsData = developmentInfo.results || {};
        
        // Skip document_id and zone_code
        Object.entries(resultsData)
          .filter(([key]) => key !== 'document_id' && key !== 'zone_code')
          .forEach(([category, categoryData]) => {
            const formattedCategory = category.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
            
            // Process each regulation answer within the category
            Object.entries(categoryData as Record<string, any>).forEach(([attribute, attrData]) => {
              const formattedAttribute = attribute.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
              
              // Check if it's a regulation answer structure
              if (attrData && typeof attrData === 'object' && 'answer' in attrData) {
                const answer = attrData.answer || 'Not specified';
                const sections = Array.isArray(attrData.section_list) ? attrData.section_list.join(', ') : 'None';
                
                data.push([formattedCategory, formattedAttribute, answer, sections]);
              } else {
                // For any other structure, add as is
                data.push([
                  formattedCategory, 
                  formattedAttribute, 
                  JSON.stringify(attrData), 
                  ''
                ]);
              }
            });
          });
      } catch (e) {
        data.push(["Development Info", "Error parsing development information"]);
        console.error("Error processing development info for Excel:", e);
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

  // Function to generate Excel file and send to API for S3 upload
  const exportToS3 = async () => {
    try {
      setIsUploading(true);
      setUploadStatus("uploading");
      
      // Get Excel data
      const { data, propertyAddress } = createExcelData();
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${propertyAddress.replace(/[^a-zA-Z0-9]/g, '_')} - ${timestamp}.xlsx`;
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      
      // Set column widths
      const wscols = [
        { wch: 25 },  // A
        { wch: 25 },  // B
        { wch: 60 },  // C
        { wch: 20 }   // D
      ];
      ws['!cols'] = wscols;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Evaluation");
      
      // Generate Excel file as array buffer
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create form data for API upload
      const formData = new FormData();
      formData.append('file', blob, fileName);
      formData.append('propertyAddress', propertyAddress);
      formData.append('reviewerName', reviewerName);
      
      // Send to API route
      const response = await fetch('/api/upload-evals', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Upload successful:", result);
      setUploadStatus("success");
      
      // Return S3 URL
      return result.fileUrl;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      setUploadStatus("error");
      alert("There was an error uploading to S3. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!reviewerName.trim()) {
      alert("Please enter your name");
      return;
    }
    
    // Export to S3 and get the S3 URL
    const s3Url = await exportToS3();
    
    if (s3Url) {
      console.log("File uploaded to:", s3Url);
      onSubmit(reviewerName, s3Url);
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
                    No specific property feedback recorded. You can still submit with additional comments.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Upload status indicator */}
          {uploadStatus === "uploading" && (
            <div className="p-4 rounded-md bg-blue-50">
              <div className="flex items-start gap-3">
                <FileUp className="h-5 w-5 text-blue-500 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="font-medium text-blue-800">Uploading Evaluation</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your evaluation is being securely uploaded. This may take a moment...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {uploadStatus === "success" && (
            <div className="p-4 rounded-md bg-green-50">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Upload Successful</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your evaluation has been successfully uploaded to secure storage.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {uploadStatus === "error" && (
            <div className="p-4 rounded-md bg-red-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Upload Failed</h4>
                  <p className="text-sm text-red-700 mt-1">
                    There was an error uploading your evaluation. Please try again or contact support.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className={hasFeedback ? "bg-green-600 hover:bg-green-700" : ""}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <FileUp className="h-4 w-4 animate-pulse" />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                Submit Evaluation
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}