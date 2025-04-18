"use client";
import React from "react";
import { MarketResearch, Radius } from "@/schemas/views/market-research-schema";

const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat().format(num);
};

const formatPercent = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return `${num.toFixed(1)}%`;
};

const formatRadius = (radius: Radius) => {
    return radius === 1 ? "one" : radius === 3 ? "three" : "five";
};

export const PopulationMetrics = ({ marketData, radius }: {marketData: MarketResearch, radius: Radius}) => {
    
    const dataInRadius = marketData[`${formatRadius(radius)}_mile_attributes`];
    const population2020 = dataInRadius?.population_data?.yearly_populations?.total_population_2020;
    const population2024 = dataInRadius?.population_data?.yearly_populations?.total_population_2024;
    const populationChange = population2024 && population2020 ? ((population2024 - population2020) / population2020) * 100 : null;
    const malePopulation = dataInRadius?.population_data?.male_population;
    const femalePopulation = dataInRadius?.population_data?.female_population;
    const malePercent = malePopulation && population2024 ? (malePopulation / population2024) * 100 : null;
    const femalePercent = femalePopulation && population2024 ? (femalePopulation / population2024) * 100 : null;
    const medianAge = dataInRadius?.population_data?.median_age;
    const youthPopulation = dataInRadius?.population_data?.youth_population;
    const agingPopulation = dataInRadius?.population_data?.elderly_population;
    const workingAgePopulation = dataInRadius?.population_data?.working_age_population;
    const youthPercent = youthPopulation && population2024 ? (youthPopulation / population2024) * 100 : null;
    const agingPercent = agingPopulation && population2024 ? (agingPopulation / population2024) * 100 : null;
    const workingAgePercent = workingAgePopulation && population2024 ? (workingAgePopulation / population2024) * 100 : null;
    const unemploymentRate = dataInRadius?.employment_data?.unemployment_rate;
    
    return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Population Growth</h3>
                <div className="grid grid-cols-2 gap-4">
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">2020 Population</p>
                    <p className="text-2xl font-bold">{formatNumber(population2020)}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">2024 Population</p>
                    <p className="text-2xl font-bold">{formatNumber(population2024)}</p>
                </div>
                <div className="stat-item col-span-2">
                    <p className="text-sm text-muted-foreground">Population Change &#40;2020-2024&#41;</p>
                    <p className="text-2xl font-bold">{formatPercent(populationChange)}</p>
                </div>
                </div>
            </div>

            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Gender Distribution &#40;2024&#41;</h3>
                <div className="grid grid-cols-2 gap-4">
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Male</p>
                    <p className="text-2xl font-bold">{formatPercent(malePercent)}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Female</p>
                    <p className="text-2xl font-bold">{formatPercent(femalePercent)}</p>
                </div>
                </div>
            </div>

            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Age Demographics &#40;2024&#41;</h3>
                <div className="grid grid-cols-2 gap-4">
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Median Age</p>
                    <p className="text-2xl font-bold">{formatNumber(medianAge)}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Youth Population &#40;0-24&#41;</p>
                    <p className="text-2xl font-bold">{formatPercent(youthPercent)}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Working Age &#40;25-64&#41;</p>
                    <p className="text-2xl font-bold">{formatPercent(workingAgePercent)}</p>
                </div>
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Aging Population &#40;65+&#41;</p>
                    <p className="text-2xl font-bold">{formatPercent(agingPercent)}</p>
                </div>
                </div>
            </div>

            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Workforce & Dependency &#40;2024&#41;</h3>
                <div className="grid grid-cols-2 gap-4">
                <div className="stat-item">
                    <p className="text-sm text-muted-foreground">Unemployment Rate</p>
                    <p className="text-2xl font-bold">{formatPercent(unemploymentRate)}</p>
                </div>
                </div>
            </div>
        </div>
    )
}