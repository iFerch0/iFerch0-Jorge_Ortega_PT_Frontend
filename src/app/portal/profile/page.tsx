"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Phone, Mail, Ruler, Scale, Target, HeartPulse,
    Building2, Home, TreePine, MapPin, Edit, ChevronLeft,
    LogOut, Dumbbell, Activity
} from "lucide-react";
import { toast } from "sonner";
import { me, auth } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ClientProfile, Evaluation } from "@/types/api";

// ── Helpers ────────────────────────────────────────────────────

const trainingPlaceMap: Record<string, { label: string; Icon: typeof Building2 }> = {
    GYM:     { label: "Gimnasio",   Icon: Building2 },
    HOME:    { label: "Casa",       Icon: Home },
    OUTDOOR: { label: "Aire libre", Icon: TreePine },
};

const genderLabels: Record<string, string> = {
    MALE: "Masculino", FEMALE: "Femenino", OTHER: "Otro",
};

const severityConfig: Record<string, { label: string; className: string }> = {
    Low:    { label: "Baja",  className: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
    Medium: { label: "Media", className: "text-amber-600  bg-amber-500/10  border-amber-500/20"  },
    High:   { label: "Alta",  className: "text-red-600    bg-red-500/10    border-red-500/20"    },
};

function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function getInitials(first?: string | null, last?: string | null) {
    return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";
}

const sectionLabel = "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 block";

// ── Skeleton ───────────────────────────────────────────────────

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-24" />
            </div>
            {/* Hero */}
            <div className="rounded-2xl border bg-card p-6 space-y-4">
                <div className="flex flex-col items-center gap-3">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-center gap-4">
                    <Skeleton className="h-10 w-24 rounded-xl" />
                    <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <div className="rounded-2xl border bg-card p-4 space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Stat pill ──────────────────────────────────────────────────

function StatPill({ icon: Icon, value, label }: { icon: typeof Scale; value: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-0.5 rounded-xl border bg-muted/30 px-4 py-2.5 min-w-[80px]">
            <Icon className="h-3.5 w-3.5 text-primary mb-0.5" />
            <span className="text-sm font-bold leading-none">{value}</span>
            <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
    );
}

// ── Bio metric row ─────────────────────────────────────────────

function BioRow({ label, value, unit }: { label: string; value: number | null | undefined; unit: string }) {
    if (value == null) return null;
    return (
        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-semibold tabular-nums">
                {value}<span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span>
            </span>
        </div>
    );
}

// ── Page ───────────────────────────────────────────────────────

export default function PortalProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<ClientProfile | null>(null);
    const [latestEval, setLatestEval] = useState<Evaluation | null>(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        Promise.all([
            me.getProfile(),
            me.getAssessments({ limit: 1 }),
        ])
            .then(([profileData, evalData]) => {
                setProfile(profileData);
                setLatestEval(evalData?.data?.[0] ?? null);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <ProfileSkeleton />;

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <p className="text-muted-foreground text-sm">No se pudo cargar el perfil.</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Reintentar
                </Button>
            </div>
        );
    }

    const age = profile.birthDate ? calculateAge(profile.birthDate) : null;
    const placeConfig = profile.trainingPlace ? trainingPlaceMap[profile.trainingPlace] : null;
    const PlaceIcon = placeConfig?.Icon ?? MapPin;
    const bio = latestEval?.bioimpedance;
    const email = profile.user?.email;

    return (
        <div className="space-y-6 pb-4">

            {/* ── Top nav ── */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/portal">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="gap-1.5 text-primary">
                    <Link href="/portal/profile/edit">
                        <Edit className="h-3.5 w-3.5" />
                        Editar
                    </Link>
                </Button>
            </div>

            {/* ── Hero ── */}
            <div className="rounded-2xl border bg-card p-6 text-center space-y-4">
                {/* Avatar */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
                    <span className="font-display text-2xl font-bold text-primary">
                        {getInitials(profile.firstName, profile.lastName)}
                    </span>
                </div>

                {/* Name */}
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">
                        {profile.firstName} {profile.lastName}
                    </h1>
                    {placeConfig && (
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-sm text-muted-foreground">
                            <PlaceIcon className="h-3.5 w-3.5" />
                            <span>{placeConfig.label}</span>
                            {age && (
                                <>
                                    <span className="text-border">·</span>
                                    <span>{age} años</span>
                                </>
                            )}
                        </div>
                    )}
                    {!placeConfig && age && (
                        <p className="mt-1 text-sm text-muted-foreground">{age} años</p>
                    )}
                </div>

                {/* Quick stats */}
                {(profile.height || bio?.weight) && (
                    <div className="flex justify-center gap-3">
                        {profile.height && (
                            <StatPill icon={Ruler} value={`${profile.height}`} label="cm" />
                        )}
                        {bio?.weight && (
                            <StatPill icon={Scale} value={`${bio.weight}`} label="kg" />
                        )}
                        {bio?.bmi && (
                            <StatPill icon={Activity} value={`${bio.bmi}`} label="IMC" />
                        )}
                    </div>
                )}
            </div>

            {/* ── Contacto ── */}
            {(email || profile.phone || profile.gender) && (
                <div>
                    <span className={sectionLabel}>Contacto</span>
                    <div className="rounded-2xl border bg-card divide-y divide-border/50">
                        {email && (
                            <div className="flex items-center gap-3 px-4 py-3">
                                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                                    <p className="text-sm font-medium">{email}</p>
                                </div>
                            </div>
                        )}
                        {profile.phone && (
                            <div className="flex items-center gap-3 px-4 py-3">
                                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Teléfono</p>
                                    <p className="text-sm font-medium">{profile.phone}</p>
                                </div>
                            </div>
                        )}
                        {profile.gender && (
                            <div className="flex items-center gap-3 px-4 py-3">
                                <span className="text-muted-foreground text-base leading-none shrink-0">⚧</span>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Género</p>
                                    <p className="text-sm font-medium">{genderLabels[profile.gender] ?? "—"}</p>
                                </div>
                            </div>
                        )}
                        {profile.cedula && (
                            <div className="flex items-center gap-3 px-4 py-3">
                                <span className="text-muted-foreground text-sm font-mono shrink-0">ID</span>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cédula</p>
                                    <p className="text-sm font-medium">{profile.cedula}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Objetivos ── */}
            <div>
                <span className={sectionLabel}>Objetivos</span>
                <div className="rounded-2xl border bg-card px-4 py-3">
                    {profile.objectives && profile.objectives.length > 0 ? (
                        <ul className="space-y-2.5">
                            {profile.objectives.map((obj, idx) => (
                                <li key={obj.id ?? idx} className="flex items-start gap-2.5 text-sm">
                                    <Target className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                                    <span>{obj.content}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground py-2">
                            No tienes objetivos definidos.{" "}
                            <Link href="/portal/profile/edit" className="text-primary underline-offset-2 hover:underline">
                                Agregar
                            </Link>
                        </p>
                    )}
                </div>
            </div>

            {/* ── Condiciones ── */}
            <div>
                <span className={sectionLabel}>Condiciones de Salud</span>
                <div className="rounded-2xl border bg-card px-4 py-3">
                    {profile.pathologies && profile.pathologies.length > 0 ? (
                        <ul className="space-y-3">
                            {profile.pathologies.map((p, idx) => {
                                const sev = p.severity ? severityConfig[p.severity] : null;
                                return (
                                    <li key={p.id ?? idx} className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium">{p.name}</p>
                                            {p.notes && (
                                                <p className="text-xs text-muted-foreground mt-0.5">{p.notes}</p>
                                            )}
                                        </div>
                                        {sev && (
                                            <span className={cn(
                                                "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                                sev.className
                                            )}>
                                                {sev.label}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground py-2">Sin condiciones registradas.</p>
                    )}
                </div>
            </div>

            {/* ── Bioimpedancia ── */}
            {bio && (
                <div>
                    <div className="flex items-baseline justify-between mb-3">
                        <span className={cn(sectionLabel, "mb-0")}>Última Bioimpedancia</span>
                        <span className="text-[10px] text-muted-foreground">
                            {new Date(latestEval!.date).toLocaleDateString("es-CO", {
                                day: "numeric", month: "short", year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="rounded-2xl border bg-card px-4 py-1">
                        <BioRow label="Peso"                  value={bio.weight}            unit=" kg" />
                        <BioRow label="IMC"                   value={bio.bmi}               unit="" />
                        <BioRow label="Grasa corporal"        value={bio.bodyFat}            unit="%" />
                        <BioRow label="Masa muscular"         value={bio.muscleMass}         unit=" kg" />
                        <BioRow label="Músculo esquelético"   value={bio.skeletalMuscleMass} unit=" kg" />
                        <BioRow label="Grasa visceral"        value={bio.visceralFat}        unit="%" />
                        <BioRow label="Agua corporal"         value={bio.bodyWater}          unit=" L" />
                        <BioRow label="Metabolismo basal"     value={bio.basalMetabolism}    unit=" kcal" />
                    </div>
                    <Link
                        href="/portal/assessments"
                        className="mt-2 flex items-center justify-center gap-1.5 text-xs text-primary font-medium hover:underline"
                    >
                        <Dumbbell className="h-3 w-3" />
                        Ver historial completo
                    </Link>
                </div>
            )}

            {/* ── Cerrar sesión ── */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-border"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tendrás que iniciar sesión de nuevo para acceder a tu perfil.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Cerrar sesión
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
