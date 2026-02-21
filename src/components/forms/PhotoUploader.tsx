"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Camera, User, Trash2, Upload, Loader2 } from "lucide-react";

export interface PhotoFiles {
    front?: File;
    side?: File;
    back?: File;
}

export interface PhotoUrls {
    frontUrl?: string | null;
    sideUrl?: string | null;
    backUrl?: string | null;
}

interface PhotoUploaderProps {
    value?: PhotoFiles;
    onChange: (files: PhotoFiles) => void;
    existingPhotos?: PhotoUrls;
    disabled?: boolean;
    uploading?: boolean;
}

type PhotoType = "front" | "side" | "back";

const photoConfig: { type: PhotoType; label: string }[] = [
    { type: "front", label: "Frontal" },
    { type: "side", label: "Lateral" },
    { type: "back", label: "Espalda" },
];

export function PhotoUploader({
    value = {},
    onChange,
    existingPhotos,
    disabled = false,
    uploading = false,
}: PhotoUploaderProps) {
    const [previews, setPreviews] = useState<Record<PhotoType, string | null>>({
        front: null,
        side: null,
        back: null,
    });

    const handleFileSelect = useCallback(
        (type: PhotoType, file: File | null) => {
            if (file) {
                const url = URL.createObjectURL(file);
                setPreviews((prev) => ({ ...prev, [type]: url }));
                onChange({ ...value, [type]: file });
            } else {
                setPreviews((prev) => ({ ...prev, [type]: null }));
                const updated = { ...value };
                delete updated[type];
                onChange(updated);
            }
        },
        [value, onChange]
    );

    const handleDrop = useCallback(
        (type: PhotoType, e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                handleFileSelect(type, file);
            }
        },
        [handleFileSelect]
    );

    const getImageSrc = (type: PhotoType): string | null => {
        if (previews[type]) return previews[type];
        if (existingPhotos) {
            const key = `${type}Url` as keyof PhotoUrls;
            return existingPhotos[key] || null;
        }
        return null;
    };

    return (
        <div className="grid grid-cols-3 gap-3">
            {photoConfig.map(({ type, label }) => {
                const imageSrc = getImageSrc(type);
                const hasFile = !!value[type];

                return (
                    <div key={type} className="space-y-2">
                        <label className="text-sm font-medium text-center block">
                            {label}
                        </label>
                        <div
                            className={cn(
                                "relative aspect-[3/4] rounded-lg border-2 border-dashed",
                                "flex items-center justify-center overflow-hidden",
                                "transition-colors cursor-pointer",
                                disabled || uploading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:border-primary hover:bg-primary/5",
                                imageSrc ? "border-primary" : "border-muted"
                            )}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => !disabled && !uploading && handleDrop(type, e)}
                        >
                            {imageSrc ? (
                                <>
                                    <Image
                                        src={imageSrc}
                                        alt={label}
                                        fill
                                        className="object-cover"
                                    />
                                    {!disabled && !uploading && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFileSelect(type, null);
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <label
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 cursor-pointer",
                                        (disabled || uploading) && "pointer-events-none"
                                    )}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={disabled || uploading}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileSelect(type, file);
                                        }}
                                    />
                                    {uploading ? (
                                        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                                    ) : (
                                        <>
                                            <User className="h-8 w-8 text-muted-foreground" />
                                            <Camera className="h-4 w-4 text-muted-foreground" />
                                        </>
                                    )}
                                </label>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
