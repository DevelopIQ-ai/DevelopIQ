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

// New schema for the additional sections with mocked variables.
export const DevelopmentInfoSchema = z.object({
  "Permitted Uses": z.array(z.object({
      "primary_use_classification": dataPointWithAlias("Primary Use Classification"),
      "permitted_uses": z.array(dataPointWithAlias("Permitted Uses")),
      "special_exceptions": z.array(dataPointWithAlias("Special Exceptions")),
  })),
  "requirements": z.object({
      "lot_requirements": z.object({
        "maximum_density": z.object({
          "units": dataPointWithAliasAndUnit("Maximum Density", "Units per Acre"),
        }),
        "minimum_lot_size": z.object({
          "square_feet": dataPointWithAliasAndUnit("Minimum Lot Size", "Sq. Ft."),
        }),
        "minimum_lot_width": z.object({
          "feet": dataPointWithAliasAndUnit("Minimum Lot Width", "Ft."),
        }),
        "minimum_lot_frontage": z.object({
          "feet": dataPointWithAliasAndUnit("Minimum Lot Frontage", "Ft."),
        }),
        "minimum_living_area": z.object({
          "square_feet": dataPointWithAliasAndUnit("Minimum Living Area", "Sq. Ft."),
        }),
      }),
      "building_placement_requirements": z.object({
        "minimum_front_setback": z.object({
          "feet": dataPointWithAliasAndUnit("Minimum Front Setback", "Ft."),
        }),
        "minimum_street_side_setback": z.object({
          "feet": dataPointWithAliasAndUnit("Minimum Street Side Setback", "Ft."),
        }),
        "minimum_side_yard_setback": z.object({
          "feet": dataPointWithAliasAndUnit("Minimum Side Yard Setback", "Ft."),
        }),
        "minimum_rear_setback": z.object({
          "feet": dataPointWithAliasAndUnit("Minimum Rear Setback", "Ft."),
        }),
        "accessory_building_setback": z.object({
          "feet": dataPointWithAliasAndUnit("Accessory Building Setback", "Ft."),
        }),
      }),
      "building_requirements": z.object({
        "maximum_building_height": z.object({
          "feet": dataPointWithAliasAndUnit("Maximum Building Height", "Ft."),
        }),
        "maximum_lot_coverage": z.object({
          "percentage": dataPointWithAliasAndUnit("Maximum Lot Coverage", "%"),
        }),
      }),
      "landscaping_requirements": z.object({
        "minimum_plant_sizes": z.object({
          "feet": dataPointWithAliasAndUnit("Minimum Plant Sizes", "Ft."),
        }),
        "landscape_plan_review_summary": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "species_variation_requirement_summary": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "performance_guarantee_warranty_requirements_summary": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
      }),
      "parking_requirements": z.object({
        "minimum_aisle_width": z.object({
          "feet": dataPointWithAliasAndUnit("Minimum Aisle Width", "Ft."),
        }),
        "curbing_requirements": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "striping_requirements": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "drainage_requirements": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "parking_stalls_required": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
      }),
      "signage_requirements": z.object({
        "permitted_sign_types": z.object({
          "signs": z.array(z.string()),
        }),
        "prohibited_sign_types": z.object({
          "signs": z.array(z.string()),
        }),
        "design_requirements": z.object({
          "requirements": dataPointWithAlias("Requirements"),
        }),
      }),
    })
});

// Exporting inferred types for further usage.
export type DevelopmentInfo = z.infer<typeof DevelopmentInfoSchema>;
export type DataPoint = z.infer<ReturnType<typeof dataPointWithAlias>>;
export type DataPointWithUnit = z.infer<ReturnType<typeof dataPointWithAliasAndUnit>>;