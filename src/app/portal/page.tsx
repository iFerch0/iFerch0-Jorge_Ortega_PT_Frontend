"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WeightChart } from "@/components/charts/WeightChart";
import {
    Target, TrendingDown, TrendingUp, Scale,
    MapPin, Building2, Home, TreePine, ChevronRight, ArrowRight
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { me } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Evaluation, ClientProfile } from "@/types/api";

const placeMap: Record<string, { label: string; Icon: typeof Building2 }> = {
    GYM:     { label: "Gimnasio",   Icon: Building2 },
    HOME:    { label: "Casa",       Icon: Home },
    OUTDOOR: { label: "Aire libre", Icon: TreePine },
};

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
}

function HomeSkeleton() {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-5 space-y-4">
                <div className="space-y-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-7 w-44" />
                    <Skeleton className="h-3.5 w-24 mt-1" />
                </div>
                <div className="flex gap-2.5">
                    <Skeleton className="h-16 w-24 rounded-xl flex-1" />
                    <Skeleton className="h-16 w-24 rounded-xl flex-1" />
                    <Skeleton className="h-16 w-24 rounded-xl flex-1" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-20 rounded-2xl" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-52 rounded-2xl" />
            </div>
        </div>
    );
}

function StatCard({
    value, label, sub, icon: Icon, trend,
}: {
    value: string; label: string; sub?: string;
    icon?: typeof Scale; trend?: "up" | "down" | "neutral";
}) {
    const trendColor = trend === "down" ? "text-emerald-500" : trend === "up" ? "text-red-400" : "text-muted-foreground";
    const TrendIcon = trend === "down" ? TrendingDown : trend === "up" ? TrendingUp : null;
    return (
        <div className="flex flex-col items-center gap-1 rounded-xl border bg-muted/20 px-3 py-3 flex-1 min-w-0">
            {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
            <span className="text-lg font-bold font-display leading-none tabular-nums">{value}</span>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
            {sub && (
                <span className={cn("text-[10px] font-medium flex items-center gap-0.5", trendColor)}>
                    {TrendIcon && <TrendIcon className="h-3 w-3" />}
                    {sub}
                </span>
            )}
        </div>
    );
}

export default function PortalPage() {
    const { user, loading: sessionLoading } = useSession();
    const [profile, setProfile] = useState<ClientProfile | null>(null);
    const [evals, setEvals] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (sessionLoading) return;
        if (!user?.id) { setLoading(false); return; }

        Promise.all([me.getProfile(), me.getAssessments()])
            .then(([profileData, assessmentsData]) => {
                setProfile(profileData);
                setEvals(assessmentsData?.data || []);
            })
            .catch((err) => setError(err.message || "Error al cargar datos"))
            .finally(() => setLoading(false));
    }, [sessionLoading, user?.id]);

    if (sessionLoading || loading) return <HomeSkeleton />;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Reintentar
                </Button>
            </div>
        );
    }

    const sorted = [...evals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sorted[0];
    const previous = sorted[1];

    const latestWeight = latest?.bioimpedance?.weight;
    const prevWeight = previous?.bioimpedance?.weight;
    const weightDiff = latestWeight && prevWeight ? +(latestWeight - prevWeight).toFixed(1) : null;

    const firstName = profile?.firstName || user?.name?.split(" ")[0] || "Atleta";
    const place = profile?.trainingPlace ? placeMap[profile.trainingPlace] : null;
    const PlaceIcon = place?.Icon ?? MapPin;

    return (
        <div className="space-y-6">

            {/* ── Hero ── */}
            <div className="rounded-2xl border bg-card p-5 space-y-4">
                <div>
                    <p className="text-xs text-muted-foreground">{getGreeting()}</p>
                    <h1 className="font-display text-2xl font-bold tracking-tight mt-0.5">
                        {firstName} 👋
                    </h1>
                    {place && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                            <PlaceIcon className="h-3 w-3" />
                            <span>{place.label}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2.5">
                    <StatCard
                        icon={Scale}
                        value={latestWeight ? `${latestWeight}` : "—"}
                        label="Peso (kg)"
                        sub={weightDiff !== null
                            ? `${weightDiff > 0 ? "+" : ""}${weightDiff}kg`
                            : undefined
                        }
                        trend={weightDiff !== null ? (weightDiff <= 0 ? "down" : "up") : undefined}
                    />
                    <StatCard
                        icon={Target}
                        value={`${evals.length}`}
                        label="Valoraciones"
                    />
                    {profile?.objectives && profile.objectives.length > 0 && (
                        <StatCard
                            value={`${profile.objectives.length}`}
                            label="Objetivos"
                        />
                    )}
                </div>
            </div>

            {/* ── Objetivos ── */}
            {profile?.objectives && profile.objectives.length > 0 && (
                <div>
                    <div className="flex items-baseline justify-between mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Mis objetivos
                        </span>
                        <Link href="/portal/profile" className="text-[10px] text-primary font-medium hover:underline flex items-center gap-0.5">
                            Ver todos <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="rounded-2xl border bg-card px-4 py-3 space-y-2.5">
                        {profile.objectives.slice(0, 3).map((obj, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm">
                                <Target className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                                <span>{obj.content}</span>
                            </div>
                        ))}
                        {profile.objectives.length > 3 && (
                            <p className="text-xs text-muted-foreground pl-6">
                                +{profile.objectives.length - 3} más
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* ── Progreso ── */}
            {sorted.length > 0 ? (
                <div>
                    <div className="flex items-baseline justify-between mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Progreso de peso
                        </span>
                        <Link href="/portal/assessments" className="text-[10px] text-primary font-medium hover:underline flex items-center gap-0.5">
                            Historial <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="rounded-2xl border bg-card overflow-hidden">
                        <WeightChart data={sorted} />
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed bg-card px-6 py-12 text-center space-y-3">
                    <Scale className="h-8 w-8 mx-auto text-muted-foreground/40" />
                    <div>
                        <p className="text-sm font-medium">Sin valoraciones aún</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tu entrenador registrará tu primera evaluación pronto.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
