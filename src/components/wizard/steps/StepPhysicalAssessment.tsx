"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizardStore } from "@/store/wizard-store";
import { physicalAssessmentSchema, PhysicalAssessment } from "@/lib/validators/wizard-schema";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { WizardLayout } from "../WizardLayout";

export function StepPhysicalAssessment() {
    const { data, setPhysicalAssessment, nextStep, prevStep } = useWizardStore();

    const form = useForm<PhysicalAssessment>({
        resolver: zodResolver(physicalAssessmentSchema) as any,
        defaultValues: data.physicalAssessment || {
            injuries: "",
            medicalConditions: "",
            medications: "",
        },
    });

    function onSubmit(values: PhysicalAssessment) {
        setPhysicalAssessment(values);
        nextStep();
    }

    return (
        <WizardLayout
            title="Valoración Física"
            description="Información médica relevante para tu seguridad."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="injuries"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lesiones Actuales o Pasadas</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe cualquier lesión que debamos tener en cuenta..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Deja en blanco si no tienes lesiones.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="medicalConditions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Condiciones Médicas</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Asma, hipertensión, diabetes, etc..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="medications"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Medicamentos</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="¿Tomas algún medicamento actualmente?"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Setup for Photo Upload would go here in future iteration */}
                    <div className="rounded-lg border border-dashed p-8 text-center bg-muted/50">
                        <p className="text-sm text-muted-foreground">
                            Módulo de carga de fotos (Frontal, Perfil, Espalda) pendiente de integración.
                        </p>
                    </div>

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
