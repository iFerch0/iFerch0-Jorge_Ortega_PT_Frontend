"use client";

import { Dumbbell } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 lg:grid lg:grid-cols-2 lg:p-0">
            <div className="flex flex-col items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <Link href="/" className="mx-auto flex flex-col items-center gap-2 font-bold text-xl text-primary mb-4">
                            <img
                                src="https://res.cloudinary.com/duhsqdstl/image/upload/v1770782105/LOGO_CON_TRAZO_-_TRANSPARENTE_ytfdn6.png"
                                alt="GymProfile Pro Logo"
                                width={180}
                                height={60}
                                className="h-auto w-48"
                            />
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <div className="h-full w-full object-cover bg-primary/10 flex items-center justify-center">
                    <img
                        src="https://res.cloudinary.com/duhsqdstl/image/upload/v1770782105/LOGO_CON_TRAZO_-_TRANSPARENTE_ytfdn6.png"
                        alt="GymProfile Pro Logo Large"
                        className="h-auto w-96 opacity-20 filter grayscale"
                    />
                </div>
            </div>
        </div>
    );
}
