"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeColor = "amber" | "teal" | "rose" | "blue" | "emerald";

interface ThemeContextType {
    themeColor: ThemeColor;
    setThemeColor: (color: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeColorProvider({ children }: { children: React.ReactNode }) {
    const [themeColor, setThemeColor] = useState<ThemeColor>("amber");

    useEffect(() => {
        const savedColor = localStorage.getItem("theme-color") as ThemeColor;
        if (savedColor) {
            setThemeColor(savedColor);
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const colors: Record<ThemeColor, { light: string; dark: string }> = {
            amber:   { light: "0.58 0.16 65",  dark: "0.78 0.145 70" },
            teal:    { light: "0.55 0.14 185",  dark: "0.72 0.15 185" },
            rose:    { light: "0.55 0.20 10",   dark: "0.72 0.18 10" },
            blue:    { light: "0.52 0.18 250",  dark: "0.68 0.17 250" },
            emerald: { light: "0.55 0.16 155",  dark: "0.72 0.16 155" },
        };

        const selected = colors[themeColor];
        if (selected) {
            root.style.setProperty("--primary", `oklch(${selected.dark})`);
            root.style.setProperty("--ring", `oklch(${selected.dark})`);
            root.style.setProperty("--sidebar-primary", `oklch(${selected.dark})`);
            root.style.setProperty("--sidebar-ring", `oklch(${selected.dark})`);
            root.style.setProperty("--chart-1", `oklch(${selected.dark})`);

            localStorage.setItem("theme-color", themeColor);
        }
    }, [themeColor]);

    return (
        <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeColorContext.Provider>
    );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            <ThemeColorProvider>
                {children}
            </ThemeColorProvider>
        </NextThemesProvider>
    );
}

export function useThemeColor() {
    const context = useContext(ThemeColorContext);
    if (context === undefined) {
        throw new Error("useThemeColor must be used within a ThemeProvider");
    }
    return context;
}
