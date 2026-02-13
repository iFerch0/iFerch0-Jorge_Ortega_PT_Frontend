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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Evaluation } from "@/types/api";
import { evaluations } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const assessmentSchema = z.object({
    weight: z.string().min(1, "El peso es requerido"),
    bmi: z.string().optional(),
    bodyFat: z.string().optional(), // Grasa Corporal (%)
    muscleMass: z.string().optional(), // Masa Muscular (kg)
    visceralFat: z.string().optional(), // Grasa Visceral (%)
    bodyWater: z.string().optional(), // Agua Corporal (Litros)
    skeletalMuscleMass: z.string().optional(), // Masa Muscular Esquelética (kg)
    basalMetabolism: z.string().optional(), // Metabolismo Basal (Kcal)
    notes: z.string().optional(),
    // Files are handled separately in state because controlled file inputs have issues
    // or Zod validation for files in RHF is complex
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

interface AssessmentFormProps {
    clientId: string;
    previousAssessment?: Evaluation;
    clientHeight?: number; // cm
}

export function AssessmentForm({ clientId, previousAssessment, clientHeight }: AssessmentFormProps) {
    const router = useRouter();
    const [bioimpedanceImage, setBioimpedanceImage] = useState<File | null>(null);
    const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
    const [backPhoto, setBackPhoto] = useState<File | null>(null);
    const [sidePhoto, setSidePhoto] = useState<File | null>(null);

    const form = useForm<AssessmentFormValues>({
        resolver: zodResolver(assessmentSchema),
        defaultValues: {
            weight: "",
            bmi: "",
            bodyFat: "",
            muscleMass: "",
            visceralFat: "",
            bodyWater: "",
            skeletalMuscleMass: "",
            basalMetabolism: "",
            notes: "",
        },
    });

    const { isSubmitting } = form.formState;
    const prevBio = previousAssessment?.bioimpedance;

    // Auto-calculate BMI
    const weight = form.watch("weight");
    useEffect(() => {
        if (weight && clientHeight) {
            const w = parseFloat(weight);
            if (!isNaN(w) && clientHeight > 0) {
                const heightInMeters = clientHeight / 100;
                const bmi = w / (heightInMeters * heightInMeters);
                form.setValue("bmi", bmi.toFixed(1));
            }
        }
    }, [weight, clientHeight, form]);

    async function onSubmit(data: AssessmentFormValues) {
        try {
            await evaluations.create({
                clientId,
                date: new Date().toISOString(),
                notes: data.notes || undefined,
                weight: parseFloat(data.weight),
                bmi: data.bmi ? parseFloat(data.bmi) : undefined,
                bodyFat: data.bodyFat ? parseFloat(data.bodyFat) : undefined,
                muscleMass: data.muscleMass ? parseFloat(data.muscleMass) : undefined,
                visceralFat: data.visceralFat ? parseFloat(data.visceralFat) : undefined,
                bodyWater: data.bodyWater ? parseFloat(data.bodyWater) : undefined,
                skeletalMuscleMass: data.skeletalMuscleMass ? parseFloat(data.skeletalMuscleMass) : undefined,
                basalMetabolism: data.basalMetabolism ? parseInt(data.basalMetabolism) : undefined,

                // Files
                bioimpedanceImage: bioimpedanceImage || undefined,
                front: frontPhoto || undefined,
                back: backPhoto || undefined,
                side: sidePhoto || undefined, // correcting variable name if I typoed above
            });

            toast.success("Evaluación guardada exitosamente");
            router.push(`/dashboard/clients/${clientId}/assessments`);
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar la evaluación");
        }
    }

    const renderComparison = (value?: number | null, unit: string = "") => {
        if (value == null) return null;
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
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Guardar
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Datos Corporales (Bioimpedancia)</CardTitle>
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
                                            {renderComparison(prevBio?.weight, "kg")}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bmi"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>IMC</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0.0" type="number" step="0.1" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                {clientHeight ? "Calculado automáticamente" : "Ingresa manualmente"}
                                            </FormDescription>
                                            {renderComparison(prevBio?.bmi)}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="bodyFat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Grasa Corporal (%)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0.0" type="number" step="0.1" {...field} />
                                                </FormControl>
                                                {renderComparison(prevBio?.bodyFat, "%")}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="visceralFat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Grasa Visceral (%)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" type="number" step="1" {...field} />
                                                </FormControl>
                                                {renderComparison(prevBio?.visceralFat, "%")}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="muscleMass"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Masa Muscular (kg)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0.0" type="number" step="0.1" {...field} />
                                                </FormControl>
                                                {renderComparison(prevBio?.muscleMass, "kg")}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="skeletalMuscleMass"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>M.M. Esquelética (kg)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0.0" type="number" step="0.1" {...field} />
                                                </FormControl>
                                                {renderComparison(prevBio?.skeletalMuscleMass, "kg")}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="bodyWater"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Agua Corporal (Litros)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0.0" type="number" step="0.1" {...field} />
                                                </FormControl>
                                                {renderComparison(prevBio?.bodyWater, "L")}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="basalMetabolism"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Metab. Basal (Kcal)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" type="number" step="1" {...field} />
                                                </FormControl>
                                                {renderComparison(prevBio?.basalMetabolism, "Kcal")}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FormLabel>Foto del Ticket (Bioimpedancia)</FormLabel>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files && setBioimpedanceImage(e.target.files[0])}
                                    />
                                    {prevBio?.imageUrl && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Anterior: Existe imagen adjunta
                                        </p>
                                    )}
                                </div>

                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fotos de Progreso</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <FormLabel>Foto Frontal</FormLabel>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files && setFrontPhoto(e.target.files[0])}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FormLabel>Foto Trasera</FormLabel>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files && setBackPhoto(e.target.files[0])}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FormLabel>Foto Lateral</FormLabel>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files && setSidePhoto(e.target.files[0])} // Removed typooooo
                                        />
                                    </div>
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
                                                    placeholder="Anotaciones sobre el progreso..."
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
