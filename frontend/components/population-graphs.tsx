"use client";

import { Loader2 } from "lucide-react";
import "@/styles/report.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import { YearlyPopulationGraphDataPoint, PopulationPyramidDataPoint } from "@/schemas/views/market-research-schema";

export const PopulationGraphs = ({yearlyPopulationData, populationPyramidData, endYear}: {yearlyPopulationData: YearlyPopulationGraphDataPoint[], populationPyramidData: PopulationPyramidDataPoint[], endYear: number}) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Population Growth Over Time</h3>
                {yearlyPopulationData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={yearlyPopulationData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
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
                <h3 className="text-lg font-semibold mb-2">Population Age Distribution ({endYear})</h3>
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
                                tickFormatter={(value) => `${value}%`}
                            />
                            <YAxis 
                                type="category" 
                                dataKey="ageGroup" 
                                width={60}
                            />
                            <Tooltip 
                                formatter={(value) => `${value}%`}
                                labelFormatter={(label) => `Age: ${label}`}
                            />
                            <Legend />
                            <ReferenceLine x={0} stroke="#000" />
                            <Bar 
                                dataKey="percentage" 
                                name="Population %" 
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