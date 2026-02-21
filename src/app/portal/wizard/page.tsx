"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/wizard-store";
import { toast } from "sonner";
import { me } from "@/lib/api";

import { StepPersonalData } from "@/components/wizard/steps/StepPersonalData";
import { StepObjectives } from "@/components/wizard/steps/StepObjectives";
import { StepPathologies } from "@/components/wizard/steps/StepPathologies";
import { StepAvailability } from "@/components/wizard/steps/StepAvailability";
import { StepPhotos } from "@/components/wizard/steps/StepPhotos";
import { StepBioimpedance } from "@/components/wizard/steps/StepBioimpedance";
import { PortalWizardReview } from "@/components/portal";

const WIZARD_STEPS = [
    { component: StepPersonalData, label: "Datos Personales" },
    { component: StepObjectives, label: "Objetivos" },
    { component: StepPathologies, label: "Condiciones de Salud" },
    { component: StepAvailability, label: "Disponibilidad" },
    { component: StepPhotos, label: "Fotos" },
    { component: StepBioimpedance, label: "Bioimpedancia" },
    { component: PortalWizardReview, label: "Revisión" },
];

export default function PortalWizardPage() {
    const router = useRouter();
    const { currentStep, resetWizard, setPersonalData, data } = useWizardStore();

    // Prefill wizard with existing profile data on first load
    useEffect(() => {
        async function loadProfile() {
            try {
                const profile = await me.getProfile();
                // Only prefill if Step 1 hasn't been filled yet
                if (!data.personalData?.firstName) {
                    setPersonalData({
                        firstName: profile.firstName || "",
                        lastName: profile.lastName || "",
                        cedula: profile.cedula || "",
                        email: profile.email || "",
                        phone: profile.phone || "",
                        birthDate: profile.birthDate
                            ? new Date(profile.birthDate).toISOString().split("T")[0]
                            : "",
                        gender: (profile.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
                        height: profile.height || 0,
                        weight: 0,
                    });
                }
            } catch {
                // Ignore - user may be new
            }
        }
        loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const CurrentStepComponent = WIZARD_STEPS[currentStep]?.component || StepPersonalData;

    return (
        <div className="py-4">
            <CurrentStepComponent />
        </div>
    );
}
