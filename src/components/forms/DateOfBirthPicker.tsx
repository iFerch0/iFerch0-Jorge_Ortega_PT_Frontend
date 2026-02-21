"use client";

import { Input } from "@/components/ui/input";
import { Calendar, AlertCircle } from "lucide-react";
import { useMemo } from "react";

interface DateOfBirthPickerProps {
    value?: string;
    onChange: (date: string) => void;
    disabled?: boolean;
    minYear?: number;
    maxYear?: number;
    showAge?: boolean;
    error?: string;
}

export function DateOfBirthPicker({
    value,
    onChange,
    disabled = false,
    minYear = 1920,
    maxYear,
    showAge = true,
    error,
}: DateOfBirthPickerProps) {
    const today = new Date();
    const effectiveMaxYear = maxYear || today.getFullYear();
    const maxDate = today.toISOString().split("T")[0];
    const minDate = `${minYear}-01-01`;

    const age = useMemo(() => {
        if (!value) return null;
        const birth = new Date(value);
        if (isNaN(birth.getTime())) return null;

        let years = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            years--;
        }
        return years >= 0 ? years : null;
    }, [value, today]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
    };

    const isValid = useMemo(() => {
        if (!value) return true;
        const date = new Date(value);
        if (isNaN(date.getTime())) return false;
        if (date > today) return false;
        if (date.getFullYear() < minYear) return false;
        if (date.getFullYear() > effectiveMaxYear) return false;
        return true;
    }, [value, today, minYear, effectiveMaxYear]);

    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    type="date"
                    value={value || ""}
                    onChange={handleChange}
                    disabled={disabled}
                    min={minDate}
                    max={maxDate}
                    className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between text-sm">
                {showAge && age !== null && isValid && (
                    <span className="text-muted-foreground">
                        {age} años
                    </span>
                )}
                {!isValid && (
                    <span className="text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Fecha inválida
                    </span>
                )}
                {error && (
                    <span className="text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {error}
                    </span>
                )}
            </div>
        </div>
    );
}
