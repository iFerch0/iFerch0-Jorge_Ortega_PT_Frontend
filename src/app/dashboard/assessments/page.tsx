"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { trainer, clients as clientsApi } from "@/lib/api";
import type { Evaluation, Client } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Calendar, Scale, Eye, ChevronLeft, ChevronRight } from "lucide-react";

type EvaluationWithClient = Evaluation & { client?: { firstName: string; lastName: string } };

export default function AssessmentsListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [assessments, setAssessments] = useState<EvaluationWithClient[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedClient, setSelectedClient] = useState<string>(searchParams.get("clientId") || "all");

    const fetchAssessments = useCallback(async () => {
        setLoading(true);
        try {
            const params: { page: number; limit: number; clientId?: string } = {
                page,
                limit: 10,
            };
            if (selectedClient !== "all") {
                params.clientId = selectedClient;
            }
            const res = await trainer.getAssessments(params);
            setAssessments(res.data);
            setTotalPages(res.meta.lastPage);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, selectedClient]);

    useEffect(() => {
        fetchAssessments();
    }, [fetchAssessments]);

    useEffect(() => {
        clientsApi.list().then((res) => setClients(res.data)).catch(console.error);
    }, []);

    const handleClientChange = (value: string) => {
        setSelectedClient(value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Valoraciones</h1>
                    <p className="text-sm text-muted-foreground">
                        Historial de valoraciones de todos los clientes
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Select value={selectedClient} onValueChange={handleClientChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los clientes</SelectItem>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id}>
                                            {client.firstName} {client.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : assessments.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            No se encontraron valoraciones
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {assessments.map((assessment) => (
                        <Card key={assessment.id} className="hover:bg-muted/50 transition-colors">
                            <CardContent className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold">
                                                {assessment.client
                                                    ? `${assessment.client.firstName} ${assessment.client.lastName}`
                                                    : "Cliente desconocido"}
                                            </h3>
                                            <Badge variant="secondary" className="text-xs">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(assessment.date).toLocaleDateString("es-CO", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            {assessment.bioimpedance?.weight && (
                                                <span className="flex items-center gap-1">
                                                    <Scale className="h-4 w-4" />
                                                    {assessment.bioimpedance.weight} kg
                                                </span>
                                            )}
                                            {assessment.bioimpedance?.bodyFat != null && (
                                                <span>
                                                    {assessment.bioimpedance.bodyFat}% grasa
                                                </span>
                                            )}
                                            {assessment.notes && (
                                                <span className="truncate max-w-[200px]">
                                                    {assessment.notes}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/dashboard/assessments/${assessment.id}`}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Ver
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
