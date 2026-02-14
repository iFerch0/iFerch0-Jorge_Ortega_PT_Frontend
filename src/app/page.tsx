"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Camera,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Instagram,
  Facebook,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const benefits = [
  "Evaluaciones de bioimpedancia registradas en cada sesion",
  "Graficas de evolucion de peso y composicion corporal",
  "Fotos de progreso con comparativa antes y despues",
  "Portal personal para que veas tu avance 24/7",
  "Historial completo de todas tus evaluaciones",
];

const process_steps = [
  {
    number: "01",
    title: "Evaluacion Inicial",
    desc: "Te registro en la plataforma y tomamos tus medidas de bioimpedancia, fotos y objetivos.",
    icon: Activity,
  },
  {
    number: "02",
    title: "Seguimiento Periodico",
    desc: "Cada mes actualizamos tus metricas para medir tu evolucion real con datos concretos.",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "Resultados Visibles",
    desc: "Accede a tu portal personal y visualiza tu progreso con graficas y comparativas.",
    icon: Camera,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-white selection:bg-primary/30">
      {/* Noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient mesh — amber + teal atmospheric glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[30%] -top-[20%] h-[600px] w-[600px] rounded-full bg-amber-500/12 blur-[140px]" />
        <div className="absolute -right-[20%] top-[30%] h-[500px] w-[500px] rounded-full bg-teal-500/8 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-amber-600/6 blur-[100px]" />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 lg:px-20"
      >
        <div className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/duhsqdstl/image/upload/v1770782105/LOGO_CON_TRAZO_-_TRANSPARENTE_ytfdn6.png"
            alt="Jorge Ortega PT"
            className="h-9 w-auto brightness-0 invert"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5" asChild>
            <a href="https://wa.me/573233848512" target="_blank" rel="noopener noreferrer">Solicitar Plan</a>
          </Button>
          <Button className="rounded-full bg-amber-400 text-black hover:bg-amber-300 font-medium px-6" asChild>
            <Link href="/login">
              Área de Clientes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-16 md:px-12 md:pt-24 lg:pt-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Jorge Ortega &middot; Personal Trainer
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Tu progreso de entrenamiento,{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-amber-300 via-amber-400 to-teal-400 bg-clip-text text-transparent">
                medible y visible
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-teal-400 opacity-50" />
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl"
          >
            Plataforma exclusiva para mis clientes. Seguimiento personalizado con bioimpedancia, fotos de progreso y métricas detalladas.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="rounded-full bg-amber-400 text-black hover:bg-amber-300 font-semibold px-8 h-13 text-base"
              asChild
            >
              <Link href="/login">
                Ingresar al Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white font-medium px-8 h-13 text-base"
              asChild
            >
              <a href="https://wa.me/573233848512" target="_blank" rel="noopener noreferrer">
                Solicitar Asesoría
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-amber-400/10 to-transparent opacity-50 blur-sm" />
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-1 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-1.5 px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <div className="ml-4 h-5 w-48 rounded-md bg-white/5" />
            </div>
            <div className="rounded-lg bg-gradient-to-br from-[#0f0f12] to-[#121216] p-6 md:p-8">
              <div className="grid grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: "Peso Actual", val: "82.5 kg", color: "from-amber-500/20 to-amber-500/5" },
                  { label: "% Grasa", val: "22.5%", color: "from-teal-500/20 to-teal-500/5" },
                  { label: "% Musculo", val: "38.0%", color: "from-emerald-500/20 to-emerald-500/5" },
                  { label: "Evaluaciones", val: "8", color: "from-amber-400/20 to-amber-400/5" },
                ].map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                    className={`rounded-lg bg-gradient-to-br ${card.color} border border-white/5 p-3 md:p-4`}
                  >
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/40 md:text-xs">
                      {card.label}
                    </p>
                    <p className="mt-1 font-mono text-xl font-bold text-white md:text-2xl">{card.val}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex gap-3 md:gap-4">
                <div className="flex-1 rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <div className="mb-3 h-3 w-32 rounded bg-white/10" />
                  <div className="flex items-end gap-1 h-24">
                    {[40, 55, 45, 65, 50, 70, 60, 75, 68, 80, 72, 85].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1.2 + i * 0.05, duration: 0.4 }}
                        className="flex-1 rounded-sm bg-gradient-to-t from-amber-500/60 to-amber-400/20"
                      />
                    ))}
                  </div>
                </div>
                <div className="hidden w-48 rounded-lg border border-white/5 bg-white/[0.02] p-4 md:block">
                  <div className="mb-3 h-3 w-20 rounded bg-white/10" />
                  <div className="space-y-2">
                    {[85, 62, 45, 30].map((w, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 + i * 0.1 }}
                      >
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${w}%` }}
                            transition={{ delay: 1.6 + i * 0.1, duration: 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-amber-400"
                          />
                        </div>
                        <span className="text-[10px] text-white/30">{w}%</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Process */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Como funciona
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/40">
            Un proceso simple para que te enfoques en entrenar mientras yo me encargo de medir tu progreso.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {process_steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-amber-400/20 hover:bg-white/[0.04]"
            >
              <span className="font-display text-4xl font-black text-white/[0.04]">{step.number}</span>
              <div className="mt-2 mb-3 inline-flex rounded-lg border border-white/[0.08] bg-white/[0.04] p-2.5">
                <step.icon className="h-5 w-5 text-amber-400/60" />
              </div>
              <h3 className="font-display mb-2 text-base font-semibold tracking-tight">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/40">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-12">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Todo tu proceso{" "}
              <span className="text-white/40">en un solo lugar</span>
            </h2>
            <p className="mt-4 text-white/40">
              Olvidate de fotos dispersas en el telefono, hojas de calculo o apuntes perdidos. Aqui tienes todo organizado.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 rounded-lg px-3 py-2"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/70" />
                <span className="text-sm text-white/60">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Jorge Ortega */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-12 bg-white/[0.02] border-y border-white/[0.06]">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-sm text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Tu Entrenador
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Jorge Ortega <span className="text-white/40">Personal Trainer</span>
            </h2>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                Soy Jorge Ortega, entrenador personal certificado con más de 5 años de experiencia transformando vidas a través del fitness. Mi enfoque combina la ciencia del entrenamiento con la motivación necesaria para superar tus límites.
              </p>
              <p>
                No solo te ayudo a entrenar, te enseño a entender tu cuerpo. Con mi metodología, cada repetición cuenta y cada comida suma a tu objetivo. Mi misión es que logres resultados sostenibles y reales, sin fórmulas mágicas, solo trabajo inteligente y constancia.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/10 hover:text-amber-400" asChild>
                <a href="https://www.instagram.com/jorgeortega_ptrainer/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/10 hover:text-amber-400" asChild>
                <a href="https://www.facebook.com/joelorpi" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/10 hover:text-amber-400" asChild>
                <a href="https://wa.me/573233848512" target="_blank" rel="noopener noreferrer">
                  <Smartphone className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="aspect-square relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              {/* Placeholder for trainer image */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-amber-500/20 to-teal-500/20">
                <Smartphone className="h-20 w-20 text-white/20" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div>
                  <p className="text-2xl font-bold">Más de 500+</p>
                  <p className="text-white/60">Clientes transformados</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-12 text-center md:p-16"
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-teal-500/8 blur-[80px]" />

          <h2 className="font-display relative text-3xl font-bold tracking-tight sm:text-4xl">
            Listo para ver tu evolucion?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-white/40">
            Ingresa a tu cuenta y revisa tus metricas actualizadas, o contactame para empezar tu proceso.
          </p>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="rounded-full bg-amber-400 text-black hover:bg-amber-300 font-semibold px-10 h-13 text-base"
              asChild
            >
              <Link href="/login">
                Ingresar al Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white font-medium px-8 h-13 text-base"
              asChild
            >
              <a href="https://wa.me/573233848512" target="_blank" rel="noopener noreferrer">
                Contactar por WhatsApp
                <Smartphone className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/duhsqdstl/image/upload/v1770782105/LOGO_CON_TRAZO_-_TRANSPARENTE_ytfdn6.png"
              alt="Jorge Ortega PT"
              className="h-6 w-auto brightness-0 invert opacity-40"
            />
          </div>
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} Jorge Ortega Personal Trainer
          </p>
        </div>
      </footer>
    </div >
  );
}
