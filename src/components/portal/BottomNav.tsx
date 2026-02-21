"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, User, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const links = [
        { href: "/portal", label: "Inicio", icon: Home },
        { href: "/portal/assessments", label: "Progreso", icon: Dumbbell },
        { href: "/portal/photos", label: "Fotos", icon: Camera },
        { href: "/portal/profile", label: "Perfil", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background px-4 py-2">
            <nav className="flex justify-around">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || (href !== "/portal" && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
