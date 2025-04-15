import { z } from "zod";

// Schema for chunks that contain references to sections
const ChunkSchema = z.object({
  id: z.string(),
  section_number: z.string(),
  chapter_number: z.string(),
  // Add other chunk fields if needed
});

// Schema for a regulation answer
const RegulationAnswerSchema = z.object({
  answer: z.string(),
  chunks: z.array(ChunkSchema),
  section_list: z.array(z.string())
});

// Main schema for development info
export const DevelopmentInfoSchema = z.object({
  "document_id": z.string(),
  "zone_code": z.string(),
  "results": z.object({
    "building_placement_requirements": z.object({
      "front_setback": RegulationAnswerSchema,
      "street_side_setback": RegulationAnswerSchema,
      "side_yard_setback": RegulationAnswerSchema,
      "rear_setback": RegulationAnswerSchema,
      "accessory_building_setback": RegulationAnswerSchema
    }),
    "building_requirements": z.object({
      "maximum_building_height": RegulationAnswerSchema,
      "maximum_lot_coverage": RegulationAnswerSchema
    }),
    "landscaping_requirements": z.object({
      "plant_sizes": RegulationAnswerSchema,
      "landscape_plan_review": RegulationAnswerSchema,
      "species_variation": RegulationAnswerSchema,
      "performance_guarantee": RegulationAnswerSchema
    }),
    "parking_requirements": z.object({
      "aisle_width": RegulationAnswerSchema,
      "curbing_requirements": RegulationAnswerSchema,
      "striping_requirements": RegulationAnswerSchema,
      "drainage_requirements": RegulationAnswerSchema,
      "parking_stalls": RegulationAnswerSchema
    }),
    "signage_requirements": z.object({
      "permitted_signs": RegulationAnswerSchema,
      "prohibited_signs": RegulationAnswerSchema,
      "design_requirements": RegulationAnswerSchema
    })
  })
});

// Type exports
export type DevelopmentInfo = z.infer<typeof DevelopmentInfoSchema>;
export type RegulationAnswer = z.infer<typeof RegulationAnswerSchema>;
export type Chunk = z.infer<typeof ChunkSchema>;