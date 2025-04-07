import { GeneralPropertyInfo } from "@/schemas/views/general-property-info-schema";
import { DevelopmentInfo } from "@/schemas/views/development-info-schema";
import { DataPoint } from "@/schemas/views/general-property-info-schema";
import * as XLSX from 'xlsx';
import { feedbackStore } from "./feedback-store";

interface DataPointWithCorrection {
  alias: string;
  value: string | number | null;
  source: string | null;
  correction?: string | null;
  reason?: string | null;
  section?: string;
  subsection?: string;
}

type NestedData = {
  [key: string]: NestedData | DataPoint | DataPoint[];
};

function isDataPoint(obj: unknown): obj is DataPoint {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'alias' in obj &&
    'value' in obj &&
    'source' in obj
  );
}

function flattenDataPoints(data: NestedData, section: string = "", subsection: string = ""): DataPointWithCorrection[] {
  const result: DataPointWithCorrection[] = [];

  if (data && typeof data === 'object') {
    if (isDataPoint(data)) {
      // This is a DataPoint
      result.push({
        alias: data.alias,
        value: data.value === null || data.value === undefined ? "NOT FOUND" : data.value,
        source: data.source,
        correction: null,
        reason: null,
        section,
        subsection
      });
    } else {
      // This is a nested object
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          value.forEach(item => {
            if (isDataPoint(item)) {
              result.push({
                alias: item.alias,
                value: item.value === null || item.value === undefined ? "NOT FOUND" : item.value,
                source: item.source,
                correction: null,
                reason: null,
                section,
                subsection: key
              });
            } else if (typeof item === 'object' && item !== null) {
              // Handle nested arrays (like in Permitted Uses)
              Object.entries(item).forEach(([nestedKey, nestedValue]) => {
                if (Array.isArray(nestedValue)) {
                  nestedValue.forEach(nestedItem => {
                    if (isDataPoint(nestedItem)) {
                      result.push({
                        alias: nestedItem.alias,
                        value: nestedItem.value === null || nestedItem.value === undefined ? "NOT FOUND" : nestedItem.value,
                        source: nestedItem.source,
                        correction: null,
                        reason: null,
                        section,
                        subsection: `${key} - ${nestedKey}`
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          result.push(...flattenDataPoints(value as NestedData, section, key));
        }
      }
    }
  }

  return result;
}

export function exportToExcel(
  generalInfo: GeneralPropertyInfo | null,
  developmentInfo: DevelopmentInfo | null,
  propertyAddress: string
) {
  if (!generalInfo && !developmentInfo) {
    throw new Error('No data to export');
  }

  // Get all corrections from the feedback store
  const corrections = feedbackStore.getAllCorrections();

  // Get property corrections and feedback from local storage
  const propertyCorrections = localStorage.getItem('property_corrections');
  const propertyFeedback = localStorage.getItem('property_feedback');
  
  const correctionsData = propertyCorrections ? JSON.parse(propertyCorrections) : {};
  const feedbackData = propertyFeedback ? JSON.parse(propertyFeedback) : {};

  // Flatten the data points
  const generalDataPoints = generalInfo ? flattenDataPoints(generalInfo as unknown as NestedData, "General Property Info") : [];
  const developmentDataPoints = developmentInfo ? flattenDataPoints(developmentInfo as unknown as NestedData, "Development Info") : [];

  // Extract and flatten development standards from developmentInfo
  let standardsDataPoints: DataPointWithCorrection[] = [];
  if (developmentInfo && 'requirements' in developmentInfo) {
    const requirements = developmentInfo.requirements;
    standardsDataPoints = flattenDataPoints(requirements as unknown as NestedData, "Development Standards");
  }

  // Combine all data points
  const allDataPoints = [...generalDataPoints, ...developmentDataPoints, ...standardsDataPoints];

  // Update data points with corrections and feedback
  const correctedDataPoints = allDataPoints.map(point => {
    // Clean up the path components to match how they're stored
    const cleanSection = point.section?.replace(/[^a-zA-Z0-9]/g, '_') || '';
    const cleanSubsection = point.subsection?.replace(/[^a-zA-Z0-9]/g, '_') || '';
    const cleanAlias = point.alias?.replace(/[^a-zA-Z0-9]/g, '_') || '';
    
    // Try different path combinations
    const paths = [
      `${cleanSection}.${cleanSubsection}.${cleanAlias}`,
      `${cleanSection}.${cleanAlias}`,
      cleanAlias
    ];

    // Find the first matching correction
    let correction = null;
    let propertyCorrection = null;
    let propertyFeedback = null;

    for (const path of paths) {
      if (!correction) correction = corrections[path];
      if (!propertyCorrection) propertyCorrection = correctionsData[path];
      if (!propertyFeedback) propertyFeedback = feedbackData[path];
    }

    if (correction || propertyCorrection || propertyFeedback) {
      return {
        ...point,
        correction: propertyCorrection?.value || correction?.value || null,
        reason: propertyFeedback?.explanation || "User correction"
      };
    }
    return point;
  });

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(correctedDataPoints.map(point => ({
    'Section': point.section,
    'Subsection': point.subsection,
    'Data Point': point.alias,
    'Value': point.value,
    'Source': point.source,
    'Correction': point.correction,
    'Reason': point.reason
  })));

  // Add cell formatting for NOT FOUND values
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (!ws[cell_ref]) continue;
      if (ws[cell_ref].v === "NOT FOUND") {
        ws[cell_ref].s = {
          font: { color: { rgb: "FF0000" } },
          fill: { fgColor: { rgb: "FFE6E6" } }
        };
      }
    }
  }

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Property Analysis");

  // Generate Excel file
  const fileName = `${propertyAddress.replace(/[^a-zA-Z0-9]/g, "_")}_analysis.xlsx`;
  XLSX.writeFile(wb, fileName);
} 