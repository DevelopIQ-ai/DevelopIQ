import { z } from "zod";

const BaseDataPointSchema = z.object({
  alias: z.string(),
  value: z.union([z.string(), z.number(), z.null()]),
  source: z.union([z.string(), z.null()]),
});

export const dataPointWithAlias = (defaultAlias: string) =>
  BaseDataPointSchema.default({
    alias: defaultAlias,
    value: null,
    source: null,
  });

// New schema for the additional sections with mocked variables.
export const DevelopmentInfoSchema = z.object({
  "Permitted Uses": z.array(z.object({
      "primary_use_classification": dataPointWithAlias("Primary Use Classification"),
      "permitted_uses": z.array(dataPointWithAlias("Permitted Uses")),
      "special_exceptions": z.array(dataPointWithAlias("Special Exceptions")),
  })),
  "Development Standards": z.object({
      "Lot Requirements": z.object({
        "Maximum Density": z.object({
          "units_per_acre": dataPointWithAlias("Units per Acre"),
        }),
        "Minimum Lot Size": z.object({
          "square_feet": dataPointWithAlias("Square Feet"),
        }),
        "Minimum Lot Width": z.object({
          "feet": dataPointWithAlias("Feet"),
        }),
        "Minimum Lot Frontage": z.object({
          "feet": dataPointWithAlias("Feet"),
        }),
        "Minimum Living Area": z.object({
          "square_feet": dataPointWithAlias("Square Feet"),
        }),
      }),
      "Building Placement Requirements": z.object({
        "Minimum Front Setback": z.object({
          "feet": dataPointWithAlias("Feet"),
        }),
        "Minimum Street Side Setback": z.object({
          "feet": dataPointWithAlias("Feet"),
        }),
        "Minimum Side Yard Setback": z.object({
          "feet": dataPointWithAlias("Feet"),
        }),
        "Minimum Rear Setback": z.object({
          "feet": dataPointWithAlias("Feet"),
        }),
        "Accessory Building Setback": z.object({
          "feet": dataPointWithAlias("Feet"),
        }),
      }),
      "Building Requirements": z.object({
        "Maximum Building Height": z.object({
          "feet": dataPointWithAlias("Feet"),
        }),
        "Maximum Lot Coverage": z.object({
          "percentage": dataPointWithAlias("Percentage"),
        }),
      }),
      "Landscaping Requirements": z.object({
        "Minimum Plant Sizes": z.object({
          "feet": dataPointWithAlias("Feet"),
        }),
        "Landscape Plan Review Summary": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "Species Variation Requirement Summary": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "Performance Guarantee Warranty Requirements Summary": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
      }),
      "Parking Requirements": z.object({
        "Minimum Aisle Width": z.object({
          "feet": dataPointWithAlias("Feet"),
        }),
        "Curbing Requirements": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "Striping Requirements": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "Drainage Requirements": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "Parking Stalls Required": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
      }),
      "Signage Requirements": z.object({
        "Permitted Sign Types": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "Prohibited Sign Types": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
        "Design Requirements": z.object({
          "summary": dataPointWithAlias("Summary"),
        }),
      }),
    })
});

// Exporting inferred types for further usage.
export type DevelopmentInfo = z.infer<typeof DevelopmentInfoSchema>;
export type DataPoint = z.infer<ReturnType<typeof dataPointWithAlias>>;