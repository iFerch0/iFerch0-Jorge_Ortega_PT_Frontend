"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientCardSkeleton } from "@/components/clients/ClientCardSkeleton";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { clients as clientsApi } from "@/lib/api";
import type { Client } from "@/types/api";

const ITEMS_PER_PAGE = 8;

function getPageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push("...");
    pages.push(total);
    return pages;
}

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
    const [clientsList, setClientsList] = useState<Client[]>([]);
    const [totalClients, setTotalClients] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearch = useDebounce(searchQuery, 300);

    const fetchClients = useCallback(async (page: number, search: string, status: string) => {
        setIsLoading(true);
        try {
            const result = await clientsApi.list({
                page,
                limit: ITEMS_PER_PAGE,
                search: search || undefined,
                status: status === "all" ? undefined : status,
            });
            setClientsList(result.data);
            setTotalClients(result.meta.total);
            setTotalPages(result.meta.lastPage);
        } catch {
            setClientsList([]);
            setTotalClients(0);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch when page, search, or status changes
    useEffect(() => {
        fetchClients(currentPage, debouncedSearch, statusFilter);
    }, [currentPage, debouncedSearch, statusFilter, fetchClients]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter]);

    function handleArchived() {
        fetchClients(currentPage, debouncedSearch, statusFilter);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">Clientes</h1>
                    {!isLoading && (
                        <p className="text-sm text-muted-foreground">
                            {totalClients} cliente{totalClients !== 1 ? "s" : ""}
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
            ) : clientsList.length > 0 ? (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {clientsList.map((client) => (
                            <ClientCard key={client.id} client={client} onArchived={handleArchived} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t pt-4">
                            <p className="text-sm text-muted-foreground">
                                Página {currentPage} de {totalPages} · {totalClients} clientes
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
                                    {getPageNumbers(currentPage, totalPages).map((page, i) =>
                                        page === "..." ? (
                                            <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted-foreground">...</span>
                                        ) : (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "ghost"}
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => setCurrentPage(page as number)}
                                            >
                                                {page}
                                            </Button>
                                        )
                                    )}
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
                        {debouncedSearch || statusFilter !== "all"
                            ? "Intenta ajustar tu búsqueda o filtros."
                            : "Agrega tu primer cliente para comenzar."}
                    </p>
                    {(debouncedSearch || statusFilter !== "all") ? (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setStatusFilter("all");
                            }}
                        >
                            Limpiar Filtros
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href="/dashboard/clients/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Cliente
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
