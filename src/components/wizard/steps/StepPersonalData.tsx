"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizardStore } from "@/store/wizard-store";
import { personalDataSchema, PersonalData } from "@/lib/validators/wizard-schema";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WizardLayout } from "../WizardLayout";
import { cn } from "@/lib/utils";

function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

const fieldLabel = "text-sm font-semibold uppercase tracking-widest text-muted-foreground";

export function StepPersonalData() {
    const { data, setPersonalData, nextStep } = useWizardStore();

    const form = useForm<PersonalData>({
        resolver: zodResolver(personalDataSchema) as any,
        defaultValues: data.personalData || {
            firstName: "",
            lastName: "",
            cedula: "",
            email: "",
            phone: "",
            birthDate: "",
            gender: "MALE",
            height: 0,
            weight: 0,
        },
    });

    useEffect(() => {
        if (data.personalData?.firstName && !form.getValues("firstName")) {
            form.reset(data.personalData);
        }
    }, [data.personalData, form]);

    const watchedBirthDate = form.watch("birthDate");
    const calculatedAge = watchedBirthDate ? calculateAge(watchedBirthDate) : null;

    function onSubmit(values: PersonalData) {
        setPersonalData(values);
        nextStep();
    }

    return (
        <WizardLayout
            title="Datos Personales"
            description="Cuéntanos un poco sobre ti para personalizar tu plan."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Nombre / Apellido */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={fieldLabel}>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Juan" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={fieldLabel}>Apellido</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Pérez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Cédula / Teléfono */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="cedula"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={fieldLabel}>Cédula</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="1234567890"
                                            {...field}
                                            disabled={!!data.personalData?.cedula}
                                        />
                                    </FormControl>
                                    {data.personalData?.cedula && (
                                        <p className="text-[11px] text-muted-foreground">
                                            No puede modificarse
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={fieldLabel}>Teléfono</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+57 300 123 4567" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Fecha / Género */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-baseline gap-2">
                                        <FormLabel className={fieldLabel}>Nacimiento</FormLabel>
                                        {calculatedAge !== null && calculatedAge > 0 && (
                                            <span className="text-xs font-medium text-primary">
                                                {calculatedAge} años
                                            </span>
                                        )}
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            max={new Date().toISOString().split("T")[0]}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={fieldLabel}>Género</FormLabel>
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
                                            <SelectItem value="MALE">Masculino</SelectItem>
                                            <SelectItem value="FEMALE">Femenino</SelectItem>
                                            <SelectItem value="OTHER">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Altura / Peso */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="height"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={fieldLabel}>Altura (cm)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="175" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={fieldLabel}>Peso (kg)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="70" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" size="lg" className="min-w-[140px]">
                            Siguiente
                        </Button>
                    </div>
                </form>
            </Form>
        </WizardLayout>
    );
}
