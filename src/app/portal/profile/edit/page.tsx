"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
    Loader2, ChevronLeft, Plus, X, Save,
    Building2, Home, TreePine, Check,
} from "lucide-react";
import { me } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ClientProfile } from "@/types/api";

// ── Schema ─────────────────────────────────────────────────────

const editProfileSchema = z.object({
    firstName:     z.string().min(2, "Nombre requerido"),
    lastName:      z.string().min(2, "Apellido requerido"),
    phone:         z.string().optional(),
    height:        z.number().min(100).max(250).optional(),
    gender:        z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    trainingPlace: z.enum(["GYM", "HOME", "OUTDOOR"]).optional(),
    objectives: z.array(z.object({
        id:      z.string().optional(),
        content: z.string().min(3, "Objetivo muy corto"),
    })),
    pathologies: z.array(z.object({
        id:       z.string().optional(),
        name:     z.string().min(2, "Nombre requerido"),
        severity: z.enum(["Low", "Medium", "High"]).optional(),
        notes:    z.string().optional(),
    })),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

// ── Config ─────────────────────────────────────────────────────

const trainingPlaces = [
    { value: "GYM",     label: "Gimnasio",   description: "Equipo completo", Icon: Building2 },
    { value: "HOME",    label: "Casa",        description: "Equipo básico",   Icon: Home },
    { value: "OUTDOOR", label: "Aire libre",  description: "Parques y exterior", Icon: TreePine },
];

const SEVERITY_OPTIONS = [
    { value: "Low",    label: "Baja",  className: "text-emerald-600 border-emerald-500/40 bg-emerald-500/5" },
    { value: "Medium", label: "Media", className: "text-amber-600  border-amber-500/40  bg-amber-500/5"  },
    { value: "High",   label: "Alta",  className: "text-red-600    border-red-500/40    bg-red-500/5"    },
];

const fieldLabel = "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground";
const sectionHeader = "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4 block";

// ── Page ───────────────────────────────────────────────────────

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const form = useForm<EditProfileForm>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            firstName: "", lastName: "", phone: "",
            height: undefined, gender: undefined,
            trainingPlace: undefined,
            objectives: [], pathologies: [],
        },
    });

    const objArray = useFieldArray({ control: form.control, name: "objectives" });
    const patArray = useFieldArray({ control: form.control, name: "pathologies" });

    useEffect(() => {
        me.getProfile()
            .then((data: ClientProfile) => {
                form.reset({
                    firstName:     data.firstName || "",
                    lastName:      data.lastName  || "",
                    phone:         data.phone     || "",
                    height:        data.height    ?? undefined,
                    gender:        (data.gender as EditProfileForm["gender"]) ?? undefined,
                    trainingPlace: (data.trainingPlace as EditProfileForm["trainingPlace"]) ?? undefined,
                    objectives:    data.objectives?.map(o => ({ id: o.id, content: o.content })) ?? [],
                    pathologies:   data.pathologies?.map(p => ({
                        id:       p.id,
                        name:     p.name,
                        severity: (p.severity as EditProfileForm["pathologies"][number]["severity"]) ?? undefined,
                        notes:    p.notes ?? "",
                    })) ?? [],
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [form]);

    async function onSubmit(values: EditProfileForm) {
        setSaving(true);
        try {
            await me.updateProfile({
                firstName:     values.firstName,
                lastName:      values.lastName,
                phone:         values.phone,
                height:        values.height,
                gender:        values.gender,
                trainingPlace: values.trainingPlace,
                objectives:    values.objectives.map(o => ({ id: o.id, content: o.content })),
                pathologies:   values.pathologies.map(p => ({
                    id: p.id, name: p.name, severity: p.severity, notes: p.notes,
                })),
            });
            toast.success("Perfil actualizado");
            router.push("/portal/profile");
        } catch {
            toast.error("Error al actualizar el perfil");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-24 w-full rounded-2xl" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">

            {/* ── Header ── */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/portal/profile">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="font-display text-xl font-bold">Editar Perfil</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                    {/* ── Datos personales ── */}
                    <section>
                        <span className={sectionHeader}>Datos personales</span>
                        <div className="rounded-2xl border bg-card p-5 space-y-5">

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={fieldLabel}>Nombre</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
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
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
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
                                <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={fieldLabel}>Altura (cm)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="175"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={fieldLabel}>Género</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                    </section>

                    {/* ── Lugar de entrenamiento ── */}
                    <section>
                        <span className={sectionHeader}>Lugar de entrenamiento</span>
                        <FormField
                            control={form.control}
                            name="trainingPlace"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-3 gap-3">
                                        {trainingPlaces.map((place) => {
                                            const isSelected = field.value === place.value;
                                            return (
                                                <button
                                                    key={place.value}
                                                    type="button"
                                                    onClick={() => field.onChange(place.value)}
                                                    className={cn(
                                                        "relative flex flex-col items-center gap-2 rounded-2xl border-2 py-5 px-2 text-center transition-all duration-200",
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
                                                    <div className={cn(
                                                        "rounded-xl p-2.5 transition-colors",
                                                        isSelected ? "bg-primary/10" : "bg-muted"
                                                    )}>
                                                        <place.Icon className={cn(
                                                            "h-5 w-5",
                                                            isSelected ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <p className={cn(
                                                            "text-xs font-semibold leading-tight",
                                                            isSelected ? "text-foreground" : "text-muted-foreground"
                                                        )}>
                                                            {place.label}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                                                            {place.description}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </section>

                    {/* ── Objetivos ── */}
                    <section>
                        <span className={sectionHeader}>Objetivos</span>
                        <div className="space-y-2.5">
                            {objArray.fields.map((field, index) => (
                                <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`objectives.${index}.content`}
                                    render={({ field: inputField }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-2">
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
                                                <button
                                                    type="button"
                                                    onClick={() => objArray.remove(index)}
                                                    className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    aria-label="Eliminar objetivo"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <FormMessage className="pl-7" />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => objArray.append({ content: "" })}
                                className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline ml-7"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Agregar objetivo
                            </button>
                        </div>
                    </section>

                    {/* ── Condiciones de salud ── */}
                    <section>
                        <span className={sectionHeader}>Condiciones de salud</span>
                        <div className="space-y-3">
                            {patArray.fields.map((field, index) => (
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
                                                    <FormLabel className={fieldLabel}>Condición</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ej: Hipertensión" {...inputField} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => patArray.remove(index)}
                                            className="mt-7 shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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
                                                                    ? opt.className
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
                            <button
                                type="button"
                                onClick={() => patArray.append({ name: "", severity: "Low", notes: "" })}
                                className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Agregar condición
                            </button>
                        </div>
                    </section>

                    {/* ── Submit ── */}
                    <Button type="submit" className="w-full" size="lg" disabled={saving}>
                        {saving ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</>
                        ) : (
                            <><Save className="h-4 w-4 mr-2" />Guardar Cambios</>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
