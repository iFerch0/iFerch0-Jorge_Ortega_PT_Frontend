"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Dumbbell, TrendingUp, Camera } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const highlights = [
    { icon: TrendingUp, text: "Seguimiento de tu composición corporal con gráficas detalladas" },
    { icon: Camera, text: "Fotos de progreso con comparativas antes y después" },
    { icon: Dumbbell, text: "Evaluaciones periódicas personalizadas a tu medida" },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left — Form side */}
            <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
                {/* Ambient glow — warm presence that connects with the brand panel */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[30%] -right-[20%] h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
                    <div className="absolute -bottom-[20%] -left-[15%] h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-[100px]" />
                </div>

                {/* Subtle dot pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                        backgroundSize: "24px 24px",
                    }}
                />

                <div className="relative z-10 mx-auto w-full max-w-[400px] space-y-8">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex justify-center"
                    >
                        <Link href="/" className="inline-block">
                            <img
                                src="https://res.cloudinary.com/duhsqdstl/image/upload/v1770782105/LOGO_CON_TRAZO_-_TRANSPARENTE_ytfdn6.png"
                                alt="Jorge Ortega PT"
                                className="h-auto w-44"
                            />
                        </Link>
                    </motion.div>

                    {/* Mobile-only brand tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-center text-xs text-muted-foreground/60 lg:hidden"
                    >
                        Tu progreso de entrenamiento, medible y visible.
                    </motion.p>

                    {/* Form content */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {children}
                    </motion.div>
                </div>

                {/* Bottom */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute bottom-6 text-[11px] text-muted-foreground/50"
                >
                    &copy; {new Date().getFullYear()} Jorge Ortega Personal Trainer
                </motion.p>
            </div>

            {/* Right — Brand panel */}
            <div className="relative hidden overflow-hidden bg-[#09090b] lg:flex lg:w-[55%] xl:w-[50%]">
                {/* Gradient mesh */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-[20%] -top-[10%] h-[500px] w-[500px] rounded-full bg-amber-500/15 blur-[120px]" />
                    <div className="absolute -right-[15%] top-[40%] h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[100px]" />
                    <div className="absolute -bottom-[15%] left-[30%] h-[350px] w-[350px] rounded-full bg-amber-600/8 blur-[90px]" />
                </div>

                {/* Noise */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Grid lines */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={`h-${i}`}
                            className="absolute left-0 right-0 h-px bg-white"
                            style={{ top: `${(i + 1) * 16.66}%` }}
                        />
                    ))}
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={`v-${i}`}
                            className="absolute top-0 bottom-0 w-px bg-white"
                            style={{ left: `${(i + 1) * 25}%` }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
                    <div />

                    {/* Center */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                                Personal Trainer
                            </p>
                            <h2 className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-white xl:text-4xl">
                                Tu progreso,{" "}
                                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-teal-400 bg-clip-text text-transparent">
                                    visible y medible.
                                </span>
                            </h2>
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/40">
                                Accede a tus evaluaciones de composición corporal, fotos de progreso y métricas personalizadas. Todo tu proceso de entrenamiento en un solo lugar.
                            </p>
                        </motion.div>

                        {/* Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="space-y-3"
                        >
                            {highlights.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.1 }}
                                    className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
                                        <item.icon className="h-4 w-4 text-amber-400/60" />
                                    </div>
                                    <p className="text-sm text-white/50">{item.text}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom — trainer quote */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        className="mt-12 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/40 to-teal-500/30 text-xs font-bold text-white">
                                JO
                            </div>
                            <div>
                                <p className="text-sm leading-relaxed text-white/50 italic">
                                    &ldquo;Lo que no se mide, no se mejora. Esta plataforma te permite ver tu evolución real, sesión a sesión.&rdquo;
                                </p>
                                <p className="mt-2 text-xs text-white/25">
                                    <span className="font-medium text-white/40">Jorge Ortega</span>
                                    {" "}&middot;{" "}Personal Trainer Certificado
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
