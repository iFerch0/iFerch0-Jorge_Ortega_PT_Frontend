"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightChart } from "@/components/charts/WeightChart";
import { Target, TrendingDown, Loader2 } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { evaluations as evaluationsApi, users } from "@/lib/api";
import type { Evaluation } from "@/types/api";

export default function PortalPage() {
    const { user, loading: sessionLoading } = useSession();
    const [evals, setEvals] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        // Resolve the client profile ID from the user profile,
        // then fetch evaluations using the correct client ID
        users.getProfile()
            .then((profile: { clientProfile?: { id: string } }) => {
                const clientId = profile.clientProfile?.id;
                if (!clientId) {
                    setLoading(false);
                    return;
                }
                return evaluationsApi.getHistory(clientId);
            })
            .then((data) => { if (data) setEvals(data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user?.id]);

    if (sessionLoading || loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const sorted = [...evals].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latest = sorted[0];
    const previous = sorted[1];

    const latestWeight = latest?.bioimpedance?.weight;
    const prevWeight = previous?.bioimpedance?.weight;
    const weightDiff = latestWeight && prevWeight ? latestWeight - prevWeight : null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Peso Actual</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{latestWeight || "-"} kg</div>
                        {weightDiff !== null && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center">
                                <TrendingDown className={`mr-1 h-3 w-3 ${weightDiff <= 0 ? "text-green-500" : "text-red-500"}`} />
                                {weightDiff > 0 ? "+" : ""}{weightDiff.toFixed(1)}kg vs anterior
                            </p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Evaluaciones</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{evals.length}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <Target className="mr-1 h-3 w-3 text-primary" />
                            registradas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {sorted.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold tracking-tight">Tu Progreso</h2>
                    <div className="-mx-4 sm:mx-0">
                        <WeightChart data={sorted} />
                    </div>
                </div>
            )}

            {sorted.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Aún no tienes evaluaciones registradas.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
