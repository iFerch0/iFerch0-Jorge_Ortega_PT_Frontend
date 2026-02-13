"use client";

import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { useWizardStore, type WizardPhotos } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, User, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

import { WizardLayout } from "../WizardLayout";

type SlotKey = keyof WizardPhotos;

interface PhotoSlotProps {
    label: string;
    file: File | undefined;
    onDrop: (files: File[]) => void;
    onRemove: () => void;
    preview: string | null;
}

function PhotoSlot({ label, file, onDrop, onRemove, preview }: PhotoSlotProps) {
    const dropzoneOpts: DropzoneOptions = {
        onDrop,
        accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
        maxFiles: 1,
        multiple: false,
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOpts);

    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-foreground">{label}</span>

            {preview ? (
                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border">
                    <Image
                        src={preview}
                        alt={label}
                        fill
                        className="object-cover"
                    />
                    <button
                        onClick={onRemove}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors"
                        type="button"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`aspect-[3/4] w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors gap-3 ${
                        isDragActive
                            ? "border-primary bg-primary/10"
                            : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="rounded-full bg-muted p-3">
                        <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col items-center gap-1 px-2 text-center">
                        <UploadCloud className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                            {isDragActive ? "Suelta aquí" : "Arrastra o haz clic"}
                        </p>
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

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            Object.values(previews).forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasAnyPhoto = Object.values(files).some(Boolean);

    const handleNext = () => {
        setPhotos(files);
        nextStep();
    };

    return (
        <WizardLayout
            title="Registro Fotográfico"
            description="Sube hasta 3 fotos: Frontal, Lateral y Espalda (opcional pero recomendado)."
        >
            <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    {SLOTS.map(({ key, label }) => (
                        <PhotoSlot
                            key={key}
                            label={label}
                            file={files[key]}
                            preview={previews[key]}
                            onDrop={(accepted) => handleDrop(key, accepted)}
                            onRemove={() => handleRemove(key)}
                        />
                    ))}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    JPG, PNG o WebP — Max 5MB cada una
                </p>

                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Atrás
                    </Button>
                    <Button onClick={handleNext}>
                        {hasAnyPhoto ? "Siguiente" : "Saltar este paso"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </WizardLayout>
    );
}
