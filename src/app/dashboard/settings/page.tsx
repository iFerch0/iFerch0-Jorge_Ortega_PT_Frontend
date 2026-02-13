"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Upload, Building2, User, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeCustomizer } from "@/components/settings/ThemeCustomizer";
import { users, gym as gymApi } from "@/lib/api";
import type { Gym } from "@/types/api";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">Configuración</h1>
                <p className="text-sm text-muted-foreground">
                    Administra tu perfil, el branding de tu gimnasio y la apariencia.
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="profile">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                    </TabsTrigger>
                    <TabsTrigger value="gym">
                        <Building2 className="mr-2 h-4 w-4" />
                        Gimnasio
                    </TabsTrigger>
                    <TabsTrigger value="appearance">
                        <Palette className="mr-2 h-4 w-4" />
                        Apariencia
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6 space-y-6">
                    <TrainerProfileForm />
                </TabsContent>

                <TabsContent value="gym" className="mt-6 space-y-6">
                    <GymConfigForm />
                </TabsContent>

                <TabsContent value="appearance" className="mt-6 space-y-6">
                    <ThemeCustomizer />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function TrainerProfileForm() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            name: "",
            email: "",
        },
    });

    useEffect(() => {
        users.getProfile()
            .then((profile) => {
                reset({
                    name: profile.name || "",
                    email: profile.email || "",
                });
                if (profile.image) setAvatarPreview(profile.image);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [reset]);

    function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    async function onSubmit(data: { name: string; email: string }) {
        try {
            await users.updateProfile({ name: data.name });
            toast.success("Perfil actualizado correctamente");
        } catch {
            toast.error("Error al actualizar perfil");
        }
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Perfil del Entrenador</CardTitle>
                <CardDescription>
                    Tu información personal visible para los clientes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-2">
                            <AvatarImage src={avatarPreview || ""} />
                            <AvatarFallback className="text-xl">JO</AvatarFallback>
                        </Avatar>
                        <div>
                            <Label
                                htmlFor="avatar-upload"
                                className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                            >
                                <Upload className="h-4 w-4" />
                                Cambiar Foto
                            </Label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onAvatarChange}
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                JPG, PNG. Máximo 2MB.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" {...register("name")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} disabled />
                            <p className="text-xs text-muted-foreground">El email no se puede cambiar.</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function GymConfigForm() {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [primaryColor, setPrimaryColor] = useState("#2563eb");
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
        defaultValues: {
            gymName: "",
        },
    });

    const gymName = watch("gymName");

    useEffect(() => {
        gymApi.get()
            .then((gymData) => {
                reset({ gymName: gymData.name || "" });
                if (gymData.logo) setLogoPreview(gymData.logo);
                if (gymData.primaryColor) setPrimaryColor(gymData.primaryColor);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [reset]);

    function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    }

    async function onSubmit(data: { gymName: string }) {
        try {
            await gymApi.update({
                name: data.gymName,
                primaryColor,
            });
            toast.success("Configuración del gimnasio actualizada");
        } catch {
            toast.error("Error al actualizar configuración");
        }
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Branding del Gimnasio</CardTitle>
                <CardDescription>
                    Personaliza el logo, nombre y color de tu gimnasio. Se aplicará en la app, reportes PDF y el portal del cliente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Logo del Gimnasio</Label>
                        <div className="flex items-center gap-4">
                            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain p-1" />
                                ) : (
                                    <Building2 className="h-8 w-8 text-muted-foreground/40" />
                                )}
                            </div>
                            <div>
                                <Label
                                    htmlFor="logo-upload"
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                >
                                    <Upload className="h-4 w-4" />
                                    Subir Logo
                                </Label>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={onLogoChange}
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    PNG o SVG con fondo transparente. Máximo 1MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gymName">Nombre del Gimnasio</Label>
                        <Input id="gymName" {...register("gymName")} />
                    </div>

                    <div className="space-y-2">
                        <Label>Color Primario</Label>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="h-10 w-10 cursor-pointer rounded-md border p-0.5"
                                />
                            </div>
                            <Input
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-32 font-mono text-sm uppercase"
                                placeholder="#000000"
                            />
                            <div
                                className="h-10 flex-1 rounded-md border"
                                style={{ backgroundColor: primaryColor }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Se usará en headers, botones, reportes PDF y portal del cliente.
                        </p>
                    </div>

                    <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Vista previa
                        </p>
                        <div className="flex items-center gap-3 rounded-md border bg-background p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="" className="h-full w-full object-contain" />
                                ) : (
                                    <Building2 className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>
                            <span className="font-semibold" style={{ color: primaryColor }}>
                                {gymName || "Tu Gimnasio"}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Configuración
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
