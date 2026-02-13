"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AssessmentList } from "@/components/assessments/AssessmentList";
import { useSession } from "@/hooks/useSession";
import { evaluations as evaluationsApi } from "@/lib/api";
import type { Evaluation } from "@/types/api";

export default function PortalAssessmentsPage() {
    const { user, loading: sessionLoading } = useSession();
    const [evals, setEvals] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        evaluationsApi.getHistory(user.id)
            .then(setEvals)
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Historial</h1>
                <p className="text-sm text-muted-foreground">
                    Tus evaluaciones y progresos registrados.
                </p>
            </div>

            <AssessmentList assessments={evals} />
        </div>
    );
}
