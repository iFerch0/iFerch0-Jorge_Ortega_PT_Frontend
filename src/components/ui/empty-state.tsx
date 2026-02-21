"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, FileQuestion, AlertCircle, Inbox, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    variant?: "default" | "error" | "search" | "inbox";
    className?: string;
}

const variantConfig = {
    default: { icon: FileQuestion, color: "text-muted-foreground" },
    error: { icon: AlertCircle, color: "text-destructive" },
    search: { icon: SearchX, color: "text-muted-foreground" },
    inbox: { icon: Inbox, color: "text-muted-foreground" },
};

export function EmptyState({
    icon,
    title,
    description,
    action,
    variant = "default",
    className,
}: EmptyStateProps) {
    const config = variantConfig[variant];
    const Icon = icon || config.icon;

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-12 px-4 text-center",
                className
            )}
            role="status"
            aria-label={title}
        >
            <div
                className={cn(
                    "mb-4 rounded-full bg-muted p-4",
                    variant === "error" && "bg-destructive/10"
                )}
            >
                <Icon className={cn("h-8 w-8", config.color)} aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                    {description}
                </p>
            )}
            {action && (
                <Button onClick={action.onClick} className="mt-4" variant="outline">
                    {action.label}
                </Button>
            )}
        </div>
    );
}
