"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Users,
    UserPlus,
    Activity,
    Clock,
    ArrowRight,
    AlertTriangle,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { dashboard, clients as clientsApi } from "@/lib/api";
import { useSession } from "@/hooks/useSession";
import type { DashboardStats, Client } from "@/types/api";

const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
    }),
};

export default function DashboardPage() {
    const { user } = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentClients, setRecentClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsData, clientsData] = await Promise.all([
                    dashboard.getStats(),
                    clientsApi.list({ limit: 6, status: "active" }),
                ]);
                setStats(statsData);
                setRecentClients(clientsData.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar datos");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex flex-1 items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                    <p className="text-sm text-muted-foreground">{error || "No se pudieron cargar los datos"}</p>
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    const { totalClients, activeClients, inactiveClients } = stats.stats;
    const pendingEvaluations = stats.pendingEvaluations;

    const statCards = [
        {
            title: "Clientes Activos",
            value: activeClients.toString(),
            description: `${inactiveClients} inactivos`,
            icon: Users,
            accent: "text-emerald-600 dark:text-emerald-400",
            border: "border-l-emerald-500",
        },
        {
            title: "Total Clientes",
            value: totalClients.toString(),
            description: "registrados",
            icon: UserPlus,
            accent: "text-blue-600 dark:text-blue-400",
            border: "border-l-blue-500",
        },
        {
            title: "Pendientes de Evaluación",
            value: pendingEvaluations.length.toString(),
            description: "+60 días sin evaluar",
            icon: Clock,
            accent: pendingEvaluations.length > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400",
            border: pendingEvaluations.length > 0 ? "border-l-amber-500" : "border-l-emerald-500",
        },
        {
            title: "Clientes Inactivos",
            value: inactiveClients.toString(),
            description: "sin actividad",
            icon: Activity,
            accent: inactiveClients > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400",
            border: inactiveClients > 0 ? "border-l-amber-500" : "border-l-emerald-500",
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">
                        Bienvenido{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Aquí tienes un resumen de tu actividad reciente.
                    </p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button asChild>
                        <Link href="/dashboard/clients/new">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Nuevo Cliente
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        custom={i}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card className={`relative overflow-hidden border-l-[3px] ${stat.border}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-3xl font-bold tabular-nums">{stat.value}</div>
                                <p className={`mt-1 text-xs ${stat.accent}`}>
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Pending Evaluations Alert */}
                {pendingEvaluations.length > 0 && (
                    <motion.div
                        custom={4}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-2"
                    >
                        <Card className="border-amber-500/20 bg-amber-500/[0.03]">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    Evaluaciones Pendientes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {pendingEvaluations.map((pending) => {
                                    const daysSince = pending.daysSinceLastEvaluation;

                                    return (
                                        <Link
                                            key={pending.id}
                                            href={`/dashboard/clients/${pending.id}/new-assessment`}
                                            className="flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/50"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {pending.name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {pending.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {daysSince === "Never"
                                                        ? "Sin evaluación"
                                                        : `Hace ${daysSince} días`}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px]"
                                            >
                                                Pendiente
                                            </Badge>
                                        </Link>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Recent Clients */}
                <motion.div
                    custom={5}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className={
                        pendingEvaluations.length > 0
                            ? "lg:col-span-3"
                            : "lg:col-span-5"
                    }
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base">Clientes Recientes</CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/clients">
                                    Ver todos
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentClients.length > 0 ? (
                                <div className="space-y-1">
                                    {recentClients.map((client) => {
                                        const latestEval = client.evaluations?.[0];
                                        return (
                                            <Link
                                                key={client.id}
                                                href={`/dashboard/clients/${client.id}`}
                                                className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50"
                                            >
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="text-xs">
                                                        {client.firstName[0]}{client.lastName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium">
                                                        {client.firstName} {client.lastName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {client.email || client.phone || "Sin contacto"}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            client.status === "ACTIVE"
                                                                ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                                                : "border-muted text-muted-foreground"
                                                        }
                                                    >
                                                        {client.status === "ACTIVE" ? "Activo" : client.status === "INACTIVE" ? "Inactivo" : "Archivado"}
                                                    </Badge>
                                                    {latestEval?.bioimpedance?.weight && (
                                                        <p className="mt-0.5 text-xs font-medium tabular-nums">
                                                            {latestEval.bioimpedance.weight} kg
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <Users className="mx-auto h-8 w-8 text-muted-foreground/40" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        No hay clientes registrados
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-3" asChild>
                                        <Link href="/dashboard/clients/new">Agregar cliente</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
