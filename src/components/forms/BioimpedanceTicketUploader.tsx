"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileImage, Trash2, Upload, Loader2, CheckCircle } from "lucide-react";

interface BioimpedanceTicketUploaderProps {
    value?: File | null;
    existingUrl?: string | null;
    onChange: (file: File | null) => void;
    onUpload?: (file: File) => Promise<void>;
    disabled?: boolean;
    uploading?: boolean;
}

export function BioimpedanceTicketUploader({
    value,
    existingUrl,
    onChange,
    onUpload,
    disabled = false,
    uploading = false,
}: BioimpedanceTicketUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileSelect = useCallback(
        (file: File | null) => {
            if (file) {
                const url = URL.createObjectURL(file);
                setPreview(url);
                setUploadSuccess(false);
            } else {
                setPreview(null);
            }
            onChange(file);
        },
        [onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                handleFileSelect(file);
            }
        },
        [handleFileSelect]
    );

    const handleUpload = async () => {
        if (!value || !onUpload) return;
        try {
            await onUpload(value);
            setUploadSuccess(true);
        } catch {
            // Error handled by parent
        }
    };

    const imageSrc = preview || existingUrl;
    const hasNewFile = !!value;

    return (
        <div className="space-y-3">
            <div
                className={cn(
                    "relative rounded-lg border-2 border-dashed",
                    "flex flex-col items-center justify-center overflow-hidden",
                    "transition-colors min-h-[200px]",
                    disabled || uploading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-primary hover:bg-primary/5 cursor-pointer",
                    imageSrc ? "border-primary" : "border-muted"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => !disabled && !uploading && handleDrop(e)}
            >
                {imageSrc ? (
                    <div className="relative w-full h-[200px]">
                        <Image
                            src={imageSrc}
                            alt="Ticket de bioimpedancia"
                            fill
                            className="object-contain"
                        />
                        {!disabled && !uploading && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFileSelect(null);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        {uploadSuccess && (
                            <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                ) : (
                    <label
                        className={cn(
                            "flex flex-col items-center gap-3 p-6 cursor-pointer",
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
                                if (file) handleFileSelect(file);
                            }}
                        />
                        {uploading ? (
                            <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                        ) : (
                            <>
                                <FileImage className="h-12 w-12 text-muted-foreground" />
                                <div className="text-center">
                                    <p className="font-medium">Arrastra o haz clic para subir</p>
                                    <p className="text-sm text-muted-foreground">
                                        Ticket de bioimpedancia (imagen)
                                    </p>
                                </div>
                            </>
                        )}
                    </label>
                )}
            </div>

            {hasNewFile && onUpload && !uploadSuccess && (
                <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={disabled || uploading}
                    className="w-full"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Subiendo...
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4 mr-2" />
                            Subir ticket
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}
