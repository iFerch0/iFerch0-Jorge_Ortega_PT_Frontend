"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, HeartPulse, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Pathology {
    id?: string;
    name: string;
    severity?: "Low" | "Medium" | "High";
    notes?: string;
}

interface PathologiesEditorProps {
    value: Pathology[];
    onChange: (pathologies: Pathology[]) => void;
    disabled?: boolean;
    maxItems?: number;
}

const severityOptions = [
    { value: "Low", label: "Leve", color: "text-green-600" },
    { value: "Medium", label: "Moderada", color: "text-amber-600" },
    { value: "High", label: "Severa", color: "text-red-600" },
];

export function PathologiesEditor({
    value,
    onChange,
    disabled = false,
    maxItems = 10,
}: PathologiesEditorProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleAdd = () => {
        if (value.length >= maxItems) return;
        const newIndex = value.length;
        onChange([...value, { name: "", severity: "Low", notes: "" }]);
        setExpandedIndex(newIndex);
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
        if (expandedIndex === index) setExpandedIndex(null);
    };

    const handleChange = (index: number, field: keyof Pathology, fieldValue: string) => {
        const updated = [...value];
        updated[index] = { ...updated[index], [field]: fieldValue };
        onChange(updated);
    };

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="space-y-3">
            {value.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">
                    No hay condiciones de salud registradas.
                </p>
            )}

            {value.map((pathology, index) => (
                <div
                    key={pathology.id || index}
                    className="border rounded-lg p-3 space-y-3"
                >
                    <div className="flex items-center gap-2">
                        <HeartPulse className="h-4 w-4 text-primary flex-shrink-0" />
                        <Input
                            value={pathology.name}
                            onChange={(e) => handleChange(index, "name", e.target.value)}
                            placeholder="Nombre de la condición"
                            disabled={disabled}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleExpand(index)}
                            className="flex-shrink-0"
                        >
                            {expandedIndex === index ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(index)}
                            disabled={disabled}
                            className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {expandedIndex === index && (
                        <div className="pl-6 space-y-3">
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block">
                                    Severidad
                                </label>
                                <Select
                                    value={pathology.severity || "Low"}
                                    onValueChange={(val) => handleChange(index, "severity", val)}
                                    disabled={disabled}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {severityOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                <span className={cn(opt.color)}>{opt.label}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block">
                                    Notas adicionales
                                </label>
                                <Textarea
                                    value={pathology.notes || ""}
                                    onChange={(e) => handleChange(index, "notes", e.target.value)}
                                    placeholder="Medicamentos, restricciones, etc."
                                    disabled={disabled}
                                    rows={2}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {value.length < maxItems && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAdd}
                    disabled={disabled}
                    className="w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar condición de salud
                </Button>
            )}
        </div>
    );
}
