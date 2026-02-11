"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
                <h2 className="text-xl font-semibold">¡Algo salió mal!</h2>
                <p className="text-muted-foreground mt-2 max-w-sm">
                    No pudimos cargar la información. Por favor, intenta de nuevo.
                </p>
            </div>
            <div className="flex gap-2">
                <Button onClick={() => window.location.reload()} variant="outline">
                    Recargar Página
                </Button>
                <Button onClick={() => reset()}>Intentar de nuevo</Button>
            </div>
        </div>
    );
}
