"use client";

import { Loader2 } from "lucide-react";
import "@/styles/report.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import { MarketResearch, Radius } from "@/schemas/views/market-research-schema";

const formatRadius = (radius: Radius) => {
    return radius === 1 ? "one" : radius === 3 ? "three" : "five";
};

const years = ["2020", "2021", "2022", "2023", "2024"];
const ageGroups = {
    age_0_4: "0-4",
    age_5_9: "5-9",
    age_10_14: "10-14",
    age_15_19: "15-19",
    age_20_24: "20-24",
    age_25_29: "25-29",
    age_30_34: "30-34",
    age_35_39: "35-39",
    age_40_44: "40-44",
    age_45_49: "45-49",
    age_50_54: "50-54",
    age_55_59: "55-59",
    age_60_64: "60-64",
    age_65_69: "65-69",
    age_70_74: "70-74",
    age_75_79: "75-79",
    age_80_84: "80-84",
    age_85_plus: "85+"
};
export const PopulationGraphs = ({ marketData, radius }: {marketData: MarketResearch, radius: Radius}) => {
    
    const dataInRadius = marketData[`${formatRadius(radius)}_mile_attributes`];
    const yearlyPopulationData = years.map((year) => ({
        year: parseInt(year),
        population: dataInRadius?.population_data?.yearly_populations[`total_population_${year}` as keyof typeof dataInRadius.population_data.yearly_populations]
    }));
    const populationPyramidData = Object.entries(dataInRadius?.population_data?.five_year_age_brackets).map(([ageGroup, count]) => ({
        ageGroup: ageGroups[ageGroup as keyof typeof ageGroups],
        count: count || null
    })).reverse();
    
    return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Population Growth Over Time</h3>
                {yearlyPopulationData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={yearlyPopulationData}
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
                                dataKey="population" 
                                name="Population" 
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
            <div className="market-data-section flex flex-col">
                <h3 className="text-lg font-semibold mb-2">Population Age Distribution</h3>
                {populationPyramidData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart
                            layout="vertical"
                            data={populationPyramidData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                type="number" 
                                domain={[0, 'dataMax']} 
                            />
                            <YAxis 
                                type="category" 
                                dataKey="ageGroup" 
                                width={60}
                            />
                            <Tooltip 
                                formatter={(value: number) => new Intl.NumberFormat().format(value)}
                                labelFormatter={(label) => `Age: ${label}`}
                            />
                            <Legend />
                            <ReferenceLine x={0} stroke="#000" />
                            <Bar 
                                dataKey="count" 
                                name="Population" 
                                fill="#f97316" 
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>
        </div>
    )
}