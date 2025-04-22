"use client";
import { useEffect, useState } from "react";
import { Tooltip, Legend, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";
import { MarketResearch, UnemploymentRateDataPoint } from "@/schemas/views/market-research-schema";

export const UnemploymentGraph = ({marketData, county, state}: {marketData: MarketResearch, county: string | null, state: string | null}) => {
    const unemploymentData = marketData.bls.unemployment_rate;
    const years = Array.from(new Set(unemploymentData.map(data => data.year))).sort();
    const months = Array.from(new Set(unemploymentData.map(data => data.month))).sort();

    // Converting month numbers to names for better readability
    const monthNames = {
        "01": "January", "02": "February", "03": "March", "04": "April",
        "05": "May", "06": "June", "07": "July", "08": "August",
        "09": "September", "10": "October", "11": "November", "12": "December"
    };

    const [startYear, setStartYear] = useState<string>("");
    const [startMonth, setStartMonth] = useState<string>("");
    const [endYear, setEndYear] = useState<string>("");
    const [endMonth, setEndMonth] = useState<string>("");
    const [filteredData, setFilteredData] = useState<UnemploymentRateDataPoint[]>([]);

    useEffect(() => {
        if (unemploymentData && unemploymentData.length > 0) {
            // Initialize with 5 years back
            setStartYear(years[years.length - 6]);
            setStartMonth(unemploymentData[0].month);
            
            // Initialize with newest data point
            setEndYear(years[years.length - 1]);
            setEndMonth(unemploymentData[0].month);
        }
    }, [unemploymentData]);

    useEffect(() => {
        // Validate and adjust selections to ensure end date is after start date
        if (startYear && startMonth && endYear && endMonth) {
            const startDate = new Date(`${startYear}-${startMonth}-01`);
            const endDate = new Date(`${endYear}-${endMonth}-01`);
            
            if (endDate < startDate) {
                // If end date is before start date, set end date to start date
                setEndYear(startYear);
                setEndMonth(startMonth);
            }
            
            // Filter data based on selected date range
            if (unemploymentData) {
                const filtered = unemploymentData.filter(item => {
                    const itemDate = new Date(`${item.year}-${item.month}-01`);
                    return itemDate >= startDate && itemDate <= endDate;
                }).sort((a, b) => {
                    // Sort by date
                    return new Date(`${a.year}-${a.month}-01`).getTime() - 
                           new Date(`${b.year}-${b.month}-01`).getTime();
                }).map(item => ({
                    ...item,
                    // Add a combined date field for the x-axis
                    dateKey: `${item.year}-${item.month}`
                }));
                
                setFilteredData(filtered);
            }
        }
    }, [startYear, startMonth, endYear, endMonth, unemploymentData]);

    if (!unemploymentData || !county || !state) return (
        <div className="flex flex-col gap-6">
            <div className="market-data-section">
                <h3 className="text-lg font-semibold mb-2">Unemployment Rate</h3>
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
                
                {/* Date Range Selectors */}
                <div className="flex flex-row justify-start gap-4">
                    <div className="gap-4 mb-4">
                        <div>
                            <p className="text-sm mb-1">From:</p>
                            <div className="flex gap-2">
                                <select 
                                    value={startMonth} 
                                    onChange={(e) => setStartMonth(e.target.value)}
                                    className="px-2 py-1 border rounded text-sm"
                                >
                                    {months.map(month => (
                                        <option key={`start-month-${month}`} value={month}>
                                            {monthNames[month as keyof typeof monthNames]}
                                        </option>
                                    ))}
                                </select>
                                <select 
                                    value={startYear} 
                                    onChange={(e) => setStartYear(e.target.value)}
                                    className="px-2 py-1 border rounded text-sm"
                                >
                                    {years.map(year => (
                                        <option key={`start-year-${year}`} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-px h-16 bg-muted-foreground/30 my-auto"></div>
                
                    <div className="gap-4 mb-4">
                        <div>
                            <p className="text-sm mb-1">To:</p>
                            <div className="flex gap-2">
                                <select 
                                    value={endMonth} 
                                    onChange={(e) => setEndMonth(e.target.value)}
                                    className="px-2 py-1 border rounded text-sm"
                                >
                                    {months.map(month => (
                                        <option key={`end-month-${month}`} value={month}>
                                            {monthNames[month as keyof typeof monthNames]}
                                        </option>
                                    ))}
                                </select>
                                <select 
                                    value={endYear} 
                                    onChange={(e) => setEndYear(e.target.value)}
                                    className="px-2 py-1 border rounded text-sm"
                                >
                                    {years.map(year => (
                                        <option key={`end-year-${year}`} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Line Chart */}
                <div className="mb-8">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={filteredData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="dateKey" 
                                tickFormatter={(dateKey) => {
                                    if (!dateKey) return "";
                                    const [year, month] = dateKey.split('-');
                                    return `${monthNames[month as keyof typeof monthNames].substring(0, 3)} ${year}`;
                                }}
                                interval="preserveStartEnd"
                            />
                            <YAxis 
                                label={{ value: 'Unemployment Rate (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip 
                                formatter={(value) => [`${value}%`, "Unemployment Rate"]}
                                labelFormatter={(dateKey) => {
                                    if (!dateKey) return "";
                                    const [year, month] = dateKey.split('-');
                                    return `${monthNames[month as keyof typeof monthNames]} ${year}`;
                                }}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                name="Unemployment Rate" 
                                stroke="#ff7300" 
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    return (
                                        <circle 
                                            key={`dot-${payload.year}-${payload.month}`}
                                            cx={cx} 
                                            cy={cy} 
                                            r={6} 
                                            fill={payload.preliminary ? "#1E88E5" : "#f97316"} 
                                            stroke="none"
                                        />
                                    );
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center items-center gap-6 text-sm mt-2">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-[#ff7300]"></div>
                            <span>Final Data</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-[#1E88E5]"></div>
                            <span>Preliminary Data</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}