"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { BottomNav } from "@/components/portal/BottomNav";
import { OnboardingGuard } from "@/components/onboarding";
import { useSession } from "@/hooks/useSession";
import { auth } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, loading } = useSession();

    function getInitials(name?: string | null) {
        if (name) return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
        return "CL";
    }

    async function handleLogout() {
        try {
            await auth.logout();
            toast.success("Sesión cerrada");
            router.push("/login");
            router.refresh();
        } catch {
            toast.error("Error al cerrar sesión");
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-background pb-16">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b px-4 py-3 flex items-center justify-between">
                <div className="w-10" />
                <span className="font-display font-bold text-lg text-primary">Jorge Ortega PT</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                                <AvatarFallback className="text-xs">
                                    {loading ? "..." : getInitials(user?.name)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="font-normal">
                            <p className="text-sm font-medium">{user?.name || "Cliente"}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/portal/profile">
                                <User className="mr-2 h-4 w-4" />
                                Ver Perfil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <main className="flex-1 p-4 md:p-6 max-w-md mx-auto w-full">
                <OnboardingGuard>
                    {children}
                </OnboardingGuard>
            </main>

            <BottomNav />
        </div>
    );
}
