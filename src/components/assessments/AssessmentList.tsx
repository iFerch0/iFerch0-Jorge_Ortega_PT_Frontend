import Link from "next/link";
import type { Evaluation } from "@/types/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ChevronRight, TrendingDown, TrendingUp } from "lucide-react";

interface AssessmentListProps {
    assessments: Evaluation[];
    clientId?: string;
}

export function AssessmentList({ assessments, clientId }: AssessmentListProps) {
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

    const resolvedClientId = clientId || sortedAssessments[0]?.clientId;

    return (
        <div className="space-y-3">
            <div className="relative flex flex-col gap-3">
                {sortedAssessments.map((assessment, index) => {
                    const bio = assessment.bioimpedance;
                    const prevBio = sortedAssessments[index + 1]?.bioimpedance;

                    const weight = bio?.weight;
                    const prevWeight = prevBio?.weight;
                    const weightDiff = weight && prevWeight ? weight - prevWeight : null;

                    const fat = bio?.bodyFat;
                    const prevFat = prevBio?.bodyFat;
                    const fatDiff = fat != null && prevFat != null ? fat - prevFat : null;

                    const muscle = bio?.muscleMass;
                    const prevMuscle = prevBio?.muscleMass;
                    const muscleDiff = muscle != null && prevMuscle != null ? muscle - prevMuscle : null;

                    return (
                        <Link
                            key={assessment.id}
                            href={`/dashboard/clients/${resolvedClientId}/assessments/${assessment.id}`}
                        >
                            <Card className="group relative overflow-hidden transition-colors hover:border-primary/30 hover:bg-muted/30">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/60 to-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />

                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-background text-xs font-medium text-muted-foreground">
                                                {sortedAssessments.length - index}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-sm font-semibold">
                                                    {new Date(assessment.date).toLocaleDateString("es-CO", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                            {index === 0 && (
                                                <Badge className="text-[10px]">Más reciente</Badge>
                                            )}
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        {weight != null && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Peso</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold tabular-nums">
                                                        {weight} kg
                                                    </span>
                                                    {weightDiff != null && weightDiff !== 0 && (
                                                        <span
                                                            className={`inline-flex items-center gap-0.5 text-xs font-medium ${weightDiff < 0
                                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                                    : "text-red-500 dark:text-red-400"
                                                                }`}
                                                        >
                                                            {weightDiff < 0 ? (
                                                                <TrendingDown className="h-3 w-3" />
                                                            ) : (
                                                                <TrendingUp className="h-3 w-3" />
                                                            )}
                                                            {weightDiff > 0 ? "+" : ""}
                                                            {weightDiff.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {fat != null && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">% Grasa</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold tabular-nums">
                                                        {fat}%
                                                    </span>
                                                    {fatDiff != null && fatDiff !== 0 && (
                                                        <span
                                                            className={`text-xs font-medium ${fatDiff < 0
                                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                                    : "text-red-500 dark:text-red-400"
                                                                }`}
                                                        >
                                                            {fatDiff > 0 ? "+" : ""}
                                                            {fatDiff.toFixed(1)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {muscle != null && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">% Músculo</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold tabular-nums">
                                                        {muscle}%
                                                    </span>
                                                    {muscleDiff != null && muscleDiff !== 0 && (
                                                        <span
                                                            className={`text-xs font-medium ${muscleDiff > 0
                                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                                    : "text-red-500 dark:text-red-400"
                                                                }`}
                                                        >
                                                            {muscleDiff > 0 ? "+" : ""}
                                                            {muscleDiff.toFixed(1)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {bio?.visceralFat != null && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Grasa Visceral</span>
                                                <span className="text-lg font-bold tabular-nums">
                                                    {bio.visceralFat}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {assessment.notes && (
                                        <div className="mt-3 rounded-md bg-muted p-2.5 text-xs text-muted-foreground line-clamp-2">
                                            {assessment.notes}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
