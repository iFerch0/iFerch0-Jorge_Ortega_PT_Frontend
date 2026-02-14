"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, Info, IdCard } from "lucide-react";

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
import { auth } from "@/lib/api";

const loginSchema = z.object({
    email: z.string().min(1, { message: "Email o cédula es requerido" }),
    password: z.string().min(1, { message: "La contraseña es requerida" }),
});

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        try {
            const result = await auth.login(values.email, values.password);

            if (!result.ok) {
                toast.error(result.error || "Error al iniciar sesión");
                return;
            }

            toast.success("Inicio de sesión exitoso");
            router.push("/dashboard");
            router.refresh();
        } catch {
            toast.error("Error de conexión. Intenta de nuevo.");
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold tracking-tight">
                    Iniciar Sesión
                </h1>
                <p className="text-sm text-muted-foreground">
                    Accede a tu cuenta para ver tu progreso y evaluaciones.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email o Cédula</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                                        <Input placeholder="tu@email.com o cédula" className="h-11 pl-10" {...field} />
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
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Contraseña</FormLabel>
                                    <button
                                        type="button"
                                        className="text-xs text-muted-foreground/60 hover:text-primary transition-colors"
                                        onClick={() => toast("Contacta a tu entrenador para restablecer tu contraseña.", { icon: <Info className="h-4 w-4" /> })}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
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
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </FormControl>
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
                                Iniciando sesión...
                            </>
                        ) : (
                            <>
                                Ingresar
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Regístrate
                </Link>
            </p>
        </div>
    );
}
