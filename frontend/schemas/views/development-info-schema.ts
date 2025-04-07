import { z } from "zod";

const BaseDataPointSchema = z.object({
  alias: z.string(),
  value: z.union([z.string(), z.number(), z.null()]),
  source: z.union([z.string(), z.null()])
});

const BaseUnitDataPointSchema = z.object({
  alias: z.string(),
  value: z.union([z.string(), z.number(), z.null()]),
  source: z.union([z.string(), z.null()]),
  unit: z.union([z.string(), z.null()]),
});

export const dataPointWithAlias = (defaultAlias: string) =>
  BaseDataPointSchema.default({
    alias: defaultAlias,
    value: null,
    source: null,
  });

export const dataPointWithAliasAndUnit = (defaultAlias: string, defaultUnit: string) =>
  BaseUnitDataPointSchema.default({
    alias: defaultAlias,
    value: null,
    source: null,
    unit: defaultUnit,
  });

// Helper to create a schema for unit-based measurements with specific aliases
const createMeasurementField = (fieldType: 'feet' | 'square_feet' | 'units' | 'percentage' | 'summary' | 'requirements', alias: string) => 
  z.object({
    [fieldType]: z.string()
  }).transform(data => {
    if (fieldType === 'summary') {
      return {
        summary: {
          alias,
          value: String(data.summary),
          source: null as null | string,
        }
      };
    } else if (fieldType === 'requirements') {
      return {
        requirements: {
          alias,
          value: String(data.requirements),
          source: null as null | string,
        }
      };
    } else {
      return {
        alias,
        value: String(data[fieldType]),
        source: null as null | string,
        unit: fieldType === 'feet' ? 'Ft.' :
              fieldType === 'square_feet' ? 'Sq. Ft.' :
              fieldType === 'units' ? 'Units per Acre' :
              fieldType === 'percentage' ? '%' :
              'Summary'
      };
    }
  });

// New schema for the additional sections with mocked variables.
export const DevelopmentInfoSchema = z.object({
  "requirements": z.object({
      "lot_requirements": z.object({
        "maximum_density": createMeasurementField('units', "Maximum Density"),
        "minimum_lot_size": createMeasurementField('square_feet', "Minimum Lot Size"),
        "minimum_lot_width": createMeasurementField('feet', "Minimum Lot Width"),
        "minimum_lot_frontage": createMeasurementField('feet', "Minimum Lot Frontage"),
        "minimum_living_area": createMeasurementField('square_feet', "Minimum Living Area"),
      }),
      "building_placement_requirements": z.object({
        "minimum_front_setback": createMeasurementField('feet', "Minimum Front Setback"),
        "minimum_street_side_setback": createMeasurementField('feet', "Minimum Street Side Setback"),
        "minimum_side_yard_setback": createMeasurementField('feet', "Minimum Side Yard Setback"),
        "minimum_rear_setback": createMeasurementField('feet', "Minimum Rear Setback"),
        "accessory_building_setback": createMeasurementField('feet', "Accessory Building Setback"),
      }),
      "building_requirements": z.object({
        "maximum_building_height": createMeasurementField('feet', "Maximum Building Height"),
        "maximum_lot_coverage": createMeasurementField('percentage', "Maximum Lot Coverage"),
      }),
      "landscaping_requirements": z.object({
        "minimum_plant_sizes": createMeasurementField('feet', "Minimum Plant Sizes"),
        "landscape_plan_review_summary": createMeasurementField('summary', "Landscape Plan Review Summary"),
        "species_variation_requirement_summary": createMeasurementField('summary', "Species Variation Requirement Summary"),
        "performance_guarantee_warranty_requirements_summary": createMeasurementField('summary', "Performance Guarantee Warranty Requirements Summary"),
      }),
      "parking_requirements": z.object({
        "minimum_aisle_width": createMeasurementField('feet', "Minimum Aisle Width"),
        "curbing_requirements": createMeasurementField('summary', "Curbing Requirements"),
        "striping_requirements": createMeasurementField('summary', "Striping Requirements"),
        "drainage_requirements": createMeasurementField('summary', "Drainage Requirements"),
        "parking_stalls_required": createMeasurementField('summary', "Parking Stalls Required"),
      }),
      "signage_requirements": z.object({
        "permitted_sign_types": z.object({
          "signs": z.array(z.string()),
        }),
        "prohibited_sign_types": z.object({
          "signs": z.array(z.string()),
        }),
        "design_requirements": createMeasurementField('requirements', "Design Requirements"),
      }),
    })
});

// Exporting inferred types for further usage.
export type DevelopmentInfo = z.infer<typeof DevelopmentInfoSchema>;
export type DataPoint = z.infer<ReturnType<typeof dataPointWithAlias>>;
export type DataPointWithUnit = z.infer<ReturnType<typeof dataPointWithAliasAndUnit>>;