import * as z from "zod";

// Schema for consent scopes
export const consentScopesSchema = z.object({
    dataTreatment: z.boolean().refine((val) => val === true, {
        message: "Debes aceptar el tratamiento de datos para continuar",
    }),
    photos: z.boolean().optional(),
    sensitiveHealthData: z.boolean().optional(),
});

// Schema for accepting consent
export const acceptConsentSchema = z.object({
    policyVersion: z.string().min(1, "Versión de política requerida"),
    scopes: consentScopesSchema,
});

export type AcceptConsentInput = z.infer<typeof acceptConsentSchema>;
export type ConsentScopes = z.infer<typeof consentScopesSchema>;

// Current policy version - should match backend CURRENT_POLICY_VERSION
export const CURRENT_POLICY_VERSION = "2026-02-14";
