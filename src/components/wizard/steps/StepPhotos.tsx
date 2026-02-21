"use client";

import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { useWizardStore, type WizardPhotos } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { WizardLayout } from "../WizardLayout";
import { cn } from "@/lib/utils";

type SlotKey = keyof WizardPhotos;

interface PhotoSlotProps {
    label: string;
    slotKey: SlotKey;
    file: File | undefined;
    onDrop: (files: File[]) => void;
    onRemove: () => void;
    preview: string | null;
}

function PhotoSlot({ label, slotKey, file, onDrop, onRemove, preview }: PhotoSlotProps) {
    const opts: DropzoneOptions = {
        onDrop,
        accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
        maxFiles: 1,
        multiple: false,
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone(opts);

    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
            </span>

            {preview ? (
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-primary/30 shadow-sm">
                    <Image
                        src={preview}
                        alt={label}
                        fill
                        className="object-cover"
                    />
                    <button
                        onClick={onRemove}
                        className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-destructive"
                        type="button"
                        aria-label={`Eliminar foto ${label}`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent py-2 px-2">
                        <p className="text-[10px] text-white/80 text-center truncate">{file?.name}</p>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "aspect-[3/4] w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200",
                        isDragActive
                            ? "border-primary bg-primary/10 scale-[1.02]"
                            : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
                    )}
                >
                    <input {...getInputProps()} />

                    {/* Body silhouette placeholder */}
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
    { key: "side",  label: "Lateral" },
    { key: "back",  label: "Espalda" },
];

export function StepPhotos() {
    const { setPhotos, nextStep, prevStep } = useWizardStore();

    const [files, setFiles] = useState<WizardPhotos>({});
    const [previews, setPreviews] = useState<Record<SlotKey, string | null>>({
        front: null,
        side: null,
        back: null,
    });

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
        setFiles((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
        setPreviews((prev) => {
            if (prev[key]) URL.revokeObjectURL(prev[key]!);
            return { ...prev, [key]: null };
        });
    }, []);

    useEffect(() => {
        return () => {
            Object.values(previews).forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadedCount = Object.values(files).filter(Boolean).length;
    const hasAnyPhoto = uploadedCount > 0;

    const handleNext = () => {
        setPhotos(files);
        nextStep();
    };

    return (
        <WizardLayout
            title="Registro Fotográfico"
            description="Fotos de referencia para medir tu progreso. Puedes saltarte este paso."
        >
            <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                    {SLOTS.map(({ key, label }) => (
                        <PhotoSlot
                            key={key}
                            label={label}
                            slotKey={key}
                            file={files[key]}
                            preview={previews[key]}
                            onDrop={(accepted) => handleDrop(key, accepted)}
                            onRemove={() => handleRemove(key)}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>JPG, PNG o WebP · Máx 5 MB c/u</span>
                    {hasAnyPhoto && (
                        <span className="text-primary font-medium">
                            {uploadedCount} / 3 subidas
                        </span>
                    )}
                </div>

                <div className="flex justify-between pt-2">
                    <Button type="button" variant="ghost" onClick={prevStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Atrás
                    </Button>
                    <Button onClick={handleNext} size="lg" className="min-w-[160px]">
                        {hasAnyPhoto ? "Siguiente" : "Saltar este paso"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </WizardLayout>
    );
}
