"use client";

import { useWizardStore } from "@/store/wizard-store";
import { StepPersonalData } from "@/components/wizard/steps/StepPersonalData";
import { StepObjectives } from "@/components/wizard/steps/StepObjectives";
import { StepPathologies } from "@/components/wizard/steps/StepPathologies";
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
                return <StepPathologies />;
            case 3:
                return <StepPhysicalAssessment />;
            case 4:
                return <StepBioimpedance />;
            case 5:
                return <StepPhotos />;
            case 6:
                return <StepAvailability />;
            case 7:
                return <StepReview />;
            default:
                return <StepPersonalData />;
        }
    };

    return <>{renderStep()}</>;
}
