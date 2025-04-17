"use client";
import React from "react";
import { MarketResearchDataSchema } from "@/schemas/views/market-research-schema";

const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat().format(num);
};

const formatPercent = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return `${num}%`;
};

export const PopulationMetrics = ({marketData, startYear, endYear}: {marketData: MarketResearchDataSchema, startYear: number, endYear: number}) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Population Growth</h3>
                <div className="grid grid-cols-2 gap-4">
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">{startYear} Population</p>
                    <p className="text-2xl font-bold">{formatNumber(marketData.pop_start)}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">{endYear} Population</p>
                    <p className="text-2xl font-bold">{formatNumber(marketData.pop_end)}</p>
                </div>
                <div className="stat-item col-span-2">
                    <p className="text-sm text-muted-foreground">Population Change ({startYear}-{endYear})</p>
                    <p className="text-2xl font-bold">{formatPercent(marketData.percent_population_change)}</p>
                </div>
                </div>
            </div>

            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Gender Distribution ({endYear})</h3>
                <div className="grid grid-cols-2 gap-4">
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Male</p>
                    <p className="text-2xl font-bold">{formatPercent(marketData.male_percent_end)}</p>
                    <p className="text-xs text-muted-foreground">±{formatPercent(marketData.male_moe_percent_end)}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Female</p>
                    <p className="text-2xl font-bold">{formatPercent(marketData.female_percent_end)}</p>
                    <p className="text-xs text-muted-foreground">±{formatPercent(marketData.female_moe_percent_end)}</p>
                </div>
                </div>
            </div>

            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Age Demographics</h3>
                <div className="grid grid-cols-2 gap-4">
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Median Age ({startYear})</p>
                    <p className="text-2xl font-bold">{marketData.median_age_start}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Median Age ({endYear})</p>
                    <p className="text-2xl font-bold">{marketData.median_age_end}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Youth Population (0-24)</p>
                    <p className="text-2xl font-bold">{formatPercent(marketData.youth_percent_2023)}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Aging Population (65+)</p>
                    <p className="text-2xl font-bold">{formatPercent(marketData.aging_percent_2023)}</p>
                </div>
                </div>
            </div>

            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Workforce & Generations</h3>
                <div className="grid grid-cols-2 gap-4">
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Working Age (25-44)</p>
                    <p className="text-2xl font-bold">{formatPercent(marketData.working_age_percent_2023)}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Age Dependency Ratio</p>
                    <p className="text-2xl font-bold">{marketData.age_dependency_ratio_2023}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Boomer Share</p>
                    <p className="text-2xl font-bold">{formatPercent(marketData.boomer_percent_2023)}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Millennial Share</p>
                    <p className="text-2xl font-bold">{formatPercent(marketData.millennial_percent_2023)}</p>
                </div>
                </div>
            </div>
        </div>
    )
}