import { useState, useEffect } from 'react';
import { PropertyReportHandler } from '@/lib/report-handler';
import { MarketResearch } from '@/schemas/views/market-research-schema';
export function useMarketResearchData(
  reportHandler: PropertyReportHandler
) {
  const [marketData, setMarketData] = useState<MarketResearch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchMarketData() {
      if (!reportHandler) return;

      // Get latitude and longitude from localStorage
      const latitude = localStorage.getItem("propertyLatitude");
      const longitude = localStorage.getItem("propertyLongitude");
      const county = localStorage.getItem("county");
      const state = localStorage.getItem("state");
      if (!latitude || !longitude) {
        setError("No latitude or longitude found for this location.");
        setLoading(false);
        return;
      }

      if (reportHandler.getMarketResearch()) {
        setMarketData(reportHandler.getMarketResearch() || null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // Create a cache key based on coordinates
      const cacheKey = "marketResearchData";
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setMarketData(parsedData);
          reportHandler.setMarketResearch(parsedData);
          setLoading(false);
          return;
        } catch (err) {
          console.error('Error with cached data:', err);
          // Continue with fetching if there's an issue with cached data
        }
      }
      
      try {
        const coords = {
          x: latitude,
          y: longitude
        };
        
        // Fetch and flatten ESRI data using coordinates
        const data = await fetchAndFlattenStats(coords);
        if (county && state) {
          const blsData = await fetchBlsData(county, state);
          console.log(blsData);

        }
        console.log(data);
        setMarketData(data);
        
        // Store the data in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(data));
        reportHandler.setMarketResearch(data);
        
      } catch (err) {
        console.error('Error fetching market research data:', err);
        setError('Failed to load market research data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMarketData();
  }, [reportHandler]);
  
  return {
    marketData,
    loading,
    error
  };
}

// List of ESRI variables to fetch
const variables = [
  'TOTPOP_CY',
  'TSPOP23_CY',
  'TSPOP22_CY',
  'TSPOP21_CY',
  'TSPOP20_CY',
  'MALES_CY',
  'FEMALES_CY',
  'MEDAGE_CY',
  'CHILD_CY',
  'WORKAGE_CY',
  'SENIOR_CY',
  'MEDHINC_CY',
  'AVGHINC_CY',
  'OWNER_CY',
  'RENTER_CY',
  'VACANT_CY',
  'AVGVAL_CY',
  'TOTHH_CY',
  'TSHH23_CY',
  'TSHH22_CY',
  'TSHH21_CY',
  'TSHH20_CY',
  'TOTHU_CY',
  'TSHU23_CY',
  'TSHU22_CY',
  'TSHU21_CY',
  'TSHU20_CY',
  'UNEMPRT_CY',
  'INDBASE_CY',
  'INDAGRI_CY',
  'INDMIN_CY',
  'INDCONS_CY',
  'INDMANU_CY',
  'INDWHTR_CY',
  'INDRTTR_CY',
  'INDTRAN_CY',
  'INDUTIL_CY',
  'INDINFO_CY',
  'INDFIN_CY',
  'INDRE_CY',
  'INDTECH_CY',
  'INDMGMT_CY',
  'INDADMN_CY',
  'INDEDUC_CY',
  'INDHLTH_CY',
  'INDARTS_CY',
  'INDFOOD_CY',
  'INDOTSV_CY',
  'INDPUBL_CY',
  'POP0_CY',
  'POP5_CY',
  'POP10_CY',
  'POP15_CY',
  'POP20_CY',
  'POP25_CY',
  'POP30_CY',
  'POP35_CY',
  'POP40_CY',
  'POP45_CY',
  'POP50_CY',
  'POP55_CY',
  'POP60_CY',
  'POP65_CY',
  'POP70_CY',
  'POP75_CY',
  'POP80_CY',
  'POP85_CY',
];

interface Coordinates {
  x: string; // latitude
  y: string; // longitude
}

interface EsriResponse {
  results: [{
    value: {
      FeatureSet: [{
        features: [
          { attributes: Record<string, number> },
          { attributes: Record<string, number> },
          { attributes: Record<string, number> }
        ]
      }]
    }
  }]
}

async function fetchBlsData(county: string, state: string) {
  const response = await fetch("/api/bls", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ county, state, queryType: "unemployment_rate" }),
  });
  const data = await response.json();
  return data;
}

async function fetchEsriData(coords: Coordinates) {
  const apiKey = process.env.NEXT_PUBLIC_ESRI_API_KEY;
  const baseUrl = 'https://geoenrich.arcgis.com/arcgis/rest/services/World/GeoEnrichmentServer/GeoEnrichment/enrich';

  const url = new URL(baseUrl);
  url.searchParams.append('f', 'json');
  url.searchParams.append('token', apiKey || '');
  url.searchParams.append('studyAreas', JSON.stringify([{
    "sourceCountry": "US",
    "geometry": { "x": coords.y, "y": coords.x },
    "areaType": "RingBuffer",
    "bufferUnits": "esriMiles",
    "bufferRadii": [1, 3, 5]
  }]));
  url.searchParams.append('analysisVariables', variables.join(','));

  const response = await fetch(url.toString(), {
    method: 'GET',
  });

  const data = await response.json();
  return data;
}

function flattenGeoenrichmentResponse(data: EsriResponse) {
  const oneMileAttributes = data?.results?.[0]?.value?.FeatureSet?.[0]?.features?.[0]?.attributes;
  const threeMileAttributes = data?.results?.[0]?.value?.FeatureSet?.[0]?.features?.[1]?.attributes;
  const fiveMileAttributes = data?.results?.[0]?.value?.FeatureSet?.[0]?.features?.[2]?.attributes;

  if (!oneMileAttributes || !threeMileAttributes || !fiveMileAttributes) {
    throw new Error('Invalid GeoEnrichment response structure.');
  }

  return {
    one_mile_attributes: {
      population_data: {
        yearly_populations: {
          total_population_2024: oneMileAttributes.TOTPOP_CY ?? null,
          total_population_2023: oneMileAttributes.TSPOP23_CY ?? null,
          total_population_2022: oneMileAttributes.TSPOP22_CY ?? null,
          total_population_2021: oneMileAttributes.TSPOP21_CY ?? null,
          total_population_2020: oneMileAttributes.TSPOP20_CY ?? null,
        },
        five_year_age_brackets: {
           age_0_4: oneMileAttributes.POP0_CY ?? null,
           age_5_9: oneMileAttributes.POP5_CY ?? null,
           age_10_14: oneMileAttributes.POP10_CY ?? null,
           age_15_19: oneMileAttributes.POP15_CY ?? null,
           age_20_24: oneMileAttributes.POP20_CY ?? null,
           age_25_29: oneMileAttributes.POP25_CY ?? null,
           age_30_34: oneMileAttributes.POP30_CY ?? null,  
           age_35_39: oneMileAttributes.POP35_CY ?? null, 
           age_40_44: oneMileAttributes.POP40_CY ?? null, 
           age_45_49: oneMileAttributes.POP45_CY ?? null, 
           age_50_54: oneMileAttributes.POP50_CY ?? null, 
           age_55_59: oneMileAttributes.POP55_CY ?? null, 
           age_60_64: oneMileAttributes.POP60_CY ?? null, 
           age_65_69: oneMileAttributes.POP65_CY ?? null, 
           age_70_74: oneMileAttributes.POP70_CY ?? null, 
           age_75_79: oneMileAttributes.POP75_CY ?? null, 
           age_80_84: oneMileAttributes.POP80_CY ?? null, 
           age_85_plus: oneMileAttributes.POP85_CY ?? null, 
        },
        male_population: oneMileAttributes.MALES_CY ?? null,
        female_population: oneMileAttributes.FEMALES_CY ?? null,
        median_age: oneMileAttributes.MEDAGE_CY ?? null,
        youth_population: oneMileAttributes.CHILD_CY ?? null,
        working_age_population: oneMileAttributes.WORKAGE_CY ?? null,
        elderly_population: oneMileAttributes.SENIOR_CY ?? null,
      },
      housing_data: {
        median_household_income: oneMileAttributes.MEDHINC_CY ?? null,
        average_household_income: oneMileAttributes.AVGHINC_CY ?? null,
        owner_occupied_units: oneMileAttributes.OWNER_CY ?? null,
        renter_occupied_units: oneMileAttributes.RENTER_CY ?? null,
        vacant_units: oneMileAttributes.VACANT_CY ?? null,
        median_home_value: oneMileAttributes.AVGVAL_CY ?? null,
        total_renters: oneMileAttributes.RENTER_CY ?? null,
        total_owner_occupied: oneMileAttributes.OWNER_CY ?? null,
        total_vacant: oneMileAttributes.VACANT_CY ?? null,
        households: {
          total_households_2024: oneMileAttributes.TOTHH_CY ?? null,
          total_households_2023: oneMileAttributes.TSHH23_CY ?? null,
          total_households_2022: oneMileAttributes.TSHH22_CY ?? null,
          total_households_2021: oneMileAttributes.TSHH21_CY ?? null,
          total_households_2020: oneMileAttributes.TSHH20_CY ?? null,
        },
        housing_units: {
          total_housing_units_2024: oneMileAttributes.TOTHU_CY ?? null,
          total_housing_units_2023: oneMileAttributes.TSHU23_CY ?? null,
          total_housing_units_2022: oneMileAttributes.TSHU22_CY ?? null,
          total_housing_units_2021: oneMileAttributes.TSHU21_CY ?? null,
          total_housing_units_2020: oneMileAttributes.TSHU20_CY ?? null,
        }
      },
      employment_data: {
        working_age_population: oneMileAttributes.WORKAGE_CY ?? null,
        unemployment_rate: oneMileAttributes.UNEMPRT_CY ?? null,
        industry_base_population: oneMileAttributes.INDBASE_CY ?? null,
        employment_by_industry: {
          agriculture_forestry_fishing_hunting_population: oneMileAttributes.INDAGRI_CY ?? null,
          mining_quarrying_oil_and_gas_extraction_population: oneMileAttributes.INDMIN_CY ?? null,
          construction_population: oneMileAttributes.INDCONS_CY ?? null,
          manufacturing_population: oneMileAttributes.INDMANU_CY ?? null,
          wholesale_trade_population: oneMileAttributes.INDWHTR_CY ?? null,
          retail_trade_population: oneMileAttributes.INDRTTR_CY ?? null,
          transportation_warehousing_population: oneMileAttributes.INDTRAN_CY ?? null,
          utilities_population: oneMileAttributes.INDUTIL_CY ?? null,
          information_population: oneMileAttributes.INDINFO_CY ?? null,
          finance_insurance_population: oneMileAttributes.INDFIN_CY ?? null,
          real_estate_rental_leasing_population: oneMileAttributes.INDRE_CY ?? null,
          professional_scientific_technical_services_population: oneMileAttributes.INDTECH_CY ?? null,
          management_of_companies_enterprises_population: oneMileAttributes.INDMGMT_CY ?? null,
          administrative_support_waste_management_services_population: oneMileAttributes.INDADMN_CY ?? null,
          educational_services_population: oneMileAttributes.INDEDUC_CY ?? null,
          health_care_social_assistance_population: oneMileAttributes.INDHLTH_CY ?? null,
          arts_entertainment_recreation_population: oneMileAttributes.INDARTS_CY ?? null,
          accommodation_food_services_population: oneMileAttributes.INDFOOD_CY ?? null,
          other_services_population: oneMileAttributes.INDOTSV_CY ?? null,
          public_administration_population: oneMileAttributes.INDPUBL_CY ?? null,
        }
      }
    },
    three_mile_attributes: {
      population_data: {
        yearly_populations: {
          total_population_2024: threeMileAttributes.TOTPOP_CY ?? null,
          total_population_2023: threeMileAttributes.TSPOP23_CY ?? null,
          total_population_2022: threeMileAttributes.TSPOP22_CY ?? null,
          total_population_2021: threeMileAttributes.TSPOP21_CY ?? null,
          total_population_2020: threeMileAttributes.TSPOP20_CY ?? null,
        },
        five_year_age_brackets: {
          age_0_4: threeMileAttributes.POP0_CY ?? null,
          age_5_9: threeMileAttributes.POP5_CY ?? null,
          age_10_14: threeMileAttributes.POP10_CY ?? null,
          age_15_19: threeMileAttributes.POP15_CY ?? null,
          age_20_24: threeMileAttributes.POP20_CY ?? null,
          age_25_29: threeMileAttributes.POP25_CY ?? null,
          age_30_34: threeMileAttributes.POP30_CY ?? null,  
          age_35_39: threeMileAttributes.POP35_CY ?? null, 
          age_40_44: threeMileAttributes.POP40_CY ?? null, 
          age_45_49: threeMileAttributes.POP45_CY ?? null, 
          age_50_54: threeMileAttributes.POP50_CY ?? null, 
          age_55_59: threeMileAttributes.POP55_CY ?? null, 
          age_60_64: threeMileAttributes.POP60_CY ?? null, 
          age_65_69: threeMileAttributes.POP65_CY ?? null, 
          age_70_74: threeMileAttributes.POP70_CY ?? null, 
          age_75_79: threeMileAttributes.POP75_CY ?? null, 
          age_80_84: threeMileAttributes.POP80_CY ?? null, 
          age_85_plus: threeMileAttributes.POP85_CY ?? null, 
       },
        male_population: threeMileAttributes.MALES_CY ?? null,
        female_population: threeMileAttributes.FEMALES_CY ?? null,
        median_age: threeMileAttributes.MEDAGE_CY ?? null,
        youth_population: threeMileAttributes.CHILD_CY ?? null,
        working_age_population: threeMileAttributes.WORKAGE_CY ?? null,
        elderly_population: threeMileAttributes.SENIOR_CY ?? null,
      },
      housing_data: {
        median_household_income: threeMileAttributes.MEDHINC_CY ?? null,
        average_household_income: threeMileAttributes.AVGHINC_CY ?? null,
        owner_occupied_units: threeMileAttributes.OWNER_CY ?? null,
        renter_occupied_units: threeMileAttributes.RENTER_CY ?? null,
        vacant_units: threeMileAttributes.VACANT_CY ?? null,
        median_home_value: threeMileAttributes.AVGVAL_CY ?? null,
        total_renters: threeMileAttributes.RENTER_CY ?? null,
        total_owner_occupied: threeMileAttributes.OWNER_CY ?? null,
        total_vacant: threeMileAttributes.VACANT_CY ?? null,
        households: {
          total_households_2024: threeMileAttributes.TOTHH_CY ?? null,
          total_households_2023: threeMileAttributes.TSHH23_CY ?? null,
          total_households_2022: threeMileAttributes.TSHH22_CY ?? null,
          total_households_2021: threeMileAttributes.TSHH21_CY ?? null,
          total_households_2020: threeMileAttributes.TSHH20_CY ?? null,
        },
        housing_units: {
          total_housing_units_2024: threeMileAttributes.TOTHU_CY ?? null,
          total_housing_units_2023: threeMileAttributes.TSHU23_CY ?? null,
          total_housing_units_2022: threeMileAttributes.TSHU22_CY ?? null,
          total_housing_units_2021: threeMileAttributes.TSHU21_CY ?? null,
          total_housing_units_2020: threeMileAttributes.TSHU20_CY ?? null,
        }
      },
      employment_data: {
        working_age_population: threeMileAttributes.WORKAGE_CY ?? null,
        unemployment_rate: threeMileAttributes.UNEMPRT_CY ?? null,
        industry_base_population: threeMileAttributes.INDBASE_CY ?? null,
        employment_by_industry: {
          agriculture_forestry_fishing_hunting_population: threeMileAttributes.INDAGRI_CY ?? null,
          mining_quarrying_oil_and_gas_extraction_population: threeMileAttributes.INDMIN_CY ?? null,
          construction_population: threeMileAttributes.INDCONS_CY ?? null,
          manufacturing_population: threeMileAttributes.INDMANU_CY ?? null,
          wholesale_trade_population: threeMileAttributes.INDWHTR_CY ?? null,
          retail_trade_population: threeMileAttributes.INDRTTR_CY ?? null,
          transportation_warehousing_population: threeMileAttributes.INDTRAN_CY ?? null,
          utilities_population: threeMileAttributes.INDUTIL_CY ?? null,
          information_population: threeMileAttributes.INDINFO_CY ?? null,
          finance_insurance_population: threeMileAttributes.INDFIN_CY ?? null,
          real_estate_rental_leasing_population: threeMileAttributes.INDRE_CY ?? null,
          professional_scientific_technical_services_population: threeMileAttributes.INDTECH_CY ?? null,
          management_of_companies_enterprises_population: threeMileAttributes.INDMGMT_CY ?? null,
          administrative_support_waste_management_services_population: threeMileAttributes.INDADMN_CY ?? null,
          educational_services_population: threeMileAttributes.INDEDUC_CY ?? null,
          health_care_social_assistance_population: threeMileAttributes.INDHLTH_CY ?? null,
          arts_entertainment_recreation_population: threeMileAttributes.INDARTS_CY ?? null,
          accommodation_food_services_population: threeMileAttributes.INDFOOD_CY ?? null,
          other_services_population: threeMileAttributes.INDOTSV_CY ?? null,
          public_administration_population: threeMileAttributes.INDPUBL_CY ?? null,
        }
      }
    },
    five_mile_attributes: {
      population_data: {
        yearly_populations: {
          total_population_2024: fiveMileAttributes.TOTPOP_CY ?? null,
          total_population_2023: fiveMileAttributes.TSPOP23_CY ?? null,
          total_population_2022: fiveMileAttributes.TSPOP22_CY ?? null,
          total_population_2021: fiveMileAttributes.TSPOP21_CY ?? null,
          total_population_2020: fiveMileAttributes.TSPOP20_CY ?? null,
        },
        five_year_age_brackets: {
          age_0_4: fiveMileAttributes.POP0_CY ?? null,
          age_5_9: fiveMileAttributes.POP5_CY ?? null,
          age_10_14: fiveMileAttributes.POP10_CY ?? null,
          age_15_19: fiveMileAttributes.POP15_CY ?? null,
          age_20_24: fiveMileAttributes.POP20_CY ?? null,
          age_25_29: fiveMileAttributes.POP25_CY ?? null,
          age_30_34: fiveMileAttributes.POP30_CY ?? null,  
          age_35_39: fiveMileAttributes.POP35_CY ?? null, 
          age_40_44: fiveMileAttributes.POP40_CY ?? null, 
          age_45_49: fiveMileAttributes.POP45_CY ?? null, 
          age_50_54: fiveMileAttributes.POP50_CY ?? null, 
          age_55_59: fiveMileAttributes.POP55_CY ?? null, 
          age_60_64: fiveMileAttributes.POP60_CY ?? null, 
          age_65_69: fiveMileAttributes.POP65_CY ?? null, 
          age_70_74: fiveMileAttributes.POP70_CY ?? null, 
          age_75_79: fiveMileAttributes.POP75_CY ?? null, 
          age_80_84: fiveMileAttributes.POP80_CY ?? null, 
          age_85_plus: fiveMileAttributes.POP85_CY ?? null, 
       },
        male_population: fiveMileAttributes.MALES_CY ?? null,
        female_population: fiveMileAttributes.FEMALES_CY ?? null,
        median_age: fiveMileAttributes.MEDAGE_CY ?? null,
        youth_population: fiveMileAttributes.CHILD_CY ?? null,
        working_age_population: fiveMileAttributes.WORKAGE_CY ?? null,
        elderly_population: fiveMileAttributes.SENIOR_CY ?? null,
      },
      housing_data: {
        median_household_income: fiveMileAttributes.MEDHINC_CY ?? null,
        average_household_income: fiveMileAttributes.AVGHINC_CY ?? null,
        owner_occupied_units: fiveMileAttributes.OWNER_CY ?? null,
        renter_occupied_units: fiveMileAttributes.RENTER_CY ?? null,
        vacant_units: fiveMileAttributes.VACANT_CY ?? null,
        median_home_value: fiveMileAttributes.AVGVAL_CY ?? null,
        total_renters: fiveMileAttributes.RENTER_CY ?? null,
        total_owner_occupied: fiveMileAttributes.OWNER_CY ?? null,
        total_vacant: fiveMileAttributes.VACANT_CY ?? null,
        households: {
          total_households_2024: fiveMileAttributes.TOTHH_CY ?? null,
          total_households_2023: fiveMileAttributes.TSHH23_CY ?? null,
          total_households_2022: fiveMileAttributes.TSHH22_CY ?? null,
          total_households_2021: fiveMileAttributes.TSHH21_CY ?? null,
          total_households_2020: fiveMileAttributes.TSHH20_CY ?? null,
        },
        housing_units: {
          total_housing_units_2024: fiveMileAttributes.TOTHU_CY ?? null,
          total_housing_units_2023: fiveMileAttributes.TSHU23_CY ?? null,
          total_housing_units_2022: fiveMileAttributes.TSHU22_CY ?? null,
          total_housing_units_2021: fiveMileAttributes.TSHU21_CY ?? null,
          total_housing_units_2020: fiveMileAttributes.TSHU20_CY ?? null,
        }
      },
      employment_data: {
        working_age_population: fiveMileAttributes.WORKAGE_CY ?? null,
        unemployment_rate: fiveMileAttributes.UNEMPRT_CY ?? null,
        industry_base_population: fiveMileAttributes.INDBASE_CY ?? null,
        employment_by_industry: {
          agriculture_forestry_fishing_hunting_population: fiveMileAttributes.INDAGRI_CY ?? null,
          mining_quarrying_oil_and_gas_extraction_population: fiveMileAttributes.INDMIN_CY ?? null,
          construction_population: fiveMileAttributes.INDCONS_CY ?? null,
          manufacturing_population: fiveMileAttributes.INDMANU_CY ?? null,
          wholesale_trade_population: fiveMileAttributes.INDWHTR_CY ?? null,
          retail_trade_population: fiveMileAttributes.INDRTTR_CY ?? null,
          transportation_warehousing_population: fiveMileAttributes.INDTRAN_CY ?? null,
          utilities_population: fiveMileAttributes.INDUTIL_CY ?? null,
          information_population: fiveMileAttributes.INDINFO_CY ?? null,
          finance_insurance_population: fiveMileAttributes.INDFIN_CY ?? null,
          real_estate_rental_leasing_population: fiveMileAttributes.INDRE_CY ?? null,
          professional_scientific_technical_services_population: fiveMileAttributes.INDTECH_CY ?? null,
          management_of_companies_enterprises_population: fiveMileAttributes.INDMGMT_CY ?? null,
          administrative_support_waste_management_services_population: fiveMileAttributes.INDADMN_CY ?? null,
          educational_services_population: fiveMileAttributes.INDEDUC_CY ?? null,
          health_care_social_assistance_population: fiveMileAttributes.INDHLTH_CY ?? null,
          arts_entertainment_recreation_population: fiveMileAttributes.INDARTS_CY ?? null,
          accommodation_food_services_population: fiveMileAttributes.INDFOOD_CY ?? null,
          other_services_population: fiveMileAttributes.INDOTSV_CY ?? null,
          public_administration_population: fiveMileAttributes.INDPUBL_CY ?? null,
        }
      }
    }
  };
}

async function fetchAndFlattenStats(coords: Coordinates) {
  const rawData = await fetchEsriData(coords);
  const cleanData = flattenGeoenrichmentResponse(rawData);
  return cleanData;
}