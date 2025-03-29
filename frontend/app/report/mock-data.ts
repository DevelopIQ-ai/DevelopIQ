import { GeneralPropertyInfo } from "@/schemas/views/general-property-info-schema"
import { DevelopmentInfo } from "@/schemas/views/development-info-schema"

// Define 5 demo properties with coordinates
export const DEMO_PROPERTIES = [
  {
    address: "7315 Hwy 311, Sellersburg, IN 47172, USA",
  },
  {
    address: "1206 W 186th St, Westfield, IN 46074, USA",
  },
  {
    address: "238 Easy St, Bargersville, IN 46106, USA"
  }
]

// Create a general info data point helper
const dataPoint = (value: string | number | null, source: string | null = "Demo Data", alias?: string) => ({
  value,
  source,
  alias: alias || "Property Data"
})

interface MockPropertyData {
  "General Property Information": GeneralPropertyInfo,
  "Development Information": DevelopmentInfo,
}

// Mock property data for each address
export const mockPropertyData: Record<string, MockPropertyData> = {
  "7315 Hwy 311, Sellersburg, IN 47172, USA": {
    "General Property Information": {
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
    "Development Information": {
        "Permitted Uses": [
        {
          "primary_use_classification": dataPoint("Residential Primary Uses", "Demo Data", "Primary Use Classification"),
          "permitted_uses": [
              dataPoint("Dwelling - Bungalow Court", "Demo Data", "Permitted Uses"),
              dataPoint("Dwelling - Townhouse", "Demo Data", "Permitted Uses"),
              dataPoint("Dwelling - Apartment Building: Small", "Demo Data", "Permitted Uses"),
              dataPoint("Dwelling - Apartment Building: Large", "Demo Data", "Permitted Uses"),
              dataPoint("Live/Work Dwelling", "Demo Data", "Permitted Uses"),
              dataPoint("Upper Story Residential", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Dwelling - Single-Family Detached: Standard", "Demo Data", "Special Exceptions"),
              dataPoint("Dwelling - Single-Family Detached: Compact", "Demo Data", "Special Exceptions"),
              dataPoint("Dwelling - Duplex", "Demo Data", "Special Exceptions"),
              dataPoint("Accessory Dwelling Unit", "Demo Data", "Special Exceptions"),
              dataPoint("Assissted Living Facilities", "Demo Data", "Special Exceptions"),
              dataPoint("Childcare Home", "Demo Data", "Special Exceptions"),
              dataPoint("Group Residential Facility", "Demo Data", "Special Exceptions"),
              dataPoint("Rooming or Boarding House", "Demo Data", "Special Exceptions"),
            ]
          },
          {
            "primary_use_classification": dataPoint("Civic, Public, and Institutional Primary Uses", "Demo Data", "Primary Use Classification"),
            "permitted_uses": [
              dataPoint("Libraries, Museums, and Cultural Facilities", "Demo Data", "Permitted Uses"),
              dataPoint("Municipal and Government Buildings", "Demo Data", "Permitted Uses"),
              dataPoint("Parks and Playgrounds", "Demo Data", "Permitted Uses"),
              dataPoint("Commercial Studios", "Demo Data", "Permitted Uses"),
              dataPoint("Club or Lodge", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Utility, Minor Impact", "Demo Data", "Special Exceptions"),
              dataPoint("Childcare Facility", "Demo Data", "Special Exceptions"),
              dataPoint("Community Center", "Demo Data", "Special Exceptions"),
              dataPoint("Hospital, Minor", "Demo Data", "Special Exceptions"),
              dataPoint("Colleges and Universities", "Demo Data", "Special Exceptions"),
              dataPoint("Vocational Schools", "Demo Data", "Special Exceptions"),
              dataPoint("Banquet Facilities and Reception Halls", "Demo Data", "Special Exceptions"),
              dataPoint("Places of Worship", "Demo Data", "Special Exceptions"),
              dataPoint("Public and Religous Asswmbly, All Others", "Demo Data", "Special Exceptions"),
            ]
          },
          {
            "primary_use_classification": dataPoint("Commercial Sales, Services, and Repair Primary Uses ", "Demo Data", "Primary Use Classification"),
            "permitted_uses": [
              dataPoint("Arts, Recreation, Entertainment, Indoor", "Demo Data", "Permitted Uses"),
              dataPoint("Restaurants - Class A (table service)", "Demo Data", "Permitted Uses"),
              dataPoint("Restaurants - Class B (counter service, no drive-thru)", "Demo Data", "Permitted Uses"),
              dataPoint("Taverns", "Demo Data", "Permitted Uses"),
              dataPoint("Winery and Microbrewery", "Demo Data", "Permitted Uses"),
              dataPoint("Dental/Medical Offuce or Clinic", "Demo Data", "Permitted Uses"),
              dataPoint("Banks and Financial Institutions", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Arts, Recreation, Entertainment, Outdoor", "Demo Data", "Special Exceptions"),
              dataPoint("Sports and/or Entertainment Arena or Stadium", "Demo Data", "Special Exceptions"),
              dataPoint("Parking Garage", "Demo Data", "Special Exceptions"),
              dataPoint("Parking Lot", "Demo Data", "Special Exceptions"),
              dataPoint("Restaurants - Class C (counter service w/drive-thru)", "Demo Data", "Special Exceptions"),
              dataPoint("Bed and Breakfast Establishments", "Demo Data", "Special Exceptions"),
              dataPoint("Hotel or Motel", "Demo Data", "Special Exceptions"),
              dataPoint("Animal Sales and Services, Household Pets Only", "Demo Data", "Special Exceptions"),
              dataPoint("Food Catering Service", "Demo Data", "Special Exceptions"),
            ]
          },
          {
            "primary_use_classification": dataPoint("Industrial, Manufacturing, and Wholesale Primary Uses", "Demo Data", "Primary Use Classification"),
            "permitted_uses": [
              dataPoint("Grain and Feed Mills", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Mass Transit Facility", "Demo Data", "Special Exceptions"),
              dataPoint("Recycling Drop-Off Facility", "Demo Data", "Special Exceptions"),
            ]
          }
        ],
        "Development Standards": {
          "Lot Requirements": {
            "Maximum Density": {
              "units_per_acre": dataPoint(10, "Demo Data", "Units per Acre"),
            },
            "Minimum Lot Size": {
              "square_feet": dataPoint(1000, "Demo Data", "Minimum Lot Size"),
            },
            "Minimum Lot Width": {
              "feet": dataPoint(100, "Demo Data", "Minimum Lot Width"),
            },
            "Minimum Lot Frontage": {
              "feet": dataPoint(100, "Demo Data", "Minimum Lot Frontage"),
            },
            "Minimum Living Area": {
              "square_feet": dataPoint(1000, "Demo Data", "Minimum Living Area"),
            }
          },
          "Building Placement Requirements": {
            "Minimum Front Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Front Setback"),
            },
            "Minimum Street Side Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Street Side Setback"),
            },
            "Minimum Side Yard Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Side Yard Setback"),
            },
            "Minimum Rear Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Rear Setback"),
            },
            "Accessory Building Setback": {
              "feet": dataPoint(100, "Demo Data", "Accessory Building Setback"),
            }
          },
          "Building Requirements": {
            "Maximum Building Height": {
              "feet": dataPoint(100, "Demo Data", "Maximum Building Height"),
            },
            "Maximum Lot Coverage": {
              "percentage": dataPoint(100, "Demo Data", "Maximum Lot Coverage"),
            }
          },
          "Landscaping Requirements": {
            "Minimum Plant Sizes": {
              "feet": dataPoint(100, "Demo Data", "Minimum Plant Sizes"),
            },
            "Landscape Plan Review Summary": {
              "summary": dataPoint("A summary outlining the requirements or review criteria for the landscaping plan.", "Demo Data", "Landscape Plan Review Summary"),
            },
            "Species Variation Requirement Summary": {
              "summary": dataPoint("A description of the requirements for species diversity in the landscaping plan.", "Demo Data", "Species Variation Requirement Summary"),
            },
            "Performance Guarantee Warranty Requirements Summary": {
              "summary": dataPoint("A summary of any performance guarantee or warranty requirements related to landscaping.", "Demo Data", "Performance Guarantee Warranty Requirements Summary"),
            }
          },
          "Parking Requirements": {
            "Minimum Aisle Width": {
              "feet": dataPoint(100, "Demo Data", "Minimum Aisle Width"),
            },
            "Curbing Requirements": {
              "summary": dataPoint("A description of the curbing standards and specifications for the parking lot.", "Demo Data", "Curbing Requirements"),
            },
            "Striping Requirements": {
              "summary": dataPoint("A summary of the requirements for parking lot striping, including layout and dimensions.", "Demo Data", "Striping Requirements"),
            },
            "Drainage Requirements": {
              "summary": dataPoint("A summary of the drainage standards that must be met within the parking area.", "Demo Data", "Drainage Requirements"),
            },
            "Parking Stalls Required": {
              "summary": dataPoint("A description of the number or configuration of parking stalls required, including any specifics such as ADA stalls.", "Demo Data", "Parking Stalls Required"),
            }
          },
          "Signage Requirements": {
            "Permitted Sign Types": {
              "summary": dataPoint("A summary of the types of signs that are allowed under the zoning or planning guidelines.", "Demo Data", "Permitted Sign Types"),
            },
            "Prohibited Sign Types": {
              "summary": dataPoint("A summary of the types of signs that are not allowed under the zoning or planning guidelines.", "Demo Data", "Prohibited Sign Types"),
            },
            "Design Requirements": {
              "summary": dataPoint("A description of the design requirements for signage, including specifications on size, color, and shape.", "Demo Data", "Design Requirements"),
            }
          }
        }
      }
  },
  "1206 W 186th St, Westfield, IN 46074, USA": {
    "General Property Information": {
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
    "Development Information": {
        "Permitted Uses": [
        {
          "primary_use_classification": dataPoint("Residential Primary Uses", "Demo Data", "Primary Use Classification"),
          "permitted_uses": [
              dataPoint("Dwelling - Bungalow Court", "Demo Data", "Permitted Uses"),
              dataPoint("Dwelling - Townhouse", "Demo Data", "Permitted Uses"),
              dataPoint("Dwelling - Apartment Building: Small", "Demo Data", "Permitted Uses"),
              dataPoint("Dwelling - Apartment Building: Large", "Demo Data", "Permitted Uses"),
              dataPoint("Live/Work Dwelling", "Demo Data", "Permitted Uses"),
              dataPoint("Upper Story Residential", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Dwelling - Single-Family Detached: Standard", "Demo Data", "Special Exceptions"),
              dataPoint("Dwelling - Single-Family Detached: Compact", "Demo Data", "Special Exceptions"),
              dataPoint("Dwelling - Duplex", "Demo Data", "Special Exceptions"),
              dataPoint("Accessory Dwelling Unit", "Demo Data", "Special Exceptions"),
              dataPoint("Assissted Living Facilities", "Demo Data", "Special Exceptions"),
              dataPoint("Childcare Home", "Demo Data", "Special Exceptions"),
              dataPoint("Group Residential Facility", "Demo Data", "Special Exceptions"),
              dataPoint("Rooming or Boarding House", "Demo Data", "Special Exceptions"),
            ]
          },
          {
            "primary_use_classification": dataPoint("Civic, Public, and Institutional Primary Uses", "Demo Data", "Primary Use Classification"),
            "permitted_uses": [
              dataPoint("Libraries, Museums, and Cultural Facilities", "Demo Data", "Permitted Uses"),
              dataPoint("Municipal and Government Buildings", "Demo Data", "Permitted Uses"),
              dataPoint("Parks and Playgrounds", "Demo Data", "Permitted Uses"),
              dataPoint("Commercial Studios", "Demo Data", "Permitted Uses"),
              dataPoint("Club or Lodge", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Utility, Minor Impact", "Demo Data", "Special Exceptions"),
              dataPoint("Childcare Facility", "Demo Data", "Special Exceptions"),
              dataPoint("Community Center", "Demo Data", "Special Exceptions"),
              dataPoint("Hospital, Minor", "Demo Data", "Special Exceptions"),
              dataPoint("Colleges and Universities", "Demo Data", "Special Exceptions"),
              dataPoint("Vocational Schools", "Demo Data", "Special Exceptions"),
              dataPoint("Banquet Facilities and Reception Halls", "Demo Data", "Special Exceptions"),
              dataPoint("Places of Worship", "Demo Data", "Special Exceptions"),
              dataPoint("Public and Religous Asswmbly, All Others", "Demo Data", "Special Exceptions"),
            ]
          },
          {
            "primary_use_classification": dataPoint("Commercial Sales, Services, and Repair Primary Uses ", "Demo Data", "Primary Use Classification"),
            "permitted_uses": [
              dataPoint("Arts, Recreation, Entertainment, Indoor", "Demo Data", "Permitted Uses"),
              dataPoint("Restaurants - Class A (table service)", "Demo Data", "Permitted Uses"),
              dataPoint("Restaurants - Class B (counter service, no drive-thru)", "Demo Data", "Permitted Uses"),
              dataPoint("Taverns", "Demo Data", "Permitted Uses"),
              dataPoint("Winery and Microbrewery", "Demo Data", "Permitted Uses"),
              dataPoint("Dental/Medical Offuce or Clinic", "Demo Data", "Permitted Uses"),
              dataPoint("Banks and Financial Institutions", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Arts, Recreation, Entertainment, Outdoor", "Demo Data", "Special Exceptions"),
              dataPoint("Sports and/or Entertainment Arena or Stadium", "Demo Data", "Special Exceptions"),
              dataPoint("Parking Garage", "Demo Data", "Special Exceptions"),
              dataPoint("Parking Lot", "Demo Data", "Special Exceptions"),
              dataPoint("Restaurants - Class C (counter service w/drive-thru)", "Demo Data", "Special Exceptions"),
              dataPoint("Bed and Breakfast Establishments", "Demo Data", "Special Exceptions"),
              dataPoint("Hotel or Motel", "Demo Data", "Special Exceptions"),
              dataPoint("Animal Sales and Services, Household Pets Only", "Demo Data", "Special Exceptions"),
              dataPoint("Food Catering Service", "Demo Data", "Special Exceptions"),
            ]
          },
          {
            "primary_use_classification": dataPoint("Industrial, Manufacturing, and Wholesale Primary Uses", "Demo Data", "Primary Use Classification"),
            "permitted_uses": [
              dataPoint("Grain and Feed Mills", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Mass Transit Facility", "Demo Data", "Special Exceptions"),
              dataPoint("Recycling Drop-Off Facility", "Demo Data", "Special Exceptions"),
            ]
          }
        ],
        "Development Standards": {
          "Lot Requirements": {
            "Maximum Density": {
              "units_per_acre": dataPoint(10, "Demo Data", "Units per Acre"),
            },
            "Minimum Lot Size": {
              "square_feet": dataPoint(1000, "Demo Data", "Minimum Lot Size"),
            },
            "Minimum Lot Width": {
              "feet": dataPoint(100, "Demo Data", "Minimum Lot Width"),
            },
            "Minimum Lot Frontage": {
              "feet": dataPoint(100, "Demo Data", "Minimum Lot Frontage"),
            },
            "Minimum Living Area": {
              "square_feet": dataPoint(1000, "Demo Data", "Minimum Living Area"),
            }
          },
          "Building Placement Requirements": {
            "Minimum Front Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Front Setback"),
            },
            "Minimum Street Side Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Street Side Setback"),
            },
            "Minimum Side Yard Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Side Yard Setback"),
            },
            "Minimum Rear Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Rear Setback"),
            },
            "Accessory Building Setback": {
              "feet": dataPoint(100, "Demo Data", "Accessory Building Setback"),
            }
          },
          "Building Requirements": {
            "Maximum Building Height": {
              "feet": dataPoint(100, "Demo Data", "Maximum Building Height"),
            },
            "Maximum Lot Coverage": {
              "percentage": dataPoint(100, "Demo Data", "Maximum Lot Coverage"),
            }
          },
          "Landscaping Requirements": {
            "Minimum Plant Sizes": {
              "feet": dataPoint(100, "Demo Data", "Minimum Plant Sizes"),
            },
            "Landscape Plan Review Summary": {
              "summary": dataPoint("A summary outlining the requirements or review criteria for the landscaping plan.", "Demo Data", "Landscape Plan Review Summary"),
            },
            "Species Variation Requirement Summary": {
              "summary": dataPoint("A description of the requirements for species diversity in the landscaping plan.", "Demo Data", "Species Variation Requirement Summary"),
            },
            "Performance Guarantee Warranty Requirements Summary": {
              "summary": dataPoint("A summary of any performance guarantee or warranty requirements related to landscaping.", "Demo Data", "Performance Guarantee Warranty Requirements Summary"),
            }
          },
          "Parking Requirements": {
            "Minimum Aisle Width": {
              "feet": dataPoint(100, "Demo Data", "Minimum Aisle Width"),
            },
            "Curbing Requirements": {
              "summary": dataPoint("A description of the curbing standards and specifications for the parking lot.", "Demo Data", "Curbing Requirements"),
            },
            "Striping Requirements": {
              "summary": dataPoint("A summary of the requirements for parking lot striping, including layout and dimensions.", "Demo Data", "Striping Requirements"),
            },
            "Drainage Requirements": {
              "summary": dataPoint("A summary of the drainage standards that must be met within the parking area.", "Demo Data", "Drainage Requirements"),
            },
            "Parking Stalls Required": {
              "summary": dataPoint("A description of the number or configuration of parking stalls required, including any specifics such as ADA stalls.", "Demo Data", "Parking Stalls Required"),
            }
          },
          "Signage Requirements": {
            "Permitted Sign Types": {
              "summary": dataPoint("A summary of the types of signs that are allowed under the zoning or planning guidelines.", "Demo Data", "Permitted Sign Types"),
            },
            "Prohibited Sign Types": {
              "summary": dataPoint("A summary of the types of signs that are not allowed under the zoning or planning guidelines.", "Demo Data", "Prohibited Sign Types"),
            },
            "Design Requirements": {
              "summary": dataPoint("A description of the design requirements for signage, including specifications on size, color, and shape.", "Demo Data", "Design Requirements"),
            }
          }
        }
      }
  },
  "238 Easy St, Bargersville, IN 46106, USA": {
    "General Property Information": {
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
    "Development Information": {
        "Permitted Uses": [
        {
          "primary_use_classification": dataPoint("Residential Primary Uses", "Demo Data", "Primary Use Classification"),
          "permitted_uses": [
              dataPoint("Dwelling - Bungalow Court", "Demo Data", "Permitted Uses"),
              dataPoint("Dwelling - Townhouse", "Demo Data", "Permitted Uses"),
              dataPoint("Dwelling - Apartment Building: Small", "Demo Data", "Permitted Uses"),
              dataPoint("Dwelling - Apartment Building: Large", "Demo Data", "Permitted Uses"),
              dataPoint("Live/Work Dwelling", "Demo Data", "Permitted Uses"),
              dataPoint("Upper Story Residential", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Dwelling - Single-Family Detached: Standard", "Demo Data", "Special Exceptions"),
              dataPoint("Dwelling - Single-Family Detached: Compact", "Demo Data", "Special Exceptions"),
              dataPoint("Dwelling - Duplex", "Demo Data", "Special Exceptions"),
              dataPoint("Accessory Dwelling Unit", "Demo Data", "Special Exceptions"),
              dataPoint("Assissted Living Facilities", "Demo Data", "Special Exceptions"),
              dataPoint("Childcare Home", "Demo Data", "Special Exceptions"),
              dataPoint("Group Residential Facility", "Demo Data", "Special Exceptions"),
              dataPoint("Rooming or Boarding House", "Demo Data", "Special Exceptions"),
            ]
          },
          {
            "primary_use_classification": dataPoint("Civic, Public, and Institutional Primary Uses", "Demo Data", "Primary Use Classification"),
            "permitted_uses": [
              dataPoint("Libraries, Museums, and Cultural Facilities", "Demo Data", "Permitted Uses"),
              dataPoint("Municipal and Government Buildings", "Demo Data", "Permitted Uses"),
              dataPoint("Parks and Playgrounds", "Demo Data", "Permitted Uses"),
              dataPoint("Commercial Studios", "Demo Data", "Permitted Uses"),
              dataPoint("Club or Lodge", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Utility, Minor Impact", "Demo Data", "Special Exceptions"),
              dataPoint("Childcare Facility", "Demo Data", "Special Exceptions"),
              dataPoint("Community Center", "Demo Data", "Special Exceptions"),
              dataPoint("Hospital, Minor", "Demo Data", "Special Exceptions"),
              dataPoint("Colleges and Universities", "Demo Data", "Special Exceptions"),
              dataPoint("Vocational Schools", "Demo Data", "Special Exceptions"),
              dataPoint("Banquet Facilities and Reception Halls", "Demo Data", "Special Exceptions"),
              dataPoint("Places of Worship", "Demo Data", "Special Exceptions"),
              dataPoint("Public and Religous Asswmbly, All Others", "Demo Data", "Special Exceptions"),
            ]
          },
          {
            "primary_use_classification": dataPoint("Commercial Sales, Services, and Repair Primary Uses ", "Demo Data", "Primary Use Classification"),
            "permitted_uses": [
              dataPoint("Arts, Recreation, Entertainment, Indoor", "Demo Data", "Permitted Uses"),
              dataPoint("Restaurants - Class A (table service)", "Demo Data", "Permitted Uses"),
              dataPoint("Restaurants - Class B (counter service, no drive-thru)", "Demo Data", "Permitted Uses"),
              dataPoint("Taverns", "Demo Data", "Permitted Uses"),
              dataPoint("Winery and Microbrewery", "Demo Data", "Permitted Uses"),
              dataPoint("Dental/Medical Offuce or Clinic", "Demo Data", "Permitted Uses"),
              dataPoint("Banks and Financial Institutions", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Arts, Recreation, Entertainment, Outdoor", "Demo Data", "Special Exceptions"),
              dataPoint("Sports and/or Entertainment Arena or Stadium", "Demo Data", "Special Exceptions"),
              dataPoint("Parking Garage", "Demo Data", "Special Exceptions"),
              dataPoint("Parking Lot", "Demo Data", "Special Exceptions"),
              dataPoint("Restaurants - Class C (counter service w/drive-thru)", "Demo Data", "Special Exceptions"),
              dataPoint("Bed and Breakfast Establishments", "Demo Data", "Special Exceptions"),
              dataPoint("Hotel or Motel", "Demo Data", "Special Exceptions"),
              dataPoint("Animal Sales and Services, Household Pets Only", "Demo Data", "Special Exceptions"),
              dataPoint("Food Catering Service", "Demo Data", "Special Exceptions"),
            ]
          },
          {
            "primary_use_classification": dataPoint("Industrial, Manufacturing, and Wholesale Primary Uses", "Demo Data", "Primary Use Classification"),
            "permitted_uses": [
              dataPoint("Grain and Feed Mills", "Demo Data", "Permitted Uses"),
            ],
            "special_exceptions": [
              dataPoint("Mass Transit Facility", "Demo Data", "Special Exceptions"),
              dataPoint("Recycling Drop-Off Facility", "Demo Data", "Special Exceptions"),
            ]
          }
        ],
        "Development Standards": {
          "Lot Requirements": {
            "Maximum Density": {
              "units_per_acre": dataPoint(10, "Demo Data", "Units per Acre"),
            },
            "Minimum Lot Size": {
              "square_feet": dataPoint(1000, "Demo Data", "Minimum Lot Size"),
            },
            "Minimum Lot Width": {
              "feet": dataPoint(100, "Demo Data", "Minimum Lot Width"),
            },
            "Minimum Lot Frontage": {
              "feet": dataPoint(100, "Demo Data", "Minimum Lot Frontage"),
            },
            "Minimum Living Area": {
              "square_feet": dataPoint(1000, "Demo Data", "Minimum Living Area"),
            }
          },
          "Building Placement Requirements": {
            "Minimum Front Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Front Setback"),
            },
            "Minimum Street Side Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Street Side Setback"),
            },
            "Minimum Side Yard Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Side Yard Setback"),
            },
            "Minimum Rear Setback": {
              "feet": dataPoint(100, "Demo Data", "Minimum Rear Setback"),
            },
            "Accessory Building Setback": {
              "feet": dataPoint(100, "Demo Data", "Accessory Building Setback"),
            }
          },
          "Building Requirements": {
            "Maximum Building Height": {
              "feet": dataPoint(100, "Demo Data", "Maximum Building Height"),
            },
            "Maximum Lot Coverage": {
              "percentage": dataPoint(100, "Demo Data", "Maximum Lot Coverage"),
            }
          },
          "Landscaping Requirements": {
            "Minimum Plant Sizes": {
              "feet": dataPoint(100, "Demo Data", "Minimum Plant Sizes"),
            },
            "Landscape Plan Review Summary": {
              "summary": dataPoint("A summary outlining the requirements or review criteria for the landscaping plan.", "Demo Data", "Landscape Plan Review Summary"),
            },
            "Species Variation Requirement Summary": {
              "summary": dataPoint("A description of the requirements for species diversity in the landscaping plan.", "Demo Data", "Species Variation Requirement Summary"),
            },
            "Performance Guarantee Warranty Requirements Summary": {
              "summary": dataPoint("A summary of any performance guarantee or warranty requirements related to landscaping.", "Demo Data", "Performance Guarantee Warranty Requirements Summary"),
            }
          },
          "Parking Requirements": {
            "Minimum Aisle Width": {
              "feet": dataPoint(100, "Demo Data", "Minimum Aisle Width"),
            },
            "Curbing Requirements": {
              "summary": dataPoint("A description of the curbing standards and specifications for the parking lot.", "Demo Data", "Curbing Requirements"),
            },
            "Striping Requirements": {
              "summary": dataPoint("A summary of the requirements for parking lot striping, including layout and dimensions.", "Demo Data", "Striping Requirements"),
            },
            "Drainage Requirements": {
              "summary": dataPoint("A summary of the drainage standards that must be met within the parking area.", "Demo Data", "Drainage Requirements"),
            },
            "Parking Stalls Required": {
              "summary": dataPoint("A description of the number or configuration of parking stalls required, including any specifics such as ADA stalls.", "Demo Data", "Parking Stalls Required"),
            }
          },
          "Signage Requirements": {
            "Permitted Sign Types": {
              "summary": dataPoint("A summary of the types of signs that are allowed under the zoning or planning guidelines.", "Demo Data", "Permitted Sign Types"),
            },
            "Prohibited Sign Types": {
              "summary": dataPoint("A summary of the types of signs that are not allowed under the zoning or planning guidelines.", "Demo Data", "Prohibited Sign Types"),
            },
            "Design Requirements": {
              "summary": dataPoint("A description of the design requirements for signage, including specifications on size, color, and shape.", "Demo Data", "Design Requirements"),
            }
          }
        }
      }
  }
} 