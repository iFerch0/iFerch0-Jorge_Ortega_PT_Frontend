"use client";

import { useWizardStore } from "@/store/wizard-store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface WizardLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

const steps = [
    { id: 0, name: "Datos Personales" },
    { id: 1, name: "Objetivos" },
    { id: 2, name: "Condiciones" },
    { id: 3, name: "Disponibilidad" },
    { id: 4, name: "Fotos" },
    { id: 5, name: "Bioimpedancia" },
    { id: 6, name: "Resumen" },
];

export function WizardLayout({ children, title, description }: WizardLayoutProps) {
    const { currentStep } = useWizardStore();

    const stepNumber = String(currentStep + 1).padStart(2, "0");
    const totalSteps = String(steps.length).padStart(2, "0");

    return (
        <div className="mx-auto max-w-2xl px-1">
            {/* ── Header ── */}
            <div className="mb-10">
                {/* Thin animated progress track */}
                <div className="h-px w-full bg-border rounded-full overflow-hidden mb-7">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    />
                </div>

                {/* Step meta row */}
                <div className="flex items-start justify-between gap-4">
                    {/* Title block with decorative number */}
                    <div className="relative flex-1 min-w-0">
                        {/* Ghost number */}
                        <span
                            className="absolute -top-5 -left-1 font-display text-8xl font-bold leading-none select-none pointer-events-none"
                            style={{ color: "var(--primary)", opacity: 0.06 }}
                            aria-hidden="true"
                        >
                            {stepNumber}
                        </span>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="relative"
                            >
                                <h2 className="font-display text-2xl font-bold tracking-tight leading-tight">
                                    {title}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1 leading-snug">
                                    {description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Step counter */}
                    <span className="text-xs font-mono text-muted-foreground tabular-nums shrink-0 pt-1">
                        {stepNumber}&thinsp;/&thinsp;{totalSteps}
                    </span>
                </div>

                {/* Segmented dots */}
                <div className="flex gap-1 mt-5">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.id}
                            className={cn(
                                "h-1 rounded-full",
                                i < currentStep
                                    ? "bg-primary"
                                    : i === currentStep
                                        ? "bg-primary"
                                        : "bg-border"
                            )}
                            animate={{
                                flexGrow: i === currentStep ? 2.5 : 1,
                            }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            style={{ minWidth: 0 }}
                        />
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
