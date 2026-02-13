"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import type { Client } from "@/types/api";
import { clients as clientsApi } from "@/lib/api";
import { CalendarDays, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClientCardProps {
    client: Client;
    onArchived?: () => void;
}

export function ClientCard({ client, onArchived }: ClientCardProps) {
    const [showArchiveDialog, setShowArchiveDialog] = useState(false);
    const [archiving, setArchiving] = useState(false);

    const getInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    };

    const statusColors: Record<string, string> = {
        ACTIVE: "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25",
        INACTIVE: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25",
        ARCHIVED: "bg-gray-500/15 text-gray-700 dark:text-gray-400 hover:bg-gray-500/25",
    };

    const statusLabels: Record<string, string> = {
        ACTIVE: "Activo",
        INACTIVE: "Inactivo",
        ARCHIVED: "Archivado",
    };

    async function handleArchive() {
        setArchiving(true);
        try {
            await clientsApi.archive(client.id);
            toast.success(`${client.firstName} ${client.lastName} fue archivado`);
            setShowArchiveDialog(false);
            onArchived?.();
        } catch {
            toast.error("Error al archivar cliente");
        } finally {
            setArchiving(false);
        }
    }

    const lastEvaluation = client.evaluations?.[0];
    const objective = client.objectives?.[0]?.content;

    return (
        <>
            <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border">
                            <AvatarFallback>{getInitials(client.firstName, client.lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold leading-none tracking-tight">
                                {client.firstName} {client.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menú</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/clients/${client.id}`}>Ver Perfil</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/clients/${client.id}/new-assessment`}>
                                    Nueva Valoración
                                </Link>
                            </DropdownMenuItem>
                            {client.status !== "ARCHIVED" && (
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setShowArchiveDialog(true)}
                                >
                                    Archivar
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={statusColors[client.status] || ""}>
                            {statusLabels[client.status] || client.status}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="mr-1 h-3 w-3" />
                            {lastEvaluation
                                ? new Date(lastEvaluation.date).toLocaleDateString("es-CO", {
                                      day: "numeric",
                                      month: "short",
                                  })
                                : "Sin evaluaciones"}
                        </div>
                    </div>
                    {objective && (
                        <div className="mt-3 text-sm">
                            <span className="font-medium">Objetivo:</span> {objective}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="bg-muted/50 p-3">
                    <Button asChild variant="ghost" className="w-full justify-center h-8 text-xs">
                        <Link href={`/dashboard/clients/${client.id}`}>
                            Ver Detalles
                        </Link>
                    </Button>
                </CardFooter>
            </Card>

            <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archivar cliente</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas archivar a{" "}
                            <strong>
                                {client.firstName} {client.lastName}
                            </strong>
                            ? El cliente no será eliminado, pero dejará de aparecer en tu lista activa.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleArchive}
                            disabled={archiving}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {archiving ? "Archivando..." : "Archivar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
