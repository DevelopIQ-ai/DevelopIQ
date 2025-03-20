import { GeneralPropertyInfo } from "@/schemas/views/general-property-info-schema"

// Define 5 demo properties with coordinates
export const DEMO_PROPERTIES = [
  {
    address: "7315 Hwy 311, Sellersburg, IN 47172, USA",
  },
  {
    address: "1206 W 186th St, Westfield, IN 46074, USA",
  }
]

// Create a general info data point helper
const dataPoint = (value: string | number | null, source: string | null = "Demo Data", alias?: string) => ({
  value,
  source,
  alias: alias || "Property Data"
})

// Mock property data for each address
export const mockPropertyData: Record<string, GeneralPropertyInfo> = {
  "7315 Hwy 311, Sellersburg, IN 47172, USA": {
    
    "Property Identification & Legal Framework": {
      "Geospatial Information": {
        latitude: dataPoint(38.3782, "Demo Data", "Latitude"),
        longitude: dataPoint(-85.7709, "Demo Data", "Longitude"),
        munName: dataPoint("Sellersburg", "Demo Data", "Municipality Name"),
        lotSize1: dataPoint("2.11 acres", "Demo Data", "Lot Size 1"),
        lotSize2: dataPoint("91,911 sq ft", "Demo Data", "Lot Size 2"),
        lotNum: dataPoint("A-1234", "Demo Data", "Lot Number"),
        country: dataPoint("United States", "Demo Data", "Country"),
        countrySubd: dataPoint("Indiana", "Demo Data", "Country Subdivision"),
        oneline: dataPoint("7315 Hwy 311, Sellersburg, IN 47172, USA", "Demo Data", "One Line Address"),
        locality: dataPoint("Sellersburg", "Demo Data", "Locality"),
        subdName: dataPoint("Market West", "Demo Data", "Subdivision Name"),
      },
      "Legal Description": {
        legal1: dataPoint("Lot 1, Block A, Market West Subdivision, City of Philadelphia, PA", "Demo Data", "Legal Description"),
      },
      "Regulatory Status": {
        "Zoning Classification": {
          siteZoningIdent: dataPoint("CMX-5", "Demo Data", "Site Zoning Identifier"),
          zoningType: dataPoint("Central Business District", "Demo Data", "Zoning Type"),
          zoneName: dataPoint("Market West", "Demo Data", "Zone Name"),
          zoneSubType: dataPoint("Commercial", "Demo Data", "Zone Subtype"),
        },
        "Overlay Districts": {
          overlayDistricts: dataPoint("Center City Commercial Area", "Demo Data", "Overlay Districts"),
        },
      },
      "Tax Status": {
        taxCodeArea: dataPoint("15-0023", "Demo Data", "Tax Code Area"),
        taxAmt: dataPoint(145000, "Demo Data", "Tax Amount"),
        taxYear: dataPoint(2023, "Demo Data", "Tax Year"),
      },
      "Tax Deliquincy": {
        taxDeliquincy: dataPoint("None", "Demo Data", "Tax Deliquincy"),
      },
    },
    "Physical Site Characteristics": {
      "Lot Configuration": {
        "Dimensional Analysis": {
          depth: dataPoint("250 ft", "Demo Data", "Depth"),
          frontage: dataPoint("180 ft", "Demo Data", "Frontage"),
        },
        "Topographical Profile": {
          elevationDelta: dataPoint("5 ft", "Demo Data", "Elevation Delta"),
          slope: dataPoint("2%", "Demo Data", "Slope"),
        },
      },
      "Easements & Encumbrances": {
        "Recorded Easements": {
          recordedEasements: dataPoint("Utility easement on north property line, 15 ft width", "Demo Data", "Recorded Easements"),
        },
        "Deed Restrictions": {
          deedRestrictions: dataPoint("None", "Demo Data", "Deed Restrictions"),
        },
      },
      "Structural Inventory": {
        "Existing Improvements": {
          existingImprovements: dataPoint("35-story office tower", "Demo Data", "Existing Improvements"),
          yearBuilt: dataPoint(1985, "Demo Data", "Year Built"),
        },
        "Building Metrics": {
          bldgSize: dataPoint("850,000 sq ft", "Demo Data", "Building Size"),
          horizontalFootprint: dataPoint("65,000 sq ft", "Demo Data", "Horizontal Footprint"),
          totalStructureCount: dataPoint(1, "Demo Data", "Total Structure Count"),
        },
      },
    },
    "Zoning & Entitlements": {
      "Entitlement Status": {
        entitlementStatus: dataPoint("Fully entitled", "Demo Data", "Entitlement Status"),
      },
      "Current Approvals": {
        currentApprovals: dataPoint("All zoning approvals in place", "Demo Data", "Current Approvals"),
      },
      "Required Permits": {
        requiredPermits: dataPoint("Building permits required for renovations", "Demo Data", "Required Permits"),
      },
    },
    "Construction & Systems Profile": {
      "Structural Components": {
        foundationType: dataPoint("Concrete pilings", "Demo Data", "Foundation Type"),
        frameType: dataPoint("Steel frame", "Demo Data", "Frame Type"),
      },
      "Utilities": {
        powerProvider: dataPoint("PECO", "Demo Data", "Power Provider"),
        gasProvider: dataPoint("Philadelphia Gas Works", "Demo Data", "Gas Provider"),
        tcommProvider: dataPoint("Comcast", "Demo Data", "Telecommunications Provider"),
        waterProvider: dataPoint("Philadelphia Water Department", "Demo Data", "Water Provider"),
      },
    },
    "Environmental & Geotechnical": {
      "Environmental Assessment": {
        environmentalAssessment: dataPoint("Phase I complete, no issues identified", "Demo Data", "Environmental Assessment"),
      },
      "Phase I ESA Findings (2024)": {
        phaseIESA: dataPoint("No RECs identified", "Demo Data", "Phase I ESA"),
      },
      "Soil Contamination": {
        soilContamination: dataPoint("None detected", "Demo Data", "Soil Contamination"),
      },
      "Flood Risk Assessment": {
        floodRiskAssessment: dataPoint("Low risk", "Demo Data", "Flood Risk Assessment"),
      },
      "FEMA Designation": {
        femaDesignation: dataPoint("Zone X", "Demo Data", "FEMA Designation"),
      },
      "Mitigation Requirements": {
        mitigationRequirements: dataPoint("None required", "Demo Data", "Mitigation Requirements"),
      },
    },
    "Development Economics": {
      "Current Use Analysis": {
        value: dataPoint("Class A office building with retail", "Demo Data", "Current Use Analysis"),
        officeRents: dataPoint("$35-45 psf", "Demo Data", "Office Rents"),
        NOI: dataPoint("$3.2M annually", "Demo Data", "NOI"),
        capRate: dataPoint("6.5%", "Demo Data", "Cap Rate"),
      },
      "Reuse Potential": {
        reusePotential: dataPoint("High potential for mixed-use redevelopment", "Demo Data", "Development Feasibility"),
      },
      "Tax History & Projections": {
        taxHistory: dataPoint("Property taxes have increased 3% annually over the past 5 years", "Demo Data", "Tax History"),
      },
    },
    "Insurance & Risk Assessment": {
      "Insurance Profile": {
        currentCoverage: dataPoint("Standard commercial property insurance", "Demo Data", "Current Coverage"),
        lossHistory: dataPoint("No significant claims in past 5 years", "Demo Data", "Loss History"),
      },
      "Risk Assessment Matrix": {
        riskAssessmentMatrix: dataPoint("Low overall risk profile", "Demo Data", "Risk Factors"),
      },
    },
  },

  "1206 W 186th St, Westfield, IN 46074, USA": {
    "Property Identification & Legal Framework": {
      "Geospatial Information": {
        latitude: dataPoint(40.0584, "Demo Data", "Latitude"),
        longitude: dataPoint(-86.1822, "Demo Data", "Longitude"),
        munName: dataPoint("Westfield", "Demo Data", "Municipality Name"),
        lotSize1: dataPoint("2.11 acres", "Demo Data", "Lot Size 1"),
        lotSize2: dataPoint("91,911 sq ft", "Demo Data", "Lot Size 2"),
        lotNum: dataPoint("A-1234", "Demo Data", "Lot Number"),
        country: dataPoint("United States", "Demo Data", "Country"),
        countrySubd: dataPoint("Pennsylvania", "Demo Data", "Country Subdivision"),
        oneline: dataPoint("1500 Market St. Philadelphia, PA 19102", "Demo Data", "One Line Address"),
        locality: dataPoint("Sellersburg", "Demo Data", "Locality"),
        subdName: dataPoint("Market West", "Demo Data", "Subdivision Name"),
      },
      "Legal Description": {
        legal1: dataPoint("Lot 1, Block A, Market West Subdivision, City of Philadelphia, PA", "Demo Data", "Legal Description"),
      },
      "Regulatory Status": {
        "Zoning Classification": {
          siteZoningIdent: dataPoint("CMX-5", "Demo Data", "Site Zoning Identifier"),
          zoningType: dataPoint("Central Business District", "Demo Data", "Zoning Type"),
          zoneName: dataPoint("Market West", "Demo Data", "Zone Name"),
          zoneSubType: dataPoint("Commercial", "Demo Data", "Zone Subtype"),
        },
        "Overlay Districts": {
          overlayDistricts: dataPoint("Center City Commercial Area", "Demo Data", "Overlay Districts"),
        },
      },
      "Tax Status": {
        taxCodeArea: dataPoint("15-0023", "Demo Data", "Tax Code Area"),
        taxAmt: dataPoint(145000, "Demo Data", "Tax Amount"),
        taxYear: dataPoint(2023, "Demo Data", "Tax Year"),
      },
      "Tax Deliquincy": {
        taxDeliquincy: dataPoint("None", "Demo Data", "Tax Deliquincy"),
      },
    },
    "Physical Site Characteristics": {
      "Lot Configuration": {
        "Dimensional Analysis": {
          depth: dataPoint("250 ft", "Demo Data", "Depth"),
          frontage: dataPoint("180 ft", "Demo Data", "Frontage"),
        },
        "Topographical Profile": {
          elevationDelta: dataPoint("5 ft", "Demo Data", "Elevation Delta"),
          slope: dataPoint("2%", "Demo Data", "Slope"),
        },
      },
      "Easements & Encumbrances": {
        "Recorded Easements": {
          recordedEasements: dataPoint("Utility easement on north property line, 15 ft width", "Demo Data", "Recorded Easements"),
        },
        "Deed Restrictions": {
          deedRestrictions: dataPoint("None", "Demo Data", "Deed Restrictions"),
        },
      },
      "Structural Inventory": {
        "Existing Improvements": {
          existingImprovements: dataPoint("35-story office tower", "Demo Data", "Existing Improvements"),
          yearBuilt: dataPoint(1985, "Demo Data", "Year Built"),
        },
        "Building Metrics": {
          bldgSize: dataPoint("850,000 sq ft", "Demo Data", "Building Size"),
          horizontalFootprint: dataPoint("65,000 sq ft", "Demo Data", "Horizontal Footprint"),
          totalStructureCount: dataPoint(1, "Demo Data", "Total Structure Count"),
        },
      },
    },
    "Zoning & Entitlements": {
      "Entitlement Status": {
        entitlementStatus: dataPoint("Fully entitled", "Demo Data", "Entitlement Status"),
      },
      "Current Approvals": {
        currentApprovals: dataPoint("All zoning approvals in place", "Demo Data", "Current Approvals"),
      },
      "Required Permits": {
        requiredPermits: dataPoint("Building permits required for renovations", "Demo Data", "Required Permits"),
      },
    },
    "Construction & Systems Profile": {
      "Structural Components": {
        foundationType: dataPoint("Concrete pilings", "Demo Data", "Foundation Type"),
        frameType: dataPoint("Steel frame", "Demo Data", "Frame Type"),
      },
      "Utilities": {
        powerProvider: dataPoint("PECO", "Demo Data", "Power Provider"),
        gasProvider: dataPoint("Philadelphia Gas Works", "Demo Data", "Gas Provider"),
        tcommProvider: dataPoint("Comcast", "Demo Data", "Telecommunications Provider"),
        waterProvider: dataPoint("Philadelphia Water Department", "Demo Data", "Water Provider"),
      },
    },
    "Environmental & Geotechnical": {
      "Environmental Assessment": {
        environmentalAssessment: dataPoint("Phase I complete, no issues identified", "Demo Data", "Environmental Assessment"),
      },
      "Phase I ESA Findings (2024)": {
        phaseIESA: dataPoint("No RECs identified", "Demo Data", "Phase I ESA"),
      },
      "Soil Contamination": {
        soilContamination: dataPoint("None detected", "Demo Data", "Soil Contamination"),
      },
      "Flood Risk Assessment": {
        floodRiskAssessment: dataPoint("Low risk", "Demo Data", "Flood Risk Assessment"),
      },
      "FEMA Designation": {
        femaDesignation: dataPoint("Zone X", "Demo Data", "FEMA Designation"),
      },
      "Mitigation Requirements": {
        mitigationRequirements: dataPoint("None required", "Demo Data", "Mitigation Requirements"),
      },
    },
    "Development Economics": {
      "Current Use Analysis": {
        value: dataPoint("Class A office building with retail", "Demo Data", "Current Use Analysis"),
        officeRents: dataPoint("$35-45 psf", "Demo Data", "Office Rents"),
        NOI: dataPoint("$3.2M annually", "Demo Data", "NOI"),
        capRate: dataPoint("6.5%", "Demo Data", "Cap Rate"),
      },
      "Reuse Potential": {
        reusePotential: dataPoint("High potential for mixed-use redevelopment", "Demo Data", "Development Feasibility"),
      },
      "Tax History & Projections": {
        taxHistory: dataPoint("Property taxes have increased 3% annually over the past 5 years", "Demo Data", "Tax History"),
      },
    },
    "Insurance & Risk Assessment": {
      "Insurance Profile": {
        currentCoverage: dataPoint("Standard commercial property insurance", "Demo Data", "Current Coverage"),
        lossHistory: dataPoint("No significant claims in past 5 years", "Demo Data", "Loss History"),
      },
      "Risk Assessment Matrix": {
        riskAssessmentMatrix: dataPoint("Low overall risk profile", "Demo Data", "Risk Factors"),
      },
    },
  }
} 