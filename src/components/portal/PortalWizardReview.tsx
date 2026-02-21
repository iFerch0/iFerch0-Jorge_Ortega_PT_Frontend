"use client";

import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import {
    Loader2, CheckCircle2, Target,
    Building2, Home, TreePine, MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { me } from "@/lib/api";
import { cn } from "@/lib/utils";

const experienceLabels: Record<string, string> = {
    beginner:     "Principiante (0-6 meses)",
    intermediate: "Intermedio (6m - 2 años)",
    advanced:     "Avanzado (+2 años)",
};

const activityLabels: Record<string, string> = {
    sedentary:   "Sedentario",
    light:       "Ligero",
    moderate:    "Moderado",
    active:      "Activo",
    very_active: "Muy Activo",
};

const dayLabels: Record<string, string> = {
    monday: "Lun", tuesday: "Mar", wednesday: "Mié",
    thursday: "Jue", friday: "Vie", saturday: "Sáb", sunday: "Dom",
};

const durationLabels: Record<string, string> = {
    "30_min":     "30 min",
    "45_min":     "45 min",
    "60_min":     "60 min",
    "90_min_plus":"+90 min",
};

const trainingPlaceMap: Record<string, { label: string; Icon: typeof Building2 }> = {
    GYM:     { label: "Gimnasio",   Icon: Building2 },
    HOME:    { label: "Casa",       Icon: Home },
    OUTDOOR: { label: "Aire libre", Icon: TreePine },
};

const severityConfig: Record<string, { label: string; className: string }> = {
    Low:    { label: "Baja",  className: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
    Medium: { label: "Media", className: "text-amber-600  bg-amber-500/10  border-amber-500/20"  },
    High:   { label: "Alta",  className: "text-red-600    bg-red-500/10    border-red-500/20"    },
};

const sectionLabel = "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 block";

function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div className="flex items-start justify-between gap-4 py-2 border-b border-border/40 last:border-0">
            <span className="text-xs text-muted-foreground shrink-0">{label}</span>
            <span className="text-xs font-medium text-right">{value}</span>
        </div>
    );
}

export function PortalWizardReview() {
    const { data, photos, bioimpedanceTicket, resetWizard, prevStep } = useWizardStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const pathologies = data.pathologies;
    const photoLabels = { front: "Frontal", side: "Lateral", back: "Espalda" } as const;
    const hasAnyPhoto = photos.front || photos.side || photos.back;

    const [photoPreviews, setPhotoPreviews] = useState<Record<string, string | null>>({
        front: null, side: null, back: null,
    });

    useEffect(() => {
        const urls: Record<string, string | null> = { front: null, side: null, back: null };
        (["front", "side", "back"] as const).forEach((key) => {
            if (photos[key]) urls[key] = URL.createObjectURL(photos[key]);
        });
        setPhotoPreviews(urls);
        return () => {
            Object.values(urls).forEach((url) => { if (url) URL.revokeObjectURL(url); });
        };
    }, [photos]);

    async function onComplete() {
        setIsSubmitting(true);
        try {
            await me.updateProfile({
                phone:          data.personalData?.phone,
                birthDate:      data.personalData?.birthDate,
                height:         data.personalData?.height,
                trainingPlace:  data.availability?.trainingPlace,
                objectives:     data.objectives?.objectives?.map((obj) => ({ content: obj.content })) || [],
                pathologies:    pathologies?.pathologies?.map((p) => ({
                    name: p.name, severity: p.severity, notes: p.notes,
                })) || [],
            });

            if (photos.front || photos.side || photos.back) {
                await me.uploadPhotos({ front: photos.front, side: photos.side, back: photos.back });
            }

            if (bioimpedanceTicket) {
                await me.uploadBioimpedanceTicket(bioimpedanceTicket);
            }

            await me.completeWizard();
            toast.success("¡Perfil completado exitosamente!");
            resetWizard();
            router.push("/portal");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al guardar tu perfil";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const birthDate = data.personalData?.birthDate;
    const age = birthDate ? calculateAge(birthDate) : null;
    const placeConfig = data.availability?.trainingPlace
        ? trainingPlaceMap[data.availability.trainingPlace]
        : null;
    const PlaceIcon = placeConfig?.Icon ?? MapPin;

    return (
        <WizardLayout
            title="Revisión Final"
            description="Verifica tu información antes de completar tu perfil."
        >
            <div className="space-y-5">

                {/* Personal */}
                <div>
                    <span className={sectionLabel}>Datos personales</span>
                    <div className="rounded-2xl border bg-card px-4 py-1">
                        <ReviewRow
                            label="Nombre"
                            value={`${data.personalData?.firstName || ""} ${data.personalData?.lastName || ""}`.trim() || null}
                        />
                        <ReviewRow label="Teléfono" value={data.personalData?.phone} />
                        <ReviewRow
                            label="Nacimiento"
                            value={birthDate ? `${birthDate}${age ? ` (${age} años)` : ""}` : null}
                        />
                        <ReviewRow
                            label="Peso / Altura"
                            value={data.personalData?.weight && data.personalData?.height
                                ? `${data.personalData.weight} kg / ${data.personalData.height} cm`
                                : null
                            }
                        />
                    </div>
                </div>

                {/* Objetivos */}
                <div>
                    <span className={sectionLabel}>Objetivos</span>
                    <div className="rounded-2xl border bg-card px-4 py-3 space-y-2.5">
                        {data.objectives?.objectives && data.objectives.objectives.length > 0 ? (
                            data.objectives.objectives.map((obj, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 text-sm">
                                    <Target className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                                    <span>{obj.content}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground py-1">Sin objetivos definidos</p>
                        )}
                        {(data.objectives?.experienceLevel || data.objectives?.activityLevel) && (
                            <div className="flex gap-2 flex-wrap pt-2 border-t border-border/40">
                                {data.objectives?.experienceLevel && (
                                    <span className="rounded-full border border-border bg-muted/30 px-3 py-1 text-[10px] font-medium text-muted-foreground">
                                        {experienceLabels[data.objectives.experienceLevel] || data.objectives.experienceLevel}
                                    </span>
                                )}
                                {data.objectives?.activityLevel && (
                                    <span className="rounded-full border border-border bg-muted/30 px-3 py-1 text-[10px] font-medium text-muted-foreground">
                                        {activityLabels[data.objectives.activityLevel] || data.objectives.activityLevel}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Condiciones */}
                <div>
                    <span className={sectionLabel}>Condiciones de salud</span>
                    <div className="rounded-2xl border bg-card px-4 py-3">
                        {pathologies?.hasNoPathologies ? (
                            <p className="text-sm text-emerald-600 font-medium py-1">Sin condiciones de salud</p>
                        ) : pathologies?.pathologies && pathologies.pathologies.length > 0 ? (
                            <ul className="space-y-2.5">
                                {pathologies.pathologies.map((p, idx) => {
                                    const sev = p.severity ? severityConfig[p.severity] : null;
                                    return (
                                        <li key={idx} className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-medium">{p.name}</span>
                                            {sev && (
                                                <span className={cn(
                                                    "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                                    sev.className
                                                )}>
                                                    {sev.label}
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground py-1">Sin información</p>
                        )}
                    </div>
                </div>

                {/* Disponibilidad */}
                <div>
                    <span className={sectionLabel}>Disponibilidad</span>
                    <div className="rounded-2xl border bg-card px-4 py-3 space-y-3">
                        {placeConfig && (
                            <div className="flex items-center gap-2 text-sm">
                                <PlaceIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span>{placeConfig.label}</span>
                                {data.availability?.trainingDuration && (
                                    <>
                                        <span className="text-border">·</span>
                                        <span className="text-muted-foreground">
                                            {durationLabels[data.availability.trainingDuration] || data.availability.trainingDuration}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                        {data.availability?.trainingDays && data.availability.trainingDays.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {data.availability.trainingDays.map((d) => (
                                    <span
                                        key={d}
                                        className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold text-primary uppercase tracking-wider"
                                    >
                                        {dayLabels[d] || d}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Fotos */}
                {hasAnyPhoto && (
                    <div>
                        <span className={sectionLabel}>Fotos</span>
                        <div className="grid grid-cols-3 gap-3">
                            {(["front", "side", "back"] as const).map((key) => (
                                <div key={key} className="flex flex-col items-center gap-1.5">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                        {photoLabels[key]}
                                    </span>
                                    {photoPreviews[key] ? (
                                        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border">
                                            <Image
                                                src={photoPreviews[key]!}
                                                alt={photoLabels[key]}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-[3/4] w-full rounded-2xl border border-dashed flex items-center justify-center">
                                            <span className="text-xs text-muted-foreground">—</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bioimpedancia */}
                <div>
                    <span className={sectionLabel}>Bioimpedancia</span>
                    <div className="rounded-2xl border bg-card px-4 py-1">
                        <ReviewRow
                            label="Peso"
                            value={data.bioimpedance?.weight ? `${data.bioimpedance.weight} kg` : null}
                        />
                        <ReviewRow label="IMC" value={data.bioimpedance?.bmi?.toString()} />
                        <ReviewRow
                            label="Grasa corporal"
                            value={data.bioimpedance?.bodyFat ? `${data.bioimpedance.bodyFat}%` : null}
                        />
                        <ReviewRow
                            label="Masa muscular"
                            value={data.bioimpedance?.muscleMass ? `${data.bioimpedance.muscleMass} kg` : null}
                        />
                        <ReviewRow label="Ticket" value={bioimpedanceTicket ? "Adjunto ✓" : null} />
                    </div>
                </div>

            </div>

            <div className="flex justify-between mt-8">
                <Button type="button" variant="ghost" onClick={prevStep} disabled={isSubmitting}>
                    Atrás
                </Button>
                <Button onClick={onComplete} size="lg" disabled={isSubmitting} className="min-w-[180px]">
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Completar Perfil
                        </>
                    )}
                </Button>
            </div>
        </WizardLayout>
    );
}
