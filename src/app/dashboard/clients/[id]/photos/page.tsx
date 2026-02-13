"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Camera, Calendar, ArrowLeftRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { evaluations as evaluationsApi } from "@/lib/api";
import type { Evaluation } from "@/types/api";

const PhotoComparison = dynamic(
    () => import("@/components/profile/PhotoComparison").then((m) => m.PhotoComparison),
    { ssr: false }
);

export default function ClientPhotosPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [evals, setEvals] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        evaluationsApi.getHistory(id)
            .then(setEvals)
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

    // Collect all photos from evaluations
    const allPhotos = evals.flatMap((ev) => {
        if (!ev.photos) return [];

        const photos = [];
        const basePhoto = {
            evalDate: ev.date,
            evalId: ev.id,
            weight: ev.bioimpedance?.weight,
            fat: ev.bioimpedance?.bodyFat,
            notes: ev.photos.notes,
        };

        if (ev.photos.frontUrl) {
            photos.push({
                ...basePhoto,
                id: `${ev.photos.id}-front`,
                imageUrl: ev.photos.frontUrl,
                angle: "FRONT",
            });
        }
        if (ev.photos.backUrl) {
            photos.push({
                ...basePhoto,
                id: `${ev.photos.id}-back`,
                imageUrl: ev.photos.backUrl,
                angle: "BACK",
            });
        }
        if (ev.photos.sideUrl) {
            photos.push({
                ...basePhoto,
                id: `${ev.photos.id}-side`,
                imageUrl: ev.photos.sideUrl,
                angle: "SIDE",
            });
        }

        return photos;
    });

    // Group photos by evaluation date
    const photosByDate = allPhotos.reduce(
        (acc, photo) => {
            const dateKey = new Date(photo.evalDate).toISOString().split("T")[0];
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(photo);
            return acc;
        },
        {} as Record<string, typeof allPhotos>
    );

    const sortedDates = Object.keys(photosByDate).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    // Get before/after for comparison (earliest FRONT vs latest FRONT)
    const frontPhotos = allPhotos
        .filter((p) => p.angle === "FRONT")
        .sort((a, b) => new Date(a.evalDate).getTime() - new Date(b.evalDate).getTime());

    const beforePhoto = frontPhotos[0];
    const afterPhoto = frontPhotos.length > 1 ? frontPhotos[frontPhotos.length - 1] : null;

    return (
        <div className="space-y-6">
            {/* Before/After Comparison */}
            {beforePhoto && afterPhoto && beforePhoto.id !== afterPhoto.id && (
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Antes y Después</h3>
                        <Badge variant="secondary" className="text-[10px]">
                            {new Date(beforePhoto.evalDate).toLocaleDateString("es-CO", {
                                month: "short",
                                year: "numeric",
                            })}{" "}
                            vs{" "}
                            {new Date(afterPhoto.evalDate).toLocaleDateString("es-CO", {
                                month: "short",
                                year: "numeric",
                            })}
                        </Badge>
                    </div>
                    <PhotoComparison
                        beforeImage={beforePhoto.imageUrl}
                        afterImage={afterPhoto.imageUrl}
                    />
                </div>
            )}

            {/* Photo Gallery by Date */}
            <div>
                <div className="mb-4 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">Galería de Progreso</h3>
                </div>

                {sortedDates.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Camera className="h-10 w-10 text-muted-foreground/30" />
                            <p className="mt-3 text-sm text-muted-foreground">
                                No hay fotos de progreso registradas aún.
                            </p>
                            <p className="text-xs text-muted-foreground/60">
                                Las fotos se agregan al crear una nueva evaluación.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {sortedDates.map((date) => {
                            const photos = photosByDate[date];
                            const firstPhoto = photos[0];

                            return (
                                <Card key={date}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-sm font-medium">
                                                    <Calendar className="mr-1.5 inline h-3.5 w-3.5 text-muted-foreground" />
                                                    {new Date(date).toLocaleDateString("es-CO", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </CardTitle>
                                                {firstPhoto && (
                                                    <CardDescription className="mt-1">
                                                        {firstPhoto.weight && `Peso: ${firstPhoto.weight} kg`}
                                                        {firstPhoto.weight && firstPhoto.fat && " · "}
                                                        {firstPhoto.fat && `Grasa: ${firstPhoto.fat}%`}
                                                    </CardDescription>
                                                )}
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">
                                                {photos.length}{" "}
                                                {photos.length === 1 ? "foto" : "fotos"}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                            {photos.map((photo) => (
                                                <div
                                                    key={photo.id}
                                                    className="group relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted"
                                                >
                                                    <img
                                                        src={photo.imageUrl}
                                                        alt={`${photo.angle} - ${date}`}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-black/40 text-white text-[10px] backdrop-blur-sm border-0"
                                                        >
                                                            {photo.angle === "FRONT" ? "Frontal" : photo.angle === "BACK" ? "Posterior" : "Lateral"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
