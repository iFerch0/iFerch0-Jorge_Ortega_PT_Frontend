"use client";

import { useWizardStore } from "@/store/wizard-store";
import StepPersonalData from "@/components/wizard/steps/StepPersonalData";
import StepObjectives from "@/components/wizard/steps/StepObjectives";
import StepPhysicalAssessment from "@/components/wizard/steps/StepPhysicalAssessment";
import StepAvailability from "@/components/wizard/steps/StepAvailability";
import StepReview from "@/components/wizard/steps/StepReview";
import { useEffect, useState } from "react";

export default function NewClientPage() {
    const { currentStep } = useWizardStore();
    const [isMounted, setIsMounted] = useState(false);

    // Prevent hydration mismatch for zustand persist
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <StepPersonalData />;
            case 1:
                return <StepObjectives />;
            case 2:
                return <StepPhysicalAssessment />;
            case 3:
                return <StepAvailability />;
            case 4:
                return <StepReview />;
            default:
                return <StepPersonalData />;
        }
    };

    return <div className="animate-in fade-in zoom-in duration-500">{renderStep()}</div>;
}
