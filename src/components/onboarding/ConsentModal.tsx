"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield, FileText } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    acceptConsentSchema,
    AcceptConsentInput,
    CURRENT_POLICY_VERSION,
} from "@/lib/validators/consent-schema";
import { me } from "@/lib/api";

interface ConsentModalProps {
    open: boolean;
    onSuccess: () => void;
}

export function ConsentModal({ open, onSuccess }: ConsentModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFullPolicy, setShowFullPolicy] = useState(false);

    const form = useForm<AcceptConsentInput>({
        resolver: zodResolver(acceptConsentSchema),
        defaultValues: {
            policyVersion: CURRENT_POLICY_VERSION,
            scopes: {
                dataTreatment: false,
                photos: false,
                sensitiveHealthData: false,
            },
        },
    });

    async function onSubmit(values: AcceptConsentInput) {
        setLoading(true);
        setError(null);

        try {
            await me.acceptConsent(values);
            onSuccess();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al aceptar el consentimiento"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center">
                        Política de Privacidad
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Para continuar, necesitamos tu consentimiento para el tratamiento de datos.
                    </DialogDescription>
                </DialogHeader>

                {/* Policy Summary */}
                <div className="rounded-lg border bg-muted/50 p-4 text-sm">
                    <div className="flex items-start gap-2 mb-3">
                        <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Resumen de la Política</p>
                            <p className="text-muted-foreground mt-1">
                                En GymProfile Pro recopilamos datos personales, de salud y fotografías de progreso 
                                para brindarte un seguimiento personalizado de tu entrenamiento.
                            </p>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => setShowFullPolicy(!showFullPolicy)}
                        className="text-primary text-sm underline hover:no-underline"
                    >
                        {showFullPolicy ? "Ocultar política completa" : "Ver política completa"}
                    </button>

                    {showFullPolicy && (
                        <div className="mt-4 space-y-3 text-muted-foreground border-t pt-4">
                            <p>
                                <strong className="text-foreground">1. Datos recopilados:</strong> Nombre, cédula, 
                                fecha de nacimiento, teléfono, email, medidas corporales, datos de bioimpedancia, 
                                objetivos de entrenamiento y condiciones médicas.
                            </p>
                            <p>
                                <strong className="text-foreground">2. Fotografías:</strong> Fotos de progreso
                                (frontal, lateral, posterior) para seguimiento visual de tu evolución física.
                            </p>
                            <p>
                                <strong className="text-foreground">3. Uso de datos:</strong> Tus datos se utilizan
                                exclusivamente para personalizar tu plan de entrenamiento y medir tu progreso.
                            </p>
                            <p>
                                <strong className="text-foreground">4. Almacenamiento:</strong> Los datos se
                                almacenan de forma segura y solo tu entrenador autorizado puede acceder a ellos.
                            </p>
                            <p>
                                <strong className="text-foreground">5. Derechos:</strong> Puedes solicitar la
                                eliminación de tus datos en cualquier momento contactando a tu entrenador.
                            </p>
                        </div>
                    )}
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <FormField
                                control={form.control}
                                name="scopes.dataTreatment"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="cursor-pointer">
                                                Acepto el tratamiento de mis datos personales{" "}
                                                <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <p className="text-xs text-muted-foreground">
                                                Requerido para usar la plataforma
                                            </p>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="scopes.photos"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="cursor-pointer">
                                                Autorizo el almacenamiento de fotografías de progreso
                                            </FormLabel>
                                            <p className="text-xs text-muted-foreground">
                                                Opcional - para seguimiento visual
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="scopes.sensitiveHealthData"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="cursor-pointer">
                                                Autorizo el tratamiento de datos sensibles de salud
                                            </FormLabel>
                                            <p className="text-xs text-muted-foreground">
                                                Patologías, condiciones médicas, medicamentos
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                            Versión de política: {CURRENT_POLICY_VERSION}
                        </p>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !form.watch("scopes.dataTreatment")}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Aceptar y Continuar"
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
