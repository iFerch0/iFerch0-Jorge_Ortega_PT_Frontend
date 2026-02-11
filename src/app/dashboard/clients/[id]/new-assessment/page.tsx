
import { mockAssessments } from "@/lib/data/mock-assessments";
import { AssessmentForm } from "@/components/assessments/AssessmentForm";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function NewAssessmentPage({ params }: PageProps) {
    const { id } = await params;

    // Get the latest assessment for comparison
    const clientAssessments = mockAssessments
        .filter((a) => a.clientId === id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const latestAssessment = clientAssessments[0];

    return (
        <div className="max-w-4xl mx-auto py-6">
            <AssessmentForm clientId={id} previousAssessment={latestAssessment} />
        </div>
    );
}
