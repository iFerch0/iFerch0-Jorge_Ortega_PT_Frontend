"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Client } from "@/lib/data/mock-clients";
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
}

export function ClientCard({ client }: ClientCardProps) {
    const [showArchiveDialog, setShowArchiveDialog] = useState(false);

    const getInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    };

    const statusColors = {
        active: "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25",
        inactive: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25",
        archived: "bg-gray-500/15 text-gray-700 dark:text-gray-400 hover:bg-gray-500/25",
    };

    const statusLabels = {
        active: "Activo",
        inactive: "Inactivo",
        archived: "Archivado",
    };

    function handleArchive() {
        toast.success(`${client.firstName} ${client.lastName} fue archivado`);
        setShowArchiveDialog(false);
    }

    return (
        <>
            <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border">
                            <AvatarImage src={client.avatar} alt={client.firstName} />
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
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setShowArchiveDialog(true)}
                            >
                                Archivar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={statusColors[client.status]}>
                            {statusLabels[client.status]}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="mr-1 h-3 w-3" />
                            {client.lastCheckIn
                                ? new Date(client.lastCheckIn).toLocaleDateString("es-CO", {
                                      day: "numeric",
                                      month: "short",
                                  })
                                : "Sin registros"}
                        </div>
                    </div>
                    <div className="mt-3 text-sm">
                        <span className="font-medium">Objetivo:</span> {client.goal}
                    </div>
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
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Archivar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
