"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeColor = "blue" | "violet" | "rose" | "orange" | "green";

interface ThemeContextType {
    themeColor: ThemeColor;
    setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeColor, setThemeColor] = useState<ThemeColor>("blue");

    // Load from local storage on mount
    useEffect(() => {
        const savedColor = localStorage.getItem("theme-color") as ThemeColor;
        if (savedColor) {
            setThemeColor(savedColor);
        }
    }, []);

    // Apply theme color
    useEffect(() => {
        const root = document.documentElement;
        const colors: Record<ThemeColor, { primary: string; ring: string }> = {
            blue: { primary: "0.55 0.22 260", ring: "0.55 0.22 260" },
            violet: { primary: "0.55 0.22 290", ring: "0.55 0.22 290" },
            rose: { primary: "0.55 0.22 340", ring: "0.55 0.22 340" },
            orange: { primary: "0.60 0.18 30", ring: "0.60 0.18 30" },
            green: { primary: "0.60 0.18 145", ring: "0.60 0.18 145" },
        };

        const selected = colors[themeColor];
        if (selected) {
            root.style.setProperty("--primary", `oklch(${selected.primary})`);
            root.style.setProperty("--ring", `oklch(${selected.ring})`);
            root.style.setProperty("--sidebar-primary", `oklch(${selected.primary})`);
            root.style.setProperty("--sidebar-ring", `oklch(${selected.ring})`);

            localStorage.setItem("theme-color", themeColor);
        }
    }, [themeColor]);

    return (
        <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
