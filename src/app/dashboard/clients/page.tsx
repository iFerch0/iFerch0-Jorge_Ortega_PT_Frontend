"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockClients } from "@/lib/data/mock-clients";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientCardSkeleton } from "@/components/clients/ClientCardSkeleton";
import { ClientFilters } from "@/components/clients/ClientFilters";

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [displayedClients, setDisplayedClients] = useState<typeof mockClients>([]);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setDisplayedClients(mockClients);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const filteredClients = displayedClients.filter((client) => {
        const matchesSearch =
            client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || client.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                <Button asChild>
                    <Link href="/dashboard/clients/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Cliente
                    </Link>
                </Button>
            </div>

            <ClientFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ClientCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredClients.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredClients.map((client) => (
                        <ClientCard key={client.id} client={client} />
                    ))}
                </div>
            ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                    <div className="rounded-full bg-muted p-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No se encontraron clientes</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Intenta ajustar tu búsqueda o crea un nuevo cliente.
                    </p>
                    <Button variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all") }}>
                        Limpiar Filtros
                    </Button>
                </div>
            )}
        </div>
    );
}
