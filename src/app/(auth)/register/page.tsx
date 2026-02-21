"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Lock, User, ArrowRight, IdCard, Calendar } from "lucide-react";

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

const registerSchema = z.object({
    firstName: z.string().min(2, { message: "El nombre es requerido" }),
    lastName: z.string().min(2, { message: "El apellido es requerido" }),
    birthDate: z.string().min(1, { message: "La fecha de nacimiento es requerida" }).refine((val) => {
        return new Date(val) < new Date();
    }, "La fecha no puede ser futura"),
    cedula: z.string().min(5, { message: "La identificación debe tener al menos 5 caracteres" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

function getPasswordStrength(password: string) {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
}

const strengthLabels = ["", "Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"];
const strengthColors = [
    "bg-muted",
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-emerald-400",
];

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            birthDate: "",
            cedula: "",
            password: "",
        },
    });

    const { isSubmitting } = form.formState;
    const passwordValue = form.watch("password");
    const strength = useMemo(() => getPasswordStrength(passwordValue || ""), [passwordValue]);

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    birthDate: values.birthDate,
                    cedula: values.cedula,
                    password: values.password,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                toast.error(data.error || "Error al crear la cuenta. Contacta a tu entrenador.");
                return;
            }

            toast.success("Cuenta creada exitosamente");
            router.push("/login");
        } catch {
            toast.error("Error de conexión. Intenta de nuevo.");
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold tracking-tight">
                    Crea tu cuenta
                </h1>
                <p className="text-sm text-muted-foreground">
                    Regístrate para acceder a tus evaluaciones y seguimiento personalizado.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Nombre
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                                            <Input
                                                placeholder="Juan"
                                                className="h-11 pl-10"
                                                {...field}
                                            />
                                        </div>
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
                                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Apellido
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Pérez"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Fecha de Nacimiento
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                                        <Input
                                            type="date"
                                            max={new Date().toISOString().split("T")[0]}
                                            className="h-11 pl-10"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cedula"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Identificación (Cédula)
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                                        <Input
                                            placeholder="1234567890"
                                            className="h-11 pl-10"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Contraseña
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            className="h-11 pl-10 pr-10"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>

                                {/* Password strength indicator */}
                                {passwordValue && passwordValue.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                                        i < strength
                                                            ? strengthColors[strength]
                                                            : "bg-muted"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p
                                            className={`text-[11px] ${
                                                strength <= 2
                                                    ? "text-red-500"
                                                    : strength <= 3
                                                    ? "text-amber-500"
                                                    : "text-emerald-500"
                                            }`}
                                        >
                                            {strengthLabels[strength]}
                                        </p>
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-11 rounded-full bg-primary font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creando cuenta...
                            </>
                        ) : (
                            <>
                                Crear Cuenta
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            {/* Terms */}
            <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed">
                Al registrarte, aceptas los{" "}
                <Link href="#" className="underline hover:text-muted-foreground">
                    Términos de Servicio
                </Link>{" "}
                y la{" "}
                <Link href="#" className="underline hover:text-muted-foreground">
                    Política de Privacidad
                </Link>
                .
            </p>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                >
                    Inicia Sesión
                </Link>
            </p>
        </div>
    );
}
