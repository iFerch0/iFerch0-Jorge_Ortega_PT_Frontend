"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizardStore } from "@/store/wizard-store";
import { objectivesSchema, Objectives } from "@/lib/validators/wizard-schema";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WizardLayout } from "../WizardLayout";
import { Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const OBJECTIVE_SUGGESTIONS = [
    "Perder peso",
    "Ganar masa muscular",
    "Mejorar resistencia",
    "Tonificar cuerpo",
    "Aumentar fuerza",
    "Mejorar flexibilidad",
    "Preparación para competencia",
    "Rehabilitación física",
];

const EXPERIENCE_LEVELS = [
    {
        value: "beginner",
        label: "Principiante",
        range: "0 – 6 meses",
        icon: "🌱",
    },
    {
        value: "intermediate",
        label: "Intermedio",
        range: "6 m – 2 años",
        icon: "⚡",
    },
    {
        value: "advanced",
        label: "Avanzado",
        range: "+2 años",
        icon: "🔥",
    },
];

export function StepObjectives() {
    const { data, setObjectives, nextStep, prevStep } = useWizardStore();

    const form = useForm<Objectives>({
        resolver: zodResolver(objectivesSchema) as any,
        defaultValues: data.objectives || {
            objectives: [{ id: crypto.randomUUID(), content: "" }],
            experienceLevel: "beginner",
            activityLevel: "moderate",
            notes: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "objectives",
    });

    function addObjective(content = "") {
        append({ id: crypto.randomUUID(), content });
    }

    function addSuggestion(suggestion: string) {
        const existing = form.getValues("objectives");
        const hasEmpty = existing.some((o) => !o.content.trim());
        if (hasEmpty) {
            const emptyIndex = existing.findIndex((o) => !o.content.trim());
            form.setValue(`objectives.${emptyIndex}.content`, suggestion);
        } else {
            append({ id: crypto.randomUUID(), content: suggestion });
        }
    }

    function onSubmit(values: Objectives) {
        setObjectives(values);
        nextStep();
    }

    return (
        <WizardLayout
            title="Objetivos y Experiencia"
            description="Define tus metas para crear un plan a tu medida."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                    {/* ── Objectives ── */}
                    <div className="space-y-4">
                        <FormLabel className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                            Tus objetivos
                        </FormLabel>

                        <div className="space-y-2.5">
                            {fields.map((field, index) => (
                                <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`objectives.${index}.content`}
                                    render={({ field: inputField }) => (
                                        <FormItem>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-xs font-mono text-muted-foreground w-5 text-right shrink-0">
                                                    {index + 1}.
                                                </span>
                                                <FormControl>
                                                    <Input
                                                        placeholder={`Objetivo ${index + 1}`}
                                                        className="flex-1"
                                                        {...inputField}
                                                    />
                                                </FormControl>
                                                {fields.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                        aria-label="Eliminar objetivo"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <FormMessage className="pl-7" />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => addObjective()}
                            className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Agregar objetivo
                        </button>

                        {/* Suggestions */}
                        <div className="pt-1">
                            <p className="text-xs text-muted-foreground mb-2.5">Sugerencias rápidas</p>
                            <div className="flex flex-wrap gap-1.5">
                                {OBJECTIVE_SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => addSuggestion(s)}
                                        className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                                    >
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Experience Level ── */}
                    <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                                    Nivel de experiencia
                                </FormLabel>
                                <FormControl>
                                    <div className="grid grid-cols-3 gap-3">
                                        {EXPERIENCE_LEVELS.map((lvl) => {
                                            const isSelected = field.value === lvl.value;
                                            return (
                                                <button
                                                    key={lvl.value}
                                                    type="button"
                                                    onClick={() => field.onChange(lvl.value)}
                                                    className={cn(
                                                        "relative flex flex-col items-center gap-2 rounded-2xl border-2 py-5 px-3 text-center transition-all duration-200",
                                                        isSelected
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border bg-card hover:border-primary/40"
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                                                            <Check className="h-2.5 w-2.5 text-primary-foreground" />
                                                        </span>
                                                    )}
                                                    <span className="text-2xl leading-none">{lvl.icon}</span>
                                                    <div>
                                                        <p className={cn(
                                                            "text-sm font-semibold leading-tight",
                                                            isSelected ? "text-foreground" : "text-muted-foreground"
                                                        )}>
                                                            {lvl.label}
                                                        </p>
                                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                                            {lvl.range}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Activity Level ── */}
                    <FormField
                        control={form.control}
                        name="activityLevel"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                                    Actividad diaria fuera del gym
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona tu nivel" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="sedentary">Sedentario — trabajo de oficina</SelectItem>
                                        <SelectItem value="light">Ligero — caminar un poco</SelectItem>
                                        <SelectItem value="moderate">Moderado — movimiento constante</SelectItem>
                                        <SelectItem value="active">Activo — trabajo físico</SelectItem>
                                        <SelectItem value="very_active">Muy activo — deportista profesional</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Notes ── */}
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                                    Notas adicionales
                                    <span className="ml-1 normal-case font-normal text-muted-foreground">(opcional)</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="¿Alguna otra meta o preferencia específica?"
                                        className="resize-none"
                                        rows={3}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
