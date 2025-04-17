import { z } from "zod";
import { DevelopmentInfoSchema } from "@/schemas/views/development-info-schema";
import { GeneralPropertyInfoSchema } from "@/schemas/views/general-property-info-schema";
import { MarketResearchSchema } from "@/schemas/views/market-research-schema";

export const ReportSchema = z.object({
  generalPropertyInfo: GeneralPropertyInfoSchema,
  developmentInfo: DevelopmentInfoSchema,
  marketResearch: MarketResearchSchema,
});

export type Report = z.infer<typeof ReportSchema>;
