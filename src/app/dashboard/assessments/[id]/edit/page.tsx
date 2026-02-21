"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { trainer } from "@/lib/api";
import type { Evaluation } from "@/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, Scale } from "lucide-react";

const editAssessmentSchema = z.object({
    date: z.string().min(1, "Fecha requerida"),
    notes: z.string().optional(),
    weight: z.coerce.number().min(20).max(300).optional(),
    bmi: z.coerce.number().min(10).max(60).optional(),
    bodyFat: z.coerce.number().min(1).max(70).optional(),
    muscleMass: z.coerce.number().min(10).max(150).optional(),
    visceralFat: z.coerce.number().min(1).max(30).optional(),
    bodyWater: z.coerce.number().min(20).max(80).optional(),
    skeletalMuscleMass: z.coerce.number().min(5).max(80).optional(),
    basalMetabolism: z.coerce.number().min(500).max(5000).optional(),
});

type EditAssessmentForm = z.infer<typeof editAssessmentSchema>;

export default function EditAssessmentPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [assessment, setAssessment] = useState<Evaluation | null>(null);

    const form = useForm<EditAssessmentForm>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(editAssessmentSchema) as any,
        defaultValues: {
            date: "",
            notes: "",
            weight: undefined,
            bmi: undefined,
            bodyFat: undefined,
            muscleMass: undefined,
            visceralFat: undefined,
            bodyWater: undefined,
            skeletalMuscleMass: undefined,
            basalMetabolism: undefined,
        },
    });

    useEffect(() => {
        if (!params.id) return;
        trainer.getAssessment(params.id)
            .then((data) => {
                setAssessment(data);
                form.reset({
                    date: data.date?.split("T")[0] || "",
                    notes: data.notes || "",
                    weight: data.bioimpedance?.weight || undefined,
                    bmi: data.bioimpedance?.bmi || undefined,
                    bodyFat: data.bioimpedance?.bodyFat || undefined,
                    muscleMass: data.bioimpedance?.muscleMass || undefined,
                    visceralFat: data.bioimpedance?.visceralFat || undefined,
                    bodyWater: data.bioimpedance?.bodyWater || undefined,
                    skeletalMuscleMass: data.bioimpedance?.skeletalMuscleMass || undefined,
                    basalMetabolism: data.bioimpedance?.basalMetabolism || undefined,
                });
            })
            .catch(() => toast.error("Error al cargar valoración"))
            .finally(() => setLoading(false));
    }, [params.id, form]);

    const onSubmit = async (data: EditAssessmentForm) => {
        if (!params.id) return;
        setSubmitting(true);
        try {
            await trainer.updateAssessment(params.id, {
                date: data.date,
                notes: data.notes || undefined,
                bioimpedance: {
                    weight: data.weight,
                    bmi: data.bmi,
                    bodyFat: data.bodyFat,
                    muscleMass: data.muscleMass,
                    visceralFat: data.visceralFat,
                    bodyWater: data.bodyWater,
                    skeletalMuscleMass: data.skeletalMuscleMass,
                    basalMetabolism: data.basalMetabolism,
                },
            });
            toast.success("Valoración actualizada");
            router.push(`/dashboard/assessments/${params.id}`);
        } catch (error) {
            toast.error("Error al actualizar");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
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
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/assessments/${params.id}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Editar Valoración</h1>
                        <p className="text-sm text-muted-foreground">
                            Modifica los datos de la valoración
                        </p>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Date & Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notas</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Observaciones de la valoración..."
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Bioimpedance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="h-5 w-5" />
                                Bioimpedancia
                            </CardTitle>
                            <CardDescription>Datos de composición corporal</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Peso (kg)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
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
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bodyFat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grasa Corporal (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="muscleMass"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Masa Muscular (kg)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="visceralFat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grasa Visceral</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="1"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bodyWater"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Agua Corporal (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="skeletalMuscleMass"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>M. Esquelética (kg)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="basalMetabolism"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Met. Basal (kcal)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="1"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href={`/dashboard/assessments/${params.id}`}>Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
