"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { me } from "@/lib/api";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { ConsentModal } from "./ConsentModal";
import type { OnboardingStatus } from "@/types/api";

interface OnboardingGuardProps {
    children: ReactNode;
    /** If true, skip wizard redirect (for dashboard layouts) */
    skipWizardRedirect?: boolean;
}

type OnboardingStep = "loading" | "password" | "consent" | "wizard" | "ready";

export function OnboardingGuard({ children, skipWizardRedirect = false }: OnboardingGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isClient, loading: sessionLoading, refresh } = useSession();
    const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);
    const [currentStep, setCurrentStep] = useState<OnboardingStep>("loading");
    const [error, setError] = useState<string | null>(null);

    // If already on the wizard page, skip wizard redirect to avoid infinite loop
    const isOnWizardPage = pathname === "/portal/wizard";

    // Fetch onboarding status (re-runs on route change to pick up wizard completion, etc.)
    useEffect(() => {
        if (sessionLoading) return;

        // If no user after session loaded, redirect to login
        if (!user) {
            router.push("/login");
            return;
        }

        me.getOnboardingStatus()
            .then((status) => {
                setOnboardingStatus(status);
                determineStep(status);
            })
            .catch((err) => {
                console.error("Error fetching onboarding status:", err);
                // If error, assume ready (don't block user)
                setCurrentStep("ready");
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, sessionLoading, router, pathname]);

    function determineStep(status: OnboardingStatus) {
        // Priority order: password > consent > wizard > ready
        if (status.mustChangePassword) {
            setCurrentStep("password");
        } else if (!status.hasAcceptedCurrentPolicy) {
            setCurrentStep("consent");
        } else if (!status.wizardCompleted && isClient && !skipWizardRedirect && !isOnWizardPage) {
            setCurrentStep("wizard");
        } else {
            setCurrentStep("ready");
        }
    }

    // Handle password change success
    async function handlePasswordChanged() {
        await refresh();
        // Re-check status
        try {
            const status = await me.getOnboardingStatus();
            setOnboardingStatus(status);
            determineStep({ ...status, mustChangePassword: false });
        } catch {
            setCurrentStep("ready");
        }
    }

    // Handle consent accepted
    async function handleConsentAccepted() {
        await refresh();
        // Re-check status
        try {
            const status = await me.getOnboardingStatus();
            setOnboardingStatus(status);
            determineStep({ ...status, hasAcceptedCurrentPolicy: true });
        } catch {
            setCurrentStep("ready");
        }
    }

    // Redirect to wizard if needed
    useEffect(() => {
        if (currentStep === "wizard") {
            router.push("/portal/wizard");
        }
    }, [currentStep, router]);

    // Loading state
    if (sessionLoading || currentStep === "loading") {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cargando...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 text-primary underline"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Wizard redirect — if already on wizard page, render children; otherwise show loader
    if (currentStep === "wizard") {
        if (isOnWizardPage) {
            return <>{children}</>;
        }
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Password modal - blocks until changed */}
            <ChangePasswordModal
                open={currentStep === "password"}
                onSuccess={handlePasswordChanged}
            />

            {/* Consent modal - blocks until accepted */}
            <ConsentModal
                open={currentStep === "consent"}
                onSuccess={handleConsentAccepted}
            />

            {/* Render children only when ready */}
            {currentStep === "ready" && children}
        </>
    );
}
