import { z } from "zod";


const DataPointSchema = z.object({
  alias: z.string(),
  value: z.union([z.string(), z.number(), z.null()]),
  source: z.union([z.string(), z.null()]),
});

export const dataPointWithAlias = (alias: string) => 
  DataPointSchema.default({
    alias,
    value: null,
    source: null,
  });

// Updated GeneralPropertyInfoSchema using the helper.
export const GeneralPropertyInfoSchema = z.object({
  "Property Identification & Legal Framework": z.object({
    "Geospatial Information": z.object({
      latitude: dataPointWithAlias("Latitude"),
      longitude: dataPointWithAlias("Longitude"),
      munName: dataPointWithAlias("Municipality Name"),
      lotSize1: dataPointWithAlias("Lot Size 1"),
      lotSize2: dataPointWithAlias("Lot Size 2"),
      lotNum: dataPointWithAlias("Lot Number"),
      country: dataPointWithAlias("Country"),
      countrySubd: dataPointWithAlias("Country Subdivision"),
      oneline: dataPointWithAlias("One Line Address"),
      locality: dataPointWithAlias("Locality"),
      subdName: dataPointWithAlias("Subdivision Name"),
    }),
    "Legal Description": z.object({
      legal1: dataPointWithAlias("Legal Description"),
    }),
    "Regulatory Status": z.object({
      "Zoning Classification": z.object({
        siteZoningIdent: dataPointWithAlias("Site Zoning Identifier"),
        zoningType: dataPointWithAlias("Zoning Type"),
        zoneName: dataPointWithAlias("Zone Name"),
        zoneSubType: dataPointWithAlias("Zone Subtype")
      }),
      "Overlay Districts": z.object({
        overlayDistricts: dataPointWithAlias("Overlay Districts"),
      }),
    }),
    "Tax Status": z.object({
      taxCodeArea: dataPointWithAlias("Tax Code Area"),
      taxAmt: dataPointWithAlias("Tax Amount"),
      taxYear: dataPointWithAlias("Tax Year"),
    }),
    "Tax Deliquincy": z.object({
      taxDeliquincy: dataPointWithAlias("Tax Deliquincy"),
    }),
  }).default(() => ({
    "Geospatial Information": {
      latitude: dataPointWithAlias("Latitude").parse(undefined),
      longitude: dataPointWithAlias("Longitude").parse(undefined),
      munName: dataPointWithAlias("Municipality Name").parse(undefined),
      lotSize1: dataPointWithAlias("Lot Size 1").parse(undefined),
      lotSize2: dataPointWithAlias("Lot Size 2").parse(undefined),
      lotNum: dataPointWithAlias("Lot Number").parse(undefined),
      country: dataPointWithAlias("Country").parse(undefined),
      countrySubd: dataPointWithAlias("Country Subdivision").parse(undefined),
      oneline: dataPointWithAlias("One Line Address").parse(undefined),
      locality: dataPointWithAlias("Locality").parse(undefined),
      subdName: dataPointWithAlias("Subdivision Name").parse(undefined),
    },
    "Legal Description": {
      legal1: dataPointWithAlias("Legal Description").parse(undefined),
    },
    "Regulatory Status": {
      "Zoning Classification": {
        siteZoningIdent: dataPointWithAlias("Site Zoning Identifier").parse(undefined),
        zoningType: dataPointWithAlias("Zoning Type").parse(undefined),
        zoneName: dataPointWithAlias("Zone Name").parse(undefined),
        zoneSubType: dataPointWithAlias("Zone Subtype").parse(undefined),
      },
      "Overlay Districts": {
        overlayDistricts: dataPointWithAlias("Overlay Districts").parse(undefined),
      },
    },
    "Tax Status": {
      taxCodeArea: dataPointWithAlias("Tax Code Area").parse(undefined),
      taxAmt: dataPointWithAlias("Tax Amount").parse(undefined),
      taxYear: dataPointWithAlias("Tax Year").parse(undefined),
    },
    "Tax Deliquincy": {
      taxDeliquincy: dataPointWithAlias("Tax Deliquincy").parse(undefined),
    },
  })),
  "Physical Site Characteristics": z.object({
    "Lot Configuration": z.object({
      "Dimensional Analysis": z.object({
        depth: dataPointWithAlias("Depth"),
        frontage: dataPointWithAlias("Frontage"),
      }),
      "Topographical Profile": z.object({
        elevationDelta: dataPointWithAlias("Elevation Delta"),
        slope: dataPointWithAlias("Slope"),
      }),
    }),
    "Easements & Encumbrances": z.object({
      "Recorded Easements": z.object({
        recordedEasements: dataPointWithAlias("Recorded Easements"),
      }),
      "Deed Restrictions": z.object({
        deedRestrictions: dataPointWithAlias("Deed Restrictions"),
      }),
    }),
    "Structural Inventory": z.object({
      "Existing Improvements": z.object({
        existingImprovements: dataPointWithAlias("Existing Improvements"),
        yearBuilt: dataPointWithAlias("Year Built"),
      }),
      "Building Metrics": z.object({
        bldgSize: dataPointWithAlias("Building Size"),
        horizontalFootprint: dataPointWithAlias("Horizontal Footprint"),
        totalStructureCount: dataPointWithAlias("Total Structure Count"),
      }),
    }),
  }).default(() => ({
    "Lot Configuration": {
      "Dimensional Analysis": {
        depth: dataPointWithAlias("Depth").parse(undefined),
        frontage: dataPointWithAlias("Frontage").parse(undefined),
      },
      "Topographical Profile": {
        elevationDelta: dataPointWithAlias("Elevation Delta").parse(undefined),
        slope: dataPointWithAlias("Slope").parse(undefined),
      },
    },
    "Easements & Encumbrances": {
      "Recorded Easements": {
        recordedEasements: dataPointWithAlias("Recorded Easements").parse(undefined),
      },
      "Deed Restrictions": {
        deedRestrictions: dataPointWithAlias("Deed Restrictions").parse(undefined),
      },
    },
    "Structural Inventory": {
      "Existing Improvements": {
        existingImprovements: dataPointWithAlias("Existing Improvements").parse(undefined),
        yearBuilt: dataPointWithAlias("Year Built").parse(undefined),
      },
      "Building Metrics": {
        bldgSize: dataPointWithAlias("Building Size").parse(undefined),
        horizontalFootprint: dataPointWithAlias("Horizontal Footprint").parse(undefined),
        totalStructureCount: dataPointWithAlias("Total Structure Count").parse(undefined),
      },
    },
  })),
  "Zoning & Entitlements": z.object({
    "Entitlement Status": z.object({
      entitlementStatus: dataPointWithAlias("Entitlement Status"),
    }),
    "Current Approvals": z.object({
      currentApprovals: dataPointWithAlias("Current Approvals"),
    }),
    "Required Permits": z.object({
      requiredPermits: dataPointWithAlias("Required Permits"),
    }),
  }).default(() => ({
    "Entitlement Status": {
      entitlementStatus: dataPointWithAlias("Entitlement Status").parse(undefined),
    },
    "Current Approvals": {
      currentApprovals: dataPointWithAlias("Current Approvals").parse(undefined),
    },
    "Required Permits": {
      requiredPermits: dataPointWithAlias("Required Permits").parse(undefined),
    },
  })),
  "Construction & Systems Profile": z.object({
    "Structural Components": z.object({
      foundationType: dataPointWithAlias("Foundation Type"),
      frameType: dataPointWithAlias("Frame Type"),
    }),
    Utilities: z.object({
      powerProvider: dataPointWithAlias("Power Provider"),
      gasProvider: dataPointWithAlias("Gas Provider"),
      tcommProvider: dataPointWithAlias("Telecommunications Provider"),
      waterProvider: dataPointWithAlias("Water Provider"),
    }),
  }).default(() => ({
    "Structural Components": {
      foundationType: dataPointWithAlias("Foundation Type").parse(undefined),
      frameType: dataPointWithAlias("Frame Type").parse(undefined),
    },
    Utilities: {
      powerProvider: dataPointWithAlias("Power Provider").parse(undefined),
      gasProvider: dataPointWithAlias("Gas Provider").parse(undefined),
      tcommProvider: dataPointWithAlias("Telecommunications Provider").parse(undefined),
      waterProvider: dataPointWithAlias("Water Provider").parse(undefined),
    },
  })),
  "Environmental & Geotechnical": z.object({
    "Environmental Assessment": z.object({
      environmentalAssessment: dataPointWithAlias("Environmental Assessment"),
    }),
    "Phase I ESA Findings (2024)": z.object({
      phaseIESA: dataPointWithAlias("Phase I ESA"),
    }),
    "Soil Contamination": z.object({
      soilContamination: dataPointWithAlias("Soil Contamination"),
    }),
    "Flood Risk Assessment": z.object({
      floodRiskAssessment: dataPointWithAlias("Flood Risk Assessment"),
    }),
    "FEMA Designation": z.object({
      femaDesignation: dataPointWithAlias("FEMA Designation"),
    }),
    "Mitigation Requirements": z.object({
      mitigationRequirements: dataPointWithAlias("Mitigation Requirements"),
    }),
  }).default(() => ({
    "Environmental Assessment": {
      environmentalAssessment: dataPointWithAlias("Environmental Assessment").parse(undefined),
    },
    "Phase I ESA Findings (2024)": {
      phaseIESA: dataPointWithAlias("Phase I ESA").parse(undefined),
    },
    "Soil Contamination": {
      soilContamination: dataPointWithAlias("Soil Contamination").parse(undefined),
    },
    "Flood Risk Assessment": {
      floodRiskAssessment: dataPointWithAlias("Flood Risk Assessment").parse(undefined),
    },
    "FEMA Designation": {
      femaDesignation: dataPointWithAlias("FEMA Designation").parse(undefined),
    },
    "Mitigation Requirements": {
      mitigationRequirements: dataPointWithAlias("Mitigation Requirements").parse(undefined),
    },
  })),
  "Development Economics": z.object({
    "Current Use Analysis": z.object({
      officeRents: dataPointWithAlias("Office Rents"),
      NOI: dataPointWithAlias("NOI"),
      capRate: dataPointWithAlias("Cap Rate"),
      value: dataPointWithAlias("Value"),
    }),
    "Tax History & Projections": z.object({
      taxHistory: dataPointWithAlias("Tax History"),
    }),
    "Reuse Potential": z.object({
      reusePotential: dataPointWithAlias("Reuse Potential"),
    }),
  }).default(() => ({
    "Current Use Analysis": {
      officeRents: dataPointWithAlias("Office Rents").parse(undefined),
      NOI: dataPointWithAlias("NOI").parse(undefined),
      capRate: dataPointWithAlias("Cap Rate").parse(undefined),
      value: dataPointWithAlias("Value").parse(undefined),
    },
    "Tax History & Projections": {
      taxHistory: dataPointWithAlias("Tax History").parse(undefined),
    },
    "Reuse Potential": {
      reusePotential: dataPointWithAlias("Reuse Potential").parse(undefined),
    },
  })),
  "Insurance & Risk Assessment": z.object({
    "Insurance Profile": z.object({
      currentCoverage: dataPointWithAlias("Current Coverage"),
      lossHistory: dataPointWithAlias("Loss History"),
    }),
    "Risk Assessment Matrix": z.object({
      riskAssessmentMatrix: dataPointWithAlias("Risk Assessment Matrix"),
    }),
  }).default(() => ({
    "Insurance Profile": {
      currentCoverage: dataPointWithAlias("Current Coverage").parse(undefined),
      lossHistory: dataPointWithAlias("Loss History").parse(undefined),
    },
    "Risk Assessment Matrix": {
      riskAssessmentMatrix: dataPointWithAlias("Risk Assessment Matrix").parse(undefined),
    },
  })),
});

// tab 2 schema


export type GeneralPropertyInfo = z.infer<typeof GeneralPropertyInfoSchema>;
export type DataPoint = z.infer<ReturnType<typeof dataPointWithAlias>>;