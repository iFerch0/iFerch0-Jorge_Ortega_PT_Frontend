
import { mockClients } from "@/lib/data/mock-clients";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Target, CalendarDays, TrendingDown } from "lucide-react";

import { mockAssessments } from "@/lib/data/mock-assessments";
import { WeightChart } from "@/components/charts/WeightChart";
import { CompositionChart } from "@/components/charts/CompositionChart";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ClientProfilePage({ params }: PageProps) {
    const { id } = await params;
    const client = mockClients.find((c) => c.id === id);

    if (!client) {
        notFound();
    }

    const clientAssessments = mockAssessments.filter(a => a.clientId === id);

    // Mock data for the overview
    const stats = [
        {
            title: "Objetivo Principal",
            value: client.goal,
            icon: Target,
            description: "Meta actual definida",
        },
        {
            title: "Último Peso",
            value: "82.5 kg",
            icon: TrendingDown,
            description: "-1.2kg vs mes anterior",
            trend: "down",
        },
        {
            title: "Sesiones Completadas",
            value: "12",
            icon: Dumbbell,
            description: "En el último mes",
        },
        {
            title: "Antigüedad",
            value: "3 Meses",
            icon: CalendarDays,
            description: "Miembro desde Nov 2023",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <WeightChart data={clientAssessments} goalWeight={80} />
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Notas Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <p className="font-semibold mb-1">10 Feb 2024</p>
                                <p>Reporta molestia leve en la rodilla derecha al hacer sentadilla profunda. Modificar rango de movimiento.</p>
                            </div>
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <p className="font-semibold mb-1">05 Feb 2024</p>
                                <p>Excelente energía hoy. Aumentamos carga en press de banca.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <CompositionChart data={clientAssessments} />
            </div>
        </div>
    );
}
