import * as z from "zod";

export const personalDataSchema = z.object({
    firstName: z.string().min(2, "El nombre es requerido"),
    lastName: z.string().min(2, "El apellido es requerido"),
    cedula: z.string().min(5, "La cédula es requerida"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phone: z.string().min(10, "Teléfono inválido"),
    age: z.coerce.number().min(10, "Edad inválida").max(100),
    gender: z.enum(["male", "female", "other"]),
    height: z.coerce.number().min(100, "Altura en cm requerida"),
    weight: z.coerce.number().min(30, "Peso en kg requerido"),
});

export const objectivesSchema = z.object({
    goal: z.enum(["lose_weight", "gain_muscle", "maintain", "improve_endurance"]),
    experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
    activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
    notes: z.string().optional(),
});

export const physicalAssessmentSchema = z.object({
    injuries: z.string().optional(),
    medicalConditions: z.string().optional(),
    medications: z.string().optional(),
    // Photos will be handled separately as File objects or URLs in the store
});

export const availabilitySchema = z.object({
    trainingDays: z.array(z.string()).min(1, "Selecciona al menos un día"),
    trainingDuration: z.enum(["30_min", "45_min", "60_min", "90_min_plus"]),
    equipment: z.array(z.string()).min(1, "Selecciona el equipo disponible"),
});

// Bioimpedancia Schema (Paso 4)
// Bioimpedance Schema (Paso 4)
export const bioimpedanceSchema = z.object({
    weight: z.coerce.number().min(30, "Peso requerido"),
    bmi: z.coerce.number().optional().nullable(),
    bodyFat: z.coerce.number().min(1, "% Grasa requerido").max(60).optional().nullable(),
    muscleMass: z.coerce.number().min(10, "Masa Muscular requerida").max(100).optional().nullable(),
    visceralFat: z.coerce.number().min(1, "Grasa visceral requerida").max(30).optional().nullable(),
    bodyWater: z.coerce.number().min(20, "Agua corporal requerida").max(100).optional().nullable(),
    skeletalMuscleMass: z.coerce.number().min(10, "Masa esquelética requerida").optional().nullable(),
    basalMetabolism: z.coerce.number().min(500, "Metabolismo basal requerido").optional().nullable(),
    bioimpedanceImage: z.any().optional(),
});

export const wizardSchema = z.object({
    personalData: personalDataSchema,
    objectives: objectivesSchema,
    physicalAssessment: physicalAssessmentSchema,
    bioimpedance: bioimpedanceSchema,
    availability: availabilitySchema,
});

export type PersonalData = z.infer<typeof personalDataSchema>;
export type Objectives = z.infer<typeof objectivesSchema>;
export type PhysicalAssessment = z.infer<typeof physicalAssessmentSchema>;
export type Bioimpedance = z.infer<typeof bioimpedanceSchema>;
export type Availability = z.infer<typeof availabilitySchema>;
export type WizardData = z.infer<typeof wizardSchema>;
