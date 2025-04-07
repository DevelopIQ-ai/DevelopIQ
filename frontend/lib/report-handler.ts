import { z } from "zod";
import { GeneralPropertyInfo, DataPoint, GeneralPropertyInfoSchema } from "../schemas/views/general-property-info-schema";
import { DevelopmentInfo, DevelopmentInfoSchema } from "../schemas/views/development-info-schema";
/**
 * PropertyReportHandler class for managing and processing real estate property reports.
 * It handles data collection, validation, and formatting for property analysis.
 */
export class PropertyReportHandler {
  private generalInfo: GeneralPropertyInfo | null = null;
  private developmentInfo: DevelopmentInfo | null = null;
  private rawData: Record<string, unknown> = {};
  private propertyUrl: string | null = null;
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();
  private status: ReportStatus = "pending";
  private errors: ReportError[] = [];

  constructor(propertyUrl?: string, initialData?: Partial<GeneralPropertyInfo>) {
    if (propertyUrl) this.propertyUrl = propertyUrl;
    if (initialData) this.setGeneralInfo(initialData);
  }

  setPropertyUrl(url: string): void {
    this.propertyUrl = url;
    this.updatedAt = new Date();
  }

  getPropertyUrl(): string | null {
    return this.propertyUrl;
  }

  setGeneralInfo(data: Partial<GeneralPropertyInfo>): void {
    try {
      const mergedData = this.generalInfo
        ? this.mergeGeneralInfo(this.generalInfo, data)
        : data;
      this.rawData = { ...this.rawData, ...data };
      this.generalInfo = PropertyReportHandler.validateGeneralInfo(mergedData as GeneralPropertyInfo);
      this.updatedAt = new Date();
      this.status = "updated";
    } catch (error) {
      this.handleError(
        "validation_error",
        `Failed to set general info: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  getGeneralInfo(): GeneralPropertyInfo | null {
    return this.generalInfo;
  }

  setDevelopmentInfo(data: Partial<DevelopmentInfo>): void {
    try {
      const mergedData = this.developmentInfo
        ? this.mergeDevelopmentInfo(this.developmentInfo, data)
        : data;
      this.rawData = { ...this.rawData, ...data };
      this.developmentInfo = PropertyReportHandler.validateDevelopmentInfo(mergedData as DevelopmentInfo);
      this.updatedAt = new Date();
      this.status = "updated";
    } catch (error) {
      this.handleError(
        "validation_error",
        `Failed to set development info: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  getDevelopmentInfo(): DevelopmentInfo | null {
    return this.developmentInfo;
  }

  async fetchDevelopmentInfo(stateCode: string | number, municipality: string, zoneCode: string): Promise<DevelopmentInfo> {
    try {
      console.log("Fetching development info from API");
      const response = await fetch('/api/development-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: stateCode, municipality, zone_code: zoneCode })
      });

      const result = await response.json();
      console.log('Development info API result:', result);

      if (result.status === 'success') {
        console.log('Development info received successfully');
        
        // Create a development info object with the new schema structure
        const developmentInfo = {
          lot_requirements: {
            maximum_density: { alias: "Maximum Density", value: result.requirements?.lot_requirements?.maximum_density?.value || null, source: result.requirements?.lot_requirements?.maximum_density?.source || null, unit: "Units per Acre" },
            minimum_lot_size: { alias: "Minimum Lot Size", value: result.requirements?.lot_requirements?.minimum_lot_size?.value || null, source: result.requirements?.lot_requirements?.minimum_lot_size?.source || null, unit: "Sq. Ft." },
            minimum_lot_width: { alias: "Minimum Lot Width", value: result.requirements?.lot_requirements?.minimum_lot_width?.value || null, source: result.requirements?.lot_requirements?.minimum_lot_width?.source || null, unit: "Ft." },
            minimum_lot_frontage: { alias: "Minimum Lot Frontage", value: result.requirements?.lot_requirements?.minimum_lot_frontage?.value || null, source: result.requirements?.lot_requirements?.minimum_lot_frontage?.source || null, unit: "Ft." },
            minimum_living_area: { alias: "Minimum Living Area", value: result.requirements?.lot_requirements?.minimum_living_area?.value || null, source: result.requirements?.lot_requirements?.minimum_living_area?.source || null, unit: "Sq. Ft." }
          },
          building_placement_requirements: {
            minimum_front_setback: { alias: "Minimum Front Setback", value: result.requirements?.building_placement_requirements?.minimum_front_setback?.value || null, source: result.requirements?.building_placement_requirements?.minimum_front_setback?.source || null, unit: "Ft." },
            minimum_street_side_setback: { alias: "Minimum Street Side Setback", value: result.requirements?.building_placement_requirements?.minimum_street_side_setback?.value || null, source: result.requirements?.building_placement_requirements?.minimum_street_side_setback?.source || null, unit: "Ft." },
            minimum_side_yard_setback: { alias: "Minimum Side Yard Setback", value: result.requirements?.building_placement_requirements?.minimum_side_yard_setback?.value || null, source: result.requirements?.building_placement_requirements?.minimum_side_yard_setback?.source || null, unit: "Ft." },
            minimum_rear_setback: { alias: "Minimum Rear Setback", value: result.requirements?.building_placement_requirements?.minimum_rear_setback?.value || null, source: result.requirements?.building_placement_requirements?.minimum_rear_setback?.source || null, unit: "Ft." },
            accessory_building_setback: { alias: "Accessory Building Setback", value: result.requirements?.building_placement_requirements?.accessory_building_setback?.value || null, source: result.requirements?.building_placement_requirements?.accessory_building_setback?.source || null, unit: "Ft." }
          },
          building_requirements: {
            maximum_building_height: { alias: "Maximum Building Height", value: result.requirements?.building_requirements?.maximum_building_height?.value || null, source: result.requirements?.building_requirements?.maximum_building_height?.source || null, unit: "Ft." },
            maximum_lot_coverage: { alias: "Maximum Lot Coverage", value: result.requirements?.building_requirements?.maximum_lot_coverage?.value || null, source: result.requirements?.building_requirements?.maximum_lot_coverage?.source || null, unit: "%" }
          },
          landscaping_requirements: {
            minimum_plant_sizes: { alias: "Minimum Plant Sizes", value: result.requirements?.landscaping_requirements?.minimum_plant_sizes?.value || null, source: result.requirements?.landscaping_requirements?.minimum_plant_sizes?.source || null, unit: "Ft." },
            landscape_plan_review_summary: { summary: { alias: "Landscape Plan Review Summary", value: result.requirements?.landscaping_requirements?.landscape_plan_review_summary?.summary?.value || null, source: result.requirements?.landscaping_requirements?.landscape_plan_review_summary?.summary?.source || null } },
            species_variation_requirement_summary: { summary: { alias: "Species Variation Requirement Summary", value: result.requirements?.landscaping_requirements?.species_variation_requirement_summary?.summary?.value || null, source: result.requirements?.landscaping_requirements?.species_variation_requirement_summary?.summary?.source || null } },
            performance_guarantee_warranty_requirements_summary: { summary: { alias: "Performance Guarantee Warranty Requirements Summary", value: result.requirements?.landscaping_requirements?.performance_guarantee_warranty_requirements_summary?.summary?.value || null, source: result.requirements?.landscaping_requirements?.performance_guarantee_warranty_requirements_summary?.summary?.source || null } }
          },
          parking_requirements: {
            minimum_aisle_width: { alias: "Minimum Aisle Width", value: result.requirements?.parking_requirements?.minimum_aisle_width?.value || null, source: result.requirements?.parking_requirements?.minimum_aisle_width?.source || null, unit: "Ft." },
            curbing_requirements: { summary: { alias: "Curbing Requirements", value: result.requirements?.parking_requirements?.curbing_requirements?.summary?.value || null, source: result.requirements?.parking_requirements?.curbing_requirements?.summary?.source || null } },
            striping_requirements: { summary: { alias: "Striping Requirements", value: result.requirements?.parking_requirements?.striping_requirements?.summary?.value || null, source: result.requirements?.parking_requirements?.striping_requirements?.summary?.source || null } },
            drainage_requirements: { summary: { alias: "Drainage Requirements", value: result.requirements?.parking_requirements?.drainage_requirements?.summary?.value || null, source: result.requirements?.parking_requirements?.drainage_requirements?.summary?.source || null } },
            parking_stalls_required: { summary: { alias: "Parking Stalls Required", value: result.requirements?.parking_requirements?.parking_stalls_required?.summary?.value || null, source: result.requirements?.parking_requirements?.parking_stalls_required?.summary?.source || null } }
          },
          signage_requirements: {
            permitted_sign_types: { signs: result.requirements?.signage_requirements?.permitted_sign_types?.signs || [] },
            prohibited_sign_types: { signs: result.requirements?.signage_requirements?.prohibited_sign_types?.signs || [] },
            design_requirements: { requirements: { alias: "Design Requirements", value: result.requirements?.signage_requirements?.design_requirements?.requirements?.value || null, source: result.requirements?.signage_requirements?.design_requirements?.requirements?.source || null } }
          }
        };

        this.setDevelopmentInfo(developmentInfo);
        return developmentInfo;
      } else if (!response.ok) {
        throw new Error(result.error || "Unknown error fetching development info");
      } else {
        throw new Error("Failed to fetch development info");
      }
    } catch (error) {
      console.error("Error in development info processing:", error);
      throw error;
    }
  }

  updateDataPoint(
    path: string,
    value: string | number | null,
    source: string | null,
    alias?: string
  ): void {
    try {
      if (!this.generalInfo) {
        this.generalInfo = this.createEmptyGeneralInfo();
      }
      if (!this.developmentInfo) {
        this.developmentInfo = this.createEmptyDevelopmentInfo();
      }
      const pathParts = path.split(".");
      // Retrieve existing data point, if any.
      const existing = this.getNestedValue(this.generalInfo, pathParts) as DataPoint | undefined;
      const newDataPoint: DataPoint = {
        alias: alias || (existing ? existing.alias : pathParts[pathParts.length - 1]),
        value,
        source,
      };
      this.setNestedValue(this.generalInfo, pathParts, newDataPoint);
      this.updatedAt = new Date();
      this.status = "updated";
    } catch (error) {
      this.handleError(
        "update_error",
        `Failed to update data point at ${path}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  getDataPoint(path: string): DataPoint | null {
    try {
      if (!this.generalInfo) return null;
      const pathParts = path.split(".");
      return (this.getNestedValue(this.generalInfo, pathParts) as DataPoint) || null;
    } catch (error) {
      this.handleError(
        "retrieval_error",
        `Failed to get data point at ${path}: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    }
  }

  getStatus(): ReportStatus {
    return this.status;
  }

  getErrors(): ReportError[] {
    return [...this.errors];
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  toJSON(): PropertyReportJSON {
    return {
      propertyUrl: this.propertyUrl,
      generalInfo: this.generalInfo,
      status: this.status,
      errors: this.errors,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  toHTML(): string {
    if (!this.generalInfo) {
      return '<p class="error">No property information available</p>';
    }
    
    let html = "";

    // Iterate over each top-level section (h1)
    for (const [sectionName, sectionValue] of Object.entries(this.generalInfo)) {
      html += `<h1 style="font-size: 1.5rem; margin-top: 1.5em;">${sectionName}</h1>`;

      // Each sub-section (h2)
      for (const [subheaderName, subheaderValue] of Object.entries(sectionValue)) {
        html += `<h2 style="font-size: 1.2rem; margin-top: 1em;">${subheaderName}</h2>`;

        // Handle each leaf node
        for (const [key, leafObject] of Object.entries(subheaderValue)) {
          if (!leafObject || typeof leafObject !== "object") continue;

          // Check if this is a nested structure
          if (this.isNestedStructure(key)) {
            html += this.renderNestedStructure(key, leafObject as Record<string, DataPoint>);
            continue;
          }

          // Handle regular DataPoints
          if (isDataPoint(leafObject)) {
            html += this.renderDataPoint(leafObject, key);
          }
        }
      }
    }

    return html;
  }

  private isNestedStructure(key: string): boolean {
    const nestedKeys = [
      "Zoning Classification",
      "Overlay Districts",
      "Dimensional Analysis",
      "Topographical Profile",
      "Recorded Easements",
      "Deed Restrictions",
      "Existing Improvements",
      "Building Metrics"
    ];
    return nestedKeys.includes(key);
  }

  private renderDataPoint(dataPoint: DataPoint, fallbackKey: string): string {
    const alias = dataPoint.alias || fallbackKey;
    const rawValue = dataPoint.value;
    const displayValue = rawValue === null || rawValue === undefined ? "NOT FOUND" : rawValue;

    return `<p style="margin-left: 1.5em;"><strong>${alias}:</strong> ${displayValue}</p>`;
  }

  private renderNestedStructure(title: string, data: Record<string, DataPoint>): string {
    let html = `<div style="margin-left: 1.5em;">
      <strong>${title}</strong>
      <div style="margin-left: 1.5em;">`;

    for (const [, dataPoint] of Object.entries(data)) {
      if (isDataPoint(dataPoint)) {
        const displayValue = dataPoint.value === null || dataPoint.value === undefined
          ? "NOT FOUND"
          : dataPoint.value;
        html += `<p><em>${dataPoint.alias}:</em> ${displayValue}</p>`;
      }
    }

    html += '</div></div>';
    return html;
  }

  static fromJSON(json: PropertyReportJSON): PropertyReportHandler {
    const report = new PropertyReportHandler(json.propertyUrl || undefined);
    if (json.generalInfo) report.generalInfo = json.generalInfo;
    report.status = json.status || "pending";
    report.errors = json.errors || [];
    report.createdAt = json.createdAt ? new Date(json.createdAt) : new Date();
    report.updatedAt = json.updatedAt ? new Date(json.updatedAt) : new Date();
    return report;
  }

  public static validateGeneralInfo(data: GeneralPropertyInfo): GeneralPropertyInfo {
    try {
      return GeneralPropertyInfoSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${JSON.stringify(error.errors)}`);
      }
      throw error;
    }
  }

  public static validateDevelopmentInfo(data: DevelopmentInfo): DevelopmentInfo {
    try {
      return DevelopmentInfoSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${JSON.stringify(error.errors)}`); 
      }
      throw error;
    }
  }

  private mergeGeneralInfo(
    existing: GeneralPropertyInfo,
    updates: Partial<GeneralPropertyInfo>
  ): GeneralPropertyInfo {
    return this.deepMerge(existing, updates) as GeneralPropertyInfo;
  }

  private mergeDevelopmentInfo(
    existing: DevelopmentInfo,
    updates: Partial<DevelopmentInfo>
  ): DevelopmentInfo {
    return this.deepMerge(existing, updates) as DevelopmentInfo;
  }

  private deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>
  ): Record<string, unknown> {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          output[key] = key in target
            ? this.deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>)
            : source[key];
        } else {
          output[key] = source[key];
        }
      });
    }
    return output;
  }

  private createEmptyGeneralInfo(): GeneralPropertyInfo {
    return GeneralPropertyInfoSchema.parse({});
  }

  private createEmptyDevelopmentInfo(): DevelopmentInfo {
    return DevelopmentInfoSchema.parse({});
  }

  private getNestedValue(obj: Record<string, unknown>, pathParts: string[]): unknown {
    return pathParts.reduce<unknown>((acc, key) => {
      if (acc != null && typeof acc === "object") {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  private setNestedValue(
    obj: Record<string, unknown>,
    pathParts: string[],
    value: unknown
  ): void {
    let current = obj;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!current[part] || typeof current[part] !== "object") {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
    current[pathParts[pathParts.length - 1]] = value;
  }

  private handleError(type: ReportErrorType, message: string): void {
    const error: ReportError = {
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    this.errors.push(error);
    this.status = "error";
  }
}

function isObject(item: unknown): boolean {
  return Boolean(item) && typeof item === "object" && !Array.isArray(item);
}

function isDataPoint(obj: unknown): obj is DataPoint {
  return Boolean(
    obj &&
    typeof obj === 'object' &&
    'alias' in obj &&
    'value' in obj
  );
}

export type ReportStatus = "pending" | "processing" | "updated" | "complete" | "error";

export type ReportErrorType =
  | "validation_error"
  | "processing_error"
  | "retrieval_error"
  | "update_error";

// Report error interface
export interface ReportError {
  type: ReportErrorType;
  message: string;
  timestamp: string;
}

// Property report JSON interface for serialization/deserialization
export interface PropertyReportJSON {
  propertyUrl: string | null;
  generalInfo: GeneralPropertyInfo | null;
  status: ReportStatus;
  errors: ReportError[];
  createdAt: string;
  updatedAt: string;
}