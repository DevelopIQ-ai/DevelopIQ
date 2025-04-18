"use client";

import { Loader2 } from "lucide-react";
import "@/styles/report.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MarketResearch, Radius } from "@/schemas/views/market-research-schema";

const formatRadius = (radius: Radius) => {
    return radius === 1 ? "one" : radius === 3 ? "three" : "five";
};

const years = ["2020", "2021", "2022", "2023", "2024"];

export const HousingGraphs = ({ marketData, radius }: {marketData: MarketResearch, radius: Radius}) => {
    
    const dataInRadius = marketData[`${formatRadius(radius)}_mile_attributes`];
    const yearlyHouseholdData = years.map((year) => ({
        year: parseInt(year),
        households: dataInRadius?.housing_data?.households[`total_households_${year}` as keyof typeof dataInRadius.housing_data.households]
    }));
    const yearlyHousingUnitsData = years.map((year) => ({
        year: parseInt(year),
        housingUnits: dataInRadius?.housing_data?.housing_units[`total_housing_units_${year}` as keyof typeof dataInRadius.housing_data.housing_units]
    }));
    
    return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Households Over Time</h3>
                {yearlyHouseholdData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={yearlyHouseholdData}
                            margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={(value) => new Intl.NumberFormat().format(value)} />
                            <Tooltip 
                                formatter={(value: number) => new Intl.NumberFormat().format(value)}
                                labelFormatter={(label: string) => `Year: ${label}`}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="households" 
                                name="Households" 
                                stroke="#f97316" 
                                strokeWidth={2}
                                activeDot={{ r: 8 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Housing Units Over Time</h3>
                {yearlyHousingUnitsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={yearlyHousingUnitsData}
                            margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={(value) => new Intl.NumberFormat().format(value)} />
                            <Tooltip 
                                formatter={(value: number) => new Intl.NumberFormat().format(value)}
                                labelFormatter={(label: string) => `Year: ${label}`}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="housingUnits" 
                                name="Housing Units" 
                                stroke="#f97316" 
                                strokeWidth={2}
                                activeDot={{ r: 8 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>
        </div>
    )
}