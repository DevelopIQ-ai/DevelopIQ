"use client";
import React from "react";
import { EsriData2024Schema } from "@/schemas/views/market-research-schema";

const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat().format(num);
};

const formatPercentage = (value: number, total: number) => {
    if (!total) return 'N/A';
    return `${((value / total) * 100).toFixed(1)}%`;
};

// Map of industry keys to display names
const industryMap = {
    agricultureForestryFishingHuntingPopulation: "Agriculture, Forestry, Fishing & Hunting",
    miningQuarryingOilAndGasExtractionPopulation: "Mining, Quarrying, Oil & Gas Extraction",
    constructionPopulation: "Construction",
    manufacturingPopulation: "Manufacturing",
    wholesaleTradePopulation: "Wholesale Trade",
    retailTradePopulation: "Retail Trade",
    transportationWarehousingPopulation: "Transportation & Warehousing",
    utilitiesPopulation: "Utilities",
    informationPopulation: "Information",
    financeInsurancePopulation: "Finance & Insurance",
    realEstateRentalLeasingPopulation: "Real Estate, Rental & Leasing",
    professionalScientificTechnicalServicesPopulation: "Professional, Scientific & Technical Services",
    managementOfCompaniesEnterprisesPopulation: "Management of Companies & Enterprises",
    administrativeSupportWasteManagementServicesPopulation: "Administrative Support & Waste Management",
    educationalServicesPopulation: "Educational Services",
    healthCareSocialAssistancePopulation: "Healthcare & Social Assistance",
    artsEntertainmentRecreationPopulation: "Arts, Entertainment & Recreation",
    accommodationFoodServicesPopulation: "Accommodation & Food Services",
    otherServicesPopulation: "Other Services",
    publicAdministrationPopulation: "Public Administration",
};

export const IndustryTable = ({esriData2024}: {esriData2024: EsriData2024Schema}) => {
    const basePopulation = esriData2024?.employmentByIndustry?.industryBasePopulation || 0;

    if (!esriData2024 || !esriData2024.employmentByIndustry) return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Employment By Industry Table</h3>
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
                <h3 className="text-lg font-semibold mb-2">Employment By Industry Table</h3>
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
                                        {formatNumber(esriData2024.employmentByIndustry![key as keyof EsriData2024Schema] as number)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatPercentage(esriData2024.employmentByIndustry![key as keyof EsriData2024Schema] as number, basePopulation)}
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