import Link from "next/link";
import { ArrowLeft, Settings, Camera, Activity, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClients } from "@/lib/data/mock-clients";
import { notFound } from "next/navigation";

import { mockAssessments } from "@/lib/data/mock-assessments";
import { PDFDownloadButton } from "@/components/reports/PDFDownloadButton";

interface ClientLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default async function ClientLayout({ children, params }: ClientLayoutProps) {
    const { id } = await params;
    const client = mockClients.find((c) => c.id === id);

    if (!client) {
        notFound();
    }

    const clientAssessments = mockAssessments.filter((a) => a.clientId === id);

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
                <PDFDownloadButton
                    clientName={`${client.firstName} ${client.lastName}`}
                    clientEmail={client.email}
                    goal={client.goal}
                    assessments={clientAssessments}
                />
                <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                </Button>
            </div>

            {/* Client Summary Card */}
            <div className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src={client.avatar} alt={client.firstName} />
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
                            <span>•</span>
                            <span>{client.phone}</span>
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
                            <Link href={`/dashboard/clients/${client.id}`}>
                                <Activity className="mr-2 h-4 w-4" />
                                Resumen
                            </Link>
                        </TabsTrigger>
                        <TabsTrigger value="assessments" asChild>
                            <Link href={`/dashboard/clients/${client.id}/assessments`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Evaluaciones
                            </Link>
                        </TabsTrigger>
                        <TabsTrigger value="photos" asChild>
                            <Link href={`/dashboard/clients/${client.id}/photos`}>
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
