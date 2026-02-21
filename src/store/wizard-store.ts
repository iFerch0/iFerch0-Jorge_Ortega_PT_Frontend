import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    WizardData,
    PersonalData,
    Objectives,
    Pathologies,
    PhysicalAssessment,
    Bioimpedance,
    Availability,
} from "@/lib/validators/wizard-schema";

export type WizardPhotos = { front?: File; side?: File; back?: File };
export type BioimpedanceTicket = File | null;

interface WizardState {
    currentStep: number;
    data: Partial<WizardData>;
    photos: WizardPhotos;
    bioimpedanceTicket: BioimpedanceTicket;
    setPersonalData: (data: PersonalData) => void;
    setObjectives: (data: Objectives) => void;
    setPathologies: (data: Pathologies) => void;
    setPhysicalAssessment: (data: PhysicalAssessment) => void;
    setBioimpedance: (data: Bioimpedance) => void;
    setAvailability: (data: Availability) => void;
    setPhotos: (photos: WizardPhotos) => void;
    setBioimpedanceTicket: (ticket: BioimpedanceTicket) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetWizard: () => void;
    setStep: (step: number) => void;
}

const initialState: Partial<WizardData> = {
    personalData: undefined,
    objectives: undefined,
    pathologies: undefined,
    physicalAssessment: undefined,
    bioimpedance: undefined,
    availability: undefined,
};

export const useWizardStore = create<WizardState>()(
    persist(
        (set) => ({
            currentStep: 0,
            data: initialState,
            photos: {},
            bioimpedanceTicket: null,
            setPersonalData: (personalData) =>
                set((state) => ({ data: { ...state.data, personalData } })),
            setObjectives: (objectives) =>
                set((state) => ({ data: { ...state.data, objectives } })),
            setPathologies: (pathologies) =>
                set((state) => ({ data: { ...state.data, pathologies } })),
            setPhysicalAssessment: (physicalAssessment) =>
                set((state) => ({ data: { ...state.data, physicalAssessment } })),
            setBioimpedance: (bioimpedance) =>
                set((state) => ({ data: { ...state.data, bioimpedance } })),
            setAvailability: (availability) =>
                set((state) => ({ data: { ...state.data, availability } })),
            setPhotos: (photos) => set({ photos }),
            setBioimpedanceTicket: (bioimpedanceTicket) => set({ bioimpedanceTicket }),

            nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
            prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
            setStep: (step) => set({ currentStep: step }),
            resetWizard: () => set({ currentStep: 0, data: initialState, photos: {}, bioimpedanceTicket: null }),
        }),
        {
            name: "wizard-storage",
            partialize: (state) => ({ currentStep: state.currentStep, data: state.data }),
        }
    )
);
