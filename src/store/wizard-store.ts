import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    WizardData,
    PersonalData,
    Objectives,
    PhysicalAssessment,
    Availability,
} from "@/lib/validators/wizard-schema";

interface WizardState {
    currentStep: number;
    data: Partial<WizardData>;
    setPersonalData: (data: PersonalData) => void;
    setObjectives: (data: Objectives) => void;
    setPhysicalAssessment: (data: PhysicalAssessment) => void;
    setAvailability: (data: Availability) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetWizard: () => void;
    setStep: (step: number) => void;
}

const initialState: Partial<WizardData> = {
    personalData: undefined,
    objectives: undefined,
    physicalAssessment: undefined,
    availability: undefined,
};

export const useWizardStore = create<WizardState>()(
    persist(
        (set) => ({
            currentStep: 0,
            data: initialState,
            setPersonalData: (personalData) =>
                set((state) => ({ data: { ...state.data, personalData } })),
            setObjectives: (objectives) =>
                set((state) => ({ data: { ...state.data, objectives } })),
            setPhysicalAssessment: (physicalAssessment) =>
                set((state) => ({ data: { ...state.data, physicalAssessment } })),
            setAvailability: (availability) =>
                set((state) => ({ data: { ...state.data, availability } })),
            nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
            prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
            setStep: (step) => set({ currentStep: step }),
            resetWizard: () => set({ currentStep: 0, data: initialState }),
        }),
        {
            name: "wizard-storage",
        }
    )
);
