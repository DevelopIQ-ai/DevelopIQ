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
        "requirements": {
          "lot_requirements": {
            "maximum_density": {
              "unit": "units",
              "value": "10",
              "source": "Demo Data",
              "alias": "Maximum Density",
            },
            "minimum_lot_size": {
              "unit": "square_feet",
              "value": "1000",
              "source": "Demo Data",
              "alias": "Minimum Lot Size",
            },
            "minimum_lot_width": {
              "unit": "feet",
              "value": "100",
              "source": "Demo Data",
              "alias": "Minimum Lot Width",
            },
            "minimum_lot_frontage": {
              "unit": "feet",
              "value": "100",
              "source": "Demo Data",
              "alias": "Minimum Lot Frontage",
            },
            "minimum_living_area": {
              "unit": "square_feet",
              "value": "1000",
              "source": "Demo Data",
              "alias": "Minimum Living Area",
            }
          },
          "building_placement_requirements": {
            "minimum_front_setback": {
              "unit": "feet",
              "value": "100",
              "source": "Demo Data",
              "alias": "Minimum Front Setback",
            },
            "minimum_street_side_setback": {
              "unit": "feet",
              "value": "100",
              "source": "Demo Data",
              "alias": "Minimum Street Side Setback",
            },
            "minimum_side_yard_setback": {
              "unit": "feet",
              "value": "100",
              "source": "Demo Data",
              "alias": "Minimum Side Yard Setback",
            },
            "minimum_rear_setback": {
              "unit": "feet",
              "value": "100",
              "source": "Demo Data",
              "alias": "Minimum Rear Setback",
            },
            "accessory_building_setback": {
              "unit": "feet",
              "value": "100",
              "source": "Demo Data",
              "alias": "Accessory Building Setback",
            }
          },
          "building_requirements": {
            "maximum_building_height": {
              "unit": "feet",
              "value": "100",
              "source": "Demo Data",
              "alias": "Maximum Building Height",
            },
            "maximum_lot_coverage": {
              "unit": "percentage",
              "value": "100",
              "source": "Demo Data",
              "alias": "Maximum Lot Coverage",
            }
          },
          "landscaping_requirements": {
            "minimum_plant_sizes": {
              "unit": "feet",
              "value": "100",
              "source": "Demo Data",
              "alias": "Minimum Plant Sizes",
            },
            "landscape_plan_review_summary": {
              "summary": dataPoint(`
                The landscape plan review process for the RR (Rural Residential) zone involves several key steps and requirements as outlined in the regulations. A landscape plan must be submitted as part of all site plan and permit applications, detailing perimeter areas, buffer yards, common areas, entryways, and any other relevant open spaces. The plan must be drawn to the same scale as the site plan and include:

                1. **Proposed Landscaping**: All proposed plants must be indicated with circles showing their anticipated size at maturity.
                2. **Plant Table**: A table listing the scientific and common names, quantities, and sizes of all proposed plants.
                3. **Compliance Calculations**: Calculations demonstrating how the plan meets the chapter's requirements.
                4. **Existing Features**: Identification of existing natural and man-made landscape features, as well as proposed buildings and structures.
                5. **Tree Management**: Existing trees of eight-inch caliper or greater must be labeled for removal or preservation, with protective measures noted for those to be saved.
                6. **Contours**: Contours should be shown at two-foot intervals.

                The submitted landscape plans are subject to review and approval by the Plan Commission or Administrator, who may modify requirements if existing vegetation or topography makes compliance difficult. Overall, the process aims to ensure that landscaping contributes positively to the community's health, attractiveness, and environmental sensitivity.
                `, "Demo Data", "Landscape Plan Review Summary"),
            },
            "species_variation_requirement_summary": {
              "summary": dataPoint(`
                In the RR (Rural Residential) zone, the species variation requirements for landscaping stipulate that no single species of tree can constitute more than 35% of the total number of trees planted, and similarly, no single species of shrub can make up more than 35% of the total number of shrubs. This regulation is designed to promote biodiversity and prevent over-reliance on a single species in landscaping.
                `, "Demo Data", "Species Variation Requirement Summary"),
            },
            "performance_guarantee_warranty_requirements_summary": {
              "summary": dataPoint(`
                In the RR (Rural Residential) zone, the performance guarantee for landscaping requires the applicant to provide a financial guarantee to ensure that all landscaping is installed according to the approved plan and in compliance with the relevant regulations. This guarantee is mandated by the Plan Commission and is outlined in §154.161. Additionally, landscaping materials must be installed before a certificate of occupancy is issued, although the Administrator may allow a delay of up to 120 days due to adverse weather or other scheduling conflicts. During any delay, a surety or guarantee may be required to cover the estimated installation costs. Furthermore, all landscaping must be maintained, with dead or damaged plants needing replacement by the end of the growing season to remain compliant.
                `, "Demo Data", "Performance Guarantee Warranty Requirements Summary"),
            }
          },
          "parking_requirements": {
            "minimum_aisle_width": {
              "unit": "feet",
              "value": "100",
              "source": "Demo Data",
              "alias": "Minimum Aisle Width",
            },
            "curbing_requirements": {
              "summary": dataPoint(`
                Curbing requirements for parking areas in the RR zone include the necessity for curbs and gutters to be built according to the town's construction standards. These curbs must be installed around the perimeter of all parking facilities and landscape islands within the parking facilities. The purpose of this requirement is to prevent parked vehicles from extending beyond the parking area onto a street right-of-way or adjacent property, as well as to protect landscaped areas.
                `, "Demo Data", "Curbing Requirements"),
            },
            "striping_requirements": {
              "summary": dataPoint(`
                Parking areas in the RR (Residential Rural) zone must be striped and maintained to clearly identify each parking space. This requirement ensures that parking spaces are organized and easily recognizable for users.
                `, "Demo Data", "Striping Requirements"),
            },
            "drainage_requirements": {
              "summary": dataPoint(`
                Parking areas must be graded and drained to ensure that water does not flow onto adjacent property or public sidewalks. Additionally, runoff generated by parking areas must be collected in appropriate drainage facilities in accordance with the Bargersville storm water standards
                `, "Demo Data", "Drainage Requirements"),
            },
            "parking_stalls_required": {
              "summary": dataPoint(`
                In the RR (Residential Rural) zone, the parking requirements are not explicitly detailed in the provided context. However, it is mentioned that except for certain residential uses, there are no minimum required parking spaces. Instead, the owner is responsible for providing parking spaces based on factors such as the number of employees, expected customer traffic, or actual counts at similar establishments. The presence of convenient municipal off-street parking or on-street spaces adjacent to the site, as well as pedestrian connections to nearby residential neighborhoods or employment centers, are also considered. 

                For specific uses, the maximum number of parking spaces permitted is determined based on the gross square footage of the use or as outlined in the Permitted Use Table. If the calculation results in a fraction, it is rounded up to the next whole number. 

                In summary, the RR zone does not have a fixed number of required parking stalls; instead, it allows flexibility based on the specific circumstances of each establishment.
                `, "Demo Data", "Parking Stalls Required"),
            }
          },
          "signage_requirements": {
            "permitted_sign_types": {
              "signs": [
                "Door signs (not covering more than 25% of the door area and not illuminated)",
                "Wall-mounted cabinet signs (in nonresidential districts, stylized in shape)"
              ],
            },
            "prohibited_sign_types": {
              "signs": [
                "Abandoned signs",
                "Signs that are animated, blink, flash, move, rotate, or have scrolling text",
                "Balloon or inflatable signs",
                "Billboards or off-premise advertising signs",
                "Pole signs",
                "Reflective or fluorescent signs",
                "Signs attached to or painted on trees or natural features",
                "Signs within the right-of-way",
                "Signs installed, attached to, or painted on fences",
                "Signs or sign support structures obstructing a means of egress, including any fire escape, window, door opening, stairway, exit, walkway, any utility access, or fire department connection",
                "Signs interfering with any opening required for ventilation",
                "Signs resembling traffic control device signs",
                "Signs with exposed raceways",
                "Snipe or bandit signs",
                "Unlawful vehicle signs",
              ]
            },
            "design_requirements": {
              "requirements": dataPoint(`
                1. **Material Requirements:**  
                  - Sign design themes and materials must be compatible with the architecture, colors, and materials of the project.  
                  - Permanent signs located in residential districts cannot be separately or specially illuminated, except for identification signs at the entrance of a residential subdivision.  

                2. **Illumination Requirements:**  
                  - Permanent signs in residential districts must not have internal illumination unless specified otherwise.  
                  - Signs in nonresidential districts may use internal illumination, internal indirect (halo) illumination, or external indirect illumination.  
                  - Outdoor internally illuminated signs must have an opaque background with translucent letters or graphics, or a colored background with lighter letters or graphics.  
                  - Exposed light sources are prohibited, and light sources must be shielded to prevent light trespass onto adjacent properties.  
                  - Signs located within 50 feet of a single-family district cannot be internally illuminated.  

                3. **Size Requirements:**  
                  - Signs must be no larger than necessary for visibility and legibility.  
                  - A master sign plan must not contain a freestanding sign exceeding any maximum height standard by more than 50%.  
                  - A wall sign must not exceed any maximum sign area standard by more than 25%.  
                  - The number of signs must be sufficient for internal traffic and navigation for vehicles and pedestrians.`, "Demo Data", "Design Requirements"),
            }
          }
        }
      }
  }
}

// Helper function to create development info mock data
export const createDevelopmentInfoMockData = () => {
  return {
    "Permitted Uses": [
      {
        primary_use_classification: {
          value: "Residential",
          source: "Mock data"
        },
        permitted_uses: [
          { value: "Single-family dwelling", source: "Mock data" },
          { value: "Duplex", source: "Mock data" },
          { value: "Townhouse", source: "Mock data" }
        ],
        special_exceptions: [
          { value: "Multi-family dwelling", source: "Mock data" },
          { value: "Accessory dwelling unit", source: "Mock data" }
        ]
      }
    ],
    "requirements": {
      "lot_requirements": {
        "lot_size": {
          "minimum_lot_area": {
            alias: "Minimum Lot Area",
            value: "5,000",
            source: "Mock data",
            unit: "Sq. Ft."
          },
          "minimum_lot_width": {
            alias: "Minimum Lot Width",
            value: "50",
            source: "Mock data",
            unit: "Ft."
          },
          "summary": {
            alias: "Lot Size Summary",
            value: "Minimum lot size of 5,000 sq. ft. with 50 ft. minimum width required for all residential developments.",
            source: "Mock data"
          }
        }
      },
      "building_placement_requirements": {
        "setbacks": {
          "front_setback": {
            alias: "Front Setback",
            value: "25",
            source: "Mock data",
            unit: "Ft."
          },
          "side_setback": {
            alias: "Side Setback",
            value: "10",
            source: "Mock data",
            unit: "Ft."
          },
          "rear_setback": {
            alias: "Rear Setback",
            value: "20",
            source: "Mock data",
            unit: "Ft."
          },
          "summary": {
            alias: "Setback Summary",
            value: "Front: 25 ft, Side: 10 ft, Rear: 20 ft minimum setbacks required.",
            source: "Mock data"
          }
        }
      },
      "building_requirements": {
        "height": {
          "maximum_height": {
            alias: "Maximum Height",
            value: "35",
            source: "Mock data",
            unit: "Ft."
          },
          "summary": {
            alias: "Height Summary",
            value: "Buildings may not exceed 35 feet in height.",
            source: "Mock data"
          }
        },
        "density": {
          "maximum_density": {
            alias: "Maximum Density",
            value: "8",
            source: "Mock data",
            unit: "Units per Acre"
          }
        }
      },
      "landscaping_requirements": {
        "general": {
          "requirements": {
            alias: "Landscaping Requirements",
            value: "Minimum 20% of the lot must be landscaped. Street trees required every 40 ft. along frontage.",
            source: "Mock data"
          }
        }
      },
      "parking_requirements": {
        "residential": {
          "requirements": {
            alias: "Residential Parking",
            value: "2 parking spaces per dwelling unit. Additional visitor parking at 1 space per 4 units for developments with more than 10 units.",
            source: "Mock data"
          }
        }
      },
      "signage_requirements": {
        "permitted_signs": {
          "signs": [
            "One monument sign not to exceed 24 sq. ft. and 6 ft. in height",
            "Building identification sign not to exceed 6 sq. ft.",
            "Temporary real estate sign not to exceed 6 sq. ft."
          ]
        }
      }
    }
  };
}; 