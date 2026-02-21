"use client";

import { useCallback } from "react";
import { toast } from "sonner";

interface ApiError {
    message?: string;
    error?: string;
    statusCode?: number;
}

interface UseApiErrorOptions {
    defaultMessage?: string;
    showToast?: boolean;
}

export function useApiError(options: UseApiErrorOptions = {}) {
    const { defaultMessage = "Ha ocurrido un error", showToast = true } = options;

    const handleError = useCallback(
        (error: unknown, customMessage?: string): string => {
            let message = customMessage || defaultMessage;

            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === "object" && error !== null) {
                const apiError = error as ApiError;
                message = apiError.message || apiError.error || message;
            } else if (typeof error === "string") {
                message = error;
            }

            // Handle specific error cases
            if (message.includes("401") || message.toLowerCase().includes("unauthorized")) {
                message = "Sesión expirada. Por favor, inicia sesión nuevamente.";
            } else if (message.includes("403") || message.toLowerCase().includes("forbidden")) {
                message = "No tienes permisos para realizar esta acción.";
            } else if (message.includes("404") || message.toLowerCase().includes("not found")) {
                message = "El recurso no fue encontrado.";
            } else if (message.includes("500") || message.toLowerCase().includes("internal server")) {
                message = "Error del servidor. Intenta de nuevo más tarde.";
            } else if (message.toLowerCase().includes("network") || message.toLowerCase().includes("fetch")) {
                message = "Error de conexión. Verifica tu internet.";
            }

            if (showToast) {
                toast.error(message);
            }

            return message;
        },
        [defaultMessage, showToast]
    );

    const handleSuccess = useCallback((message: string) => {
        toast.success(message);
    }, []);

    const handleWithRetry = useCallback(
        async <T>(
            fn: () => Promise<T>,
            retries = 3,
            delay = 1000
        ): Promise<T> => {
            let lastError: unknown;

            for (let i = 0; i < retries; i++) {
                try {
                    return await fn();
                } catch (error) {
                    lastError = error;
                    if (i < retries - 1) {
                        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
                    }
                }
            }

            throw lastError;
        },
        []
    );

    return {
        handleError,
        handleSuccess,
        handleWithRetry,
    };
}
