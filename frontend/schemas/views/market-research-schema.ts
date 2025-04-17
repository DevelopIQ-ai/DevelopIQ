export interface PopulationPyramidDataPoint {
    ageGroup: string;
    percentage: number;
}

export interface YearlyPopulationGraphDataPoint {
    year: number;
    population: number;
}

export interface MarketResearchData {
  // Population growth
  pop_end: number;
  pop_start: number;
  percent_population_change: number | null;
  
  // Gender distribution
  male_percent_end: number;
  female_percent_end: number;
  male_moe_percent_end: number;
  female_moe_percent_end: number;
  
  // Age demographics
  median_age_end: number;
  median_age_start: number;
  median_age_change: number;
  
  // Youth vs Aging
  youth_percent_2023: number;
  aging_percent_2023: number;
  
  // Prime working age
  working_age_percent_2023: number;
  
  // Age dependency ratio
  age_dependency_ratio_2023: number;
  
  // Population Change by Age Bracket
  pop_change_25_to_34_percent: number | null;
  
  // Generations
  boomer_percent_2023: number;
  millennial_percent_2023: number;
}

export interface YearlyPopulationData {
    female_population: number;
    female_population_moe: number;
    female_population_moe_percent: number;
    female_population_percent: number;
    id: number;
    male_population: number;
    male_population_moe: number;
    male_population_moe_percent: number;
    male_population_percent: number;
    median_age: number;
    median_age_moe: number;
    name: string;
    population_5_to_9: number;
    population_5_to_9_percent: number;
    population_10_to_14: number;
    population_10_to_14_percent: number;
    population_15_to_19: number;
    population_15_to_19_percent: number;
    population_20_to_24: number;
    population_20_to_24_percent: number;
    population_25_to_34: number;
    population_25_to_34_percent: number;
    population_35_to_44: number;
    population_35_to_44_percent: number;
    population_45_to_54: number;
    population_45_to_54_percent: number;
    population_55_to_59: number;
    population_55_to_59_percent: number;
    population_60_to_64: number;
    population_60_to_64_percent: number;
    population_65_to_74: number;
    population_65_to_74_percent: number;
    population_75_to_84: number;
    population_75_to_84_percent: number;
    population_85_older: number;
    population_85_older_percent: number;
    population_under_5: number;
    population_under_5_percent: number;
    total_population: number;
}

export interface BaseMarketResearchData {
    location: string;
    msaName: string;
    msaId: number;
    fiveYearData?: {
        marketData:MarketResearchData,
        populationPyramidData: PopulationPyramidDataPoint[],
        yearlyPopulationData: YearlyPopulationGraphDataPoint[],
    }
    tenYearData?: {
        marketData:MarketResearchData,
        populationPyramidData: PopulationPyramidDataPoint[],
        yearlyPopulationData: YearlyPopulationGraphDataPoint[],
    }
}