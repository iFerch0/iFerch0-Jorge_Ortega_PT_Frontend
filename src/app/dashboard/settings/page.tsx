"use client";

import { useState } from "react";
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

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Configuración</h3>
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
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            firstName: "Jorge",
            lastName: "Ortega",
            email: "jorge.ortega@gmail.com",
            phone: "+57 300 000 0000",
        },
    });

    function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    async function onSubmit(data: Record<string, string>) {
        await new Promise((r) => setTimeout(r, 1000));
        toast.success("Perfil actualizado correctamente");
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
                    {/* Avatar */}
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
                            <Label htmlFor="firstName">Nombre</Label>
                            <Input id="firstName" {...register("firstName")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input id="lastName" {...register("lastName")} />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input id="phone" {...register("phone")} />
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
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            gymName: "Jorge Ortega Personal Trainer",
        },
    });

    function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    }

    async function onSubmit(data: Record<string, string>) {
        await new Promise((r) => setTimeout(r, 1000));
        toast.success("Configuración del gimnasio actualizada");
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
                    {/* Logo upload */}
                    <div className="space-y-2">
                        <Label>Logo del Gimnasio</Label>
                        <div className="flex items-center gap-4">
                            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 overflow-hidden">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="h-full w-full object-contain p-1"
                                    />
                                ) : (
                                    <img
                                        src="https://res.cloudinary.com/duhsqdstl/image/upload/v1770782105/LOGO_CON_TRAZO_-_TRANSPARENTE_ytfdn6.png"
                                        alt="Logo actual"
                                        className="h-full w-full object-contain p-1"
                                    />
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

                    {/* Gym name */}
                    <div className="space-y-2">
                        <Label htmlFor="gymName">Nombre del Gimnasio</Label>
                        <Input id="gymName" {...register("gymName")} />
                    </div>

                    {/* Primary color */}
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

                    {/* Preview */}
                    <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Vista previa
                        </p>
                        <div className="flex items-center gap-3 rounded-md border bg-background p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="" className="h-full w-full object-contain" />
                                ) : (
                                    <img
                                        src="https://res.cloudinary.com/duhsqdstl/image/upload/v1770782105/LOGO_CON_TRAZO_-_TRANSPARENTE_ytfdn6.png"
                                        alt=""
                                        className="h-full w-full object-contain"
                                    />
                                )}
                            </div>
                            <span className="font-semibold" style={{ color: primaryColor }}>
                                {/* Display gym name from form would need watch, so just show text */}
                                Jorge Ortega PT
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
