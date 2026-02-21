"use client";

import { cn } from "@/lib/utils";
import { Building2, Home, TreePine } from "lucide-react";

export type TrainingPlace = "GYM" | "HOME" | "OUTDOOR";

interface TrainingPlaceSelectorProps {
    value?: TrainingPlace;
    onChange: (place: TrainingPlace) => void;
    disabled?: boolean;
}

const options: { value: TrainingPlace; label: string; description: string; icon: typeof Building2 }[] = [
    {
        value: "GYM",
        label: "Gimnasio",
        description: "Acceso a equipos completos",
        icon: Building2,
    },
    {
        value: "HOME",
        label: "Casa",
        description: "Equipamiento limitado",
        icon: Home,
    },
    {
        value: "OUTDOOR",
        label: "Aire Libre",
        description: "Sin equipamiento fijo",
        icon: TreePine,
    },
];

export function TrainingPlaceSelector({
    value,
    onChange,
    disabled = false,
}: TrainingPlaceSelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {options.map((option) => {
                const Icon = option.icon;
                const isSelected = value === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => !disabled && onChange(option.value)}
                        disabled={disabled}
                        className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                            "hover:border-primary/50 hover:bg-primary/5",
                            isSelected
                                ? "border-primary bg-primary/10"
                                : "border-muted bg-background",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Icon
                            className={cn(
                                "h-8 w-8",
                                isSelected ? "text-primary" : "text-muted-foreground"
                            )}
                        />
                        <div className="text-center">
                            <p
                                className={cn(
                                    "font-medium",
                                    isSelected ? "text-primary" : "text-foreground"
                                )}
                            >
                                {option.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {option.description}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
