import { useState, useEffect } from "react";
import { PropertyReportHandler } from "@/lib/report-handler";

interface DevelopmentInfoResult {
    developmentInfoLoading: boolean;
    developmentInfoError: string | null;
}

export const useDevelopmentInfo = (reportHandler: PropertyReportHandler | null, generalPropertyInfoError: string | null): DevelopmentInfoResult => {
    const [developmentInfoLoading, setDevelopmentInfoLoading] = useState(true);
    const [developmentInfoError, setDevelopmentInfoError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDevelopmentInfo = async () => {
            try {
                // Don't do anything if reportHandler is null
                if (!reportHandler) {
                    console.log("Report handler is null, waiting...");
                    return;
                }

                // If we already have development info, we're done
                if (reportHandler.getDevelopmentInfo()) {
                    console.log("Development info already exists in report handler");
                    setDevelopmentInfoLoading(false);
                    return;
                }

                if (generalPropertyInfoError) {
                    setDevelopmentInfoError(generalPropertyInfoError);
                    setDevelopmentInfoLoading(false);
                    console.log("Development info error set to:", generalPropertyInfoError);
                    return;
                }

                // Get the general info - required for API call parameters
                const generalInfo = reportHandler.getGeneralInfo();
                if (!generalInfo) {
                    console.log("General info not available yet, waiting...");
                    return;
                }

                // Extract required parameters from generalInfo
                console.log("Extracting required parameters from generalInfo");
                let stateCode;
                let municipality;
                let zoneCode;

                // Try to extract state
                if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].countrySubd?.value) {
                    stateCode = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].countrySubd.value;
                }

                // Try to extract municipality
                if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].munName?.value) {
                    municipality = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].munName.value;
                } else if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"] &&
                    generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].locality?.value) {
                    municipality = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].locality.value;
                }

                // Try to extract zone code
                if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].siteZoningIdent?.value) {
                    zoneCode = generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].siteZoningIdent.value;
                } else if (generalInfo["Property Identification & Legal Framework"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"] &&
                    generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].zoneSubType?.value) {
                    zoneCode = generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].zoneSubType.value;
                }

                // If any required parameter is missing, log error and return
                if (!stateCode) {
                    setDevelopmentInfoError("Could not determine property state");
                    setDevelopmentInfoLoading(false);
                    return;
                }

                if (!municipality) {
                    setDevelopmentInfoError("Could not determine property municipality");
                    setDevelopmentInfoLoading(false);
                    return;
                }

                if (!zoneCode) {
                    setDevelopmentInfoError("Could not determine property zone code");
                    setDevelopmentInfoLoading(false);
                    return;
                }

                // console.log("INPUTS for development info API:", stateCode, municipality, zoneCode);
                // console.log("Fetching development info - this may take several minutes...");
                
                // // MOCK API CALL
                // console.log("STARTING mock development info API call (10 second delay)");
                // await new Promise(resolve => setTimeout(resolve, 10000));
                // console.log("COMPLETED mock development info API call");

                // // Mock API response
                // const result = {
                //     status: 'success',
                //     requirements: {
                //         "building_placement_requirements": {}
                //     },
                //     error: null
                // };

                console.log("Fetching development info from API");
                const response = await fetch('/api/development-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ state: stateCode, municipality, zone_code: zoneCode })
                })

                const result = await response.json();
                console.log('result', result);
                // Set development info in the report handler
                if (result.status === 'success') {
                    console.log('Development info received successfully');
                    
                    const mockPermittedUses = {
                        "Permitted Uses": [
                            {
                                "primary_use_classification": {
                                    value: "Residential",
                                    alias: "Primary Use Classification",
                                    source: null
                                },
                                "permitted_uses": [
                                    {
                                        value: "Single Family Residential",
                                        alias: "Permitted Use",
                                        source: null
                                    }
                                ],
                                "special_exceptions": [
                                    {
                                        value: "Special Exceptions",
                                        alias: "Special Exception",
                                        source: null
                                    }
                                ]
                            }
                        ]
                    };
                    
                    // Add the mock data to the report handler
                    // reportHandler.setDevelopmentInfo({...mockPermittedUses, "requirements": {
                    //       "building_placement_requirements": {
                    //         "minimum_front_setback": {
                    //           "feet": {
                    //             "value": "50",
                    //             "alias": "Minimum Front Setback",
                    //             "source": null,
                    //             "unit": "feet"
                    //           }
                    //         },
                    //         "minimum_street_side_setback": {
                    //           "feet": {
                    //             "value": "50", 
                    //             "alias": "Minimum Street Side Setback",
                    //             "source": null,
                    //             "unit": "feet"
                    //           }
                    //         },
                    //         "minimum_side_yard_setback": {
                    //             "feet": {
                    //                 "value": "40",
                    //                 "alias": "Minimum Side Yard Setback",
                    //                 "source": null,
                    //                 "unit": "feet"
                    //             }
                    //         },
                    //         "minimum_rear_setback": {
                    //           "feet": {
                    //             "value": "40",
                    //             "alias": "Minimum Rear Setback",
                    //             "source": null,
                    //             "unit": "feet"
                    //           }
                    //         },
                    //         "accessory_building_setback": {
                    //           "feet": {
                    //             "value": "50", 
                    //             "alias": "Minimum Street Side Setback",
                    //             "source": null,
                    //             "unit": "feet"
                    //           }
                    //         }
                    //       },
                    //       "building_requirements": {
                    //         "maximum_building_height": {
                    //           "feet": {
                    //             "value": "45",
                    //             "alias": "Maximum Building Height",
                    //             "source": null,
                    //             "unit": "feet"
                    //           }
                    //         },
                    //         "maximum_lot_coverage": {
                    //           "percentage": {
                    //             "value": "30",
                    //             "alias": "Maximum Lot Coverage",
                    //             "source": null,
                    //             "unit": "%"
                    //           }
                    //         }
                    //       },
                    //       "landscaping_requirements": {
                    //         "minimum_plant_sizes": {
                    //           "feet": {
                    //             "value": "Not specified in the provided context.",
                    //             "alias": "Minimum Plant Sizes",
                    //             "source": null,
                    //             "unit": "feet"
                    //           }
                    //         },
                    //         "landscape_plan_review_summary": {
                    //           "summary": {
                    //             "value": "The landscape plan review process for the RR (Rural Residential) zone involves several key steps and requirements as outlined in the regulations. A landscape plan must be submitted as part of any site plan and permit applications, detailing perimeter areas, buffer yards, common areas, entryways, and other relevant open spaces. The plan must be drawn to the same scale as the site plan and include:\n\n1. **Proposed Landscaping**: All proposed plants must be indicated with circles showing their anticipated size at maturity.\n2. **Plant Table**: A table listing all proposed plants, including their scientific and common names, quantities, and sizes at planting.\n3. **Compliance Calculations**: Calculations demonstrating how the landscape plan meets the chapter's requirements.\n4. **Existing Features**: Identification of existing natural and man-made landscape features, as well as proposed buildings and structures.\n5. **Tree Management**: Existing trees of eight-inch caliper or greater must be labeled for removal or preservation, and measures to protect saved trees should be noted.\n6. **Contours**: Contours must be shown at two-foot intervals.\n\nThe landscape plans are subject to review and approval by the Plan Commission or Administrator, who may modify requirements if existing vegetation or topography makes compliance difficult. Overall, the process aims to ensure that landscaping contributes positively to the community's health, attractiveness, and environmental sensitivity.",
                    //             "alias": "Landscape Plan Review Summary",
                    //             "source": null
                    //           }
                    //         },
                    //         "species_variation_requirement_summary": {
                    //           "summary": {
                    //             "value": "In the RR (Rural Residential) zone, the species variation requirements for landscaping stipulate that no single species of tree can constitute more than 35% of the total number of trees planted, and similarly, no single species of shrub can make up more than 35% of the total number of shrubs. This regulation is designed to promote biodiversity and prevent over-reliance on any one species in landscaping.",
                    //             "alias": "Species Variation Requirement Summary",
                    //             "source": null
                    //           }
                    //         },
                    //         "performance_guarantee_warranty_requirements_summary": {
                    //           "summary": {
                    //             "value": "In the RR (Rural Residential) zone, the performance guarantee for landscaping requires the applicant to provide a financial guarantee to ensure that all landscaping is installed according to the approved plan and in compliance with the relevant regulations. This guarantee is mandated by the Plan Commission and is outlined in §154.161. Additionally, landscaping materials must be installed before a certificate of occupancy is issued, although the Administrator may allow a delay of up to 120 days under certain conditions, such as adverse weather or scheduling conflicts. During any delay, a surety or guarantee may be required to cover the estimated installation costs, and site management must adhere to sediment and erosion control provisions. Furthermore, all landscaping must be maintained, with dead or damaged plants needing replacement by the end of the growing season to ensure compliance.",
                    //             "alias": "Performance Guarantee Warranty Requirements Summary",
                    //             "source": null
                    //           }
                    //         }
                    //       },
                    //       "lot_requirements": {
                    //         "maximum_density": {
                    //           "units": {
                    //             "value": "1 unit per 10 acres",
                    //             "alias": "Maximum Density",
                    //             "source": null,
                    //             "unit": "units per acre"
                    //           }
                    //         },
                    //         "minimum_lot_size": {
                    //           "square_feet": {
                    //             "value": "43560",
                    //             "alias": "Minimum Lot Size",
                    //             "source": null,
                    //             "unit": "square feet"
                    //           }
                    //         },
                    //         "minimum_lot_width": {
                    //         "feet": {
                    //             "value": "150",
                    //             "alias": "Minimum Lot Width",
                    //             "source": null,
                    //             "unit": "feet"
                    //           }
                    //         },
                    //         "minimum_lot_frontage": {
                    //           "feet": {
                    //             "value": "150",
                    //             "alias": "Minimum Lot Frontage",
                    //             "source": null,
                    //             "unit": "feet"
                    //           }
                    //         },
                    //         "minimum_living_area": {
                    //           "square_feet": {
                    //             "value": "N/A",
                    //             "alias": "Minimum Living Area",
                    //             "source": null,
                    //             "unit": "square feet"
                    //           }
                    //         }
                    //       },
                    //       "parking_requirements": {
                    //         "minimum_aisle_width": {
                    //           "feet": {
                    //             "value": "14",
                    //             "alias": "Minimum Aisle Width",
                    //             "source": null,
                    //             "unit": "feet"
                    //           }
                    //         },
                    //         "curbing_requirements": {
                    //           "summary": {
                    //             "value": "Curbing requirements for parking areas in the RR zone include the necessity for curbs and gutters to be built according to the town's construction standards. These curbs must be installed around the perimeter of all parking facilities and landscape islands within the parking facilities. The purpose of this requirement is to prevent parked vehicles from extending beyond the parking area onto a street right-of-way or adjacent property, as well as to protect landscaped areas.",
                    //             "alias": "Curbing Requirements Summary",
                    //             "source": null
                    //           }
                    //         },
                    //         "striping_requirements": {
                    //           "summary": {
                    //             "value": "Parking areas in the RR (Residential Rural) zone must be striped and maintained to clearly identify each parking space. This requirement ensures that parking spaces are organized and easily recognizable for users.",
                    //             "alias": "Striping Requirements Summary",
                    //             "source": null
                    //           }
                    //         },
                    //         "drainage_requirements": {
                    //         "summary": {
                    //             "value": "Parking areas must be graded and drained to ensure that water does not flow onto adjacent property or public sidewalks. Additionally, runoff generated by parking areas must be collected in appropriate drainage facilities in accordance with the Bargersville storm water standards.",
                    //             "alias": "Drainage Requirements Summary",
                    //             "source": null
                    //           }
                    //         },
                    //         "parking_stalls_required": {
                    //           "summary": {
                    //             "value": "In the RR (Rural Residential) zone, the parking requirements are not explicitly detailed in the provided context. However, it is mentioned that except for certain residential uses, there are no minimum required parking spaces. Instead, the owner is responsible for providing parking spaces based on the number of employees, expected customer traffic, or actual counts at similar establishments. The presence of convenient municipal off-street parking or on-street spaces adjacent to the site, as well as pedestrian connections to nearby residential neighborhoods or employment centers, are also considered. \n\nFor specific uses, the maximum number of parking spaces permitted is determined based on the gross square footage of the use or as specified in the Permitted Use Table. If the calculation results in a fraction, it is rounded up to the next whole number. \n\nIn summary, the RR zone does not have a fixed number of required parking stalls; instead, it allows flexibility based on the specific use and circumstances.",
                    //             "alias": "Parking Stalls Required Summary",
                    //             "source": null
                    //           }
                    //         }
                    //       },
                    //       "signage_requirements": {
                    //         "permitted_sign_types": {
                    //           "signs": [
                    //             "Door signs (not covering more than 25% of the door area and not illuminated)",
                    //             "Wall-mounted cabinet signs (in nonresidential districts)"
                    //           ]
                    //         },
                    //         "prohibited_sign_types": {
                    //           "signs": [
                    //             "Abandoned signs",
                    //             "Signs that are animated, blink, flash, move, rotate, or have scrolling text",
                    //             "Balloon or inflatable signs",
                    //             "Billboards or off-premise advertising signs",
                    //             "Pole signs",
                    //             "Reflective or fluorescent signs",
                    //             "Signs attached to or painted on trees or natural features",
                    //             "Signs within the right-of-way",
                    //             "Signs installed, attached to, or painted on fences",
                    //             "Signs or sign support structures obstructing a means of egress, including any fire escape, window, door opening, stairway, exit, walkway, any utility access, or fire department connection",
                    //             "Signs interfering with any opening required for ventilation",
                    //             "Signs resembling traffic control device signs",
                    //             "Signs with exposed raceways",
                    //             "Snipe or bandit signs",
                    //             "Unlawful vehicle signs"
                    //           ]
                    //         },
                    //         "design_requirements": {
                    //           "requirements": {
                    //             "value": "1. **Material Requirements:**\n   - Sign design themes and materials must be compatible with the architecture, colors, and materials of the project.\n\n2. **Illumination Requirements:**\n   - Permanent signs located on parcels in residential districts (RR) cannot be separately or specially illuminated, except for identification signs at the entrance of a residential subdivision.\n   - For signs in nonresidential districts, illumination can be achieved through internal illumination, internal indirect (halo) illumination, or external indirect illumination, unless specified otherwise.\n   - Exposed light sources are prohibited, and light sources must be shielded to prevent light trespass onto adjacent properties.\n   - Externally lit signs must be illuminated only with steady, stationary, and shielded light sources directed solely onto the sign.\n\n3. **Size Requirements:**\n   - Signs must be no larger than necessary for visibility and legibility.\n   - A master sign plan must not contain a freestanding sign exceeding any maximum height standard permitted by the chapter by more than 50%.\n   - A master sign plan must not contain a wall sign exceeding any maximum sign area standard permitted by the chapter by more than 25%.",
                    //             "alias": "Signage Design Requirements",
                    //             "source": null
                    //           }
                    //         }
                    //       }
                    //     }
                    //   });

                    reportHandler.setDevelopmentInfo({ ...mockPermittedUses, "requirements": result.requirements.requirements });
                    
                    // IMPORTANT: Set loading to false IMMEDIATELY after setting the data
                    setDevelopmentInfoLoading(false);
                    setDevelopmentInfoError(null);
                    console.log("Development info loading set to FALSE");
                } else if (!response.ok) {
                    throw new Error(result.error || "Unknown error fetching development info");
                }
            } catch (error) {
                console.error("Error in development info processing:", error);
                // if (isMounted) {
                //     setDevelopmentInfoError(
                //         error instanceof Error ? error.message : "An unexpected error occurred"
                //     );
                //     setDevelopmentInfoLoading(false);
                // }
                setDevelopmentInfoError("Unfortunately, we were unable to fetch development info for your property. Please try again later.");
                setDevelopmentInfoLoading(false);
            }
        };

        fetchDevelopmentInfo();

        // return () => {
        //     isMounted = false;
        // };
    }, [reportHandler, reportHandler?.getGeneralInfo(), generalPropertyInfoError]); // Only depend on reportHandler changes


    return { developmentInfoLoading, developmentInfoError };
}