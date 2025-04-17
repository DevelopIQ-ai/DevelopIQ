"use client";
import React from "react";
import { EsriData2024Schema } from "@/schemas/views/market-research-schema";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat().format(num);
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

export const IndustryGraph = ({esriData2024}: {esriData2024: EsriData2024Schema}) => {
    if (!esriData2024 || !esriData2024.employmentByIndustry) return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Employment By Industry Pie Chart</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">This data is not available for this county.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Create data for pie chart
    const pieData = Object.entries(industryMap)
        .map(([key, name]) => ({
            name,
            value: esriData2024.employmentByIndustry![key as keyof EsriData2024Schema] as number || 0
        }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);
    
    // Generate colors for the pie chart - more muted palette
    const COLORS = [
        '#4e79a7', '#59a14f', '#9c755f', '#f28e2b', '#76b7b2', 
        '#edc948', '#b07aa1', '#ff9da7', '#6c5b7b', '#8cd17d',
        '#86bcb6', '#a173a1', '#7a85d4', '#bab0ac', '#d37295',
        '#99765f', '#5d887a', '#8e8a93', '#c7b42e', '#499894'
    ];
    
    return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Employment By Industry Pie Chart</h3>
                
                {/* Pie Chart Section */}
                <div className="mb-8">
                    <ResponsiveContainer width="100%" height={600}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="value"
                                label={({name, percent}) => {
                                    // Only show labels for slices that are 5% or larger
                                    return percent >= 0.05 ? `${name}: ${(percent * 100).toFixed(1)}%` : '';
                                }}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value) => formatNumber(value as number)}
                                labelFormatter={(index) => pieData[index as number].name}
                            />
                            <Legend 
                                layout="horizontal" 
                                verticalAlign="bottom" 
                                align="center"
                                wrapperStyle={{ fontSize: '0.75rem' }} // Makes legend text smaller
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}