"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/api";
import type { Session } from "@/types/api";

export function useSession() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        auth.getSession()
            .then(setSession)
            .finally(() => setLoading(false));
    }, []);

    return { session, loading, user: session?.user ?? null };
}
