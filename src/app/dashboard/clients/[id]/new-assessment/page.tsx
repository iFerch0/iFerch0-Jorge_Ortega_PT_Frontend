"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AssessmentForm } from "@/components/assessments/AssessmentForm";
import { evaluations as evaluationsApi, clients as clientsApi } from "@/lib/api";
import type { Evaluation } from "@/types/api";

export default function NewAssessmentPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [latestEval, setLatestEval] = useState<Evaluation | undefined>(undefined);
    const [clientHeight, setClientHeight] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        Promise.all([
            evaluationsApi.getHistory(id),
            clientsApi.get(id),
        ])
            .then(([evals, client]) => {
                const sorted = [...evals].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setLatestEval(sorted[0]);
                setClientHeight(client.height);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-6">
            <AssessmentForm clientId={id} previousAssessment={latestEval} clientHeight={clientHeight} />
        </div>
    );
}
