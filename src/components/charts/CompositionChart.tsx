"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Assessment } from "@/lib/data/mock-assessments";

interface CompositionChartProps {
    data: Assessment[];
}

export function CompositionChart({ data }: CompositionChartProps) {
    // Sort data, filter out entries without composition data
    const chartData = [...data]
        .filter((item) => item.muscleMassPercentage && item.bodyFatPercentage)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((item) => ({
            date: new Date(item.date).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
            }),
            muscle: item.muscleMassPercentage,
            fat: item.bodyFatPercentage,
        }));

    if (chartData.length === 0) return null;

    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle>Composición Corporal</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorMuscle" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} stroke="#888888" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--popover))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="muscle"
                                name="Masa Muscular %"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorMuscle)"
                            />
                            <Area
                                type="monotone"
                                dataKey="fat"
                                name="Grasa Corporal %"
                                stroke="#ef4444"
                                fillOpacity={1}
                                fill="url(#colorFat)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
