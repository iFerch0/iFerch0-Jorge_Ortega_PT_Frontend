"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, CalendarDays, TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { clients as clientsApi, evaluations as evaluationsApi } from "@/lib/api";
import type { Client, Evaluation } from "@/types/api";
import { WeightChart } from "@/components/charts/WeightChart";
import { CompositionChart } from "@/components/charts/CompositionChart";

export default function ClientProfilePage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [client, setClient] = useState<Client | null>(null);
    const [evals, setEvals] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            clientsApi.get(id),
            evaluationsApi.getHistory(id),
        ])
            .then(([clientData, evalsData]) => {
                setClient(clientData);
                setEvals(evalsData);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!client) return null;

    const sortedEvals = [...evals].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latest = sortedEvals[0];
    const previous = sortedEvals[1];
    const latestBio = latest?.bioimpedance;
    const prevBio = previous?.bioimpedance;

    const weightDiff = latestBio?.weight && prevBio?.weight
        ? latestBio.weight - prevBio.weight
        : null;
    const fatDiff = latestBio?.bodyFat != null && prevBio?.bodyFat != null
        ? latestBio.bodyFat - prevBio.bodyFat
        : null;

    const createdDate = new Date(client.createdAt);
    const now = new Date();
    const monthsActive = Math.max(
        1,
        Math.round((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    );

    const objective = client.objectives?.[0]?.content || "Sin objetivo definido";

    const stats = [
        {
            title: "Objetivo Principal",
            value: objective,
            icon: Target,
            description: "Meta actual definida",
            delta: null as number | null,
            deltaGoodWhenNegative: false,
        },
        {
            title: "Último Peso",
            value: latestBio?.weight ? `${latestBio.weight} kg` : "—",
            icon: weightDiff !== null && weightDiff <= 0 ? TrendingDown : TrendingUp,
            description: weightDiff !== null
                ? `${weightDiff > 0 ? "+" : ""}${weightDiff.toFixed(1)}kg vs anterior`
                : "Sin evaluación previa",
            delta: weightDiff,
            deltaGoodWhenNegative: true,
        },
        {
            title: "% Grasa Corporal",
            value: latestBio?.bodyFat != null ? `${latestBio.bodyFat}%` : "—",
            icon: fatDiff !== null && fatDiff <= 0 ? TrendingDown : TrendingUp,
            description: fatDiff !== null
                ? `${fatDiff > 0 ? "+" : ""}${fatDiff.toFixed(1)}% vs anterior`
                : "Sin datos previos",
            delta: fatDiff,
            deltaGoodWhenNegative: true,
        },
        {
            title: "Antigüedad",
            value: `${monthsActive} ${monthsActive === 1 ? "Mes" : "Meses"}`,
            icon: CalendarDays,
            description: `Desde ${createdDate.toLocaleDateString("es-CO", { month: "short", year: "numeric" })}`,
            delta: null as number | null,
            deltaGoodWhenNegative: false,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const isGood =
                        stat.delta !== null
                            ? stat.deltaGoodWhenNegative
                                ? stat.delta <= 0
                                : stat.delta > 0
                            : null;

                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-2xl font-bold tabular-nums">{stat.value}</div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    {stat.delta !== null && (
                                        <Badge
                                            variant="secondary"
                                            className={`text-[10px] px-1.5 py-0 ${
                                                isGood
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}
                                        >
                                            {stat.delta > 0 ? "+" : ""}
                                            {stat.delta.toFixed(1)}
                                        </Badge>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts */}
            {sortedEvals.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <WeightChart data={sortedEvals} />
                    <Card className="col-span-full lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Últimas Observaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sortedEvals
                                    .filter((a) => a.notes)
                                    .slice(0, 3)
                                    .map((a) => (
                                        <div key={a.id} className="rounded-md bg-muted p-3 text-sm">
                                            <p className="font-semibold mb-1">
                                                {new Date(a.date).toLocaleDateString("es-CO", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            <p className="text-muted-foreground">{a.notes}</p>
                                        </div>
                                    ))}
                                {sortedEvals.filter((a) => a.notes).length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No hay observaciones registradas.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <CompositionChart data={sortedEvals} />
                </div>
            )}

            {sortedEvals.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No hay evaluaciones registradas para este cliente.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
