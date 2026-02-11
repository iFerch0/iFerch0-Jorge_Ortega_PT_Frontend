"use client";

import { useWizardStore } from "@/store/wizard-store";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface WizardLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

const steps = [
    { id: 0, name: "Datos Personales" },
    { id: 1, name: "Objetivos" },
    { id: 2, name: "Valoración" },
    { id: 3, name: "Bioimpedancia" },
    { id: 4, name: "Fotos" },
    { id: 5, name: "Disponibilidad" },
    { id: 6, name: "Resumen" },
];

export function WizardLayout({
    children,
    title,
    description,
}: WizardLayoutProps) {
    const { currentStep } = useWizardStore();

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
            {/* Progress Bar */}
            <div className="mb-8 md:mb-12">
                <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                        const isCompleted = currentStep > index;
                        const isCurrent = currentStep === index;

                        return (
                            <div
                                key={step.id}
                                className="flex flex-col items-center relative z-10"
                            >
                                <div
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-colors duration-300 md:h-10 md:w-10",
                                        isCompleted
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : isCurrent
                                                ? "border-primary text-primary"
                                                : "border-muted text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-4 w-4 md:h-5 md:w-5" />
                                    ) : (
                                        <span className="text-xs font-semibold md:text-sm">
                                            {index + 1}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "absolute -bottom-6 w-32 text-center text-[10px] font-medium transition-colors duration-300 md:text-xs",
                                        isCurrent ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {step.name}
                                </span>
                            </div>
                        );
                    })}
                    {/* Progress Line */}
                    <div className="absolute top-4 md:top-5 left-0 -z-0 h-[2px] w-full bg-muted">
                        <div
                            className="h-full bg-primary transition-all duration-300 ease-in-out"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
