import { mockClients } from "@/lib/data/mock-clients";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Target, CalendarDays, TrendingDown, TrendingUp, Minus } from "lucide-react";

import { mockAssessments } from "@/lib/data/mock-assessments";
import { WeightChart } from "@/components/charts/WeightChart";
import { CompositionChart } from "@/components/charts/CompositionChart";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ClientProfilePage({ params }: PageProps) {
    const { id } = await params;
    const client = mockClients.find((c) => c.id === id);

    if (!client) {
        notFound();
    }

    const clientAssessments = mockAssessments
        .filter((a) => a.clientId === id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const latest = clientAssessments[0];
    const previous = clientAssessments[1];

    // Dynamic calculations
    const weightDiff = latest && previous ? latest.weight - previous.weight : null;
    const fatDiff =
        latest?.bodyFatPercentage !== undefined && previous?.bodyFatPercentage !== undefined
            ? latest.bodyFatPercentage - previous.bodyFatPercentage
            : null;
    const muscleDiff =
        latest?.muscleMassPercentage !== undefined && previous?.muscleMassPercentage !== undefined
            ? latest.muscleMassPercentage - previous.muscleMassPercentage
            : null;

    const joinedDate = new Date(client.joinedAt);
    const now = new Date();
    const monthsActive = Math.max(
        1,
        Math.round((now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    );

    const stats = [
        {
            title: "Objetivo Principal",
            value: client.goal,
            icon: Target,
            description: "Meta actual definida",
            delta: null,
        },
        {
            title: "Último Peso",
            value: latest ? `${latest.weight} kg` : "—",
            icon: weightDiff !== null && weightDiff <= 0 ? TrendingDown : TrendingUp,
            description: weightDiff !== null
                ? `${weightDiff > 0 ? "+" : ""}${weightDiff.toFixed(1)}kg vs anterior`
                : "Sin evaluación previa",
            delta: weightDiff,
            deltaGoodWhenNegative: true,
        },
        {
            title: "% Grasa Corporal",
            value: latest?.bodyFatPercentage !== undefined ? `${latest.bodyFatPercentage}%` : "—",
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
            description: `Desde ${joinedDate.toLocaleDateString("es-CO", { month: "short", year: "numeric" })}`,
            delta: null,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const isGood =
                        stat.delta !== null && stat.delta !== undefined
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
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    {stat.delta !== null && stat.delta !== undefined && (
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <WeightChart data={clientAssessments} goalWeight={80} />
                <Card className="col-span-full lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Últimas Observaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {clientAssessments
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
                            {clientAssessments.filter((a) => a.notes).length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No hay observaciones registradas.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <CompositionChart data={clientAssessments} />
            </div>
        </div>
    );
}
