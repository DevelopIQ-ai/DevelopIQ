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
  value: value?.toString() ?? "",
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
  "document_id": "demo_document",
  "zone_code": "CMX-5",
  "results": {
    "lot_requirements": {
      "maximum_density": {
        "answer": "10 units per acre is the maximum density allowed.",
        "section_list": ["Demo Section 1.1"],
        "chunks": []
      },
      "minimum_lot_size": {
        "answer": "1000 square feet is the minimum lot size required.",
        "section_list": ["Demo Section 1.2"],
        "chunks": []
      },
      "minimum_lot_width": {
        "answer": "100 feet is the minimum lot width required.",
        "section_list": ["Demo Section 1.3"],
        "chunks": []
      },
      "minimum_lot_frontage": {
        "answer": "100 feet of street frontage is required for all lots.",
        "section_list": ["Demo Section 1.4"],
        "chunks": []
      },
      "minimum_living_area": {
        "answer": "1000 square feet minimum living area is required.",
        "section_list": ["Demo Section 1.5"],
        "chunks": []
      }
    },
    "building_placement_requirements": {
      "front_setback": {
        "answer": "100 feet minimum front setback is required.",
        "section_list": ["Demo Section 2.1"],
        "chunks": []
      },
      "street_side_setback": {
        "answer": "100 feet minimum street side setback is required for corner lots.",
        "section_list": ["Demo Section 2.2"],
        "chunks": []
      },
      "side_yard_setback": {
        "answer": "100 feet minimum side yard setback is required.",
        "section_list": ["Demo Section 2.3"],
        "chunks": []
      },
      "rear_setback": {
        "answer": "100 feet minimum rear setback is required.",
        "section_list": ["Demo Section 2.4"],
        "chunks": []
      },
      "accessory_building_setback": {
        "answer": "100 feet minimum accessory building setback is required.",
        "section_list": ["Demo Section 2.5"],
        "chunks": []
      }
    },
    "building_requirements": {
      "maximum_building_height": {
        "answer": "100 feet is the maximum building height allowed.",
        "section_list": ["Demo Section 3.1"],
        "chunks": []
      },
      "maximum_lot_coverage": {
        "answer": "100% maximum lot coverage is permitted.",
        "section_list": ["Demo Section 3.2"],
        "chunks": []
      }
    },
    "landscaping_requirements": {
      "plant_sizes": {
        "answer": "Minimum plant size is 100 feet.",
        "section_list": ["Demo Section 4.1"],
        "chunks": []
      },
      "landscape_plan_review": {
        "answer": "The landscape plan review process involves submitting detailed plans showing proposed plants, plant tables, compliance calculations, existing features, tree management, and contours at two-foot intervals.",
        "section_list": ["Demo Section 4.2"],
        "chunks": []
      },
      "species_variation": {
        "answer": "No single species of tree or shrub can constitute more than 35% of the total number of that plant type.",
        "section_list": ["Demo Section 4.3"],
        "chunks": []
      },
      "performance_guarantee": {
        "answer": "A financial guarantee is required to ensure landscaping is installed according to plan, with installation before certificate of occupancy or within 120 days due to weather delays.",
        "section_list": ["Demo Section 4.4"],
        "chunks": []
      }
    },
    "parking_requirements": {
      "aisle_width": {
        "answer": "100 feet minimum aisle width is required.",
        "section_list": ["Demo Section 5.1"],
        "chunks": []
      },
      "curbing_requirements": {
        "answer": "Curbs and gutters must be built around parking facilities and landscape islands to prevent vehicles from extending beyond the parking area.",
        "section_list": ["Demo Section 5.2"],
        "chunks": []
      },
      "striping_requirements": {
        "answer": "Parking areas must be striped and maintained to clearly identify each parking space.",
        "section_list": ["Demo Section 5.3"],
        "chunks": []
      },
      "drainage_requirements": {
        "answer": "Parking areas must be graded and drained to prevent water flow onto adjacent properties or sidewalks, with runoff collected in appropriate drainage facilities.",
        "section_list": ["Demo Section 5.4"],
        "chunks": []
      },
      "parking_stalls": {
        "answer": "The number of required parking spaces is based on factors such as number of employees, expected customer traffic, or actual counts at similar establishments.",
        "section_list": ["Demo Section 5.5"],
        "chunks": []
      }
    },
    "signage_requirements": {
      "permitted_signs": {
        "answer": "Permitted signs include door signs and wall-mounted cabinet signs in non-residential districts.",
        "section_list": ["Demo Section 6.1"],
        "chunks": []
      },
      "prohibited_signs": {
        "answer": "Prohibited signs include abandoned signs, animated signs, balloon signs, billboards, pole signs, and signs within the right-of-way.",
        "section_list": ["Demo Section 6.2"],
        "chunks": []
      },
      "design_requirements": {
        "answer": "Sign design must be compatible with architecture and materials of the project, with specific requirements for illumination and size based on location and purpose.",
        "section_list": ["Demo Section 6.3"],
        "chunks": []
      }
    }
  }
}
  }
}

// Helper function to create development info mock data
// Helper function to create development info mock data
export const createDevelopmentInfoMockData = () => {
  return {
    "document_id": "mock_document",
    "zone_code": "R1",
    "results": {
      "lot_requirements": {
        "maximum_density": {
          "answer": "8 units per acre is the maximum density allowed in this zone.",
          "section_list": ["154.042", "154.050"],
          "chunks": []
        },
        "minimum_lot_size": {
          "answer": "5,000 square feet is the minimum lot size required for all residential developments.",
          "section_list": ["154.042"],
          "chunks": []
        },
        "minimum_lot_width": {
          "answer": "50 feet is the minimum lot width required.",
          "section_list": ["154.042"],
          "chunks": []
        },
        "minimum_lot_frontage": {
          "answer": "40 feet of street frontage is required for all residential lots.",
          "section_list": ["154.042", "154.045"],
          "chunks": []
        },
        "minimum_living_area": {
          "answer": "1,200 square feet minimum living area is required for single-family dwellings.",
          "section_list": ["154.048"],
          "chunks": []
        }
      },
      "building_placement_requirements": {
        "minimum_front_setback": {
          "answer": "25 feet minimum front setback is required from property line to structure.",
          "section_list": ["154.043"],
          "chunks": []
        },
        "minimum_street_side_setback": {
          "answer": "15 feet minimum street side setback is required for corner lots.",
          "section_list": ["154.043"],
          "chunks": []
        },
        "minimum_side_yard_setback": {
          "answer": "10 feet minimum side yard setback is required for interior lot lines.",
          "section_list": ["154.043"],
          "chunks": []
        },
        "minimum_rear_setback": {
          "answer": "20 feet minimum rear setback is required for primary structures.",
          "section_list": ["154.043"],
          "chunks": []
        },
        "accessory_building_setback": {
          "answer": "5 feet minimum setback is required for accessory buildings from side and rear property lines.",
          "section_list": ["154.044"],
          "chunks": []
        }
      },
      "building_requirements": {
        "maximum_building_height": {
          "answer": "35 feet is the maximum building height allowed for primary structures.",
          "section_list": ["154.046"],
          "chunks": []
        },
        "maximum_lot_coverage": {
          "answer": "40% maximum lot coverage by structures is permitted.",
          "section_list": ["154.047"],
          "chunks": []
        }
      },
      "landscaping_requirements": {
        "plant_sizes": {
          "answer": "Deciduous trees must be at least 2 inch caliper, evergreen trees must be at least 6 feet tall, and shrubs must be at least 18 inches tall at time of planting.",
          "section_list": ["154.090", "154.092"],
          "chunks": []
        },
        "landscape_plan_review": {
          "answer": "Landscape plans must be submitted as part of all site plan and permit applications, detailing perimeter areas, buffer yards, common areas, and entryways. Plans must show proposed plants, include a plant table listing scientific and common names, quantities, and sizes, and demonstrate compliance with requirements.",
          "section_list": ["154.091"],
          "chunks": []
        },
        "species_variation": {
          "answer": "No single species of tree or shrub can constitute more than 35% of the total number of that plant type.",
          "section_list": ["154.093"],
          "chunks": []
        },
        "performance_guarantee": {
          "answer": "A financial guarantee must be provided to ensure landscaping is installed according to approved plans. Landscaping must be installed before certificate of occupancy is issued, with possible delay up to 120 days due to adverse weather.",
          "section_list": ["154.161"],
          "chunks": []
        }
      },
      "parking_requirements": {
        "aisle_width": {
          "answer": "24 feet minimum aisle width required for 90-degree parking spaces, 18 feet for 60-degree parking, and 12 feet for parallel parking.",
          "section_list": ["154.110", "154.112"],
          "chunks": []
        },
        "curbing_requirements": {
          "answer": "Curbs and gutters must be built according to town construction standards around the perimeter of all parking facilities and landscape islands to prevent vehicles from extending beyond parking areas.",
          "section_list": ["154.115"],
          "chunks": []
        },
        "striping_requirements": {
          "answer": "Parking areas must be striped and maintained to clearly identify each parking space.",
          "section_list": ["154.116"],
          "chunks": []
        },
        "drainage_requirements": {
          "answer": "Parking areas must be graded and drained to ensure water does not flow onto adjacent property or public sidewalks. Runoff must be collected in appropriate drainage facilities according to town stormwater standards.",
          "section_list": ["154.117"],
          "chunks": []
        },
        "parking_stalls": {
          "answer": "For residential uses, 2 parking spaces per dwelling unit are required. For multi-family developments with more than 10 units, an additional visitor parking space is required per 4 units.",
          "section_list": ["154.108", "154.109"],
          "chunks": []
        }
      },
      "signage_requirements": {
        "permitted_signs": {
          "answer": "Permitted signs include: monument signs, wall signs, door signs, and temporary real estate signs, subject to specific size and placement regulations.",
          "section_list": ["154.130", "154.132"],
          "chunks": []
        },
        "prohibited_signs": {
          "answer": "Prohibited signs include: animated or flashing signs, balloon signs, billboards, pole signs, signs in right-of-way, signs on trees or natural features, and signs obstructing means of egress.",
          "section_list": ["154.131"],
          "chunks": []
        },
        "design_requirements": {
          "answer": "Sign design must be compatible with architecture and materials of the project. Permanent signs in residential districts cannot be separately illuminated except for subdivision entrance signs. Illuminated signs must have opaque backgrounds with translucent letters, and light sources must be shielded.",
          "section_list": ["154.135", "154.136"],
          "chunks": []
        }
      }
    }
  };
};