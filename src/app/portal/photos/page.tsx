"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { me } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SlotKey = "front" | "side" | "back";

interface PhotoSlotProps {
    label: string;
    file: File | undefined;
    onDrop: (files: File[]) => void;
    onRemove: () => void;
    preview: string | null;
    disabled: boolean;
}

function PhotoSlot({ label, file, onDrop, onRemove, preview, disabled }: PhotoSlotProps) {
    const opts: DropzoneOptions = {
        onDrop,
        accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
        maxFiles: 1,
        multiple: false,
        disabled,
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone(opts);

    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
            </span>

            {preview ? (
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-primary/30 shadow-sm">
                    <Image src={preview} alt={label} fill className="object-cover" />
                    {!disabled && (
                        <button
                            onClick={onRemove}
                            className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-destructive"
                            type="button"
                            aria-label={`Eliminar foto ${label}`}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent py-2 px-2">
                        <p className="text-[10px] text-white/80 text-center truncate">{file?.name}</p>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "aspect-[3/4] w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-200",
                        disabled
                            ? "opacity-50 cursor-not-allowed"
                            : isDragActive
                                ? "border-primary bg-primary/10 scale-[1.02] cursor-pointer"
                                : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40 cursor-pointer"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className={cn(
                        "flex flex-col items-center gap-2 transition-colors",
                        isDragActive ? "text-primary" : "text-muted-foreground"
                    )}>
                        <svg
                            viewBox="0 0 40 80"
                            className="h-12 w-6 opacity-20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <circle cx="20" cy="8" r="8" />
                            <path d="M10 20 Q8 40 10 60 L14 60 L14 40 L20 40 L26 40 L26 60 L30 60 Q32 40 30 20 Q26 16 20 16 Q14 16 10 20Z" />
                        </svg>
                        <div className="flex flex-col items-center gap-1">
                            <UploadCloud className="h-4 w-4" />
                            <p className="text-[10px] text-center px-1 leading-tight">
                                {isDragActive ? "Suelta aquí" : "Arrastra o toca"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const SLOTS: { key: SlotKey; label: string }[] = [
    { key: "front", label: "Frontal" },
    { key: "side", label: "Lateral" },
    { key: "back", label: "Espalda" },
];

const TIPS = [
    "Usa ropa ajustada para mejor visibilidad",
    "Buena iluminación, sin sombras directas",
    "Postura natural y relajada",
    "Mismo fondo y posición cada vez",
];

export default function PortalPhotosPage() {
    const [files, setFiles] = useState<Record<SlotKey, File | undefined>>({
        front: undefined, side: undefined, back: undefined,
    });
    const [previews, setPreviews] = useState<Record<SlotKey, string | null>>({
        front: null, side: null, back: null,
    });
    const [uploading, setUploading] = useState(false);

    const handleDrop = useCallback((key: SlotKey, accepted: File[]) => {
        const file = accepted[0];
        if (!file) return;
        setFiles((prev) => ({ ...prev, [key]: file }));
        setPreviews((prev) => {
            if (prev[key]) URL.revokeObjectURL(prev[key]!);
            return { ...prev, [key]: URL.createObjectURL(file) };
        });
    }, []);

    const handleRemove = useCallback((key: SlotKey) => {
        setFiles((prev) => ({ ...prev, [key]: undefined }));
        setPreviews((prev) => {
            if (prev[key]) URL.revokeObjectURL(prev[key]!);
            return { ...prev, [key]: null };
        });
    }, []);

    useEffect(() => {
        return () => {
            Object.values(previews).forEach((url) => { if (url) URL.revokeObjectURL(url); });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadedCount = Object.values(files).filter(Boolean).length;
    const hasAnyPhoto = uploadedCount > 0;

    const handleUpload = async () => {
        if (!hasAnyPhoto) return;
        setUploading(true);
        try {
            await me.uploadPhotos({ front: files.front, back: files.back, side: files.side });
            toast.success("Fotos subidas correctamente");
            setFiles({ front: undefined, side: undefined, back: undefined });
            Object.values(previews).forEach((url) => { if (url) URL.revokeObjectURL(url); });
            setPreviews({ front: null, side: null, back: null });
        } catch (error) {
            toast.error("Error al subir las fotos");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const clearAll = () => {
        Object.values(previews).forEach((url) => { if (url) URL.revokeObjectURL(url); });
        setFiles({ front: undefined, side: undefined, back: undefined });
        setPreviews({ front: null, side: null, back: null });
    };

    return (
        <div className="space-y-6">
            <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Progreso visual
                </span>
                <h1 className="font-display text-2xl font-bold tracking-tight mt-0.5">
                    Registro Fotográfico
                </h1>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    {SLOTS.map(({ key, label }) => (
                        <PhotoSlot
                            key={key}
                            label={label}
                            file={files[key]}
                            preview={previews[key]}
                            onDrop={(accepted) => handleDrop(key, accepted)}
                            onRemove={() => handleRemove(key)}
                            disabled={uploading}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>JPG, PNG o WebP · Máx 5 MB c/u</span>
                    {hasAnyPhoto && (
                        <span className="text-primary font-medium">{uploadedCount} / 3 subidas</span>
                    )}
                </div>

                <p className="text-[10px] text-muted-foreground text-center">
                    Las fotos son confidenciales. Solo tu entrenador puede verlas.
                </p>

                <div className="flex gap-3">
                    {hasAnyPhoto && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearAll}
                            disabled={uploading}
                        >
                            Limpiar
                        </Button>
                    )}
                    <Button
                        onClick={handleUpload}
                        disabled={!hasAnyPhoto || uploading}
                        className="flex-1"
                    >
                        {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <UploadCloud className="h-4 w-4 mr-2" />
                                Subir Fotos
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Tips */}
            <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 block">
                    Consejos
                </span>
                <div className="rounded-2xl border bg-card px-4 py-3 space-y-2.5">
                    {TIPS.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <span className="text-primary mt-0.5 shrink-0">·</span>
                            <span>{tip}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
