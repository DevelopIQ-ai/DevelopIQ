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

export const HousingMetrics = ({marketData, radius}: {marketData: MarketResearch, radius: Radius}) => {
    const dataInRadius = marketData[`${formatRadius(radius)}_mile_attributes`];
    const medianHomeValue = dataInRadius?.housing_data?.median_home_value;
    const medianHouseholdIncome = dataInRadius?.housing_data?.median_household_income;
    const averageHouseholdIncome = dataInRadius?.housing_data?.average_household_income;
    const totalHousingUnits = dataInRadius?.housing_data?.housing_units?.total_housing_units_2024;
    const ownerOccupiedUnits = dataInRadius?.housing_data?.owner_occupied_units;
    const ownerOccupiedUnitsPercent = ownerOccupiedUnits && totalHousingUnits ? (ownerOccupiedUnits / totalHousingUnits) * 100 : null;
    const renterOccupiedUnits = dataInRadius?.housing_data?.renter_occupied_units;
    const renterOccupiedUnitsPercent = renterOccupiedUnits && totalHousingUnits ? (renterOccupiedUnits / totalHousingUnits) * 100 : null;
    const vacantUnits = dataInRadius?.housing_data?.vacant_units;
    const vacantUnitsPercent = vacantUnits && totalHousingUnits ? (vacantUnits / totalHousingUnits) * 100 : null;

    return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Household Financials &#40;2024&#41;</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Median Home Value</p>
                        <p className="text-2xl font-bold">${formatNumber(medianHomeValue)}</p>
                    </div>
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Median Household Income</p>
                        <p className="text-2xl font-bold">${formatNumber(medianHouseholdIncome)}</p>
                    </div>
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Average Household Income</p>
                        <p className="text-2xl font-bold">${formatNumber(averageHouseholdIncome)}</p>
                    </div>
                </div>
            </div>

            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Home Ownership &#40;2024&#41;</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Owner Occupied Units</p>
                        <p className="text-2xl font-bold">{formatPercent(ownerOccupiedUnitsPercent)}</p>
                    </div>
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Renter Occupied Units</p>
                        <p className="text-2xl font-bold">{formatPercent(renterOccupiedUnitsPercent)}</p>
                    </div>
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Vacant Units</p>
                        <p className="text-2xl font-bold">{formatPercent(vacantUnitsPercent)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}