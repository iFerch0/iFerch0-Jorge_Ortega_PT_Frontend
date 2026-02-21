"use client";

import { useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/api";
import type { Session, Role } from "@/types/api";

export function useSession() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const newSession = await auth.getSession();
            setSession(newSession);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        auth.getSession()
            .then(setSession)
            .finally(() => setLoading(false));
    }, []);

    const user = session?.user ?? null;
    const role: Role | null = user?.role ?? null;

    // Convenience boolean flags
    const isClient = role === "CLIENT";
    const isTrainer = role === "TRAINER";
    const isAdmin = role === "ADMIN";
    const isAuthenticated = !!user;

    // Onboarding flags
    const mustChangePassword = user?.mustChangePassword ?? false;
    const wizardCompleted = user?.wizardCompleted ?? true; // Default true for non-CLIENT roles

    return {
        session,
        loading,
        user,
        role,
        // Role helpers
        isClient,
        isTrainer,
        isAdmin,
        isAuthenticated,
        // Onboarding flags
        mustChangePassword,
        wizardCompleted,
        // Actions
        refresh,
    };
}
