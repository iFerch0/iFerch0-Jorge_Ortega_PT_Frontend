"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Assessment } from "@/lib/data/mock-assessments";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const assessmentSchema = z.object({
    weight: z.string().min(1, "El peso es requerido"),
    bodyFatPercentage: z.string().optional(),
    muscleMassPercentage: z.string().optional(),
    visceralFat: z.string().optional(),
    notes: z.string().optional(),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

interface AssessmentFormProps {
    clientId: string;
    previousAssessment?: Assessment;
}

export function AssessmentForm({ clientId, previousAssessment }: AssessmentFormProps) {
    const router = useRouter();
    const form = useForm<AssessmentFormValues>({
        resolver: zodResolver(assessmentSchema),
        defaultValues: {
            weight: "",
            bodyFatPercentage: "",
            muscleMassPercentage: "",
            visceralFat: "",
            notes: "",
        },
    });

    async function onSubmit(data: AssessmentFormValues) {
        try {
            const formData = new FormData();
            formData.append("clientId", clientId);
            formData.append("weight", data.weight);
            formData.append("date", new Date().toISOString());
            formData.append("type", "MONTHLY"); // Default to Monthly follow-up

            if (data.bodyFatPercentage) formData.append("fatPercentage", data.bodyFatPercentage);
            if (data.muscleMassPercentage) formData.append("muscleMass", data.muscleMassPercentage);
            if (data.visceralFat) formData.append("visceralFat", data.visceralFat);
            if (data.notes) formData.append("notes", data.notes);

            // Photos are pending implementation in this form
            // if (photos) ... 

            console.log("Submitting assessment to API...");
            const response = await fetch("/api/evaluations", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al guardar la evaluación");
            }

            toast.success("Evaluación guardada exitosamente");

            // Invalidate queries or update context here
            setTimeout(() => {
                router.push(`/dashboard/clients/${clientId}/assessments`);
                router.refresh();
            }, 1000);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error al conectar con el servidor");
        }
    }

    const renderComparison = (label: string, value?: number, unit: string = "") => {
        if (value === undefined) return null;
        return (
            <div className="text-sm text-muted-foreground mt-1">
                Anterior: <span className="font-medium text-foreground">{value} {unit}</span>
            </div>
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/clients/${clientId}/assessments`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h2 className="text-xl font-semibold">Nueva Evaluación</h2>
                    </div>
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Morphological Data */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos Corporales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Peso (kg)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0.0" type="number" step="0.1" {...field} />
                                        </FormControl>
                                        {renderComparison("Anterior", previousAssessment?.weight, "kg")}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="bodyFatPercentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>% Grasa</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0.0" type="number" step="0.1" {...field} />
                                            </FormControl>
                                            {renderComparison("Anterior", previousAssessment?.bodyFatPercentage, "%")}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="muscleMassPercentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>% Músculo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0.0" type="number" step="0.1" {...field} />
                                            </FormControl>
                                            {renderComparison("Anterior", previousAssessment?.muscleMassPercentage, "%")}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="visceralFat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Grasa Visceral</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0" type="number" step="1" {...field} />
                                        </FormControl>
                                        {renderComparison("Anterior", previousAssessment?.visceralFat)}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Photos & Notes */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fotos de Progreso</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Funcionalidad de carga de fotos pendiente (Sprint 4)
                                    </p>
                                    <Button variant="secondary" size="sm" className="mt-4" disabled>
                                        Subir Fotos
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notas y Observaciones</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Anotaciones sobre el progreso, sensaciones, cambios en dieta..."
                                                    className="min-h-[120px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
