
import { mockAssessments } from "@/lib/data/mock-assessments";
import { AssessmentList } from "@/components/assessments/AssessmentList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ClientAssessmentsPage({ params }: PageProps) {
    const { id } = await params;

    const clientAssessments = mockAssessments.filter(
        (assessment) => assessment.clientId === id
    );

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

            <AssessmentList assessments={clientAssessments} />
        </div>
    );
}
