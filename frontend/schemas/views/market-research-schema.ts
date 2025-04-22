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

export const MarketResearchRadiusSchema = z.object({
  population_data: z.object({
    yearly_populations: z.object({
      total_population_2024: z.number().nullable(),
      total_population_2023: z.number().nullable(),
      total_population_2022: z.number().nullable(),
      total_population_2021: z.number().nullable(),
      total_population_2020: z.number().nullable(),
    }),
    five_year_age_brackets: z.object({
      age_0_4: z.number().nullable(),
      age_5_9: z.number().nullable(),
      age_10_14: z.number().nullable(),
      age_15_19: z.number().nullable(),
      age_20_24: z.number().nullable(),
      age_25_29: z.number().nullable(),
      age_30_34: z.number().nullable(),
      age_35_39: z.number().nullable(),
      age_40_44: z.number().nullable(),
      age_45_49: z.number().nullable(),
      age_50_54: z.number().nullable(),
      age_55_59: z.number().nullable(),
      age_60_64: z.number().nullable(),
      age_65_69: z.number().nullable(),
      age_70_74: z.number().nullable(),
      age_75_79: z.number().nullable(),
      age_80_84: z.number().nullable(),
      age_85_plus: z.number().nullable(),
    }),
    male_population: z.number().nullable(),
    female_population: z.number().nullable(),
    median_age: z.number().nullable(),
    youth_population: z.number().nullable(),
    working_age_population: z.number().nullable(),
    elderly_population: z.number().nullable(),
  }),
  housing_data: z.object({
    median_household_income: z.number().nullable(),
    average_household_income: z.number().nullable(),
    owner_occupied_units: z.number().nullable(),
    renter_occupied_units: z.number().nullable(),
    vacant_units: z.number().nullable(),
    median_home_value: z.number().nullable(),
    total_renters: z.number().nullable(),
    total_owner_occupied: z.number().nullable(),
    total_vacant: z.number().nullable(),
    households: z.object({
      total_households_2024: z.number().nullable(),
      total_households_2023: z.number().nullable(),
      total_households_2022: z.number().nullable(),
      total_households_2021: z.number().nullable(),
      total_households_2020: z.number().nullable(),
    }),
    housing_units: z.object({
      total_housing_units_2024: z.number().nullable(),
      total_housing_units_2023: z.number().nullable(),
      total_housing_units_2022: z.number().nullable(),
      total_housing_units_2021: z.number().nullable(),
      total_housing_units_2020: z.number().nullable(),
    }),
  }),
  employment_data: z.object({
    working_age_population: z.number().nullable(),
    unemployment_rate: z.number().nullable(),
    industry_base_population: z.number().nullable(),
    employment_by_industry: z.object({
      agriculture_forestry_fishing_hunting_population: z.number().nullable(),
      mining_quarrying_oil_and_gas_extraction_population: z.number().nullable(),
      construction_population: z.number().nullable(),
      manufacturing_population: z.number().nullable(),
      wholesale_trade_population: z.number().nullable(),
      retail_trade_population: z.number().nullable(),
      transportation_warehousing_population: z.number().nullable(),
      utilities_population: z.number().nullable(),
      information_population: z.number().nullable(),
      finance_insurance_population: z.number().nullable(),
      real_estate_rental_leasing_population: z.number().nullable(),
      professional_scientific_technical_services_population: z.number().nullable(),
      management_of_companies_enterprises_population: z.number().nullable(),
      administrative_support_waste_management_services_population: z.number().nullable(),
      educational_services_population: z.number().nullable(),
      health_care_social_assistance_population: z.number().nullable(),
      arts_entertainment_recreation_population: z.number().nullable(),
      accommodation_food_services_population: z.number().nullable(),
      other_services_population: z.number().nullable(),
      public_administration_population: z.number().nullable(),
    }),
  }),
});

export const UnemploymentRateSchema = z.object({
  year: z.string(),
  month: z.string(),
  value: z.number(),
  preliminary: z.boolean(),
});

export const BLSDatasetSchema = z.object({
  unemployment_rate: z.array(UnemploymentRateSchema),
});

export const MarketResearchSchema = z.object({
  one_mile_attributes: MarketResearchRadiusSchema,
  three_mile_attributes: MarketResearchRadiusSchema,
  five_mile_attributes: MarketResearchRadiusSchema,
  bls: BLSDatasetSchema,
});

export type Radius = 1 | 3 | 5;

export type EsriData2024Schema = {
    averageHouseholdIncome: number;
    employmentPopulation: number;
    medianHomeValue: number;
    medianHouseholdIncome: number;
    ownerOccupiedUnits: number;
    renterOccupiedUnits: number;
    unemploymentPopulation: number;
    vacantUnits: number;
    workingAgePopulation: number;
    unemploymentRate: number;
    employmentByIndustry: {
        industryBasePopulation: number;
        agricultureForestryFishingHuntingPopulation: number;
        miningQuarryingOilAndGasExtractionPopulation: number;
        constructionPopulation: number;
        manufacturingPopulation: number;
        wholesaleTradePopulation: number;
        retailTradePopulation: number;
        transportationWarehousingPopulation: number;
        utilitiesPopulation: number;
        informationPopulation: number;
        financeInsurancePopulation: number;
        realEstateRentalLeasingPopulation: number;
        professionalScientificTechnicalServicesPopulation: number;
        managementOfCompaniesEnterprisesPopulation: number;
        administrativeSupportWasteManagementServicesPopulation: number;
        educationalServicesPopulation: number;
        healthCareSocialAssistancePopulation: number;
        artsEntertainmentRecreationPopulation: number;
        accommodationFoodServicesPopulation: number;
        otherServicesPopulation: number;
        publicAdministrationPopulation: number;
    } | null;
} | null;

export type MarketResearch = z.infer<typeof MarketResearchSchema>;
export type MarketResearchDataSchema = z.infer<typeof marketResearchDataSchema>;
export type BLSDatasetSchema = z.infer<typeof BLSDatasetSchema>;
export type UnemploymentRateDataPoint = z.infer<typeof UnemploymentRateSchema>;
export type PopulationPyramidDataPointSchema = z.infer<typeof populationPyramidDataPointSchema>;
export type YearlyPopulationGraphDataPointSchema = z.infer<typeof yearlyPopulationGraphDataPointSchema>;
export type YearlyPopulationDataSchema = z.infer<typeof yearlyPopulationDataSchema>;