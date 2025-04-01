// // Define interfaces for the input structure
// import { DevelopmentInfo } from "@/schemas/views/development-info-schema";

// interface DevelopmentRequirements {
//   lot_requirements: LotRequirements;
//   building_placement_requirements: BuildingPlacementRequirements;
//   building_requirements: BuildingRequirements;
//   landscaping_requirements: LandscapingRequirements;
//   parking_requirements: ParkingRequirements;
//   signage_requirements: SignageRequirements;
// }

// interface LotRequirements {
//   maximum_density: { units: number };
//   minimum_lot_size: { square_feet: number };
//   minimum_lot_width: { feet: number };
//   minimum_lot_frontage: { feet: number };
//   minimum_living_area: { square_feet: number };
// }

// interface BuildingPlacementRequirements {
//   minimum_front_setback: { feet: number };
//   minimum_street_side_setback: { feet: number };
//   minimum_side_yard_setback: { feet: number };
//   minimum_rear_setback: { feet: number };
//   accessory_building_setback: { feet: number };
// }

// interface BuildingRequirements {
//   maximum_building_height: { feet?: number };
//   maximum_lot_coverage: { percentage?: number };
// }

// interface LandscapingRequirements {
//   minimum_plant_sizes: { feet?: number };
//   landscape_plan_review_summary: { summary?: string };
//   species_variation_requirement_summary: { summary?: string };
//   performance_guarantee_warranty_requirements_summary: { summary?: string };
// }

// interface ParkingRequirements {
//   minimum_aisle_width: { feet?: number };
//   curbing_requirements: { summary?: string };
//   striping_requirements: { summary?: string };
//   drainage_requirements: { summary?: string };
//   parking_stalls_required: { summary?: string };
// }

// interface SignageRequirements {
//   permitted_sign_types: { signs: string[] };
//   prohibited_sign_types: { signs: string[] };
//   design_requirements: { requirements: string[] };
// }

// export const transformDevelopmentRequirements = (requirements: Partial<DevelopmentInfo>) => {
//     return {
//         lot_requirements: {
//             maximum_density: {
//                 units: {
//                     value: requirements.lot_requirements.maximum_density.units,
//                     alias: "Maximum Density",
//                     source: null,
//                     unit: "Units per Acre"
//                 }
//             },
//             minimum_lot_size: {
//                 square_feet: {
//                     value: requirements.lot_requirements.minimum_lot_size.square_feet,
//                     alias: "Minimum Lot Size",
//                     source: null,
//                     unit: "Square Feet"
//                 }
//             },
//             minimum_lot_width: {
//                 feet: {
//                     value: requirements.lot_requirements.minimum_lot_width.feet,
//                     alias: "Minimum Lot Width",
//                     source: null,
//                     unit: "Feet"
//                 }
//             },
//             minimum_lot_frontage: {
//                 feet: {
//                     value: requirements.lot_requirements.minimum_lot_frontage.feet,
//                     alias: "Minimum Lot Frontage",
//                     source: null,
//                     unit: "Feet"
//                 }
//             },
//             minimum_living_area: {
//                 square_feet: {
//                     value: requirements.lot_requirements.minimum_living_area.square_feet,
//                     alias: "Minimum Living Area",
//                     source: null,
//                     unit: "Square Feet"
//                 }
//             }
//         },
//         building_placement_requirements: {
//             minimum_front_setback: {
//                 feet: {
//                     value: requirements.building_placement_requirements.minimum_front_setback.feet,
//                     alias: "Minimum Front Setback",
//                     source: null,
//                     unit: "Feet"
//                 }
//             },
//             minimum_street_side_setback: {
//                 feet: {
//                     value: requirements.building_placement_requirements.minimum_street_side_setback.feet,
//                     alias: "Minimum Street Side Setback",
//                     source: null,
//                     unit: "Feet"
//                 }
//             },
//             minimum_side_yard_setback: {
//                 feet: {
//                     value: requirements.building_placement_requirements.minimum_side_yard_setback.feet,
//                     alias: "Minimum Side Yard Setback",
//                     source: null,
//                     unit: "Feet"
//                 }
//             },
//             minimum_rear_setback: {
//                 feet: {
//                     value: requirements.building_placement_requirements.minimum_rear_setback.feet,
//                     alias: "Minimum Rear Setback",
//                     source: null,
//                     unit: "Feet"
//                 }
//             },
//             accessory_building_setback: {
//                 feet: {
//                     value: requirements.building_placement_requirements.accessory_building_setback.feet,
//                     alias: "Accessory Building Setback",
//                     source: null,
//                     unit: "Feet"
//                 }
//             }
//         },
//         building_requirements: {
//             maximum_building_height: {
//                 feet: {
//                     value: ('feet' in requirements.building_requirements.maximum_building_height) 
//                         ? requirements.building_requirements.maximum_building_height.feet 
//                         : null,
//                     alias: "Maximum Building Height",
//                     source: null,
//                     unit: "Feet"
//                 }
//             },
//             maximum_lot_coverage: {
//                 percentage: {
//                     value: ('percentage' in requirements.building_requirements.maximum_lot_coverage)
//                         ? requirements.building_requirements.maximum_lot_coverage.percentage
//                         : null,
//                     alias: "Maximum Lot Coverage",
//                     source: null,
//                     unit: "Percentage"
//                 }
//             }
//         },
//         landscaping_requirements: {
//             minimum_plant_sizes: {
//                 feet: {
//                     value: ('feet' in requirements.landscaping_requirements.minimum_plant_sizes)
//                         ? requirements.landscaping_requirements.minimum_plant_sizes.feet
//                         : null,
//                     alias: "Minimum Plant Sizes",
//                     source: null,
//                     unit: "Feet"
//                 }
//             },
//             landscape_plan_review_summary: {
//                 summary: {
//                     value: ('summary' in requirements.landscaping_requirements.landscape_plan_review_summary)
//                         ? requirements.landscaping_requirements.landscape_plan_review_summary.summary
//                         : null,
//                     alias: "Landscape Plan Review",
//                     source: null
//                 }
//             },
//             species_variation_requirement_summary: {
//                 summary: {
//                     value: ('summary' in requirements.landscaping_requirements.species_variation_requirement_summary)
//                         ? requirements.landscaping_requirements.species_variation_requirement_summary.summary
//                         : null,
//                     alias: "Species Variation Requirements",
//                     source: null
//                 }
//             },
//             performance_guarantee_warranty_requirements_summary: {
//                 summary: {
//                     value: ('summary' in requirements.landscaping_requirements.performance_guarantee_warranty_requirements_summary)
//                         ? requirements.landscaping_requirements.performance_guarantee_warranty_requirements_summary.summary
//                         : null,
//                     alias: "Performance Guarantee Requirements",
//                     source: null
//                 }
//             }
//         },
//         parking_requirements: {
//             minimum_aisle_width: {
//                 feet: {
//                     value: ('feet' in requirements.parking_requirements.minimum_aisle_width)
//                         ? requirements.parking_requirements.minimum_aisle_width.feet
//                         : null,
//                     alias: "Minimum Aisle Width",
//                     source: null,
//                     unit: "Feet"
//                 }
//             },
//             curbing_requirements: {
//                 summary: {
//                     value: ('summary' in requirements.parking_requirements.curbing_requirements)
//                         ? requirements.parking_requirements.curbing_requirements.summary
//                         : null,
//                     alias: "Curbing Requirements",
//                     source: null
//                 }
//             },
//             striping_requirements: {
//                 summary: {
//                     value: ('summary' in requirements.parking_requirements.striping_requirements)
//                         ? requirements.parking_requirements.striping_requirements.summary
//                         : null,
//                     alias: "Striping Requirements",
//                     source: null
//                 }
//             },
//             drainage_requirements: {
//                 summary: {
//                     value: ('summary' in requirements.parking_requirements.drainage_requirements)
//                         ? requirements.parking_requirements.drainage_requirements.summary
//                         : null,
//                     alias: "Drainage Requirements",
//                     source: null
//                 }
//             },
//             parking_stalls_required: {
//                 summary: {
//                     value: ('summary' in requirements.parking_requirements.parking_stalls_required)
//                         ? requirements.parking_requirements.parking_stalls_required.summary
//                         : null,
//                     alias: "Parking Stalls Required",
//                     source: null
//                 }
//             }
//         },
//         signage_requirements: {
//             permitted_sign_types: {
//                 signs: requirements.signage_requirements.permitted_sign_types.signs
//             },
//             prohibited_sign_types: {
//                 signs: requirements.signage_requirements.prohibited_sign_types.signs
//             },
//             design_requirements: {
//                 requirements: {
//                     value: requirements.signage_requirements.design_requirements.requirements,
//                     alias: "Design Requirements",
//                     source: null
//                 }
//             }
//         }
//     };
// };