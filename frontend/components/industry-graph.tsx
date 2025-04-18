"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { EsriData2024Schema, MarketResearch, Radius } from "@/schemas/views/market-research-schema";

const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat().format(num);
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

export const IndustryGraph = ({marketData, radius}: {marketData: MarketResearch, radius: Radius}) => {
    const dataInRadius = marketData[`${formatRadius(radius)}_mile_attributes`];
    if (!dataInRadius || !dataInRadius.employment_data?.employment_by_industry) return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Employment By Industry Pie Chart &#40;2024&#41;</h3>
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
            value: dataInRadius.employment_data.employment_by_industry![key as keyof EsriData2024Schema] as number || 0
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
                <h3 className="text-lg font-semibold mb-2">Employment By Industry Pie Chart &#40;2024&#41;</h3>
                
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