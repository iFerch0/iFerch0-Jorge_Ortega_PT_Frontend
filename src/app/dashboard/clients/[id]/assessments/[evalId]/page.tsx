"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    Weight,
    Percent,
    Activity,
    Heart,
    FileText,
    TrendingDown,
    TrendingUp,
    Minus,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { evaluations as evaluationsApi } from "@/lib/api";
import type { Evaluation } from "@/types/api";

function DeltaBadge({ current, previous, unit, invert = false }: { current?: number | null; previous?: number | null; unit: string; invert?: boolean }) {
    if (current == null || previous == null) return null;
    const diff = current - previous;
    if (diff === 0) return (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Minus className="h-3 w-3" /> Sin cambio
        </span>
    );
    const isPositive = diff > 0;
    const isGood = invert ? isPositive : !isPositive;

    return (
        <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
                isGood
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-400"
            }`}
        >
            {isPositive ? (
                <TrendingUp className="h-3 w-3" />
            ) : (
                <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {diff.toFixed(1)}
            {unit}
        </span>
    );
}

export default function EvaluationDetailPage() {
    const params = useParams<{ id: string; evalId: string }>();
    const { id, evalId } = params;

    const [evals, setEvals] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        evaluationsApi.getHistory(id)
            .then(setEvals)
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

    const sortedEvals = [...evals].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const currentIndex = sortedEvals.findIndex((a) => a.id === evalId);
    const assessment = sortedEvals[currentIndex];
    const previousAssessment = sortedEvals[currentIndex + 1] || null;

    if (!assessment) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">Evaluación no encontrada</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href={`/dashboard/clients/${id}/assessments`}>Volver</Link>
                </Button>
            </div>
        );
    }

    const bio = assessment.bioimpedance;
    const prevBio = previousAssessment?.bioimpedance;
    const isLatest = currentIndex === 0;

    const metrics = [
        {
            label: "Peso",
            value: bio?.weight,
            prev: prevBio?.weight,
            unit: " kg",
            icon: Weight,
            deltaUnit: " kg",
            invert: false,
        },
        {
            label: "% Grasa Corporal",
            value: bio?.bodyFat,
            prev: prevBio?.bodyFat,
            unit: "%",
            icon: Percent,
            deltaUnit: "%",
            invert: false,
        },
        {
            label: "% Masa Muscular",
            value: bio?.muscleMass,
            prev: prevBio?.muscleMass,
            unit: "%",
            icon: Activity,
            deltaUnit: "%",
            invert: true,
        },
        {
            label: "Grasa Visceral",
            value: bio?.visceralFat,
            prev: prevBio?.visceralFat,
            unit: "",
            icon: Heart,
            deltaUnit: "",
            invert: false,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Back + Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/clients/${id}/assessments`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Detalle de Evaluación</h2>
                        {isLatest && <Badge>Más reciente</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(assessment.date).toLocaleDateString("es-CO", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => {
                    if (metric.value == null) return null;
                    return (
                        <Card key={metric.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {metric.label}
                                </CardTitle>
                                <metric.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-2xl font-bold tabular-nums">
                                    {metric.value}
                                    <span className="text-base font-normal text-muted-foreground">
                                        {metric.unit}
                                    </span>
                                </div>
                                <div className="mt-1">
                                    <DeltaBadge
                                        current={metric.value}
                                        previous={metric.prev}
                                        unit={metric.deltaUnit}
                                        invert={metric.invert}
                                    />
                                </div>
                                {metric.prev != null && (
                                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                                        Anterior: {metric.prev}{metric.unit}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Comparison Table */}
            {previousAssessment && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Comparativa con Evaluación Anterior
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {new Date(previousAssessment.date).toLocaleDateString("es-CO", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}{" "}
                            vs{" "}
                            {new Date(assessment.date).toLocaleDateString("es-CO", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="pb-2 font-medium text-muted-foreground">Métrica</th>
                                        <th className="pb-2 font-medium text-muted-foreground text-right">Anterior</th>
                                        <th className="pb-2 font-medium text-muted-foreground text-right">Actual</th>
                                        <th className="pb-2 font-medium text-muted-foreground text-right">Cambio</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {metrics.map((m) => {
                                        if (m.value == null) return null;
                                        return (
                                            <tr key={m.label}>
                                                <td className="py-2.5 font-medium">{m.label}</td>
                                                <td className="py-2.5 text-right text-muted-foreground tabular-nums">
                                                    {m.prev != null ? `${m.prev}${m.unit}` : "—"}
                                                </td>
                                                <td className="py-2.5 text-right font-medium tabular-nums">
                                                    {m.value}{m.unit}
                                                </td>
                                                <td className="py-2.5 text-right">
                                                    <DeltaBadge
                                                        current={m.value}
                                                        previous={m.prev}
                                                        unit={m.deltaUnit}
                                                        invert={m.invert}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Notes */}
            {assessment.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <FileText className="h-4 w-4" />
                            Observaciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {assessment.notes}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
