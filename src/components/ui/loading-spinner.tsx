"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
    fullPage?: boolean;
}

const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
};

export function LoadingSpinner({
    size = "md",
    text,
    className,
    fullPage = false,
}: LoadingSpinnerProps) {
    const content = (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-2",
                fullPage && "min-h-[50vh]",
                className
            )}
            role="status"
            aria-label={text || "Cargando..."}
        >
            <Loader2
                className={cn("animate-spin text-muted-foreground", sizeClasses[size])}
                aria-hidden="true"
            />
            {text && (
                <p className="text-sm text-muted-foreground">{text}</p>
            )}
            <span className="sr-only">{text || "Cargando..."}</span>
        </div>
    );

    return content;
}
