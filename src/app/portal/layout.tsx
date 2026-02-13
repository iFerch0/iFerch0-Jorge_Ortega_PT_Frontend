import { BottomNav } from "@/components/portal/BottomNav";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background pb-16">
            {/* Simple Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b px-4 py-3 flex items-center justify-center">
                <span className="font-display font-bold text-lg text-primary">Jorge Ortega PT</span>
            </header>

            <main className="flex-1 p-4 md:p-6 max-w-md mx-auto w-full">
                {children}
            </main>

            <BottomNav />
        </div>
    );
}
