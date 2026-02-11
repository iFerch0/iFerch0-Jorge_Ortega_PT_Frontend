import { ThemeCustomizer } from "@/components/settings/ThemeCustomizer";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Configuración</h3>
                <p className="text-sm text-muted-foreground">
                    Administra tus preferencias y la apariencia de la aplicación.
                </p>
            </div>
            <div className="grid gap-6">
                <ThemeCustomizer />
            </div>
        </div>
    );
}
