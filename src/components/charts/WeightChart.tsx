"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Evaluation } from "@/types/api";

interface WeightChartProps {
    data: Evaluation[];
    goalWeight?: number;
}

export function WeightChart({ data, goalWeight }: WeightChartProps) {
    const chartData = [...data]
        .filter((item) => item.bioimpedance?.weight)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((item) => ({
            date: new Date(item.date).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
            }),
            weight: item.bioimpedance!.weight,
        }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Progreso de Peso</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}kg`}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--popover))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            {goalWeight && (
                                <ReferenceLine
                                    y={goalWeight}
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeDasharray="3 3"
                                    label={{
                                        position: 'right',
                                        value: 'Meta',
                                        fill: 'hsl(var(--muted-foreground))',
                                        fontSize: 12,
                                    }}
                                />
                            )}
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                                dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
