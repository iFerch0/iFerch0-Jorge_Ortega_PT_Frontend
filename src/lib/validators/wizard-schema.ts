import * as z from "zod";

// Helper for birthDate validation
const birthDateSchema = z.string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine((val) => {
        const date = new Date(val);
        const now = new Date();
        return date < now;
    }, "La fecha no puede ser futura")
    .refine((val) => {
        const date = new Date(val);
        const minDate = new Date("1920-01-01");
        return date >= minDate;
    }, "Fecha fuera de rango válido");

export const personalDataSchema = z.object({
    firstName: z.string().min(2, "El nombre es requerido"),
    lastName: z.string().min(2, "El apellido es requerido"),
    cedula: z.string().min(5, "La cédula es requerida"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phone: z.string().min(10, "Teléfono inválido").optional().or(z.literal("")),
    birthDate: birthDateSchema,
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    height: z.coerce.number().min(100, "Altura en cm requerida").max(250),
    weight: z.coerce.number().min(30, "Peso en kg requerido").max(300),
});

// Objectives as editable array (new structure)
export const objectiveItemSchema = z.object({
    id: z.string().optional(),
    content: z.string().min(3, "El objetivo debe tener al menos 3 caracteres"),
});

export const objectivesSchema = z.object({
    objectives: z.array(objectiveItemSchema).min(1, "Agrega al menos un objetivo"),
    experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]).optional(),
    notes: z.string().optional(),
});

// Pathologies as editable array
export const pathologyItemSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "El nombre de la patología es requerido"),
    severity: z.enum(["Low", "Medium", "High"]).optional(),
    notes: z.string().optional(),
});

export const pathologiesSchema = z.object({
    pathologies: z.array(pathologyItemSchema).optional(),
    hasNoPathologies: z.boolean().optional(),
});

export const physicalAssessmentSchema = z.object({
    injuries: z.string().optional(),
    medicalConditions: z.string().optional(),
    medications: z.string().optional(),
    // Photos will be handled separately as File objects or URLs in the store
});

export const availabilitySchema = z.object({
    trainingPlace: z.enum(["GYM", "HOME", "OUTDOOR"]),
    trainingDays: z.array(z.string()).min(1, "Selecciona al menos un día"),
    trainingDuration: z.enum(["30_min", "45_min", "60_min", "90_min_plus"]),
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
    pathologies: pathologiesSchema,
    physicalAssessment: physicalAssessmentSchema,
    bioimpedance: bioimpedanceSchema,
    availability: availabilitySchema,
});

export type PersonalData = z.infer<typeof personalDataSchema>;
export type ObjectiveItem = z.infer<typeof objectiveItemSchema>;
export type Objectives = z.infer<typeof objectivesSchema>;
export type PathologyItem = z.infer<typeof pathologyItemSchema>;
export type Pathologies = z.infer<typeof pathologiesSchema>;
export type PhysicalAssessment = z.infer<typeof physicalAssessmentSchema>;
export type Bioimpedance = z.infer<typeof bioimpedanceSchema>;
export type Availability = z.infer<typeof availabilitySchema>;
export type WizardData = z.infer<typeof wizardSchema>;
