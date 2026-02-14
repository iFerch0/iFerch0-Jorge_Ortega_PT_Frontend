"use client";

import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { WizardLayout } from "../WizardLayout";
import { Dumbbell, TrendingUp, Activity, User } from "lucide-react";

export function StepObjectives() {
    const { data, setObjectives, nextStep, prevStep } = useWizardStore();

    const form = useForm<Objectives>({
        resolver: zodResolver(objectivesSchema) as any,
        defaultValues: data.objectives || {
            goal: "lose_weight",
            experienceLevel: "beginner",
            activityLevel: "moderate",
            notes: "",
        },
    });

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* Goal Section */}
                    <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>¿Cuál es tu objetivo principal?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {[
                                            { value: "lose_weight", label: "Perder Peso", icon: TrendingUp },
                                            { value: "gain_muscle", label: "Ganar Músculo", icon: Dumbbell },
                                            { value: "maintain", label: "Mantenerse", icon: Activity },
                                            { value: "improve_endurance", label: "Mejorar Resistencia", icon: User },
                                        ].map((item) => (
                                            <div key={item.value}>
                                                <RadioGroupItem value={item.value} id={item.value} className="peer sr-only" />
                                                <Label
                                                    htmlFor={item.value}
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-focus-visible:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-ring"
                                                >
                                                    <item.icon className="mb-3 h-6 w-6" />
                                                    {item.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Experience Level */}
                    <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Nivel de Experiencia en Entrenamiento</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="beginner" id="exp-beginner" />
                                            <Label htmlFor="exp-beginner" className="font-normal">
                                                Principiante (0-6 meses)
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="intermediate" id="exp-intermediate" />
                                            <Label htmlFor="exp-intermediate" className="font-normal">
                                                Intermedio (6 meses - 2 años)
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="advanced" id="exp-advanced" />
                                            <Label htmlFor="exp-advanced" className="font-normal">
                                                Avanzado (+2 años)
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Activity Level */}
                    <FormField
                        control={form.control}
                        name="activityLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nivel de Actividad Diaria (fuera del gym)</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="sedentary">Sedentario (Trabajo de oficina)</SelectItem>
                                        <SelectItem value="light">Ligero (Caminar un poco)</SelectItem>
                                        <SelectItem value="moderate">Moderado (Movimiento constante)</SelectItem>
                                        <SelectItem value="active">Activo (Trabajo físico)</SelectItem>
                                        <SelectItem value="very_active">Muy Activo (Deportista profesional)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notas Adicionales</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="¿Alguna otra meta o preferencia específica?"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                            Atrás
                        </Button>
                        <Button type="submit" size="lg">
                            Siguiente
                        </Button>
                    </div>
                </form>
            </Form>
        </WizardLayout>
    );
}
