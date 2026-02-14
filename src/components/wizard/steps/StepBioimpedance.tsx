"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bioimpedanceSchema, Bioimpedance } from "@/lib/validators/wizard-schema";
import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WizardLayout } from "../WizardLayout";
import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, FileImage } from "lucide-react";
import Image from "next/image";

export function StepBioimpedance() {
    const { data, setBioimpedance, nextStep, prevStep } = useWizardStore();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((accepted: File[]) => {
        const f = accepted[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    }, []);

    const removeFile = useCallback(() => {
        if (preview) URL.revokeObjectURL(preview);
        setFile(null);
        setPreview(null);
    }, [preview]);

    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
        maxFiles: 1,
        multiple: false,
    });

    const form = useForm<Bioimpedance>({
        resolver: zodResolver(bioimpedanceSchema) as any,
        defaultValues: {
            weight: data.bioimpedance?.weight || data.personalData?.weight || 0,
            bmi: data.bioimpedance?.bmi || 0,
            bodyFat: data.bioimpedance?.bodyFat || 0,
            muscleMass: data.bioimpedance?.muscleMass || 0,
            visceralFat: data.bioimpedance?.visceralFat || 0,
            bodyWater: data.bioimpedance?.bodyWater || 0,
            skeletalMuscleMass: data.bioimpedance?.skeletalMuscleMass || 0,
            basalMetabolism: data.bioimpedance?.basalMetabolism || 0,
        },
    });

    // Auto-calculate BMI if height exists and weight changes
    const weight = form.watch("weight");
    const height = data.personalData?.height; // cm

    useEffect(() => {
        if (weight > 0 && height && height > 0) {
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            form.setValue("bmi", parseFloat(bmi.toFixed(1)));
        }
    }, [weight, height, form]);

    const onSubmit = (values: Bioimpedance) => {
        // Guardamos el archivo en el objeto de valores, aunque no persistirá en localStorage
        // NextStep y StepReview se encargarán de manejarlo si está en memoria
        // Ojo: Bioimpedance en store es inferido de bioimpedanceSchema, que ahora incluye 'bioimpedanceImage?: any'
        setBioimpedance({ ...values, bioimpedanceImage: file });
        nextStep();
    };

    return (
        <WizardLayout
            title="Bioimpedancia Inicial"
            description="Ingresa los datos de tu primera medición para establecer una línea base."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
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
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
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
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {height ? "Calculado automáticamente basado en altura." : "Ingresa manualmente."}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="bodyFat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>% Grasa Corporal</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
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
                                    <FormLabel>Grasa Visceral (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="1"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
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
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
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
                                    <FormLabel>M. Musc. Esquelética (kg)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="bodyWater"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Agua Corporal (Litros)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
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
                                    <FormLabel>Metabolismo Basal (Kcal)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="1"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Image Upload for Ticket */}
                    <div className="space-y-2">
                        <FormLabel>Foto del Ticket de Bioimpedancia (Opcional)</FormLabel>
                        {preview ? (
                            <div className="relative rounded-lg border overflow-hidden bg-muted/30">
                                <div className="flex items-center gap-3 p-3">
                                    <div className="relative h-20 w-16 shrink-0 rounded-md overflow-hidden border">
                                        <Image src={preview} alt="Ticket" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <FileImage className="h-4 w-4 text-primary shrink-0" />
                                            <span className="text-sm font-medium truncate">{file?.name}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {file ? `${(file.size / 1024).toFixed(0)} KB` : ""}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="shrink-0 rounded-full p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                                    isDragActive
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/25 hover:border-primary/50"
                                }`}
                            >
                                <input {...getInputProps()} />
                                <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    {isDragActive ? "Suelta aquí" : "Arrastra o haz clic para subir"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Foto de la hoja de resultados impresa
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={prevStep}>
                            Atrás
                        </Button>
                        <Button type="submit" size="lg">Siguiente</Button>
                    </div>
                </form>
            </Form>
        </WizardLayout>
    );
}
