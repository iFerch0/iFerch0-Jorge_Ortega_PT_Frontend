"use client";

import { useThemeColor } from "@/providers/ThemeProvider";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const colors = [
    { name: "amber", label: "Amber (Default)", value: "#D4A03D" },
    { name: "teal", label: "Teal", value: "#14B8A6" },
    { name: "rose", label: "Rosa", value: "#E11D48" },
    { name: "blue", label: "Azul", value: "#3B82F6" },
    { name: "emerald", label: "Esmeralda", value: "#10B981" },
] as const;

export function ThemeCustomizer() {
    const { themeColor, setThemeColor } = useThemeColor();
    const { theme, setTheme } = useTheme();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>
                    Personaliza el color y el modo de la aplicación.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Dark/Light Mode Toggle */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Modo</p>
                    <div className="flex gap-2">
                        <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("dark")}
                        >
                            <Moon className="mr-2 h-4 w-4" />
                            Oscuro
                        </Button>
                        <Button
                            variant={theme === "light" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("light")}
                        >
                            <Sun className="mr-2 h-4 w-4" />
                            Claro
                        </Button>
                    </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Color principal</p>
                    <div className="flex flex-wrap gap-4">
                        {colors.map((color) => {
                            const isSelected = themeColor === color.name;
                            return (
                                <Button
                                    key={color.name}
                                    variant="outline"
                                    className={cn(
                                        "h-14 w-14 rounded-full p-1 border-2 relative overflow-hidden",
                                        isSelected ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-transparent"
                                    )}
                                    onClick={() => setThemeColor(color.name as typeof themeColor)}
                                >
                                    <div
                                        className="h-full w-full rounded-full"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    <span className="sr-only">{color.label}</span>
                                    {isSelected && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                            <Check className="h-6 w-6 text-white drop-shadow-md" />
                                        </div>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
