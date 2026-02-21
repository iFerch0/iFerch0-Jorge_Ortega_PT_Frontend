"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { trainer, evaluations } from "@/lib/api";
import type { Evaluation, Bioimpedance, ProgressPhoto } from "@/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    ArrowLeft,
    Edit,
    Trash2,
    Download,
    Calendar,
    Scale,
    Droplets,
    Flame,
    Target,
    User,
} from "lucide-react";
import { DeleteAssessmentDialog } from "@/components/assessments/DeleteAssessmentDialog";

export default function AssessmentDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [assessment, setAssessment] = useState<Evaluation | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (!params.id) return;
        trainer.getAssessment(params.id)
            .then(setAssessment)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [params.id]);

    const handleDownloadPdf = async () => {
        if (!params.id) return;
        setDownloading(true);
        try {
            await evaluations.downloadPdf(params.id);
        } catch (error) {
            console.error(error);
        } finally {
            setDownloading(false);
        }
    };

    const handleDeleteSuccess = () => {
        router.push("/dashboard/assessments");
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Valoración no encontrada</p>
                <Button variant="link" asChild className="mt-4">
                    <Link href="/dashboard/assessments">Volver al listado</Link>
                </Button>
            </div>
        );
    }

    const bio: Bioimpedance | null = assessment.bioimpedance;
    const photos: ProgressPhoto | null = assessment.photos;

    const renderBioimpedance = () => {
        if (!bio) return null;
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scale className="h-5 w-5" />
                        Datos de Bioimpedancia
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {bio.weight && (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-xs text-muted-foreground uppercase">Peso</p>
                                <p className="text-2xl font-bold">{bio.weight} kg</p>
                            </div>
                        )}
                        {bio.bodyFat != null && (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-xs text-muted-foreground uppercase">Grasa Corporal</p>
                                <p className="text-2xl font-bold">{bio.bodyFat}%</p>
                            </div>
                        )}
                        {bio.muscleMass != null && (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-xs text-muted-foreground uppercase">Masa Muscular</p>
                                <p className="text-2xl font-bold">{bio.muscleMass} kg</p>
                            </div>
                        )}
                        {bio.visceralFat != null && (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-xs text-muted-foreground uppercase">Grasa Visceral</p>
                                <p className="text-2xl font-bold">{bio.visceralFat}</p>
                            </div>
                        )}
                        {bio.bodyWater != null && (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                                    <Droplets className="h-3 w-3" />
                                    Agua Corporal
                                </p>
                                <p className="text-2xl font-bold">{bio.bodyWater}%</p>
                            </div>
                        )}
                        {bio.skeletalMuscleMass != null && (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-xs text-muted-foreground uppercase">M. Esquelética</p>
                                <p className="text-2xl font-bold">{bio.skeletalMuscleMass} kg</p>
                            </div>
                        )}
                        {bio.basalMetabolism != null && (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                                    <Flame className="h-3 w-3" />
                                    Metabolismo Basal
                                </p>
                                <p className="text-2xl font-bold">{bio.basalMetabolism} kcal</p>
                            </div>
                        )}
                        {bio.bmi != null && (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-xs text-muted-foreground uppercase">IMC</p>
                                <p className="text-2xl font-bold">{bio.bmi}</p>
                            </div>
                        )}
                    </div>

                    {bio.imageUrl && (
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-2">Ticket de bioimpedancia:</p>
                            <div className="relative w-full max-w-xs aspect-[3/4] rounded-lg overflow-hidden border">
                                <Image
                                    src={bio.imageUrl}
                                    alt="Ticket de bioimpedancia"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/assessments">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Detalle de Valoración</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(assessment.date).toLocaleDateString("es-CO", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownloadPdf} disabled={downloading}>
                        {downloading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4 mr-2" />
                        )}
                        PDF
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`/dashboard/assessments/${params.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Link>
                    </Button>
                    <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </Button>
                </div>
            </div>

            {/* Bioimpedance Data */}
            {renderBioimpedance()}

            {/* Photos */}
            {photos && (photos.frontUrl || photos.backUrl || photos.sideUrl) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Registro Fotográfico
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            {photos.frontUrl && (
                                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border">
                                    <Image
                                        src={photos.frontUrl}
                                        alt="Foto frontal"
                                        fill
                                        className="object-cover"
                                    />
                                    <Badge className="absolute bottom-2 left-2 bg-black/60">Frontal</Badge>
                                </div>
                            )}
                            {photos.sideUrl && (
                                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border">
                                    <Image
                                        src={photos.sideUrl}
                                        alt="Foto lateral"
                                        fill
                                        className="object-cover"
                                    />
                                    <Badge className="absolute bottom-2 left-2 bg-black/60">Lateral</Badge>
                                </div>
                            )}
                            {photos.backUrl && (
                                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border">
                                    <Image
                                        src={photos.backUrl}
                                        alt="Foto espalda"
                                        fill
                                        className="object-cover"
                                    />
                                    <Badge className="absolute bottom-2 left-2 bg-black/60">Espalda</Badge>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Objectives Snapshot */}
            {Array.isArray(assessment.objectivesSnapshot) && assessment.objectivesSnapshot.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Objetivos al momento de la valoración
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {(assessment.objectivesSnapshot as Array<{ content: string }>).map((obj, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="text-primary">•</span>
                                    {obj.content}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ) : null}

            {/* Notes */}
            {assessment.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle>Notas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {assessment.notes}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Delete Dialog */}
            <DeleteAssessmentDialog
                assessmentId={params.id}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}
