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
  "Zoning & Use Parameter": z.object({
    "Permitted Use Matrix": z.object({
      permittedUses: dataPointWithAlias("Permitted Uses"),
      restrictions: dataPointWithAlias("Restrictions"),
    }).default(() => ({
      permittedUses: dataPointWithAlias("Permitted Uses").parse(undefined),
      restrictions: dataPointWithAlias("Restrictions").parse(undefined),
    })),
    "Overlay District Implications": z.object({
      overlayDetails: dataPointWithAlias("Overlay Details"),
      impactAssessment: dataPointWithAlias("Impact Assessment"),
    }).default(() => ({
      overlayDetails: dataPointWithAlias("Overlay Details").parse(undefined),
      impactAssessment: dataPointWithAlias("Impact Assessment").parse(undefined),
    })),
  }).default(() => ({
    "Permitted Use Matrix": {
      permittedUses: dataPointWithAlias("Permitted Uses").parse(undefined),
      restrictions: dataPointWithAlias("Restrictions").parse(undefined),
    },
    "Overlay District Implications": {
      overlayDetails: dataPointWithAlias("Overlay Details").parse(undefined),
      impactAssessment: dataPointWithAlias("Impact Assessment").parse(undefined),
    },
  })),
  "Setback & Lot Coverage Standards": z.object({
    "Primary Setback Ratios": z.object({
      frontSetback: dataPointWithAlias("Front Setback"),
      sideSetback: dataPointWithAlias("Side Setback"),
      rearSetback: dataPointWithAlias("Rear Setback"),
    }).default(() => ({
      frontSetback: dataPointWithAlias("Front Setback").parse(undefined),
      sideSetback: dataPointWithAlias("Side Setback").parse(undefined),
      rearSetback: dataPointWithAlias("Rear Setback").parse(undefined),
    })),
    "Buildable Area Calculations": z.object({
      totalBuildableArea: dataPointWithAlias("Total Buildable Area"),
      setbackAdjustedArea: dataPointWithAlias("Setback Adjusted Area"),
    }).default(() => ({
      totalBuildableArea: dataPointWithAlias("Total Buildable Area").parse(undefined),
      setbackAdjustedArea: dataPointWithAlias("Setback Adjusted Area").parse(undefined),
    })),
  }).default(() => ({
    "Primary Setback Ratios": {
      frontSetback: dataPointWithAlias("Front Setback").parse(undefined),
      sideSetback: dataPointWithAlias("Side Setback").parse(undefined),
      rearSetback: dataPointWithAlias("Rear Setback").parse(undefined),
    },
    "Buildable Area Calculations": {
      totalBuildableArea: dataPointWithAlias("Total Buildable Area").parse(undefined),
      setbackAdjustedArea: dataPointWithAlias("Setback Adjusted Area").parse(undefined),
    },
  })),
  "Facade & Exterior Requirements": z.object({
    "Design Mandates": z.object({
      facadeMaterials: dataPointWithAlias("Facade Materials"),
      architecturalStyle: dataPointWithAlias("Architectural Style"),
    }).default(() => ({
      facadeMaterials: dataPointWithAlias("Facade Materials").parse(undefined),
      architecturalStyle: dataPointWithAlias("Architectural Style").parse(undefined),
    })),
    "Maintainence Compliance": z.object({
      maintenanceFrequency: dataPointWithAlias("Maintenance Frequency"),
      complianceScore: dataPointWithAlias("Compliance Score"),
    }).default(() => ({
      maintenanceFrequency: dataPointWithAlias("Maintenance Frequency").parse(undefined),
      complianceScore: dataPointWithAlias("Compliance Score").parse(undefined),
    })),
  }).default(() => ({
    "Design Mandates": {
      facadeMaterials: dataPointWithAlias("Facade Materials").parse(undefined),
      architecturalStyle: dataPointWithAlias("Architectural Style").parse(undefined),
    },
    "Maintainence Compliance": {
      maintenanceFrequency: dataPointWithAlias("Maintenance Frequency").parse(undefined),
      complianceScore: dataPointWithAlias("Compliance Score").parse(undefined),
    },
  })),
});

// Exporting inferred types for further usage.
export type DevelopmentInfo = z.infer<typeof DevelopmentInfoSchema>;
export type DataPoint = z.infer<ReturnType<typeof dataPointWithAlias>>;