"use client";
import React from "react";
import { EsriData2024Schema } from "@/schemas/views/market-research-schema";

const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat().format(num);
};

export const HousingMetrics = ({esriData2024}: {esriData2024: EsriData2024Schema}) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Household Financials</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Median Home Value</p>
                        <p className="text-2xl font-bold">${formatNumber(esriData2024?.medianHomeValue)}</p>
                    </div>
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Median Household Income</p>
                        <p className="text-2xl font-bold">${formatNumber(esriData2024?.medianHouseholdIncome)}</p>
                    </div>
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Average Household Income</p>
                        <p className="text-2xl font-bold">${formatNumber(esriData2024?.averageHouseholdIncome)}</p>
                    </div>
                </div>
            </div>

            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Home Ownership</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Owner Occupied Units</p>
                        <p className="text-2xl font-bold">{formatNumber(esriData2024?.ownerOccupiedUnits)}</p>
                    </div>
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Renter Occupied Units</p>
                        <p className="text-2xl font-bold">{formatNumber(esriData2024?.renterOccupiedUnits)}</p>
                    </div>
                    <div className="stat-item">
                        <p className="text-sm text-muted-foreground">Vacant Units</p>
                        <p className="text-2xl font-bold">{formatNumber(esriData2024?.vacantUnits)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}