"use client";

import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WizardLayout } from "../WizardLayout";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { User, Target, Activity, Calendar, Scale, Camera } from "lucide-react";

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
                email: data.personalData?.email,
                phone: data.personalData?.phone,
                birthDate: approximateBirthDate,
                gender: data.personalData?.gender?.toUpperCase(), // API expects uppercase probably, checking docs: MALE/FEMALE
                height: data.personalData?.height,
                objectives: [{ content: data.objectives?.goal }, { content: data.objectives?.notes }].filter(o => o.content),
                pathologies: [
                    { name: data.physicalAssessment?.injuries, notes: "Lesiones" },
                    { name: data.physicalAssessment?.medicalConditions, notes: "Condiciones Médicas" }
                ].filter(p => p.name)
            };

            // Fix gender mapping if needed 
            if (clientPayload.gender === 'MALE') clientPayload.gender = 'MALE';
            if (clientPayload.gender === 'FEMALE') clientPayload.gender = 'FEMALE';
            if (clientPayload.gender === 'OTHER') clientPayload.gender = 'OTHER';
            // Assuming API handles case-insensitivity or standardizing:
            // "male" -> "MALE"
            if (clientPayload.gender === 'MALE' || clientPayload.gender === 'FEMALE') {
                // ok
            } else {
                // map keys
                if (data.personalData?.gender === 'male') clientPayload.gender = 'MALE';
                else if (data.personalData?.gender === 'female') clientPayload.gender = 'FEMALE';
                else clientPayload.gender = 'OTHER';
            }


            console.log("Creating Client...", clientPayload);
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
            const clientId = clientData.id || clientData.data?.id; // Adjust based on actual API response structure

            if (!clientId) throw new Error("No se recibió ID del cliente creado");

            console.log("Client Created, ID:", clientId);

            // 2. Crear Evaluación Inicial (Bioimpedancia + Fotos)
            const evaluationFormData = new FormData();
            evaluationFormData.append('clientId', clientId);
            evaluationFormData.append('weight', String(data.personalData?.weight || 0));
            evaluationFormData.append('date', new Date().toISOString());
            evaluationFormData.append('type', 'INITIAL'); // Asumimos tipo inicial

            // Bioimpedancia
            if (data.bioimpedance) {
                if (data.bioimpedance.bodyFat) evaluationFormData.append('fatPercentage', String(data.bioimpedance.bodyFat));
                if (data.bioimpedance.muscleMass) evaluationFormData.append('muscleMass', String(data.bioimpedance.muscleMass));
                if (data.bioimpedance.visceralFat) evaluationFormData.append('visceralFat', String(data.bioimpedance.visceralFat));
                // Others if supported by API
            }

            // Fotos
            // Asumimos orden: 0->Front, 1->Side, 2->Back
            if (photos.length > 0) evaluationFormData.append('front', photos[0]);
            if (photos.length > 1) evaluationFormData.append('side', photos[1]);
            if (photos.length > 2) evaluationFormData.append('back', photos[2]);

            console.log("Creating Initial Evaluation...");
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

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error inesperado al procesar solicitud");
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
