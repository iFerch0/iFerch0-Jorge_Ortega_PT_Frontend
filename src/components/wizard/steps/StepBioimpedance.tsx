"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bioimpedanceSchema, Bioimpedance } from "@/lib/validators/wizard-schema";
import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { WizardLayout } from "../WizardLayout";

export function StepBioimpedance() {
    const { data, setBioimpedance, nextStep, prevStep } = useWizardStore();

    const form = useForm<Bioimpedance>({
        resolver: zodResolver(bioimpedanceSchema) as any,
        defaultValues: data.bioimpedance || {
            waist: 0,
            hip: 0,
            bodyFat: 0,
            muscleMass: 0,
            visceralFat: 0,
        },
    });

    const onSubmit = (values: Bioimpedance) => {
        setBioimpedance(values);
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
                            name="bodyFat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>% Grasa Corporal</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" {...field} />
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
                                    <FormLabel>% Masa Muscular</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" {...field} />
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
                                        <Input type="number" step="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="waist"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cintura (cm)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="hip"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cadera (cm)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
