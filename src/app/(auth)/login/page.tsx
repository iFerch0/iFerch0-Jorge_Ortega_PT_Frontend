"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

const loginSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export default function LoginPage() {
    const router = useRouter();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        // TODO: Replace with actual API call using process.env.NEXT_PUBLIC_API_URL
        // const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log("Connecting to API at:", process.env.NEXT_PUBLIC_API_URL);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(values);
        toast.success("Inicio de sesión exitoso");
        router.push("/dashboard");
    }

    return (
        <Card className="w-full border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                <CardDescription>
                    Ingresa tu email y contraseña para acceder a tu cuenta.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    <div className="flex items-center">
                                        <FormLabel>Contraseña</FormLabel>
                                        <Link href="#" className="ml-auto inline-block text-sm underline">
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>
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
                                    Iniciando...
                                </>
                            ) : (
                                "Ingresar"
                            )}
                        </Button>
                        <Button variant="outline" className="w-full" type="button">
                            Ingresar con Google
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <div className="mt-4 text-center text-sm">
                    ¿No tienes una cuenta?{" "}
                    <Link href="/register" className="underline">
                        Regístrate
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
