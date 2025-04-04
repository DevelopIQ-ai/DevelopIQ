/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PropertyExpandedProfile } from "@/schemas/endpoints/attom-expanded-profile";
import type { GeneralPropertyInfo } from "@/schemas/views/general-property-info-schema";
import { GeneralPropertyInfoSchema } from "@/schemas/views/general-property-info-schema";

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export function mapAttomProfileToGeneralPropertyInfo(
  expanded: PropertyExpandedProfile
): GeneralPropertyInfo {

  const defaultStructure = GeneralPropertyInfoSchema.parse({});
  if (!expanded.property || expanded.property.length === 0) {
    return defaultStructure;
  }

  const prop = expanded.property[0];
  // Build a partial mapping for only the fields Atom provides.
  const partialMapping: DeepPartial<GeneralPropertyInfo> = {
    "Property Identification & Legal Framework": {
      "Geospatial Information": {
        latitude: { alias: "Latitude", value: prop.location?.latitude ?? null, source: "attom" },
        longitude: { alias: "Longitude", value: prop.location?.longitude ?? null, source: "attom" },
        munName: { alias: "County", value: prop.area?.munName ?? null, source: "attom" },
        lotSize1: { alias: "Lot Size 1", value: prop.lot?.lotSize1 ?? null, source: "attom" },
        lotSize2: { alias: "Lot Size 2", value: prop.lot?.lotSize2 ?? null, source: "attom" },
        lotNum: { alias: "Lot Number", value: prop.lot?.lotNum ?? null, source: "attom" },
        country: { alias: "Country", value: prop.address?.country ?? null, source: "attom" },
        countrySubd: { alias: "Country Subdivision", value: prop.address?.countrySubd ?? null, source: "attom" },
        oneline: { alias: "One Line Address", value: prop.address?.oneLine ?? null, source: "attom" },
        locality: { alias: "Locality", value: prop.address?.locality ?? null, source: "attom" },
        subdName: { alias: "Subdivision Name", value: prop.area?.subdName ?? null, source: "attom" },
      },
      "Legal Description": {
        legal1: { alias: "Legal Description", value: null, source: "attom" },
      },
      "Regulatory Status": {
        "Zoning Classification": {
          siteZoningIdent: { alias: "Site Zoning Identifier", value: prop.lot?.siteZoningIdent ?? null, source: "attom" },
          zoningType: { alias: "Zoning Type", value: prop.lot?.zoningType ?? null, source: "attom" },
        }
        // Atom does not provide "Overlay Districts" – we leave that to default.
      },
      "Tax Status": {
        taxCodeArea: { alias: "Tax Code Area", value: prop.area?.taxCodeArea ?? null, source: "attom" },
        taxAmt: { alias: "Tax Amount", value: prop.assessment?.tax?.taxAmt ?? null, source: "attom" },
        taxYear: { alias: "Tax Year", value: prop.assessment?.tax?.taxYear ?? null, source: "attom" },
      },
      "Tax Deliquincy": {
        taxDeliquincy: { alias: "Tax Deliquincy", value: null, source: "attom" },
      },
    },
    "Physical Site Characteristics": {
      "Lot Configuration": {
        "Dimensional Analysis": {
          depth: { alias: "Depth", value: prop.lot?.depth ?? null, source: "attom" },
          frontage: { alias: "Frontage", value: prop.lot?.frontage ?? null, source: "attom" },
        },
        "Topographical Profile": {
          elevationDelta: { alias: "Elevation Delta", value: null, source: "attom" },
          slope: { alias: "Slope", value: null, source: "attom" },
        },
      },
      "Structural Inventory": {
        "Existing Improvements": {
          existingImprovements: { alias: "Existing Improvements", value: prop.building?.summary?.storyDesc ?? null, source: "attom" },
          yearBuilt: { alias: "Year Built", value: prop.building?.interior?.fplcCount ?? null, source: "attom" },
        },
        "Building Metrics": {
          bldgSize: { alias: "Building Size", value: prop.building?.size?.bldgSize ?? null, source: "attom" },
          horizontalFootprint: { alias: "Horizontal Footprint", value: null, source: "attom" },
          totalStructureCount: { alias: "Total Structure Count", value: null, source: "attom" },
        },
      },
    },
    "Zoning & Entitlements": {
      "Entitlement Status": {
        entitlementStatus: { alias: "Entitlement Status", value: prop.area?.locType ?? null, source: "attom" },
      }
      // We intentionally leave out "Current Approvals" and "Required Permits"
    },
    "Construction & Systems Profile": {
      "Structural Components": {
        foundationType: { alias: "Foundation Type", value: prop.building?.construction?.foundationType ?? null, source: "attom" },
        frameType: { alias: "Frame Type", value: prop.building?.construction?.frameType ?? null, source: "attom" },
      },
      Utilities: {
        powerProvider: { alias: "Power Provider", value: prop.address?.matchCode ?? null, source: "attom" },
        gasProvider: { alias: "Gas Provider", value: null, source: "attom" },
        tcommProvider: { alias: "Telecommunications Provider", value: null, source: "attom" },
        waterProvider: { alias: "Water Provider", value: prop.address?.line1 ?? null, source: "attom" },
      },
    },
    "Environmental & Geotechnical": {
      "Environmental Assessment": {
        environmentalAssessment: { alias: "Environmental Assessment", value: null, source: "attom" },
      },
      "Phase I ESA Findings (2024)": {
        phaseIESA: { alias: "Phase I ESA", value: null, source: "attom" },
      },
      "Soil Contamination": {
        soilContamination: { alias: "Soil Contamination", value: null, source: "attom" },
      },
      "Flood Risk Assessment": {
        floodRiskAssessment: { alias: "Flood Risk Assessment", value: null, source: "attom" },
      },
      "FEMA Designation": {
        femaDesignation: { alias: "FEMA Designation", value: null, source: "attom" },
      },
      "Mitigation Requirements": {
        mitigationRequirements: { alias: "Mitigation Requirements", value: null, source: "attom" },
      },
    },
    "Development Economics": {
      "Current Use Analysis": {
        officeRents: { alias: "Office Rents", value: prop.assessment?.market?.mktImprValue ?? null, source: "attom" },
        NOI: { alias: "NOI", value: prop.assessment?.market?.mktTtlValue ?? null, source: "attom" },
        capRate: { alias: "Cap Rate", value: prop.sale?.amount?.saleAmt ?? null, source: "attom" },
        value: { alias: "Value", value: prop.assessment?.appraised?.apprTtlValue ?? null, source: "attom" },
      },
      "Tax History & Projections": {
        taxHistory: { alias: "Tax History", value: null, source: "attom" },
      },
      "Reuse Potential": {
        reusePotential: { alias: "Reuse Potential", value: null, source: "attom" },
      },
    },
    "Insurance & Risk Assessment": {
      "Insurance Profile": {
        currentCoverage: { alias: "Current Coverage", value: prop.assessment?.tax?.taxAmt ?? null, source: "attom" },
        lossHistory: { alias: "Loss History", value: null, source: "attom" },
      },
      "Risk Assessment Matrix": {
        riskAssessmentMatrix: { alias: "Risk Assessment Matrix", value: null, source: "attom" },
      },
    },
  };

  const merged = deepMerge(defaultStructure, partialMapping);
  return GeneralPropertyInfoSchema.parse(merged);
}

function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const output = { ...target } as any;
  for (const key in source) {
    if (source[key] === undefined) continue;
    if (isObject(source[key]) && isObject(target[key])) {
      output[key] = deepMerge(target[key], source[key] as any);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === "object" && !Array.isArray(item);
}