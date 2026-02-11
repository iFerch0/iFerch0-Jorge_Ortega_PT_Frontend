import Link from "next/link";
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

interface ClientCardProps {
    client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
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

    return (
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
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/clients/${client.id}`}>Ver Perfil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Nueva Valoración</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Archivar</DropdownMenuItem>
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
                            ? new Date(client.lastCheckIn).toLocaleDateString()
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
    );
}
