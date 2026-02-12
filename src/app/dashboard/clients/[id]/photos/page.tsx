"use client";

import { use } from "react";
import { Camera, Calendar, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhotoComparison } from "@/components/profile/PhotoComparison";
import { mockAssessments } from "@/lib/data/mock-assessments";

// Mock photos for demonstration
const mockPhotos = [
    {
        id: "p1",
        assessmentId: "a2",
        date: "2024-01-15",
        angle: "Frontal",
        url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
    },
    {
        id: "p2",
        assessmentId: "a2",
        date: "2024-01-15",
        angle: "Lateral",
        url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop",
    },
    {
        id: "p3",
        assessmentId: "a1",
        date: "2024-02-10",
        angle: "Frontal",
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop",
    },
    {
        id: "p4",
        assessmentId: "a1",
        date: "2024-02-10",
        angle: "Lateral",
        url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop",
    },
];

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ClientPhotosPage({ params }: PageProps) {
    const { id } = use(params);
    const clientAssessments = mockAssessments.filter((a) => a.clientId === id);

    // Group photos by date
    const photosByDate = mockPhotos.reduce(
        (acc, photo) => {
            if (!acc[photo.date]) acc[photo.date] = [];
            acc[photo.date].push(photo);
            return acc;
        },
        {} as Record<string, typeof mockPhotos>
    );

    const sortedDates = Object.keys(photosByDate).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    // Get before/after for comparison (earliest frontal vs latest frontal)
    const frontalPhotos = mockPhotos
        .filter((p) => p.angle === "Frontal")
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const beforePhoto = frontalPhotos[0];
    const afterPhoto = frontalPhotos[frontalPhotos.length - 1];

    return (
        <div className="space-y-6">
            {/* Before/After Comparison */}
            {beforePhoto && afterPhoto && beforePhoto.id !== afterPhoto.id && (
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">Antes y Después</h3>
                        <Badge variant="secondary" className="text-[10px]">
                            {new Date(beforePhoto.date).toLocaleDateString("es-CO", {
                                month: "short",
                                year: "numeric",
                            })}{" "}
                            vs{" "}
                            {new Date(afterPhoto.date).toLocaleDateString("es-CO", {
                                month: "short",
                                year: "numeric",
                            })}
                        </Badge>
                    </div>
                    <PhotoComparison
                        beforeImage={beforePhoto.url}
                        afterImage={afterPhoto.url}
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
                            const assessment = clientAssessments.find(
                                (a) =>
                                    new Date(a.date).toISOString().split("T")[0] === date
                            );

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
                                                {assessment && (
                                                    <CardDescription className="mt-1">
                                                        Peso: {assessment.weight} kg
                                                        {assessment.bodyFatPercentage &&
                                                            ` · Grasa: ${assessment.bodyFatPercentage}%`}
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
                                                        src={photo.url}
                                                        alt={`${photo.angle} - ${photo.date}`}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-black/40 text-white text-[10px] backdrop-blur-sm border-0"
                                                        >
                                                            {photo.angle}
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
