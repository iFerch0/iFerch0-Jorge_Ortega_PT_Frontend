"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings, Camera, Activity, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clients as clientsApi } from "@/lib/api";
import type { Client } from "@/types/api";

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        clientsApi.get(id)
            .then(setClient)
            .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar cliente"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="flex flex-1 items-center justify-center py-20">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">{error || "Cliente no encontrado"}</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                        <Link href="/dashboard/clients">Volver a clientes</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const getInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header with Back Button and Actions */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/clients">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Volver</span>
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Perfil del Cliente</h1>
                </div>
                <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                </Button>
            </div>

            {/* Client Summary Card */}
            <div className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarFallback className="text-lg">
                            {getInitials(client.firstName, client.lastName)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-bold">
                            {client.firstName} {client.lastName}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{client.email}</span>
                            {client.phone && (
                                <>
                                    <span>•</span>
                                    <span>{client.phone}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href={`/dashboard/clients/${id}/new-assessment`}>
                            Nueva Valoración
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-4">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger value="overview" asChild>
                            <Link href={`/dashboard/clients/${id}`}>
                                <Activity className="mr-2 h-4 w-4" />
                                Resumen
                            </Link>
                        </TabsTrigger>
                        <TabsTrigger value="assessments" asChild>
                            <Link href={`/dashboard/clients/${id}/assessments`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Evaluaciones
                            </Link>
                        </TabsTrigger>
                        <TabsTrigger value="photos" asChild>
                            <Link href={`/dashboard/clients/${id}/photos`}>
                                <Camera className="mr-2 h-4 w-4" />
                                Fotos
                            </Link>
                        </TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                        {children}
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
