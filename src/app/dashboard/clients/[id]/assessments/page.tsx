"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssessmentList } from "@/components/assessments/AssessmentList";
import { evaluations as evaluationsApi } from "@/lib/api";
import type { Evaluation } from "@/types/api";

export default function ClientAssessmentsPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Historial de Evaluaciones</h2>
                <Button size="sm" asChild>
                    <Link href={`/dashboard/clients/${id}/new-assessment`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Evaluación
                    </Link>
                </Button>
            </div>

            <AssessmentList assessments={evals} clientId={id} />
        </div>
    );
}
