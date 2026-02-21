"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Scale, ChevronRight, Image as ImageIcon, Loader2 } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { me } from "@/lib/api";
import type { Evaluation } from "@/types/api";

function AssessmentsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-40" />
            </div>
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border bg-card p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3.5 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-4 rounded" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-t pt-3">
                            <Skeleton className="h-10 rounded-xl" />
                            <Skeleton className="h-10 rounded-xl" />
                            <Skeleton className="h-10 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function PortalAssessmentsPage() {
    const { user, loading: sessionLoading } = useSession();
    const [evals, setEvals] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const LIMIT = 10;

    useEffect(() => {
        if (!user?.id) return;
        loadAssessments(1);
    }, [user?.id]);

    async function loadAssessments(pageNum: number) {
        setLoading(true);
        try {
            const result = await me.getAssessments({ page: pageNum, limit: LIMIT });
            if (pageNum === 1) {
                setEvals(result.data || []);
            } else {
                setEvals((prev) => [...prev, ...(result.data || [])]);
            }
            setHasMore((result.data?.length || 0) >= LIMIT);
            setPage(pageNum);
        } catch (err) {
            console.error("Error loading assessments:", err);
        } finally {
            setLoading(false);
        }
    }

    if (sessionLoading || (loading && page === 1)) return <AssessmentsSkeleton />;

    const sorted = [...evals].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="space-y-6">
            <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Historial
                </span>
                <h1 className="font-display text-2xl font-bold tracking-tight mt-0.5">
                    Mis Valoraciones
                </h1>
            </div>

            {sorted.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-card px-6 py-12 text-center space-y-3">
                    <Scale className="h-8 w-8 mx-auto text-muted-foreground/40" />
                    <div>
                        <p className="text-sm font-medium">Sin valoraciones aún</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tu entrenador registrará tu primera evaluación pronto.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {sorted.map((evaluation) => {
                        const photoCount = [
                            evaluation.photos?.frontUrl,
                            evaluation.photos?.backUrl,
                            evaluation.photos?.sideUrl,
                        ].filter(Boolean).length;

                        return (
                            <Link key={evaluation.id} href={`/portal/assessments/${evaluation.id}`}>
                                <div className="rounded-2xl border bg-card p-4 hover:border-primary/40 transition-colors cursor-pointer space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <Scale className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm leading-tight">
                                                    {evaluation.bioimpedance?.weight
                                                        ? `${evaluation.bioimpedance.weight} kg`
                                                        : "Valoración"
                                                    }
                                                </p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    {new Date(evaluation.date).toLocaleDateString("es-CO", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {photoCount > 0 && (
                                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
                                                    <ImageIcon className="h-2.5 w-2.5" />
                                                    {photoCount}
                                                </span>
                                            )}
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>

                                    {evaluation.bioimpedance && (
                                        <div className="grid grid-cols-3 gap-2 border-t pt-3">
                                            {[
                                                { label: "IMC", value: evaluation.bioimpedance.bmi?.toString() },
                                                { label: "% Grasa", value: evaluation.bioimpedance.bodyFat ? `${evaluation.bioimpedance.bodyFat}%` : null },
                                                { label: "M. Muscular", value: evaluation.bioimpedance.muscleMass ? `${evaluation.bioimpedance.muscleMass}kg` : null },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="rounded-xl bg-muted/30 px-2 py-2 text-center">
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                                                    <p className="text-xs font-semibold tabular-nums mt-0.5">{value || "—"}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}

                    {hasMore && (
                        <div className="text-center pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => loadAssessments(page + 1)}
                                disabled={loading}
                                className="text-primary"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Cargar más"
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
