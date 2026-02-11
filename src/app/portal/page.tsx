import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightChart } from "@/components/charts/WeightChart";
import { mockAssessments } from "@/lib/data/mock-assessments";
import { Target, TrendingDown } from "lucide-react";

export default function PortalPage() {
    // Simulate logged-in client logic
    const clientId = "1";
    const clientAssessments = mockAssessments.filter((a) => a.clientId === clientId);
    const latest = clientAssessments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Peso Actual</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{latest?.weight || "-"} kg</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                            -1.2kg vs mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Próxima Meta</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">80.0 kg</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <Target className="mr-1 h-3 w-3 text-primary" />
                            Faltan 2.5kg
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold tracking-tight">Tu Progreso</h2>
                <div className="-mx-4 sm:mx-0">
                    {/* Negative margin to allow full-width chart on mobile */}
                    <WeightChart data={clientAssessments} goalWeight={80} />
                </div>
            </div>
        </div>
    );
}
