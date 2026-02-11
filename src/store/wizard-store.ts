import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    WizardData,
    PersonalData,
    Objectives,
    PhysicalAssessment,
    Bioimpedance,
    Availability,
} from "@/lib/validators/wizard-schema";

interface WizardState {
    currentStep: number;
    data: Partial<WizardData>;
    photos: File[];
    setPersonalData: (data: PersonalData) => void;
    setObjectives: (data: Objectives) => void;
    setPhysicalAssessment: (data: PhysicalAssessment) => void;
    setBioimpedance: (data: Bioimpedance) => void;
    setAvailability: (data: Availability) => void;
    setPhotos: (files: File[]) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetWizard: () => void;
    setStep: (step: number) => void;
}

const initialState: Partial<WizardData> = {
    personalData: undefined,
    objectives: undefined,
    physicalAssessment: undefined,
    bioimpedance: undefined,
    availability: undefined,
};

export const useWizardStore = create<WizardState>()(
    persist(
        (set) => ({
            currentStep: 0,
            data: initialState,
            photos: [],
            setPersonalData: (personalData) =>
                set((state) => ({ data: { ...state.data, personalData } })),
            setObjectives: (objectives) =>
                set((state) => ({ data: { ...state.data, objectives } })),
            setPhysicalAssessment: (physicalAssessment) =>
                set((state) => ({ data: { ...state.data, physicalAssessment } })),
            setBioimpedance: (bioimpedance) =>
                set((state) => ({ data: { ...state.data, bioimpedance } })),
            setAvailability: (availability) =>
                set((state) => ({ data: { ...state.data, availability } })),
            setPhotos: (files) => set({ photos: files }),

            nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
            prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
            setStep: (step) => set({ currentStep: step }),
            resetWizard: () => set({ currentStep: 0, data: initialState, photos: [] }),
        }),
        {
            name: "wizard-storage",
            partialize: (state) => ({ currentStep: state.currentStep, data: state.data }),
        }
    )
);
