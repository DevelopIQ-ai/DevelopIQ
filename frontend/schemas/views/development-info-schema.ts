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
      "primary_use_classification": z.string(),
      "permitted_uses": z.array(z.string()),
      "special_exceptions": z.array(z.string()),
  })),
  "Development Standards": z.object({
      "signage_requirements": z.object({
        "permitted_sign_types": z.object({
          "summary": z.string(),
        }),
        "prohibited_sign_types": z.object({
          "summary": z.string(),
        }),
        "design_requirements": z.object({
          "summary": z.string(),
        })
      }),
  })
});

// Exporting inferred types for further usage.
export type DevelopmentInfo = z.infer<typeof DevelopmentInfoSchema>;
export type DataPoint = z.infer<ReturnType<typeof dataPointWithAlias>>;