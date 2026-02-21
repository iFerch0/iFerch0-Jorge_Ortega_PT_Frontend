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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WizardLayout } from "../WizardLayout";
import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, FileImage } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const fieldLabel = "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground";

const FIELDS: {
    name: keyof Bioimpedance;
    label: string;
    unit: string;
    step: string;
}[] = [
    { name: "weight",            label: "Peso",            unit: "kg",   step: "0.1" },
    { name: "bmi",               label: "IMC",             unit: "",     step: "0.1" },
    { name: "bodyFat",           label: "Grasa corporal",  unit: "%",    step: "0.1" },
    { name: "visceralFat",       label: "Grasa visceral",  unit: "%",    step: "1"   },
    { name: "muscleMass",        label: "Masa muscular",   unit: "kg",   step: "0.1" },
    { name: "skeletalMuscleMass",label: "M. esquelética",  unit: "kg",   step: "0.1" },
    { name: "bodyWater",         label: "Agua corporal",   unit: "L",    step: "0.1" },
    { name: "basalMetabolism",   label: "Metab. basal",    unit: "kcal", step: "1"   },
];

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
            weight:            data.bioimpedance?.weight            || data.personalData?.weight || 0,
            bmi:               data.bioimpedance?.bmi               || 0,
            bodyFat:           data.bioimpedance?.bodyFat           || 0,
            muscleMass:        data.bioimpedance?.muscleMass        || 0,
            visceralFat:       data.bioimpedance?.visceralFat       || 0,
            bodyWater:         data.bioimpedance?.bodyWater         || 0,
            skeletalMuscleMass:data.bioimpedance?.skeletalMuscleMass|| 0,
            basalMetabolism:   data.bioimpedance?.basalMetabolism   || 0,
        },
    });

    const weight = form.watch("weight");
    const height = data.personalData?.height;

    useEffect(() => {
        if (weight > 0 && height && height > 0) {
            const h = height / 100;
            form.setValue("bmi", parseFloat((weight / (h * h)).toFixed(1)));
        }
    }, [weight, height, form]);

    const onSubmit = (values: Bioimpedance) => {
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
                        {FIELDS.map(({ name, label, unit, step }) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={name}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={fieldLabel}>
                                            {label}
                                            {unit && (
                                                <span className="ml-1 normal-case font-normal text-muted-foreground">
                                                    ({unit})
                                                </span>
                                            )}
                                            {name === "bmi" && height && (
                                                <span className="ml-2 text-[9px] text-primary/70 normal-case font-normal">
                                                    · auto
                                                </span>
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step={step}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>

                    {/* Ticket upload */}
                    <div className="space-y-2">
                        <p className={fieldLabel}>
                            Foto del ticket
                            <span className="ml-1 normal-case font-normal text-muted-foreground">(opcional)</span>
                        </p>

                        {preview ? (
                            <div className="rounded-2xl border bg-muted/20 p-3 flex items-center gap-3">
                                <div className="relative h-16 w-12 shrink-0 rounded-xl overflow-hidden border">
                                    <Image src={preview} alt="Ticket" fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <FileImage className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <span className="text-sm font-medium truncate">{file?.name}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {file ? `${(file.size / 1024).toFixed(0)} KB` : ""}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200",
                                    isDragActive
                                        ? "border-primary bg-primary/10 scale-[1.01]"
                                        : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
                                )}
                            >
                                <input {...getInputProps()} />
                                <UploadCloud className={cn(
                                    "h-7 w-7 mx-auto mb-2 transition-colors",
                                    isDragActive ? "text-primary" : "text-muted-foreground"
                                )} />
                                <p className="text-sm text-muted-foreground">
                                    {isDragActive ? "Suelta aquí" : "Arrastra o haz clic"}
                                </p>
                                <p className="text-xs text-muted-foreground/70 mt-1">
                                    Foto de la hoja de resultados impresa
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between pt-2">
                        <Button type="button" variant="ghost" onClick={prevStep}>
                            Atrás
                        </Button>
                        <Button type="submit" size="lg" className="min-w-[140px]">
                            Siguiente
                        </Button>
                    </div>
                </form>
            </Form>
        </WizardLayout>
    );
}
