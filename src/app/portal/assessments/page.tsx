import { AssessmentList } from "@/components/assessments/AssessmentList";
import { mockAssessments } from "@/lib/data/mock-assessments";

export default function PortalAssessmentsPage() {
    // Simulate logged-in client logic
    const clientId = "1";
    const clientAssessments = mockAssessments.filter((a) => a.clientId === clientId);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Historial</h1>
                <p className="text-sm text-muted-foreground">
                    Tus evaluaciones y progresos registrados.
                </p>
            </div>

            <AssessmentList assessments={clientAssessments} />
        </div>
    );
}
