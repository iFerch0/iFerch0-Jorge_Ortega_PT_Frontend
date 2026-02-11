"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export default function RegisterPage() {
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(values);
        toast.success("Cuenta creada exitosamente");
    }

    return (
        <Card className="w-full border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
                <CardDescription>
                    Ingresa tus datos para registrarte como entrenador.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
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
                                        <FormLabel>Apellido</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Pérez" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="entrenador@gym.com" {...field} />
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
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registrando...
                                </>
                            ) : (
                                "Crear Cuenta"
                            )}
                        </Button>
                        <Button variant="outline" className="w-full" type="button">
                            Registrarse con Google
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <div className="mt-4 text-center text-sm">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/login" className="underline">
                        Inicia Sesión
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
