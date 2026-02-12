"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Users,
    UserPlus,
    Activity,
    Clock,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    CalendarCheck,
    AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockClients } from "@/lib/data/mock-clients";
import { mockAssessments } from "@/lib/data/mock-assessments";

// Compute stats from mock data
const activeClients = mockClients.filter((c) => c.status === "active");
const inactiveClients = mockClients.filter((c) => c.status === "inactive");
const totalAssessments = mockAssessments.length;

const now = new Date();
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
const recentAssessments = mockAssessments.filter(
    (a) => new Date(a.date) >= thirtyDaysAgo
);

// Clients who haven't had an assessment in 60+ days
const clientsNeedingEval = activeClients.filter((client) => {
    const clientAssessments = mockAssessments
        .filter((a) => a.clientId === client.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (clientAssessments.length === 0) return true;
    const lastDate = new Date(clientAssessments[0].date);
    const daysSince = Math.floor(
        (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSince >= 60;
});

// Recent activity feed
const recentActivity = mockAssessments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((assessment) => {
        const client = mockClients.find((c) => c.id === assessment.clientId);
        return { ...assessment, client };
    });

const statCards = [
    {
        title: "Clientes Activos",
        value: activeClients.length.toString(),
        description: `${inactiveClients.length} inactivos`,
        icon: Users,
        trend: "+2 este mes",
        trendUp: true,
    },
    {
        title: "Evaluaciones del Mes",
        value: recentAssessments.length.toString(),
        description: `${totalAssessments} totales`,
        icon: Activity,
        trend: "al día",
        trendUp: true,
    },
    {
        title: "Pendientes de Evaluación",
        value: clientsNeedingEval.length.toString(),
        description: "+60 días sin evaluar",
        icon: Clock,
        trend: clientsNeedingEval.length > 0 ? "requieren atención" : "todo al día",
        trendUp: clientsNeedingEval.length === 0,
    },
    {
        title: "Nuevos este Mes",
        value: mockClients
            .filter((c) => new Date(c.joinedAt) >= thirtyDaysAgo)
            .length.toString(),
        description: "clientes registrados",
        icon: UserPlus,
        trend: "creciendo",
        trendUp: true,
    },
];

const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
    }),
};

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Bienvenido de vuelta
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
                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <div className="mt-1 flex items-center gap-1.5 text-xs">
                                    {stat.trendUp ? (
                                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-amber-500" />
                                    )}
                                    <span
                                        className={
                                            stat.trendUp
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-amber-600 dark:text-amber-400"
                                        }
                                    >
                                        {stat.trend}
                                    </span>
                                    <span className="text-muted-foreground">
                                        &middot; {stat.description}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Pending Evaluations Alert */}
                {clientsNeedingEval.length > 0 && (
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
                                {clientsNeedingEval.map((client) => {
                                    const lastAssessment = mockAssessments
                                        .filter((a) => a.clientId === client.id)
                                        .sort(
                                            (a, b) =>
                                                new Date(b.date).getTime() -
                                                new Date(a.date).getTime()
                                        )[0];
                                    const daysSince = lastAssessment
                                        ? Math.floor(
                                              (now.getTime() -
                                                  new Date(lastAssessment.date).getTime()) /
                                                  (1000 * 60 * 60 * 24)
                                          )
                                        : null;

                                    return (
                                        <Link
                                            key={client.id}
                                            href={`/dashboard/clients/${client.id}/new-assessment`}
                                            className="flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/50"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={client.avatar} />
                                                <AvatarFallback className="text-xs">
                                                    {client.firstName[0]}
                                                    {client.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {client.firstName} {client.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {daysSince
                                                        ? `Hace ${daysSince} días`
                                                        : "Sin evaluación"}
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

                {/* Recent Activity */}
                <motion.div
                    custom={5}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className={
                        clientsNeedingEval.length > 0
                            ? "lg:col-span-3"
                            : "lg:col-span-5"
                    }
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base">Actividad Reciente</CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/clients">
                                    Ver todos
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {recentActivity.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/dashboard/clients/${item.clientId}`}
                                    className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={item.client?.avatar} />
                                        <AvatarFallback className="text-xs">
                                            {item.client?.firstName[0]}
                                            {item.client?.lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">
                                            {item.client?.firstName} {item.client?.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {item.notes || "Evaluación registrada"}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarCheck className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(item.date).toLocaleDateString("es-CO", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs font-medium">
                                            {item.weight} kg
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            {recentActivity.length === 0 && (
                                <div className="py-8 text-center">
                                    <Activity className="mx-auto h-8 w-8 text-muted-foreground/40" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        No hay actividad reciente
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Quick Access: Recent Clients */}
            <motion.div
                custom={6}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
            >
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base">Clientes Recientes</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/clients">
                                Ver directorio
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {activeClients.slice(0, 3).map((client) => {
                                const lastAssessment = mockAssessments
                                    .filter((a) => a.clientId === client.id)
                                    .sort(
                                        (a, b) =>
                                            new Date(b.date).getTime() -
                                            new Date(a.date).getTime()
                                    )[0];

                                return (
                                    <Link
                                        key={client.id}
                                        href={`/dashboard/clients/${client.id}`}
                                        className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={client.avatar} />
                                            <AvatarFallback>
                                                {client.firstName[0]}
                                                {client.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {client.firstName} {client.lastName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {client.goal}
                                            </p>
                                        </div>
                                        {lastAssessment && (
                                            <span className="text-xs font-medium tabular-nums">
                                                {lastAssessment.weight} kg
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
