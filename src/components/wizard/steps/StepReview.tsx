"use client";

import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WizardLayout } from "../WizardLayout";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { User, Target, Activity, Calendar, Scale, Camera } from "lucide-react";
import Image from "next/image";

const goalLabels: Record<string, string> = {
    lose_weight: "Perder Peso",
    gain_muscle: "Ganar Músculo",
    maintain: "Mantenerse",
    improve_endurance: "Mejorar Resistencia",
};

const experienceLabels: Record<string, string> = {
    beginner: "Principiante (0-6 meses)",
    intermediate: "Intermedio (6m - 2 años)",
    advanced: "Avanzado (+2 años)",
};

const activityLabels: Record<string, string> = {
    sedentary: "Sedentario",
    light: "Ligero",
    moderate: "Moderado",
    active: "Activo",
    very_active: "Muy Activo",
};

const dayLabels: Record<string, string> = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
};

const durationLabels: Record<string, string> = {
    "30_min": "30 Minutos",
    "45_min": "45 Minutos",
    "60_min": "60 Minutos",
    "90_min_plus": "+90 Minutos",
};

const equipmentLabels: Record<string, string> = {
    gym_full: "Gimnasio Completo",
    dumbbells: "Mancuernas",
    barbell: "Barra y Discos",
    bands: "Bandas Elásticas",
    bodyweight: "Solo Peso Corporal",
    cardio_machine: "Máquina de Cardio",
};

const genderMap: Record<string, string> = { male: "MALE", female: "FEMALE", other: "OTHER" };

export function StepReview() {
    const { data, photos, resetWizard, prevStep } = useWizardStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function onComplete() {
        setIsSubmitting(true);

        try {
            // 1. Preparar datos para Crear Cliente
            // Calculamos una fecha de nacimiento aproximada ya que solo tenemos edad
            const currentYear = new Date().getFullYear();
            const birthYear = currentYear - (data.personalData?.age || 20);
            const approximateBirthDate = `${birthYear}-01-01`; // ISO YYYY-MM-DD

            const clientPayload = {
                firstName: data.personalData?.firstName,
                lastName: data.personalData?.lastName,
                cedula: data.personalData?.cedula,
                email: data.personalData?.email || "",
                phone: data.personalData?.phone,
                birthDate: approximateBirthDate,
                gender: genderMap[data.personalData?.gender || "other"] || "OTHER",
                height: data.personalData?.height,
                objectives: [{ content: data.objectives?.goal }, { content: data.objectives?.notes }].filter(o => o.content),
                pathologies: [
                    { name: data.physicalAssessment?.injuries, notes: "Lesiones" },
                    { name: data.physicalAssessment?.medicalConditions, notes: "Condiciones Médicas" }
                ].filter(p => p.name)
            };
            const clientResponse = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientPayload)
            });

            if (!clientResponse.ok) {
                const errorData = await clientResponse.json();
                throw new Error(errorData.message || "Error al crear cliente");
            }

            const clientData = await clientResponse.json();
            const clientId = clientData.id || clientData.data?.id;

            if (!clientId) throw new Error("No se recibió ID del cliente creado");

            // 2. Crear Evaluación Inicial (Bioimpedancia + Fotos)
            const evaluationFormData = new FormData();
            evaluationFormData.append('clientId', clientId);
            evaluationFormData.append('weight', String(data.bioimpedance?.weight || data.personalData?.weight || 0));
            evaluationFormData.append('date', new Date().toISOString());

            // Bioimpedancia
            if (data.bioimpedance) {
                if (data.bioimpedance.bmi) evaluationFormData.append('bmi', String(data.bioimpedance.bmi));
                if (data.bioimpedance.bodyFat) evaluationFormData.append('bodyFat', String(data.bioimpedance.bodyFat));
                if (data.bioimpedance.muscleMass) evaluationFormData.append('muscleMass', String(data.bioimpedance.muscleMass));
                if (data.bioimpedance.visceralFat) evaluationFormData.append('visceralFat', String(data.bioimpedance.visceralFat));
                if (data.bioimpedance.bodyWater) evaluationFormData.append('bodyWater', String(data.bioimpedance.bodyWater));
                if (data.bioimpedance.skeletalMuscleMass) evaluationFormData.append('skeletalMuscleMass', String(data.bioimpedance.skeletalMuscleMass));
                if (data.bioimpedance.basalMetabolism) evaluationFormData.append('basalMetabolism', String(data.bioimpedance.basalMetabolism));

                // Add Bioimpedance Ticket Image if exists
                if (data.bioimpedance.bioimpedanceImage) {
                    evaluationFormData.append('bioimpedance', data.bioimpedance.bioimpedanceImage);
                }
            }

            // Fotos
            if (photos.front) evaluationFormData.append('front', photos.front);
            if (photos.side) evaluationFormData.append('side', photos.side);
            if (photos.back) evaluationFormData.append('back', photos.back);

            const evalResponse = await fetch('/api/evaluations', {
                method: 'POST',
                body: evaluationFormData
                // Content-Type header is automatic with FormData
            });

            if (!evalResponse.ok) {
                console.warn("Cliente creado, pero falló la evaluación inicial.");
                toast.warning("Cliente creado, pero hubo un error al guardar la evaluación inicial.");
            } else {
                toast.success("Cliente y evaluación inicial creados exitosamente");
            }

            resetWizard();
            router.push("/dashboard/clients");

        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Error inesperado al procesar solicitud";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const photoLabels = { front: "Frontal", side: "Lateral", back: "Espalda" } as const;
    const hasAnyPhoto = photos.front || photos.side || photos.back;

    // Build preview URLs for photos
    const [photoPreviews, setPhotoPreviews] = useState<Record<string, string | null>>({
        front: null,
        side: null,
        back: null,
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

    return (
        <WizardLayout
            title="Resumen y Confirmación"
            description="Verifica que toda la información sea correcta antes de crear el perfil."
        >
            <div className="grid gap-6 md:grid-cols-2">
                {/* Section: Personal Data */}
                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <User className="h-5 w-5" />
                        <h3>Datos Personales</h3>
                    </div>
                    <div className="text-sm grid gap-1 text-muted-foreground">
                        <p><span className="font-medium text-foreground">Nombre:</span> {data.personalData?.firstName} {data.personalData?.lastName}</p>
                        <p><span className="font-medium text-foreground">Cédula:</span> {data.personalData?.cedula}</p>
                        <p><span className="font-medium text-foreground">Teléfono:</span> {data.personalData?.phone}</p>
                        <p><span className="font-medium text-foreground">Edad:</span> {data.personalData?.age} años</p>
                        <p><span className="font-medium text-foreground">Peso/Altura:</span> {data.personalData?.weight}kg / {data.personalData?.height}cm</p>
                    </div>
                </div>

                {/* Section: Objectives */}
                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Target className="h-5 w-5" />
                        <h3>Objetivos</h3>
                    </div>
                    <div className="text-sm grid gap-1 text-muted-foreground">
                        <p><span className="font-medium text-foreground">Meta:</span> {goalLabels[data.objectives?.goal || ""] || data.objectives?.goal}</p>
                        <p><span className="font-medium text-foreground">Experiencia:</span> {experienceLabels[data.objectives?.experienceLevel || ""] || data.objectives?.experienceLevel}</p>
                        <p><span className="font-medium text-foreground">Actividad:</span> {activityLabels[data.objectives?.activityLevel || ""] || data.objectives?.activityLevel}</p>
                        <p><span className="font-medium text-foreground">Notas:</span> {data.objectives?.notes || "Ninguna"}</p>
                    </div>
                </div>

                {/* Section: Physical Assessment */}
                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Activity className="h-5 w-5" />
                        <h3>Valoración Física</h3>
                    </div>
                    <div className="text-sm grid gap-1 text-muted-foreground">
                        <p><span className="font-medium text-foreground">Lesiones:</span> {data.physicalAssessment?.injuries || "Ninguna"}</p>
                        <p><span className="font-medium text-foreground">Condiciones:</span> {data.physicalAssessment?.medicalConditions || "Ninguna"}</p>
                        <p><span className="font-medium text-foreground">Medicamentos:</span> {data.physicalAssessment?.medications || "Ninguno"}</p>
                    </div>
                </div>

                {/* Section: Bioimpedance */}
                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Scale className="h-5 w-5" />
                        <h3>Bioimpedancia</h3>
                    </div>
                    <div className="text-sm grid gap-1 text-muted-foreground">
                        <p><span className="font-medium text-foreground">IMC:</span> {data.bioimpedance?.bmi || "N/A"}</p>
                        <p><span className="font-medium text-foreground">Grasa Corp:</span> {data.bioimpedance?.bodyFat ? `${data.bioimpedance.bodyFat}%` : "N/A"}</p>
                        <p><span className="font-medium text-foreground">Masa Musc:</span> {data.bioimpedance?.muscleMass ? `${data.bioimpedance.muscleMass}kg` : "N/A"}</p>
                        <p><span className="font-medium text-foreground">Grasa Visc:</span> {data.bioimpedance?.visceralFat ? `${data.bioimpedance.visceralFat}%` : "N/A"}</p>
                        <p><span className="font-medium text-foreground">Agua Corp:</span> {data.bioimpedance?.bodyWater ? `${data.bioimpedance.bodyWater}L` : "N/A"}</p>
                        <p><span className="font-medium text-foreground">M.M.E:</span> {data.bioimpedance?.skeletalMuscleMass ? `${data.bioimpedance.skeletalMuscleMass}kg` : "N/A"}</p>
                        <p><span className="font-medium text-foreground">Metab. Basal:</span> {data.bioimpedance?.basalMetabolism ? `${data.bioimpedance.basalMetabolism}kcal` : "N/A"}</p>
                        <p><span className="font-medium text-foreground">Ticket Imagen:</span> {data.bioimpedance?.bioimpedanceImage ? "Sí (Adjunta)" : "No"}</p>
                    </div>
                </div>

                {/* Section: Photos */}
                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Camera className="h-5 w-5" />
                        <h3>Fotos</h3>
                    </div>
                    {hasAnyPhoto ? (
                        <div className="grid grid-cols-3 gap-3">
                            {(["front", "side", "back"] as const).map((key) => (
                                <div key={key} className="flex flex-col items-center gap-1">
                                    <span className="text-xs font-medium text-foreground">{photoLabels[key]}</span>
                                    {photoPreviews[key] ? (
                                        <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden border">
                                            <Image src={photoPreviews[key]!} alt={photoLabels[key]} fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="aspect-[3/4] w-full rounded-md border flex items-center justify-center">
                                            <span className="text-xs text-muted-foreground">Sin foto</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Sin fotos adjuntas</p>
                    )}
                </div>

                {/* Section: Availability */}
                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Calendar className="h-5 w-5" />
                        <h3>Disponibilidad</h3>
                    </div>
                    <div className="text-sm grid gap-1 text-muted-foreground">
                        <p><span className="font-medium text-foreground">Días:</span> {data.availability?.trainingDays?.map(d => dayLabels[d] || d).join(", ") || "N/A"}</p>
                        <p><span className="font-medium text-foreground">Duración:</span> {durationLabels[data.availability?.trainingDuration || ""] || data.availability?.trainingDuration}</p>
                        <p><span className="font-medium text-foreground">Equipo:</span> {data.availability?.equipment?.map(e => equipmentLabels[e] || e).join(", ") || "N/A"}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                    Atrás
                </Button>
                <Button onClick={onComplete} size="lg" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Confirmar y Crear
                        </>
                    )}
                </Button>
            </div>
        </WizardLayout>
    );
}
