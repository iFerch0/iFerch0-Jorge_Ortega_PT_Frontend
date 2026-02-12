"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockClients } from "@/lib/data/mock-clients";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientCardSkeleton } from "@/components/clients/ClientCardSkeleton";
import { ClientFilters } from "@/components/clients/ClientFilters";

const ITEMS_PER_PAGE = 8;

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedClients, setDisplayedClients] = useState<typeof mockClients>([]);

    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDisplayedClients(mockClients);
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter]);

    const filteredClients = useMemo(() => {
        return displayedClients.filter((client) => {
            const query = debouncedSearch.toLowerCase();
            const matchesSearch =
                client.firstName.toLowerCase().includes(query) ||
                client.lastName.toLowerCase().includes(query) ||
                client.email.toLowerCase().includes(query);
            const matchesStatus =
                statusFilter === "all" || client.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [displayedClients, debouncedSearch, statusFilter]);

    const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
                    {!isLoading && (
                        <p className="text-sm text-muted-foreground">
                            {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""}
                            {statusFilter !== "all" && ` · ${statusFilter}`}
                        </p>
                    )}
                </div>
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
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                        <ClientCardSkeleton key={i} />
                    ))}
                </div>
            ) : paginatedClients.length > 0 ? (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {paginatedClients.map((client) => (
                            <ClientCard key={client.id} client={client} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t pt-4">
                            <p className="text-sm text-muted-foreground">
                                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                                {Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)} de{" "}
                                {filteredClients.length}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                    Anterior
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <Button
                                            key={i}
                                            variant={currentPage === i + 1 ? "default" : "ghost"}
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    Siguiente
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                    <div className="rounded-full bg-muted p-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No se encontraron clientes</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Intenta ajustar tu búsqueda o crea un nuevo cliente.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                        }}
                    >
                        Limpiar Filtros
                    </Button>
                </div>
            )}
        </div>
    );
}
