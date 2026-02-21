"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Target } from "lucide-react";

export interface Objective {
    id?: string;
    content: string;
}

interface ObjectivesEditorProps {
    value: Objective[];
    onChange: (objectives: Objective[]) => void;
    disabled?: boolean;
    maxItems?: number;
    placeholder?: string;
}

export function ObjectivesEditor({
    value,
    onChange,
    disabled = false,
    maxItems = 10,
    placeholder = "Ej: Bajar de peso, ganar masa muscular...",
}: ObjectivesEditorProps) {
    const handleAdd = () => {
        if (value.length >= maxItems) return;
        onChange([...value, { content: "" }]);
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, content: string) => {
        const updated = [...value];
        updated[index] = { ...updated[index], content };
        onChange(updated);
    };

    return (
        <div className="space-y-3">
            {value.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">
                    No hay objetivos definidos. Agrega uno para comenzar.
                </p>
            )}

            {value.map((obj, index) => (
                <div key={obj.id || index} className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                        <Target className="h-4 w-4 text-primary" />
                    </div>
                    <Input
                        value={obj.content}
                        onChange={(e) => handleChange(index, e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="flex-1"
                    />
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
                    Agregar objetivo
                </Button>
            )}
        </div>
    );
}
