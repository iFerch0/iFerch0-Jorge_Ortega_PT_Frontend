"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Loader2, ChevronLeft, Scale, Calendar, Target, 
    Camera, Download, Droplets, Flame, Activity
} from "lucide-react";
import { me, evaluations } from "@/lib/api";
import type { Evaluation } from "@/types/api";

export default function AssessmentDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (!id) return;
        me.getAssessment(id)
            .then(setEvaluation)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    async function handleDownloadPdf() {
        if (!evaluation) return;
        setDownloading(true);
        try {
            const filename = `valoracion-${new Date(evaluation.date).toISOString().split("T")[0]}.pdf`;
            await evaluations.downloadPdf(evaluation.id, filename);
        } catch (err) {
            console.error("Error downloading PDF:", err);
        } finally {
            setDownloading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!evaluation) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Valoración no encontrada.</p>
                <Button variant="link" asChild className="mt-2">
                    <Link href="/portal/assessments">Volver al historial</Link>
                </Button>
            </div>
        );
    }

    const bio = evaluation.bioimpedance;
    const photoData = evaluation.photos;
    // Flatten into array of photos with type labels
    const photos: { url: string; type: string }[] = [];
    if (photoData?.frontUrl) photos.push({ url: photoData.frontUrl, type: "front" });
    if (photoData?.sideUrl) photos.push({ url: photoData.sideUrl, type: "side" });
    if (photoData?.backUrl) photos.push({ url: photoData.backUrl, type: "back" });
    // Parse objectivesSnapshot as array
    const rawObjectives = evaluation.objectivesSnapshot;
    const objectives: Array<{ content: string }> = Array.isArray(rawObjectives) ? rawObjectives : [];

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/portal/assessments">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold">Valoración</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(evaluation.date).toLocaleDateString("es-CO", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={downloading}>
                    {downloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                        </>
                    )}
                </Button>
            </div>

            {/* Bioimpedance Card */}
            {bio && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Scale className="h-4 w-4 text-primary" />
                            Bioimpedancia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Main Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-primary/5 rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold text-primary">{bio.weight}</div>
                                <div className="text-sm text-muted-foreground">kg</div>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold">{bio.bmi || "—"}</div>
                                <div className="text-sm text-muted-foreground">IMC</div>
                            </div>
                        </div>

                        {/* Detailed Stats */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <Activity className="h-4 w-4 text-orange-500" />
                                <div>
                                    <span className="text-muted-foreground">% Grasa</span>
                                    <p className="font-medium">{bio.bodyFat ? `${bio.bodyFat}%` : "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <Activity className="h-4 w-4 text-blue-500" />
                                <div>
                                    <span className="text-muted-foreground">Masa Muscular</span>
                                    <p className="font-medium">{bio.muscleMass ? `${bio.muscleMass} kg` : "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <Activity className="h-4 w-4 text-red-500" />
                                <div>
                                    <span className="text-muted-foreground">Grasa Visceral</span>
                                    <p className="font-medium">{bio.visceralFat ? `${bio.visceralFat}%` : "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <Droplets className="h-4 w-4 text-cyan-500" />
                                <div>
                                    <span className="text-muted-foreground">Agua Corporal</span>
                                    <p className="font-medium">{bio.bodyWater ? `${bio.bodyWater} L` : "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <Activity className="h-4 w-4 text-purple-500" />
                                <div>
                                    <span className="text-muted-foreground">M.M. Esquelética</span>
                                    <p className="font-medium">{bio.skeletalMuscleMass ? `${bio.skeletalMuscleMass} kg` : "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <Flame className="h-4 w-4 text-amber-500" />
                                <div>
                                    <span className="text-muted-foreground">Metab. Basal</span>
                                    <p className="font-medium">{bio.basalMetabolism ? `${bio.basalMetabolism} kcal` : "—"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bioimpedance Ticket Image */}
                        {bio.imageUrl && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-muted-foreground mb-2">Ticket de bioimpedancia:</p>
                                <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border">
                                    <Image 
                                        src={bio.imageUrl} 
                                        alt="Ticket bioimpedancia"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Progress Photos */}
            {photos.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Camera className="h-4 w-4 text-primary" />
                            Fotos de Progreso
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-3">
                            {photos.map((photo, idx) => (
                                <div 
                                    key={idx} 
                                    className="relative aspect-[3/4] rounded-lg overflow-hidden border"
                                >
                                    <Image
                                        src={photo.url}
                                        alt={photo.type === "front" ? "Frontal" : 
                                             photo.type === "side" ? "Lateral" : 
                                             photo.type === "back" ? "Espalda" : `Foto ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                                        {photo.type === "front" ? "Frontal" : 
                                         photo.type === "side" ? "Lateral" : 
                                         photo.type === "back" ? "Espalda" : photo.type}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Objectives Snapshot */}
            {objectives.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Objetivos (al momento de la valoración)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {objectives.map((obj, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <Badge variant="outline" className="shrink-0">{idx + 1}</Badge>
                                    <span>{obj.content}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Notes */}
            {evaluation.notes && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Notas del Entrenador</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{evaluation.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
