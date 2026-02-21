"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizardStore } from "@/store/wizard-store";
import { availabilitySchema, Availability } from "@/lib/validators/wizard-schema";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { WizardLayout } from "../WizardLayout";
import { Building2, Home, TreePine, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const daysOfWeek = [
    { id: "monday",    short: "Lun" },
    { id: "tuesday",   short: "Mar" },
    { id: "wednesday", short: "Mié" },
    { id: "thursday",  short: "Jue" },
    { id: "friday",    short: "Vie" },
    { id: "saturday",  short: "Sáb" },
    { id: "sunday",    short: "Dom" },
];

const trainingPlaces = [
    {
        value: "GYM",
        label: "Gimnasio",
        icon: Building2,
        description: "Equipo completo",
    },
    {
        value: "HOME",
        label: "Casa",
        icon: Home,
        description: "Equipo básico",
    },
    {
        value: "OUTDOOR",
        label: "Aire libre",
        icon: TreePine,
        description: "Parques y espacios abiertos",
    },
];

const durations = [
    { value: "30_min",     label: "30 min" },
    { value: "45_min",     label: "45 min" },
    { value: "60_min",     label: "60 min" },
    { value: "90_min_plus", label: "+90 min" },
];

export function StepAvailability() {
    const { data, setAvailability, nextStep, prevStep } = useWizardStore();

    const form = useForm<Availability>({
        resolver: zodResolver(availabilitySchema) as any,
        defaultValues: data.availability || {
            trainingPlace: "GYM",
            trainingDays: [],
            trainingDuration: "60_min",
        },
    });

    function onSubmit(values: Availability) {
        setAvailability(values);
        nextStep();
    }

    return (
        <WizardLayout
            title="Disponibilidad"
            description="¿Cuándo y dónde vas a entrenar?"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                    {/* ── Training Place ── */}
                    <FormField
                        control={form.control}
                        name="trainingPlace"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                                    Lugar de entrenamiento
                                </FormLabel>
                                <FormControl>
                                    <div className="grid grid-cols-3 gap-3">
                                        {trainingPlaces.map((place) => {
                                            const isSelected = field.value === place.value;
                                            return (
                                                <button
                                                    key={place.value}
                                                    type="button"
                                                    onClick={() => field.onChange(place.value)}
                                                    className={cn(
                                                        "relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all duration-200",
                                                        isSelected
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <span className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                                                            <Check className="h-2.5 w-2.5 text-primary-foreground" />
                                                        </span>
                                                    )}
                                                    <div className={cn(
                                                        "rounded-xl p-3 transition-colors",
                                                        isSelected ? "bg-primary/10" : "bg-muted"
                                                    )}>
                                                        <place.icon className={cn(
                                                            "h-6 w-6 transition-colors",
                                                            isSelected ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <p className={cn(
                                                            "text-sm font-semibold leading-tight",
                                                            isSelected ? "text-foreground" : "text-muted-foreground"
                                                        )}>
                                                            {place.label}
                                                        </p>
                                                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                                                            {place.description}
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

                    {/* ── Training Days ── */}
                    <FormField
                        control={form.control}
                        name="trainingDays"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <FormLabel className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                                        Días de entrenamiento
                                    </FormLabel>
                                    {field.value?.length > 0 && (
                                        <span className="text-xs text-primary font-medium">
                                            {field.value.length} día{field.value.length > 1 ? "s" : ""}
                                        </span>
                                    )}
                                </div>
                                <FormControl>
                                    <div className="flex flex-wrap gap-2">
                                        {daysOfWeek.map((day) => {
                                            const isSelected = field.value?.includes(day.id);
                                            return (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = field.value ?? [];
                                                        field.onChange(
                                                            isSelected
                                                                ? current.filter((d) => d !== day.id)
                                                                : [...current, day.id]
                                                        );
                                                    }}
                                                    className={cn(
                                                        "h-10 min-w-[3.25rem] rounded-full border-2 px-4 text-sm font-medium transition-all duration-200",
                                                        isSelected
                                                            ? "border-primary bg-primary text-primary-foreground"
                                                            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                                    )}
                                                >
                                                    {day.short}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Duration ── */}
                    <FormField
                        control={form.control}
                        name="trainingDuration"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                                    Duración por sesión
                                </FormLabel>
                                <FormControl>
                                    <div className="flex flex-wrap gap-2">
                                        {durations.map((d) => {
                                            const isSelected = field.value === d.value;
                                            return (
                                                <button
                                                    key={d.value}
                                                    type="button"
                                                    onClick={() => field.onChange(d.value)}
                                                    className={cn(
                                                        "h-10 rounded-full border-2 px-6 text-sm font-medium transition-all duration-200",
                                                        isSelected
                                                            ? "border-primary bg-primary text-primary-foreground"
                                                            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                                    )}
                                                >
                                                    {d.label}
                                                </button>
                                            );
                                        })}
                                    </div>
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
