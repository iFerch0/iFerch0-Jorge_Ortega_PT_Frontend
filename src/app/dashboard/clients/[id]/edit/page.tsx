"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { clients as clientsApi } from "@/lib/api";
import type { Client, TrainingPlace, Gender } from "@/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Home, Building2, TreePine, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const editClientSchema = z.object({
    firstName: z.string().min(2, "Nombre requerido"),
    lastName: z.string().min(2, "Apellido requerido"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phone: z.string().optional(),
    birthDate: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    height: z.coerce.number().min(100).max(250).optional(),
    trainingPlace: z.enum(["GYM", "HOME", "OUTDOOR"]).optional(),
    objectives: z.array(z.object({
        id: z.string().optional(),
        content: z.string().min(1, "Objetivo requerido"),
    })),
    pathologies: z.array(z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Nombre requerido"),
        severity: z.enum(["Low", "Medium", "High"]).optional(),
        notes: z.string().optional(),
    })),
});

type EditClientForm = z.infer<typeof editClientSchema>;

const trainingPlaceOptions = [
    { value: "GYM" as const, label: "Gimnasio", icon: Building2 },
    { value: "HOME" as const, label: "Casa", icon: Home },
    { value: "OUTDOOR" as const, label: "Aire libre", icon: TreePine },
];

const genderOptions = [
    { value: "MALE" as const, label: "Masculino" },
    { value: "FEMALE" as const, label: "Femenino" },
    { value: "OTHER" as const, label: "Otro" },
];

export default function EditClientPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [client, setClient] = useState<Client | null>(null);

    const form = useForm<EditClientForm>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(editClientSchema) as any,
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            birthDate: "",
            gender: undefined,
            height: undefined,
            trainingPlace: undefined,
            objectives: [],
            pathologies: [],
        },
    });

    const objFields = useFieldArray({
        control: form.control,
        name: "objectives",
    });

    const pathFields = useFieldArray({
        control: form.control,
        name: "pathologies",
    });

    useEffect(() => {
        if (!params.id) return;
        clientsApi.get(params.id)
            .then((data) => {
                setClient(data);
                form.reset({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email || "",
                    phone: data.phone || "",
                    birthDate: data.birthDate?.split("T")[0] || "",
                    gender: data.gender || undefined,
                    height: data.height || undefined,
                    trainingPlace: data.trainingPlace,
                    objectives: data.objectives?.map(o => ({ id: o.id, content: o.content })) || [],
                    pathologies: data.pathologies?.map(p => ({
                        id: p.id,
                        name: p.name,
                        severity: p.severity,
                        notes: p.notes || "",
                    })) || [],
                });
            })
            .catch(() => toast.error("Error al cargar cliente"))
            .finally(() => setLoading(false));
    }, [params.id, form]);

    const onSubmit = async (data: EditClientForm) => {
        if (!params.id) return;
        setSubmitting(true);
        try {
            await clientsApi.update(params.id, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || undefined,
                phone: data.phone || undefined,
                birthDate: data.birthDate || undefined,
                gender: data.gender,
                height: data.height,
                trainingPlace: data.trainingPlace,
                objectives: data.objectives.map(o => ({ id: o.id, content: o.content })),
                pathologies: data.pathologies.map(p => ({
                    id: p.id,
                    name: p.name,
                    severity: p.severity,
                    notes: p.notes || undefined,
                })),
            });
            toast.success("Cliente actualizado");
            router.push(`/dashboard/clients/${params.id}`);
        } catch (error) {
            toast.error("Error al actualizar");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Cliente no encontrado</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Editar Cliente</h1>
                    <p className="text-sm text-muted-foreground">
                        {client.firstName} {client.lastName} · Cédula: {client.cedula}
                    </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/clients/${params.id}`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Link>
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Data */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos Personales</CardTitle>
                            <CardDescription>Información básica del cliente</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre *</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
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
                                            <FormLabel>Apellido *</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="birthDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Nacimiento</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
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
                                            <FormLabel>Género</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {genderOptions.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Altura (cm)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={100}
                                                    max={250}
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Training Place */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lugar de Entrenamiento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="trainingPlace"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="grid grid-cols-3 gap-4"
                                            >
                                                {trainingPlaceOptions.map((opt) => (
                                                    <Label
                                                        key={opt.value}
                                                        htmlFor={`place-${opt.value}`}
                                                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                                                            field.value === opt.value
                                                                ? "border-primary bg-primary/5"
                                                                : "border-muted hover:border-primary/50"
                                                        }`}
                                                    >
                                                        <RadioGroupItem value={opt.value} id={`place-${opt.value}`} className="sr-only" />
                                                        <opt.icon className="h-6 w-6" />
                                                        <span className="text-sm font-medium">{opt.label}</span>
                                                    </Label>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Objectives */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Objetivos</CardTitle>
                                <CardDescription>Metas del cliente</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => objFields.append({ content: "" })}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {objFields.fields.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Sin objetivos. Haz clic en &quot;Agregar&quot; para crear uno.
                                </p>
                            )}
                            {objFields.fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`objectives.${index}.content`}
                                        render={({ field: inputField }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Objetivo" {...inputField} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => objFields.remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Pathologies */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Patologías</CardTitle>
                                <CardDescription>Condiciones médicas a considerar</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => pathFields.append({ name: "", severity: "Low", notes: "" })}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pathFields.fields.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Sin patologías registradas.
                                </p>
                            )}
                            {pathFields.fields.map((field, index) => (
                                <div key={field.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`pathologies.${index}.name`}
                                            render={({ field: inputField }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Nombre de la patología" {...inputField} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`pathologies.${index}.severity`}
                                            render={({ field: selectField }) => (
                                                <FormItem>
                                                    <Select
                                                        value={selectField.value}
                                                        onValueChange={selectField.onChange}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-32">
                                                                <SelectValue placeholder="Severidad" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Low">Baja</SelectItem>
                                                            <SelectItem value="Medium">Media</SelectItem>
                                                            <SelectItem value="High">Alta</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => pathFields.remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name={`pathologies.${index}.notes`}
                                        render={({ field: textareaField }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Notas adicionales..."
                                                        rows={2}
                                                        {...textareaField}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href={`/dashboard/clients/${params.id}`}>Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
