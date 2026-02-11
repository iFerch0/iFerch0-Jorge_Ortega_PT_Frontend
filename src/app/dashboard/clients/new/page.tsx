"use client";

import { useWizardStore } from "@/store/wizard-store";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { StepPersonalData } from "@/components/wizard/steps/StepPersonalData";
import { StepObjectives } from "@/components/wizard/steps/StepObjectives";
import { StepPhysicalAssessment } from "@/components/wizard/steps/StepPhysicalAssessment";
import { StepBioimpedance } from "@/components/wizard/steps/StepBioimpedance";
import { StepPhotos } from "@/components/wizard/steps/StepPhotos";
import { StepAvailability } from "@/components/wizard/steps/StepAvailability";
import { StepReview } from "@/components/wizard/steps/StepReview";

export default function NewClientPage() {
    const { currentStep } = useWizardStore();

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <StepPersonalData />;
            case 1:
                return <StepObjectives />;
            case 2:
                return <StepPhysicalAssessment />;
            case 3:
                return <StepBioimpedance />;
            case 4:
                return <StepPhotos />;
            case 5:
                return <StepAvailability />;
            case 6:
                return <StepReview />;
            default:
                return <StepPersonalData />;
        }
    };

    return <>{renderStep()}</>;
}
