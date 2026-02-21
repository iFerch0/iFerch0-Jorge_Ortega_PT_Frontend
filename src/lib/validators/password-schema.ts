import * as z from "zod";

// Schema for changing password
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
        .string()
        .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
        .regex(/\d/, "La contraseña debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Debes confirmar la contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
