import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MarketResearchData, YearlyPopulationGraphDataPoint, PopulationPyramidDataPoint, YearlyPopulationData } from "@/schemas/views/market-research-schema";
import { SupabaseClient } from '@supabase/supabase-js';

export function useMarketResearchData(
  county: string | null, 
  state: string | null,
  startYear: number,
  endYear: number
) {
  const [marketData, setMarketData] = useState<MarketResearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msaName, setMsaName] = useState<string | null>(null);
  const [yearlyPopulationData, setYearlyPopulationData] = useState<YearlyPopulationGraphDataPoint[]>([]);
  const [populationPyramidData, setPopulationPyramidData] = useState<PopulationPyramidDataPoint[]>([]);
  
  useEffect(() => {
    async function fetchMarketData() {
      if (!county || !state) return;
      
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      const location = county + ", " + state;
      
      try {
        // Get MSA information
        const msaInfo = await fetchMsaInfo(supabase, location);
        setMsaName(msaInfo.msaName);
        
        // Fetch yearly population data
        const yearlyData = await fetchYearlyData(supabase, msaInfo.msaId, startYear, endYear);
        setYearlyPopulationData(yearlyData);
        
        // Fetch start and end year detailed data
        const dataStart = await fetchYearData(supabase, msaInfo.msaId, startYear);
        const dataEnd = await fetchYearData(supabase, msaInfo.msaId, endYear);
        
        // Process the data
        const compiledData = compileMarketResearchData(dataStart, dataEnd);
        setMarketData(compiledData);
        
        // Create population pyramid data
        if (dataEnd) {
          const pyramidData = createPopulationPyramidData(dataEnd);
          setPopulationPyramidData(pyramidData);
        }
      } catch (err) {
        console.error('Error fetching market research data:', err);
        setError('Failed to load market research data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMarketData();
  }, [county, state, startYear, endYear]);
  
  return {
    marketData,
    yearlyPopulationData,
    populationPyramidData,
    msaName,
    loading,
    error
  };
}

// Helper functions
async function fetchMsaInfo(supabase: SupabaseClient, location: string) {
  const { data: msaData, error: msaError } = await supabase
    .from("2023_Catwalk")
    .select("msa, msa_name")
    .eq("county_name", location)
    .limit(1);
  
  if (msaError) throw msaError;
  if (!msaData || msaData.length === 0) {
    throw new Error(`No MSA found for county: ${location}`);
  }
  
  return {
    msaId: msaData[0].msa,
    msaName: msaData[0].msa_name
  };
}

async function fetchYearlyData(supabase: SupabaseClient, msaId: string, startYear: number, endYear: number) {
  const yearlyData = [];
  
  for (let year = startYear; year <= endYear; year++) {
    try {
      const { data: yearData, error: yearError } = await supabase
        .from(`${year}_Population_Data`)
        .select("total_population")
        .eq("id", msaId)
        .single();
        
      if (!yearError && yearData) {
        yearlyData.push({ 
          year: year, 
          population: yearData.total_population
        });
      }
    } catch (err) {
      console.error(`Error fetching data for year ${year}:`, err);
      // Continue with other years even if one fails
    }
  }
  
  return yearlyData;
}

async function fetchYearData(supabase: SupabaseClient, msaId: string, year: number) {
  const { data, error } = await supabase
    .from(`${year}_Population_Data`)
    .select("*")
    .eq("id", msaId)
    .single();
  
  if (error) throw error;
  return data;
}

function compileMarketResearchData(dataStart: YearlyPopulationData, dataEnd: YearlyPopulationData) {
  return {
    // Population growth
    pop_end: dataEnd.total_population,
    pop_start: dataStart.total_population,
    percent_population_change: dataStart.total_population 
      ? parseFloat(((dataEnd.total_population - dataStart.total_population) * 100 / dataStart.total_population).toFixed(2))
      : null,
      
    // Gender distribution
    male_percent_end: dataEnd.male_population_percent,
    female_percent_end: dataEnd.female_population_percent,
    male_moe_percent_end: dataEnd.male_population_moe_percent,
    female_moe_percent_end: dataEnd.female_population_moe_percent,
    
    // Age demographics
    median_age_end: dataEnd.median_age,
    median_age_start: dataStart.median_age,
    median_age_change: parseFloat((dataEnd.median_age - dataStart.median_age).toFixed(2)),
    
    // Youth vs Aging (2023)
    youth_percent_2023: parseFloat((
      dataEnd.population_under_5_percent + 
      dataEnd.population_5_to_9_percent + 
      dataEnd.population_10_to_14_percent + 
      dataEnd.population_15_to_19_percent + 
      dataEnd.population_20_to_24_percent
    ).toFixed(2)),
    
    aging_percent_2023: parseFloat((
      dataEnd.population_65_to_74_percent + 
      dataEnd.population_75_to_84_percent + 
      dataEnd.population_85_older_percent
    ).toFixed(2)),
    
    // Prime working age
    working_age_percent_2023: parseFloat((
      dataEnd.population_25_to_34_percent + 
      dataEnd.population_35_to_44_percent
    ).toFixed(2)),
    
    // Age dependency ratio
    age_dependency_ratio_2023: parseFloat((
      (dataEnd.population_under_5_percent + 
        dataEnd.population_5_to_9_percent + 
        dataEnd.population_10_to_14_percent +
        dataEnd.population_65_to_74_percent + 
        dataEnd.population_75_to_84_percent + 
        dataEnd.population_85_older_percent) /
      (dataEnd.population_15_to_19_percent + 
        dataEnd.population_20_to_24_percent + 
        dataEnd.population_25_to_34_percent +
        dataEnd.population_35_to_44_percent + 
        dataEnd.population_45_to_54_percent + 
        dataEnd.population_55_to_59_percent +
        dataEnd.population_60_to_64_percent || 1)
    ).toFixed(2)),
    
    // Population Change by Age Bracket
    pop_change_25_to_34_percent: dataStart.population_25_to_34_percent
      ? parseFloat(((dataEnd.population_25_to_34_percent - dataStart.population_25_to_34_percent) * 100 / 
          dataStart.population_25_to_34_percent).toFixed(2))
      : null,
    
    // Generations
    boomer_percent_2023: parseFloat((
      dataEnd.population_55_to_59_percent + 
      dataEnd.population_60_to_64_percent + 
      dataEnd.population_65_to_74_percent
    ).toFixed(2)),
    
    millennial_percent_2023: parseFloat((
      dataEnd.population_25_to_34_percent + 
      dataEnd.population_35_to_44_percent
    ).toFixed(2))
  };
}

function createPopulationPyramidData(dataEnd: YearlyPopulationData) {
  const pyramidData = [
    { ageGroup: '0-4', percentage: dataEnd.population_under_5_percent },
    { ageGroup: '5-9', percentage: dataEnd.population_5_to_9_percent },
    { ageGroup: '10-14', percentage: dataEnd.population_10_to_14_percent },
    { ageGroup: '15-19', percentage: dataEnd.population_15_to_19_percent },
    { ageGroup: '20-24', percentage: dataEnd.population_20_to_24_percent },
    { ageGroup: '25-29', percentage: dataEnd.population_25_to_34_percent / 2 },
    { ageGroup: '30-34', percentage: dataEnd.population_25_to_34_percent / 2 },
    { ageGroup: '35-39', percentage: dataEnd.population_35_to_44_percent / 2 },
    { ageGroup: '40-44', percentage: dataEnd.population_35_to_44_percent / 2 },
    { ageGroup: '45-49', percentage: dataEnd.population_45_to_54_percent / 2 },
    { ageGroup: '50-54', percentage: dataEnd.population_45_to_54_percent / 2 },
    { ageGroup: '55-59', percentage: dataEnd.population_55_to_59_percent },
    { ageGroup: '60-64', percentage: dataEnd.population_60_to_64_percent },
    { ageGroup: '65-69', percentage: dataEnd.population_65_to_74_percent / 2 },
    { ageGroup: '70-74', percentage: dataEnd.population_65_to_74_percent / 2 },
    { ageGroup: '75-79', percentage: dataEnd.population_75_to_84_percent / 2 },
    { ageGroup: '80-84', percentage: dataEnd.population_75_to_84_percent / 2 },
    { ageGroup: '85+', percentage: dataEnd.population_85_older_percent },
  ];
  
  // Sort from oldest to youngest for proper display
  return pyramidData.reverse();
} 