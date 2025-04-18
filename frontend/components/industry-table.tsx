"use client";
import React from "react";
import { MarketResearch, Radius } from "@/schemas/views/market-research-schema";

const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat().format(num);
};

const formatPercentage = (value: number, total: number) => {
    if (!total) return 'N/A';
    return `${((value / total) * 100).toFixed(1)}%`;
};

const formatRadius = (radius: Radius) => {
    return radius === 1 ? "one" : radius === 3 ? "three" : "five";
};

// Map of industry keys to display names
const industryMap = {
    agriculture_forestry_fishing_hunting_population: "Agriculture, Forestry, Fishing, and Hunting",
    mining_quarrying_oil_and_gas_extraction_population: "Mining, Quarrying, and Oil and Gas Extraction",
    construction_population: "Construction",
    manufacturing_population: "Manufacturing",
    wholesale_trade_population: "Wholesale Trade",
    retail_trade_population: "Retail Trade",
    transportation_warehousing_population: "Transportation and Warehousing",
    utilities_population: "Utilities",
    information_population: "Information and Cultural Industries",
    finance_insurance_population: "Finance and Insurance",
    real_estate_rental_leasing_population: "Real Estate and Rental and Leasing",
    professional_scientific_technical_services_population: "Professional, Scientific, and Technical Services",
    management_of_companies_enterprises_population: "Management of Companies and Enterprises",
    administrative_support_waste_management_services_population: "Administrative and Support and Waste Management and Remediation Services",
    educational_services_population: "Educational Services",
    health_care_social_assistance_population: "Health Care and Social Assistance",
    arts_entertainment_recreation_population: "Arts, Entertainment, and Recreation",
    accommodation_food_services_population: "Accommodation and Food Services",
    other_services_population: "Other Services",
    public_administration_population: "Public Administration",
};

export const IndustryTable = ({marketData, radius}: {marketData: MarketResearch, radius: Radius}) => {
    const dataInRadius = marketData[`${formatRadius(radius)}_mile_attributes`];
    const industryBasePopulation = dataInRadius?.employment_data?.industry_base_population || 0;

    const industryData = Object.entries(dataInRadius?.employment_data?.employment_by_industry).map(([key, value]) => ({
        industry: industryMap[key as keyof typeof industryMap],
        population: value
    }));

    if (!dataInRadius || !dataInRadius.employment_data?.employment_by_industry) return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Employment By Industry Table &#40;2024&#41;</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">This data is not available for this county.</p>
                    </div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Employment By Industry Table &#40;2024&#41;</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Industry
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Population
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    % Population
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(industryMap).map(([key, displayName]) => (
                                <tr key={key}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {displayName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatNumber(industryData.find(d => d.industry === displayName)?.population || 0)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatPercentage(industryData.find(d => d.industry === displayName)?.population || 0, industryBasePopulation)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}