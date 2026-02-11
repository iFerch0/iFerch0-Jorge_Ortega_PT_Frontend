"use client";

import { useDropzone } from "react-dropzone";
import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

import { WizardLayout } from "../WizardLayout";

export function StepPhotos() {
    const { setPhotos, nextStep, prevStep } = useWizardStore();
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
        const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".png", ".jpg"],
        },
        maxFiles: 3,
    });

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const handleNext = () => {
        setPhotos(files);
        nextStep();
    };

    return (
        <WizardLayout
            title="Registro Fotográfico"
            description="Sube 3 fotos: Frente, Perfil y Espalda (Opcional pero recomendado)."
        >
            <div className="space-y-6">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragActive
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/25 hover:border-primary/50"
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full bg-muted p-4">
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">
                            {isDragActive
                                ? "Suelta las fotos aquí..."
                                : "Arrastra tus fotos o haz clic para seleccionar"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            JPG, PNG (Max 5MB cada una)
                        </p>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        {previews.map((src, index) => (
                            <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                                <Image
                                    src={src}
                                    alt={`Preview ${index}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                                    type="button"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>
                        Atrás
                    </Button>
                    <Button onClick={handleNext}>
                        {files.length === 0 ? "Saltar este paso" : "Siguiente"}
                    </Button>
                </div>
            </div>
        </WizardLayout>
    );
}
