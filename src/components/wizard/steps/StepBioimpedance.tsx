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
import { useEffect, useState } from "react";

export function StepBioimpedance() {
    const { data, setBioimpedance, nextStep, prevStep } = useWizardStore();
    const [file, setFile] = useState<File | null>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

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
                    <div className="grid gap-2">
                        <FormLabel>Foto del Ticket de Bioimpedancia (Opcional)</FormLabel>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <FormDescription>
                            Sube una foto de la hoja de resultados impresa.
                        </FormDescription>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={prevStep}>
                            Atrás
                        </Button>
                        <Button type="submit">Siguiente</Button>
                    </div>
                </form>
            </Form>
        </WizardLayout>
    );
}
