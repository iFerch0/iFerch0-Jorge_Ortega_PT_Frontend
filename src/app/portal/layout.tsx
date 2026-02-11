import { BottomNav } from "@/components/portal/BottomNav";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-muted/40 pb-16">
            {/* Simple Header */}
            <header className="sticky top-0 z-40 bg-background border-b px-4 py-3 flex items-center justify-center shadow-sm">
                <span className="font-bold text-lg text-primary">GymProfile Pro</span>
            </header>

            <main className="flex-1 p-4 md:p-6 max-w-md mx-auto w-full">
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </main>

            <BottomNav />
        </div>
    );
}
