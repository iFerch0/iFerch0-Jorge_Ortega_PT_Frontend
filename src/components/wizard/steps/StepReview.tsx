"use client";

import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WizardLayout } from "../WizardLayout";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
// Import from lucide-react icons for visual feedback
import { User, Target, Activity, Calendar, Scale, Camera } from "lucide-react";

export function StepReview() {
    const { data, photos, resetWizard, prevStep } = useWizardStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function onComplete() {
        // ... (keep existing)
        setIsSubmitting(true);

        try {
            // Simulate API Call
            console.log("Submitting Wizard Data:", data);
            await new Promise((resolve) => setTimeout(resolve, 2000));

            toast.success("Cliente creado exitosamente");
            resetWizard(); // Clear store
            router.push("/dashboard/clients");
        } catch (error) {
            toast.error("Error al crear cliente");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Helper to display arrays nicely
    const formatList = (list?: string[]) => {
        if (!list || list.length === 0) return "N/A";
        return list.join(", ");
    };

    const formatFileList = (files?: File[]) => {
        if (!files || files.length === 0) return "Sin fotos";
        return `${files.length} archivo(s) seleccionados`;
    };

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
                        <p><span className="font-medium text-foreground">Email:</span> {data.personalData?.email}</p>
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
                        <p><span className="font-medium text-foreground">Meta:</span> {data.objectives?.goal}</p>
                        <p><span className="font-medium text-foreground">Experiencia:</span> {data.objectives?.experienceLevel}</p>
                        <p><span className="font-medium text-foreground">Actividad:</span> {data.objectives?.activityLevel}</p>
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
                        <p><span className="font-medium text-foreground">Grasa:</span> {data.bioimpedance?.bodyFat ? `${data.bioimpedance.bodyFat}%` : "N/A"}</p>
                        <p><span className="font-medium text-foreground">Músculo:</span> {data.bioimpedance?.muscleMass ? `${data.bioimpedance.muscleMass}%` : "N/A"}</p>
                        <p><span className="font-medium text-foreground">Visceral:</span> {data.bioimpedance?.visceralFat || "N/A"}</p>
                        <p><span className="font-medium text-foreground">Cintura:</span> {data.bioimpedance?.waist ? `${data.bioimpedance.waist} cm` : "N/A"}</p>
                        <p><span className="font-medium text-foreground">Cadera:</span> {data.bioimpedance?.hip ? `${data.bioimpedance.hip} cm` : "N/A"}</p>
                    </div>
                </div>

                {/* Section: Photos */}
                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Camera className="h-5 w-5" />
                        <h3>Fotos</h3>
                    </div>
                    <div className="text-sm grid gap-1 text-muted-foreground">
                        <p><span className="font-medium text-foreground">Archivos:</span> {formatFileList(photos)}</p>
                    </div>
                </div>

                {/* Section: Availability */}
                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Calendar className="h-5 w-5" />
                        <h3>Disponibilidad</h3>
                    </div>
                    <div className="text-sm grid gap-1 text-muted-foreground">
                        <p><span className="font-medium text-foreground">Días:</span> {formatList(data.availability?.trainingDays)}</p>
                        <p><span className="font-medium text-foreground">Duración:</span> {data.availability?.trainingDuration}</p>
                        <p><span className="font-medium text-foreground">Equipo:</span> {formatList(data.availability?.equipment)}</p>
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
                            Creando...
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
