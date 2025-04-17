import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { YearlyPopulationGraphDataPointSchema, PopulationPyramidDataPointSchema, YearlyPopulationDataSchema, MarketResearch, MarketResearchDataSchema, EsriData2024Schema } from "@/schemas/views/market-research-schema";
import { SupabaseClient } from '@supabase/supabase-js';
import { PropertyReportHandler } from '@/lib/report-handler';

export function useMarketResearchData(
  reportHandler: PropertyReportHandler,
  county: string | null, 
  state: string | null,
  startYear: number,
  endYear: number
) {
  const [marketData, setMarketData] = useState<MarketResearchDataSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msaName, setMsaName] = useState<string | null>(null);
  const [yearlyPopulationData, setYearlyPopulationData] = useState<YearlyPopulationGraphDataPointSchema[]>([]);
  const [populationPyramidData, setPopulationPyramidData] = useState<PopulationPyramidDataPointSchema[]>([]);
  const [esriData2024, setEsriData2024] = useState<EsriData2024Schema | null>(null);
  
  useEffect(() => {
    async function fetchMarketData() {
      if (!county || !state) return;

      if (!reportHandler) return;

      if (reportHandler.getMarketResearch()) {
        if (startYear === 2014) {
          setYearlyPopulationData(reportHandler.getMarketResearch()?.tenYearData?.yearlyPopulationData || []);
          setMarketData(reportHandler.getMarketResearch()?.tenYearData?.marketData || null);
          setPopulationPyramidData(reportHandler.getMarketResearch()?.tenYearData?.populationPyramidData || []);
        } else {
          setYearlyPopulationData(reportHandler.getMarketResearch()?.fiveYearData?.yearlyPopulationData || []);
          setMarketData(reportHandler.getMarketResearch()?.fiveYearData?.marketData || null);
          setPopulationPyramidData(reportHandler.getMarketResearch()?.fiveYearData?.populationPyramidData || []);
        }
        setEsriData2024(reportHandler.getMarketResearch()?.esriData2024 || null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // Create a cache key based on county and state only (not year-dependent)
      const cacheKey = "marketResearchData";
      
      // Determine if we need 5-year or 10-year data for display
      const isDecadeView = startYear === 2014;
      
      // Check if complete data exists in localStorage
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setMsaName(parsedData.msaName);
          
          // Select the appropriate data set based on startYear
          if (isDecadeView && parsedData.tenYearData) {
            setYearlyPopulationData(parsedData.tenYearData.yearlyPopulationData);
            setMarketData(parsedData.tenYearData.marketData);
            setPopulationPyramidData(parsedData.tenYearData.populationPyramidData);
          } else if (!isDecadeView && parsedData.fiveYearData) {
            setYearlyPopulationData(parsedData.fiveYearData.yearlyPopulationData);
            setMarketData(parsedData.fiveYearData.marketData);
            setPopulationPyramidData(parsedData.fiveYearData.populationPyramidData);
          } else {
            // If we don't have the requested data range in cache, fetch it
            throw new Error("Requested data range not in cache");
          }

          setEsriData2024(parsedData.esriData2024);

          reportHandler.setMarketResearch(parsedData);
          
          setLoading(false);
          return;
        } catch (err) {
          console.error('Error with cached data:', err);
          // Continue with fetching if there's an issue with cached data
        }
      }
      
      try {
        const supabase = createClient();
        const location = county + ", " + state;
        
        // Get MSA information
        const msaInfo = await fetchMsaInfo(supabase, location);
        console.log(msaInfo);
        setMsaName(msaInfo.msaName);
        
        // Prepare container for complete cache data
        const completeData: MarketResearch = {
          location: location,
          msaName: msaInfo.msaName,
          msaId: msaInfo.msaId,
          fipsCode: msaInfo.fipsCode,
          fiveYearData: {
            marketData: {
              pop_end: 0,
              pop_start: 0,
              percent_population_change: 0,
              male_percent_end: 0,
              female_percent_end: 0,
              male_moe_percent_end: 0,
              female_moe_percent_end: 0,
              median_age_end: 0,
              median_age_start: 0,
              median_age_change: 0,
              youth_percent_2023: 0,
              aging_percent_2023: 0,
              working_age_percent_2023: 0,
              age_dependency_ratio_2023: 0,
              pop_change_25_to_34_percent: 0,
              boomer_percent_2023: 0,
              millennial_percent_2023: 0,
            },
            populationPyramidData: [],
            yearlyPopulationData: [],
          },
          tenYearData: {
            marketData: {
              pop_end: 0,
              pop_start: 0,
              percent_population_change: 0,
              male_percent_end: 0,
              female_percent_end: 0,
              male_moe_percent_end: 0,
              female_moe_percent_end: 0,
              median_age_end: 0,
              median_age_start: 0,
              median_age_change: 0,
              youth_percent_2023: 0,
              aging_percent_2023: 0,
              working_age_percent_2023: 0,
              age_dependency_ratio_2023: 0,
              pop_change_25_to_34_percent: 0,
              boomer_percent_2023: 0,
              millennial_percent_2023: 0,
            },
            populationPyramidData: [],
            yearlyPopulationData: [],
          },
          esriData2024: {
            averageHouseholdIncome: -1,
            employmentPopulation: -1,
            medianHomeValue: -1,
            medianHouseholdIncome: -1,
            ownerOccupiedUnits: -1,
            renterOccupiedUnits: -1,
            unemploymentPopulation: -1,
            vacantUnits: -1,
            workingAgePopulation: -1,
            unemploymentRate: -1,
            employmentByIndustry: {
              industryBasePopulation: -1,
              agricultureForestryFishingHuntingPopulation: -1,
              miningQuarryingOilAndGasExtractionPopulation: -1,
              constructionPopulation: -1,
              manufacturingPopulation: -1,
              wholesaleTradePopulation: -1,
              retailTradePopulation: -1,
              transportationWarehousingPopulation: -1,
              utilitiesPopulation: -1,
              informationPopulation: -1,
              financeInsurancePopulation: -1,
              realEstateRentalLeasingPopulation: -1,
              professionalScientificTechnicalServicesPopulation: -1,
              managementOfCompaniesEnterprisesPopulation: -1,
              administrativeSupportWasteManagementServicesPopulation: -1,
              educationalServicesPopulation: -1,
              healthCareSocialAssistancePopulation: -1,
              artsEntertainmentRecreationPopulation: -1,
              accommodationFoodServicesPopulation: -1,
              otherServicesPopulation: -1,
              publicAdministrationPopulation: -1,
            }
          }
        };
        
        // Fetch 10-year data (2013-2023)
        const tenYearStart = 2014;
        const tenYearEnd = 2023;
        const tenYearlyData = await fetchYearlyData(supabase, msaInfo.msaId, tenYearStart, tenYearEnd);
        
        // Fetch 10-year start and end detailed data
        const tenYearDataStart = await fetchYearData(supabase, msaInfo.msaId, tenYearStart);
        const tenYearDataEnd = await fetchYearData(supabase, msaInfo.msaId, tenYearEnd);
        
        // Process 10-year data
        const tenYearCompiledData = compileMarketResearchData(tenYearDataStart, tenYearDataEnd);
        const tenYearPyramidData = createPopulationPyramidData(tenYearDataEnd);
        
        // Store 10-year data in complete data object
        completeData.tenYearData = {
          marketData: tenYearCompiledData,
          populationPyramidData: tenYearPyramidData,
          yearlyPopulationData: tenYearlyData
        };
        
        // Fetch 5-year data (2018-2023)
        const fiveYearStart = 2019;
        const fiveYearlyData = tenYearlyData.filter(item => item.year >= fiveYearStart);
        
        // Fetch 5-year start and end detailed data
        const fiveYearDataStart = await fetchYearData(supabase, msaInfo.msaId, fiveYearStart);
        // We already have 2023 data from above
        
        // Process 5-year data
        const fiveYearCompiledData = compileMarketResearchData(fiveYearDataStart, tenYearDataEnd);
        // We can reuse the pyramid data from 2023
        
        // Store 5-year data in complete data object
        completeData.fiveYearData = {
          marketData: fiveYearCompiledData,
          populationPyramidData: tenYearPyramidData, // Same pyramid data as both use 2023 end data
          yearlyPopulationData: fiveYearlyData
        };

        const stats = await fetchAndFlattenStats(msaInfo.fipsCode);
        if (completeData.esriData2024 && completeData.esriData2024.employmentByIndustry) {
          completeData.esriData2024.averageHouseholdIncome = stats.average_household_income;
          completeData.esriData2024.employmentPopulation = stats.employment_population;
          completeData.esriData2024.medianHomeValue = stats.median_home_value;
          completeData.esriData2024.medianHouseholdIncome = stats.median_household_income;
          completeData.esriData2024.ownerOccupiedUnits = stats.owner_occupied_units;
          completeData.esriData2024.renterOccupiedUnits = stats.renter_occupied_units;
          completeData.esriData2024.unemploymentPopulation = stats.unemployment_population;
          completeData.esriData2024.vacantUnits = stats.vacant_units;
          completeData.esriData2024.workingAgePopulation = stats.working_age_population;
          completeData.esriData2024.unemploymentRate = parseFloat(((stats.unemployment_population / stats.working_age_population) * 100).toFixed(1));
          completeData.esriData2024.employmentByIndustry.industryBasePopulation = stats.industry_base_population;
          completeData.esriData2024.employmentByIndustry.agricultureForestryFishingHuntingPopulation = stats.agriculture_forestry_fishing_hunting_population;
          completeData.esriData2024.employmentByIndustry.miningQuarryingOilAndGasExtractionPopulation = stats.mining_quarrying_oil_and_gas_extraction_population;
          completeData.esriData2024.employmentByIndustry.constructionPopulation = stats.construction_population;
          completeData.esriData2024.employmentByIndustry.manufacturingPopulation = stats.manufacturing_population;
          completeData.esriData2024.employmentByIndustry.wholesaleTradePopulation = stats.wholesale_trade_population;
          completeData.esriData2024.employmentByIndustry.retailTradePopulation = stats.retail_trade_population;
          completeData.esriData2024.employmentByIndustry.transportationWarehousingPopulation = stats.transportation_warehousing_population;
          completeData.esriData2024.employmentByIndustry.utilitiesPopulation = stats.utilities_population;
          completeData.esriData2024.employmentByIndustry.informationPopulation = stats.information_population;
          completeData.esriData2024.employmentByIndustry.financeInsurancePopulation = stats.finance_insurance_population;
          completeData.esriData2024.employmentByIndustry.realEstateRentalLeasingPopulation = stats.real_estate_rental_leasing_population;
          completeData.esriData2024.employmentByIndustry.professionalScientificTechnicalServicesPopulation = stats.professional_scientific_technical_services_population;
          completeData.esriData2024.employmentByIndustry.managementOfCompaniesEnterprisesPopulation = stats.management_of_companies_enterprises_population;
          completeData.esriData2024.employmentByIndustry.administrativeSupportWasteManagementServicesPopulation = stats.administrative_support_waste_management_services_population;
          completeData.esriData2024.employmentByIndustry.educationalServicesPopulation = stats.educational_services_population;
          completeData.esriData2024.employmentByIndustry.healthCareSocialAssistancePopulation = stats.health_care_social_assistance_population;
          completeData.esriData2024.employmentByIndustry.artsEntertainmentRecreationPopulation = stats.arts_entertainment_recreation_population;
          completeData.esriData2024.employmentByIndustry.accommodationFoodServicesPopulation = stats.accommodation_food_services_population;
          completeData.esriData2024.employmentByIndustry.otherServicesPopulation = stats.other_services_population;
          completeData.esriData2024.employmentByIndustry.publicAdministrationPopulation = stats.public_administration_population;
        }
        setEsriData2024(completeData.esriData2024);
        
        // Store the complete data with both 5 and 10 year datasets in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(completeData));
        reportHandler.setMarketResearch(completeData);
        
        // Set the appropriate data based on current startYear selection
        if (isDecadeView) {
          setYearlyPopulationData(tenYearlyData);
          setMarketData(tenYearCompiledData);
          setPopulationPyramidData(tenYearPyramidData);
        } else {
          setYearlyPopulationData(fiveYearlyData);
          setMarketData(fiveYearCompiledData);
          setPopulationPyramidData(tenYearPyramidData);
        }

        
      } catch (err) {
        console.error('Error fetching market research data:', err);
        setError('Failed to load market research data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMarketData();
  }, [reportHandler, county, state, startYear, endYear]);
  
  return {
    marketData,
    yearlyPopulationData,
    populationPyramidData,
    esriData2024,
    msaName,
    loading,
    error
  };
}

// Helper functions
async function fetchMsaInfo(supabase: SupabaseClient, location: string) {
  const { data: msaData, error: msaError } = await supabase
    .from("2023_Catwalk")
    .select("msa, msa_name, fips_code")
    .eq("county_name", location)
    .limit(1);
  
  if (msaError) throw msaError;
  if (!msaData || msaData.length === 0) {
    throw new Error(`No MSA found for county: ${location}`);
  }
  
  return {
    msaId: msaData[0].msa,
    msaName: msaData[0].msa_name,
    fipsCode: msaData[0].fips_code
  };
}

async function fetchYearlyData(supabase: SupabaseClient, msaId: string, startYear: number, endYear: number) {
  const yearlyData = [];
  
  for (let year = startYear; year <= endYear; year++) {
    if (year === 2020) {
      continue;
    }
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

function compileMarketResearchData(dataStart: YearlyPopulationDataSchema, dataEnd: YearlyPopulationDataSchema) {
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

function createPopulationPyramidData(dataEnd: YearlyPopulationDataSchema) {
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

interface EsriResponse {
  results: [{
    value: {
      FeatureSet: [{
        features: [{
          attributes: {
            MEDHINC_CY: number;
            AVGHINC_CY: number;
            OWNER_CY: number;
            RENTER_CY: number;
            VACANT_CY: number;
            UNEMP_CY: number;
            EMP_CY: number;
            AVGVAL_CY: number;
            WORKAGE_CY: number;
            INDBASE_CY: number;
            INDAGRI_CY: number;
            INDMIN_CY: number;
            INDCONS_CY: number;
            INDMANU_CY: number;
            INDWHTR_CY: number;
            INDRTTR_CY: number;
            INDTRAN_CY: number;
            INDUTIL_CY: number;
            INDINFO_CY: number;
            INDFIN_CY: number;
            INDRE_CY: number;
            INDTECH_CY: number;
            INDMGMT_CY: number;
            INDADMN_CY: number;
            INDEDUC_CY: number;
            INDHLTH_CY: number;
            INDARTS_CY: number;
            INDFOOD_CY: number;
            INDOTSV_CY: number;
            INDPUBL_CY: number;
          }
        }]
      }]
    }
  }]
}

async function fetchEsriData(fipsCode: string) {
  const apiKey = process.env.NEXT_PUBLIC_ESRI_API_KEY;
  const baseUrl = 'https://geoenrich.arcgis.com/arcgis/rest/services/World/GeoEnrichmentServer/GeoEnrichment/enrich';

  const url = new URL(baseUrl);
  url.searchParams.append('f', 'json');
  url.searchParams.append('token', apiKey || '');
  url.searchParams.append('studyAreas', JSON.stringify([{"sourceCountry":"US","layer":"US.Counties","ids":[fipsCode]}]));
  url.searchParams.append('analysisVariables', 'MEDHINC_CY,AVGHINC_CY,OWNER_CY,RENTER_CY,VACANT_CY,UNEMP_CY,EMP_CY,AVGVAL_CY,AVGRENT_CY,INSPOP_CY,WORKAGE_CY,INDBASE_CY,INDAGRI_CY,INDMIN_CY,INDCONS_CY,INDMANU_CY,INDWHTR_CY,INDRTTR_CY,INDTRAN_CY,INDUTIL_CY,INDINFO_CY,INDFIN_CY,INDRE_CY,INDTECH_CY,INDMGMT_CY,INDADMN_CY,INDEDUC_CY,INDHLTH_CY,INDARTS_CY,INDFOOD_CY,INDOTSV_CY,INDPUBL_CY');

  const response = await fetch(url.toString(), {
    method: 'GET',
  });

  const data = await response.json();
  console.log(data);
  return data;
}

function flattenGeoenrichmentResponse(data: EsriResponse) {
  const attributes = data?.results?.[0]?.value?.FeatureSet?.[0]?.features?.[0]?.attributes;

  if (!attributes) {
    throw new Error('Invalid GeoEnrichment response structure.');
  }

  return {
    median_household_income: attributes.MEDHINC_CY ?? null,
    average_household_income: attributes.AVGHINC_CY ?? null,
    owner_occupied_units: attributes.OWNER_CY ?? null,
    renter_occupied_units: attributes.RENTER_CY ?? null,
    vacant_units: attributes.VACANT_CY ?? null,
    unemployment_population: attributes.UNEMP_CY ?? null,
    employment_population: attributes.EMP_CY ?? null,
    median_home_value: attributes.AVGVAL_CY ?? null,
    working_age_population: attributes.WORKAGE_CY ?? null,
    industry_base_population: attributes.INDBASE_CY ?? null,
    agriculture_forestry_fishing_hunting_population: attributes.INDAGRI_CY ?? null,
    mining_quarrying_oil_and_gas_extraction_population: attributes.INDMIN_CY ?? null,
    construction_population: attributes.INDCONS_CY ?? null,
    manufacturing_population: attributes.INDMANU_CY ?? null,
    wholesale_trade_population: attributes.INDWHTR_CY ?? null,
    retail_trade_population: attributes.INDRTTR_CY ?? null,
    transportation_warehousing_population: attributes.INDTRAN_CY ?? null,
    utilities_population: attributes.INDUTIL_CY ?? null,
    information_population: attributes.INDINFO_CY ?? null,
    finance_insurance_population: attributes.INDFIN_CY ?? null,
    real_estate_rental_leasing_population: attributes.INDRE_CY ?? null,
    professional_scientific_technical_services_population: attributes.INDTECH_CY ?? null,
    management_of_companies_enterprises_population: attributes.INDMGMT_CY ?? null,
    administrative_support_waste_management_services_population: attributes.INDADMN_CY ?? null,
    educational_services_population: attributes.INDEDUC_CY ?? null,
    health_care_social_assistance_population: attributes.INDHLTH_CY ?? null,
    arts_entertainment_recreation_population: attributes.INDARTS_CY ?? null,
    accommodation_food_services_population: attributes.INDFOOD_CY ?? null,
    other_services_population: attributes.INDOTSV_CY ?? null,
    public_administration_population: attributes.INDPUBL_CY ?? null,
  };
}

async function fetchAndFlattenStats(fipsCode: string) {
  const rawData = await fetchEsriData(fipsCode);
  const cleanData = flattenGeoenrichmentResponse(rawData);
  console.log(cleanData);
  return cleanData;
}