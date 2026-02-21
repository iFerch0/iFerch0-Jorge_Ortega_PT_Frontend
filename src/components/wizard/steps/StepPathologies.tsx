"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizardStore } from "@/store/wizard-store";
import { pathologiesSchema, Pathologies } from "@/lib/validators/wizard-schema";
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
import { cn } from "@/lib/utils";
import { Plus, X, Check, HeartPulse } from "lucide-react";

const COMMON_PATHOLOGIES = [
    "Hipertensión",
    "Diabetes",
    "Asma",
    "Lesión de rodilla",
    "Dolor lumbar",
    "Hernia discal",
    "Tendinitis",
    "Escoliosis",
];

const SEVERITY_OPTIONS = [
    { value: "Low",    label: "Baja",  description: "Controlada", color: "text-emerald-500 border-emerald-500/40 bg-emerald-500/5" },
    { value: "Medium", label: "Media", description: "Requiere atención", color: "text-amber-500 border-amber-500/40 bg-amber-500/5" },
    { value: "High",   label: "Alta",  description: "Limitante", color: "text-red-500 border-red-500/40 bg-red-500/5" },
];

const fieldLabel = "text-sm font-semibold uppercase tracking-widest text-muted-foreground";

export function StepPathologies() {
    const { data, setPathologies, nextStep, prevStep } = useWizardStore();

    const form = useForm<Pathologies>({
        resolver: zodResolver(pathologiesSchema) as any,
        defaultValues: data.pathologies || {
            pathologies: [],
            hasNoPathologies: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "pathologies",
    });

    const hasNoPathologies = form.watch("hasNoPathologies");

    function addPathology(name = "") {
        if (!hasNoPathologies) {
            append({ id: crypto.randomUUID(), name, severity: "Low", notes: "" });
        }
    }

    function onSubmit(values: Pathologies) {
        setPathologies(values);
        nextStep();
    }

    return (
        <WizardLayout
            title="Condiciones de Salud"
            description="Es importante conocer cualquier condición que pueda afectar tu entrenamiento."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* ── No conditions toggle ── */}
                    <FormField
                        control={form.control}
                        name="hasNoPathologies"
                        render={({ field }) => (
                            <FormItem>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = !field.value;
                                        field.onChange(next);
                                        if (next) form.setValue("pathologies", []);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                                        field.value
                                            ? "border-primary bg-primary/5"
                                            : "border-border bg-card hover:border-primary/40"
                                    )}
                                >
                                    <div className={cn(
                                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                                        field.value ? "border-primary bg-primary" : "border-border"
                                    )}>
                                        {field.value && <Check className="h-3 w-3 text-primary-foreground" />}
                                    </div>
                                    <div>
                                        <p className={cn(
                                            "text-sm font-semibold",
                                            field.value ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            No tengo condiciones de salud relevantes
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Selecciona si no tienes nada que reportar
                                        </p>
                                    </div>
                                </button>
                            </FormItem>
                        )}
                    />

                    {/* ── Pathologies list ── */}
                    {!hasNoPathologies && (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <FormLabel className={fieldLabel}>
                                    <span className="flex items-center gap-2">
                                        <HeartPulse className="h-3.5 w-3.5" />
                                        Condiciones
                                    </span>
                                </FormLabel>
                                {fields.length > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                        {fields.length} registrada{fields.length > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>

                            {fields.length === 0 ? (
                                <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center text-muted-foreground">
                                    <HeartPulse className="mx-auto mb-2 h-7 w-7 opacity-30" />
                                    <p className="text-sm">Agrega tus condiciones de salud</p>
                                    <p className="text-xs mt-1 opacity-70">o selecciona que no tienes ninguna arriba</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="rounded-2xl border border-border bg-card p-4 space-y-4"
                                        >
                                            <div className="flex items-start gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name={`pathologies.${index}.name`}
                                                    render={({ field: inputField }) => (
                                                        <FormItem className="flex-1">
                                                            <FormLabel className={fieldLabel}>
                                                                Condición
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Ej: Hipertensión, Diabetes..."
                                                                    {...inputField}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="mt-7 rounded-full p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    aria-label="Eliminar condición"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>

                                            {/* Severity pills */}
                                            <FormField
                                                control={form.control}
                                                name={`pathologies.${index}.severity`}
                                                render={({ field: sevField }) => (
                                                    <FormItem>
                                                        <FormLabel className={fieldLabel}>Severidad</FormLabel>
                                                        <div className="flex gap-2 pt-1">
                                                            {SEVERITY_OPTIONS.map((opt) => (
                                                                <button
                                                                    key={opt.value}
                                                                    type="button"
                                                                    onClick={() => sevField.onChange(opt.value)}
                                                                    className={cn(
                                                                        "flex-1 rounded-xl border-2 py-2 text-xs font-semibold transition-all",
                                                                        sevField.value === opt.value
                                                                            ? opt.color
                                                                            : "border-border text-muted-foreground hover:border-primary/30"
                                                                    )}
                                                                >
                                                                    {opt.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`pathologies.${index}.notes`}
                                                render={({ field: notesField }) => (
                                                    <FormItem>
                                                        <FormLabel className={fieldLabel}>
                                                            Notas
                                                            <span className="ml-1 normal-case font-normal text-muted-foreground">(opcional)</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Medicamentos, restricciones..."
                                                                {...notesField}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => addPathology()}
                                className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Agregar condición
                            </button>

                            {/* Quick suggestions */}
                            <div>
                                <p className="text-xs text-muted-foreground mb-2.5">Condiciones frecuentes</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {COMMON_PATHOLOGIES.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => addPathology(s)}
                                            className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                                        >
                                            + {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

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
