import { z } from 'zod';

export const populationPyramidDataPointSchema = z.object({
  ageGroup: z.string(),
  percentage: z.number(),
});

export const yearlyPopulationGraphDataPointSchema = z.object({
  year: z.number(),
  population: z.number(),
});

export const marketResearchDataSchema = z.object({
  // Population growth
  pop_end: z.number(),
  pop_start: z.number(),
  percent_population_change: z.number().nullable(),
  
  // Gender distribution
  male_percent_end: z.number(),
  female_percent_end: z.number(),
  male_moe_percent_end: z.number(),
  female_moe_percent_end: z.number(),
  
  // Age demographics
  median_age_end: z.number(),
  median_age_start: z.number(),
  median_age_change: z.number(),
  
  // Youth vs Aging
  youth_percent_2023: z.number(),
  aging_percent_2023: z.number(),
  
  // Prime working age
  working_age_percent_2023: z.number(),
  
  // Age dependency ratio
  age_dependency_ratio_2023: z.number(),
  
  // Population Change by Age Bracket
  pop_change_25_to_34_percent: z.number().nullable(),
  
  // Generations
  boomer_percent_2023: z.number(),
  millennial_percent_2023: z.number(),
});

export const yearlyPopulationDataSchema = z.object({
  female_population: z.number(),
  female_population_moe: z.number(),
  female_population_moe_percent: z.number(),
  female_population_percent: z.number(),
  id: z.number(),
  male_population: z.number(),
  male_population_moe: z.number(),
  male_population_moe_percent: z.number(),
  male_population_percent: z.number(),
  median_age: z.number(),
  median_age_moe: z.number(),
  name: z.string(),
  population_5_to_9: z.number(),
  population_5_to_9_percent: z.number(),
  population_10_to_14: z.number(),
  population_10_to_14_percent: z.number(),
  population_15_to_19: z.number(),
  population_15_to_19_percent: z.number(),
  population_20_to_24: z.number(),
  population_20_to_24_percent: z.number(),
  population_25_to_34: z.number(),
  population_25_to_34_percent: z.number(),
  population_35_to_44: z.number(),
  population_35_to_44_percent: z.number(),
  population_45_to_54: z.number(),
  population_45_to_54_percent: z.number(),
  population_55_to_59: z.number(),
  population_55_to_59_percent: z.number(),
  population_60_to_64: z.number(),
  population_60_to_64_percent: z.number(),
  population_65_to_74: z.number(),
  population_65_to_74_percent: z.number(),
  population_75_to_84: z.number(),
  population_75_to_84_percent: z.number(),
  population_85_older: z.number(),
  population_85_older_percent: z.number(),
  population_under_5: z.number(),
  population_under_5_percent: z.number(),
  total_population: z.number(),
});

export const MarketResearchSchema = z.object({
  "location": z.string(),
  "msaName": z.string(),
  "msaId": z.number(),
  "fiveYearData": z.object({
    "marketData": z.object({
            "pop_end": z.number(),
            "pop_start": z.number(),
            "percent_population_change": z.number().nullable(),
            "male_percent_end": z.number(),
            "female_percent_end": z.number(),
            "male_moe_percent_end": z.number(),
            "female_moe_percent_end": z.number(),
            "median_age_end": z.number(),
            "median_age_start": z.number(),
            "median_age_change": z.number(),
            "youth_percent_2023": z.number(),
            "aging_percent_2023": z.number(),
            "working_age_percent_2023": z.number(),
            "age_dependency_ratio_2023": z.number(),
            "pop_change_25_to_34_percent": z.number().nullable(),
            "boomer_percent_2023": z.number(),
            "millennial_percent_2023": z.number(),
        }),
    "populationPyramidData": z.array(populationPyramidDataPointSchema),
    "yearlyPopulationData": z.array(yearlyPopulationGraphDataPointSchema),
  }),
  "tenYearData": z.object({
    "marketData": z.object({
            "pop_end": z.number(),
            "pop_start": z.number(),
            "percent_population_change": z.number().nullable(),
            "male_percent_end": z.number(),
            "female_percent_end": z.number(),
            "male_moe_percent_end": z.number(),
            "female_moe_percent_end": z.number(),
            "median_age_end": z.number(),
            "median_age_start": z.number(),
            "median_age_change": z.number(),
            "youth_percent_2023": z.number(),
            "aging_percent_2023": z.number(),
            "working_age_percent_2023": z.number(),
            "age_dependency_ratio_2023": z.number(),
            "pop_change_25_to_34_percent": z.number().nullable(),
            "boomer_percent_2023": z.number(),
            "millennial_percent_2023": z.number(),
        }),
    "populationPyramidData": z.array(populationPyramidDataPointSchema),
    "yearlyPopulationData": z.array(yearlyPopulationGraphDataPointSchema),
  }),
});

export type MarketResearch = z.infer<typeof MarketResearchSchema>;
export type MarketResearchDataSchema = z.infer<typeof marketResearchDataSchema>;
export type PopulationPyramidDataPointSchema = z.infer<typeof populationPyramidDataPointSchema>;
export type YearlyPopulationGraphDataPointSchema = z.infer<typeof yearlyPopulationGraphDataPointSchema>;
export type YearlyPopulationDataSchema = z.infer<typeof yearlyPopulationDataSchema>;