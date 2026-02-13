"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import type { Evaluation } from "@/types/api";
import { ClientReportPDF } from "@/components/reports/ClientReportPDF";

// Dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => (
            <Button variant="outline" size="sm" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando PDF...
            </Button>
        ),
    }
);

interface PDFDownloadButtonProps {
    clientName: string;
    clientEmail: string;
    goal: string;
    assessments: Evaluation[];
}

export function PDFDownloadButton({
    clientName,
    clientEmail,
    goal,
    assessments,
}: PDFDownloadButtonProps) {
    return (
        <PDFDownloadLink
            document={
                <ClientReportPDF
                    clientName={clientName}
                    clientEmail={clientEmail}
                    goal={goal}
                    assessments={assessments}
                />
            }
            fileName={`reporte-${clientName.toLowerCase().replace(/\s/g, "-")}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button variant="outline" size="sm" disabled={loading}>
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <FileDown className="mr-2 h-4 w-4" />
                    )}
                    {loading ? "Generando..." : "Descargar Reporte"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
