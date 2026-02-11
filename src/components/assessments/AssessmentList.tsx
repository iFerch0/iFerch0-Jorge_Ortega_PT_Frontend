import { Assessment } from "@/lib/data/mock-assessments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Weight, Activity, CalendarDays } from "lucide-react";

interface AssessmentListProps {
    assessments: Assessment[];
}

export function AssessmentList({ assessments }: AssessmentListProps) {
    // Sort assessments by date descending
    const sortedAssessments = [...assessments].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (sortedAssessments.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-8">
                No hay evaluaciones registradas.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sortedAssessments.map((assessment, index) => {
                const previousAssessment = sortedAssessments[index + 1];
                const weightDiff = previousAssessment
                    ? assessment.weight - previousAssessment.weight
                    : 0;

                return (
                    <Card key={assessment.id}>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-semibold">
                                        {new Date(assessment.date).toLocaleDateString()}
                                    </span>
                                </div>
                                {index === 0 && <Badge>Más reciente</Badge>}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Peso</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold">
                                            {assessment.weight} kg
                                        </span>
                                        {previousAssessment && (
                                            <Badge
                                                variant={weightDiff <= 0 ? "default" : "destructive"} // Greenish if loss (usually good for weight loss goal) - adapt based on goal logic later
                                                className={`text-xs ${weightDiff > 0
                                                    ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                                    : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                                    }`}
                                            >
                                                {weightDiff > 0 ? "+" : ""}
                                                {weightDiff.toFixed(1)} kg
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                {assessment.bodyFatPercentage && (
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground">% Grasa</span>
                                        <span className="text-lg font-bold">
                                            {assessment.bodyFatPercentage}%
                                        </span>
                                    </div>
                                )}
                                {assessment.muscleMassPercentage && (
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground">% Músculo</span>
                                        <span className="text-lg font-bold">
                                            {assessment.muscleMassPercentage}%
                                        </span>
                                    </div>
                                )}
                            </div>
                            {assessment.notes && (
                                <div className="mt-4 rounded-md bg-muted p-3 text-sm italic text-muted-foreground">
                                    "{assessment.notes}"
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
