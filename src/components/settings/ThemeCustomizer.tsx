"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const colors = [
    { name: "blue", label: "Azul (Default)", class: "bg-blue-600", value: "#2563eb" },
    { name: "violet", label: "Violeta", class: "bg-violet-600", value: "#7c3aed" },
    { name: "rose", label: "Rosa", class: "bg-rose-600", value: "#e11d48" },
    { name: "orange", label: "Naranja", class: "bg-orange-600", value: "#ea580c" },
    { name: "green", label: "Verde", class: "bg-green-600", value: "#16a34a" },
] as const;

export function ThemeCustomizer() {
    const { themeColor, setThemeColor } = useTheme();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>
                    Personaliza el color principal de la aplicación para que coincida con tu marca.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    {colors.map((color) => {
                        // We need to compare specific enum values
                        const isSelected = themeColor === color.name;

                        return (
                            <Button
                                key={color.name}
                                variant="outline"
                                className={cn(
                                    "h-14 w-14 rounded-full p-1 border-2 relative overflow-hidden",
                                    isSelected ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent"
                                )}
                                onClick={() => setThemeColor(color.name as any)}
                            >
                                <div
                                    className={cn(
                                        "h-full w-full rounded-full",
                                    )}
                                    style={{ backgroundColor: color.value }}
                                />
                                <span className="sr-only">{color.label}</span>
                                {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                        <Check className="h-6 w-6 text-white drop-shadow-md" />
                                    </div>
                                )}
                            </Button>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
