# 🏋️ GymProfile Pro — Plan de Proyecto

## Sistema de Gestión de Perfiles de Clientes para Gimnasio

---

## 1. Visión General del Producto

**GymProfile Pro** es una aplicación web diseñada para que entrenadores personales y gimnasios gestionen de forma integral los perfiles de sus clientes: desde la captura inicial de datos hasta el seguimiento trimestral de resultados, incluyendo objetivos, patologías, datos de bioimpedancia y fotos de progreso.

### 1.1 Problema que Resuelve

La mayoría de gimnasios gestionan los datos de sus clientes de forma fragmentada: hojas de cálculo para datos personales, fotos guardadas en el teléfono del entrenador, mediciones en papel, y seguimientos que se pierden con el tiempo. Esto genera una experiencia poco profesional para el cliente y una pérdida de información valiosa para el entrenador.

### 1.2 Propuesta de Valor

- **Para el entrenador:** Centraliza toda la información del cliente en un solo lugar con flujo guiado, reduce errores y permite demostrar resultados reales con comparativas visuales.
- **Para el cliente:** Experiencia profesional desde el primer día, acceso a su propio progreso, motivación a través de datos y fotos comparativas.
- **Para el gimnasio:** Imagen profesional, diferenciación frente a la competencia, retención de clientes basada en resultados medibles.

---

## 2. Análisis de Mercado y Competencia

### 2.1 Soluciones Existentes Analizadas

| Plataforma | Fortalezas | Debilidades | Precio |
|---|---|---|---|
| **MevoLife** | CRM completo, app móvil, videollamadas | Demasiado genérico, sin bioimpedancia | Desde $29/mes |
| **My PT Hub** | Planes de nutrición y entrenamiento, tracking | Sin flujo de onboarding visual | Desde $24/mes |
| **TrueCoach** | Excelente para programación de entrenamientos | No tiene fotos de progreso ni bioimpedancia | Desde $19/mes |
| **Trainer+** | Tracking de assessments, historial | Interfaz anticuada, UX pobre | Gratuito + premium |
| **InBody (LookinBody)** | Estándar de oro en bioimpedancia | Solo funciona con equipos InBody, costoso | Hardware + licencia |
| **FitTrace** | Análisis DXA, tracking de composición | Solo DXA, no cubre el flujo completo | Varía |
| **Akern FITNESS APP** | Bioimpedancia avanzada con BIVA | Atado a hardware Akern, sin fotos | Requiere hardware |

### 2.2 Brecha de Mercado Identificada

**Ninguna solución actual combina de forma nativa:**
1. Flujo de onboarding guiado y profesional (logo → datos → objetivos → patologías → bioimpedancia → fotos)
2. Registro de bioimpedancia agnóstico de hardware (funciona con InBody, Tanita, Bodystat, o entrada manual)
3. Galería de fotos de progreso con comparativa lado a lado
4. Dashboard de seguimiento trimestral con visualización de tendencias
5. Branding personalizable (logo del gimnasio)

### 2.3 Ideas Adicionales Inspiradas en la Competencia

- **📊 Reporte PDF generado automáticamente:** Al estilo InBody, generar un PDF con el resumen del cliente para entregarlo impreso o por email al final de cada evaluación.
- **📱 Portal del cliente (read-only):** Un enlace donde el cliente puede ver su propio progreso sin poder editar (como lo hace GymMaster).
- **🔔 Recordatorios automáticos:** Notificación al entrenador cuando un cliente cumple 3 meses desde su última evaluación.
- **📈 Comparativa temporal de fotos:** Slider antes/después al estilo de apps de transformación corporal.
- **🏷️ Etiquetas y segmentación:** Agrupar clientes por objetivo (pérdida de grasa, ganancia muscular, rehabilitación) para análisis grupal.
- **🤖 Integración con IA:** Análisis automático de tendencias y sugerencias basadas en datos de bioimpedancia (fase futura).
- **📋 Plantillas de evaluación:** Templates predefinidos para diferentes tipos de evaluación (inicial, mensual, trimestral).
- **🔗 QR de acceso rápido:** Cada cliente tiene un QR que el entrenador escanea para acceder rápidamente a su perfil.

---

## 3. Stack Tecnológico Recomendado

### 3.1 Justificación del Stack

Este proyecto necesita:
- **Formularios complejos multi-paso** → React con gestión de estado
- **Carga y gestión de imágenes** → Almacenamiento en la nube optimizado
- **Gráficas de evolución** → Librería de charts
- **Generación de PDFs** → Renderizado server-side
- **Autenticación por roles** → Entrenador / Admin / Cliente (solo lectura)
- **Responsive** → Los entrenadores usarán esto desde tablets y móviles en el gym

### 3.2 Stack Seleccionado

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  Next.js 14+ (App Router)                           │
│  React 18 + TypeScript                              │
│  Tailwind CSS + shadcn/ui                           │
│  React Hook Form + Zod (validación)                 │
│  Recharts (gráficas de evolución)                   │
│  Framer Motion (transiciones multi-step)            │
│  react-dropzone (carga de fotos)                    │
│  react-compare-slider (comparativa fotos)           │
├─────────────────────────────────────────────────────┤
│                    BACKEND                           │
│  Next.js API Routes / Server Actions                │
│  Prisma ORM                                         │
│  PostgreSQL (Supabase o Neon)                       │
│  NextAuth.js v5 (autenticación)                     │
│  Cloudinary o Supabase Storage (imágenes)           │
│  @react-pdf/renderer (generación de PDFs)           │
├─────────────────────────────────────────────────────┤
│               INFRAESTRUCTURA                        │
│  Vercel (hosting + CI/CD)                           │
│  Supabase (DB + Storage + Auth alternativo)         │
│  Resend (emails transaccionales)                    │
│  Cron jobs (Vercel Cron para recordatorios)         │
└─────────────────────────────────────────────────────┘
```

### 3.3 ¿Por Qué Este Stack?

| Decisión | Razón |
|---|---|
| **Next.js** en lugar de Vite+React | SSR para SEO del landing, Server Actions para operaciones de DB, API Routes integradas. Un solo proyecto para todo. |
| **PostgreSQL** en lugar de MongoDB | Datos altamente relacionales (cliente → evaluaciones → bioimpedancia → fotos). Las relaciones y queries complejas son el fuerte de SQL. |
| **Prisma** en lugar de Drizzle | DX superior, migraciones automáticas, type-safety con TypeScript, excelente documentación. |
| **shadcn/ui** en lugar de MUI/Ant | Componentes sin opiniones de estilo, totalmente personalizables, ligeros, y se integran perfectamente con Tailwind. |
| **Supabase Storage** en lugar de S3 | Más simple de configurar, integración nativa con PostgreSQL, políticas de acceso por filas (RLS). |
| **Recharts** en lugar de Chart.js | API declarativa React-first, composable, fácil de personalizar con Tailwind. |

### 3.4 Alternativa Simplificada (para equipos pequeños o MVP más rápido)

Si el equipo es de 1-2 personas o se necesita un MVP en menos de 4 semanas:

```
Frontend:  Next.js + Tailwind + shadcn/ui
Backend:   Supabase (Auth + DB + Storage todo integrado)
Deploy:    Vercel
```

Esto elimina la necesidad de configurar Prisma, NextAuth y servicios de almacenamiento por separado.

---

## 4. Arquitectura de Datos

### 4.1 Modelo de Base de Datos (ERD)

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────────┐
│   Gym        │     │   User           │     │   Client          │
│──────────────│     │──────────────────│     │───────────────────│
│ id           │────▶│ id               │────▶│ id                │
│ name         │     │ gymId            │     │ userId            │
│ logo (url)   │     │ email            │     │ fullName          │
│ primaryColor │     │ password (hash)  │     │ dateOfBirth       │
│ createdAt    │     │ role (ADMIN|     │     │ gender            │
│              │     │  TRAINER|CLIENT) │     │ phone             │
└──────────────┘     │ name             │     │ email             │
                     │ avatar           │     │ profilePhoto      │
                     └──────────────────┘     │ status (ACTIVE|   │
                                              │  INACTIVE)        │
                                              │ trainerId         │
                                              │ tags[]            │
                                              │ notes             │
                                              │ createdAt         │
                                              └─────────┬─────────┘
                                                        │
                              ┌──────────────────────────┼──────────────────┐
                              │                          │                  │
                    ┌─────────▼────────┐   ┌─────────────▼────┐  ┌─────────▼────────┐
                    │   Objective      │   │   Pathology      │  │   Evaluation     │
                    │──────────────────│   │──────────────────│  │──────────────────│
                    │ id               │   │ id               │  │ id               │
                    │ clientId         │   │ clientId         │  │ clientId         │
                    │ type (LOSE_FAT|  │   │ name             │  │ trainerId        │
                    │  GAIN_MUSCLE|    │   │ description      │  │ date             │
                    │  REHAB|ENDUR|    │   │ severity (LOW|   │  │ type (INITIAL|   │
                    │  GENERAL|OTHER)  │   │  MEDIUM|HIGH)    │  │  MONTHLY|        │
                    │ description      │   │ medicalNotes     │  │  QUARTERLY)      │
                    │ targetDate       │   │ contraindicated  │  │ notes            │
                    │ status (ACTIVE|  │   │  Exercises[]     │  │ createdAt        │
                    │  ACHIEVED|       │   │ isActive         │  └────────┬─────────┘
                    │  MODIFIED)       │   │ createdAt        │           │
                    │ createdAt        │   └──────────────────┘    ┌──────┴───────┐
                    └──────────────────┘                           │              │
                                                        ┌─────────▼──┐  ┌────────▼────────┐
                                                        │ Bioimpedance│  │ ProgressPhoto   │
                                                        │────────────│  │─────────────────│
                                                        │ id         │  │ id              │
                                                        │ evaluationId│ │ evaluationId    │
                                                        │ weight     │  │ imageUrl        │
                                                        │ height     │  │ angle (FRONT|   │
                                                        │ bodyFatPct │  │  SIDE|BACK)     │
                                                        │ muscleMass │  │ caption         │
                                                        │ waterPct   │  │ createdAt       │
                                                        │ visceralFat│  └─────────────────┘
                                                        │ boneMass   │
                                                        │ bmr        │
                                                        │ bmi        │
                                                        │ metabolicAge│
                                                        │ skeletalMuscle│
                                                        │ subcutFat  │
                                                        │ device     │
                                                        │ rawData    │
                                                        │ createdAt  │
                                                        └────────────┘
```

### 4.2 Schema Prisma (resumen)

```prisma
model Gym {
  id           String   @id @default(cuid())
  name         String
  logo         String?
  primaryColor String   @default("#3B82F6")
  users        User[]
  createdAt    DateTime @default(now())
}

model User {
  id        String   @id @default(cuid())
  gymId     String
  gym       Gym      @relation(fields: [gymId], references: [id])
  email     String   @unique
  password  String
  role      Role     @default(TRAINER)
  name      String
  avatar    String?
  clients   Client[] @relation("TrainerClients")
  evaluations Evaluation[]
}

model Client {
  id           String       @id @default(cuid())
  fullName     String
  dateOfBirth  DateTime?
  gender       Gender?
  phone        String?
  email        String?
  profilePhoto String?
  status       ClientStatus @default(ACTIVE)
  trainerId    String
  trainer      User         @relation("TrainerClients", fields: [trainerId], references: [id])
  tags         String[]
  notes        String?
  objectives   Objective[]
  pathologies  Pathology[]
  evaluations  Evaluation[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Evaluation {
  id            String          @id @default(cuid())
  clientId      String
  client        Client          @relation(fields: [clientId], references: [id])
  trainerId     String
  trainer       User            @relation(fields: [trainerId], references: [id])
  type          EvaluationType
  date          DateTime        @default(now())
  notes         String?
  bioimpedance  Bioimpedance?
  photos        ProgressPhoto[]
  createdAt     DateTime        @default(now())
}

model Bioimpedance {
  id              String     @id @default(cuid())
  evaluationId    String     @unique
  evaluation      Evaluation @relation(fields: [evaluationId], references: [id])
  weight          Float
  height          Float
  bodyFatPct      Float?
  muscleMassKg    Float?
  waterPct        Float?
  visceralFat     Float?
  boneMassKg      Float?
  bmr             Float?
  bmi             Float?
  metabolicAge    Int?
  skeletalMuscle  Float?
  subcutaneousFat Float?
  device          String?
  rawData         Json?
  createdAt       DateTime   @default(now())
}
```

---

## 5. Flujo de Usuario (User Flows)

### 5.1 Flujo Principal: Onboarding de un Nuevo Cliente

```
   ┌─────────────────────────────────────────────────────────────┐
   │                  FLUJO DE ONBOARDING                        │
   │            (Wizard multi-step con progreso visual)          │
   └─────────────────────────────────────────────────────────────┘

   [1/7]              [2/7]             [3/7]              [4/7]
   Branding     →   Datos          →  Objetivos      →  Patologías
   ┌─────────┐      Personales        ┌───────────┐      ┌───────────┐
   │  Logo   │      ┌──────────┐      │ ☑ Perder  │      │ ☑ Ninguna │
   │  del    │      │ Nombre   │      │   grasa   │      │ ☐ Lumbalg │
   │  Gym    │      │ Apellido │      │ ☐ Ganar   │      │ ☐ Rodilla │
   │ (ya     │      │ Fecha Nac│      │   músculo │      │ ☐ Hombro  │
   │ config) │      │ Género   │      │ ☐ Rehab   │      │ ☐ Otro:   │
   │         │      │ Teléfono │      │ ☐ Resist. │      │   [____]  │
   └─────────┘      │ Email    │      │ Desc libre│      │ Severidad │
                    │ Foto     │      └───────────┘      │ Notas méd │
                    └──────────┘                         └───────────┘
        │                │                  │                  │
        ▼                ▼                  ▼                  ▼
   [5/7]              [6/7]              [7/7]
   Bioimpedancia  →  Fotos de       →  Resumen &
   ┌───────────┐      Progreso          Confirmación
   │ Peso      │      ┌───────────┐      ┌───────────┐
   │ Altura    │      │ 📷 Frente │      │ Resumen   │
   │ % Grasa   │      │ 📷 Lado   │      │ completo  │
   │ Masa musc │      │ 📷 Espalda│      │ del perfil│
   │ % Agua    │      │           │      │           │
   │ Grasa visc│      │ (cámara o │      │ [Guardar] │
   │ Masa ósea │      │  upload)  │      │ [Generar  │
   │ TMB       │      │           │      │   PDF]    │
   │ IMC       │      └───────────┘      └───────────┘
   │ Edad metab│
   │ Dispositiv│
   └───────────┘
```

### 5.2 Flujo de Seguimiento Trimestral

```
   Entrenador abre perfil del cliente
              │
              ▼
   ┌─────────────────────┐
   │  "Nueva Evaluación" │
   │  Tipo: Trimestral   │
   └──────────┬──────────┘
              │
   ┌──────────▼──────────┐
   │  Registrar nuevos   │
   │  datos bioimpedancia│  ← Se precargan datos anteriores como referencia
   └──────────┬──────────┘
              │
   ┌──────────▼──────────┐
   │  Capturar fotos     │
   │  nuevas de progreso │
   └──────────┬──────────┘
              │
   ┌──────────▼──────────┐
   │  Ver comparativa    │  ← Dashboard con gráficas de evolución
   │  automática         │    y slider de fotos antes/después
   └──────────┬──────────┘
              │
   ┌──────────▼──────────┐
   │  Actualizar         │
   │  objetivos si       │
   │  es necesario       │
   └──────────┬──────────┘
              │
   ┌──────────▼──────────┐
   │  Generar reporte    │  ← PDF con todos los datos y comparativas
   │  PDF trimestral     │
   └──────────┬──────────┘
              │
   ┌──────────▼──────────┐
   │  Compartir con      │  ← Email o link directo al portal del cliente
   │  el cliente         │
   └──────────────────────┘
```

### 5.3 Flujo del Panel del Entrenador (Dashboard)

```
   ┌─────────────────────────────────────────────────────┐
   │  Dashboard Principal                                 │
   ├─────────────────────────────────────────────────────┤
   │                                                     │
   │  🔍 Buscar cliente...          [+ Nuevo Cliente]    │
   │                                                     │
   │  ┌─── Evaluaciones Pendientes ───────────────┐     │
   │  │ ⚠️ Juan Pérez — última eval: hace 95 días │     │
   │  │ ⚠️ María López — última eval: hace 91 días│     │
   │  └───────────────────────────────────────────┘     │
   │                                                     │
   │  ┌─── Mis Clientes (24 activos) ────────────┐     │
   │  │ ┌────────┐ ┌────────┐ ┌────────┐        │     │
   │  │ │ Avatar │ │ Avatar │ │ Avatar │  ...    │     │
   │  │ │ Juan P │ │ María L│ │ Carlos │        │     │
   │  │ │ #Fuerza│ │ #PérdGr│ │ #Rehab │        │     │
   │  │ └────────┘ └────────┘ └────────┘        │     │
   │  └───────────────────────────────────────────┘     │
   │                                                     │
   │  ┌─── Resumen Rápido ───────────────────────┐     │
   │  │ 📊 24 clientes activos                    │     │
   │  │ 📊  3 evaluaciones esta semana            │     │
   │  │ 📊  5 pendientes de seguimiento           │     │
   │  └───────────────────────────────────────────┘     │
   └─────────────────────────────────────────────────────┘
```

---

## 6. Estructura del Proyecto

```
gymprofile-pro/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── logo-placeholder.svg
│   └── default-avatar.svg
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx            ← Sidebar + Header
│   │   │   ├── page.tsx              ← Dashboard principal
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx          ← Lista de clientes
│   │   │   │   ├── new/page.tsx      ← Wizard de onboarding
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      ← Perfil del cliente
│   │   │   │       ├── evaluations/
│   │   │   │       │   ├── page.tsx  ← Historial de evaluaciones
│   │   │   │       │   ├── new/page.tsx
│   │   │   │       │   └── [evalId]/page.tsx
│   │   │   │       ├── photos/page.tsx
│   │   │   │       └── progress/page.tsx ← Dashboard de progreso
│   │   │   └── settings/
│   │   │       ├── page.tsx          ← Config del gym (logo, color)
│   │   │       └── profile/page.tsx
│   │   ├── client-portal/
│   │   │   └── [token]/page.tsx      ← Vista readonly del cliente
│   │   ├── api/
│   │   │   ├── clients/
│   │   │   ├── evaluations/
│   │   │   ├── upload/
│   │   │   └── reports/pdf/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       ← shadcn/ui components
│   │   ├── forms/
│   │   │   ├── ClientWizard/
│   │   │   │   ├── Step1PersonalData.tsx
│   │   │   │   ├── Step2Objectives.tsx
│   │   │   │   ├── Step3Pathologies.tsx
│   │   │   │   ├── Step4Bioimpedance.tsx
│   │   │   │   ├── Step5Photos.tsx
│   │   │   │   ├── Step6Summary.tsx
│   │   │   │   └── WizardProgress.tsx
│   │   │   └── EvaluationForm.tsx
│   │   ├── charts/
│   │   │   ├── BodyCompositionChart.tsx
│   │   │   ├── WeightEvolutionChart.tsx
│   │   │   └── MetricsComparisonChart.tsx
│   │   ├── photos/
│   │   │   ├── PhotoUploader.tsx
│   │   │   ├── PhotoGallery.tsx
│   │   │   └── BeforeAfterSlider.tsx
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ClientCard.tsx
│   │   │   └── PendingEvaluations.tsx
│   │   └── pdf/
│   │       └── EvaluationReport.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── upload.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useWizard.ts
│   │   ├── useClients.ts
│   │   └── useEvaluations.ts
│   └── types/
│       └── index.ts
├── .env
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 7. Plan de Sprints — Entregas Incrementales de Alto Valor

### Filosofía: "Cada sprint entrega algo usable"

Cada sprint de 2 semanas termina con una funcionalidad que el entrenador puede usar inmediatamente, generando valor desde la primera entrega.

---

### 📦 Sprint 0 — Fundación (Semana 1-2)

**Objetivo:** Setup del proyecto, base de datos, autenticación y layout base.

| # | Tarea | Prioridad | Estimación |
|---|---|---|---|
| 0.1 | Crear proyecto Next.js + TypeScript + Tailwind + shadcn/ui | Alta | 2h |
| 0.2 | Configurar Prisma + PostgreSQL (Supabase/Neon) | Alta | 3h |
| 0.3 | Definir schema Prisma completo + migración inicial | Alta | 4h |
| 0.4 | Configurar NextAuth.js v5 (email/password) | Alta | 4h |
| 0.5 | Crear páginas de login y registro | Alta | 3h |
| 0.6 | Layout del dashboard (Sidebar, Header, responsive) | Alta | 6h |
| 0.7 | Configurar Supabase Storage o Cloudinary | Media | 3h |
| 0.8 | Seed de datos de prueba | Media | 2h |
| 0.9 | Deploy inicial en Vercel + variables de entorno | Alta | 2h |

**Entrega:** App desplegada con login funcional, layout del dashboard y base de datos lista.

**Demo:** El entrenador puede registrarse, iniciar sesión y ver el dashboard vacío.

---

### 📦 Sprint 1 — Registro de Clientes (Semana 3-4)

**Objetivo:** Wizard completo de onboarding del cliente (el corazón de la app).

| # | Tarea | Prioridad | Estimación |
|---|---|---|---|
| 1.1 | Componente WizardProgress (barra de pasos visual) | Alta | 3h |
| 1.2 | Hook useWizard (gestión de estado multi-step) | Alta | 4h |
| 1.3 | Step 1: Datos personales (nombre, fecha nac, género, teléfono, email, foto) | Alta | 5h |
| 1.4 | Step 2: Objetivos (selección múltiple + descripción libre) | Alta | 4h |
| 1.5 | Step 3: Patologías (checklist + campo libre + severidad + notas médicas) | Alta | 4h |
| 1.6 | Step 4: Bioimpedancia (formulario con todos los campos, device selector) | Alta | 5h |
| 1.7 | Step 5: Fotos de progreso (upload de 3 ángulos: frente, lado, espalda) | Alta | 6h |
| 1.8 | Step 6: Resumen + confirmación + guardado | Alta | 4h |
| 1.9 | Server Action para crear cliente con todos los datos relacionados | Alta | 5h |
| 1.10 | Validación con Zod en cada paso | Alta | 3h |

**Entrega:** Un entrenador puede registrar un cliente completo paso a paso.

**Demo:** Flujo completo de onboarding de un nuevo cliente con datos reales.

---

### 📦 Sprint 2 — Listado y Perfil de Clientes (Semana 5-6)

**Objetivo:** Ver, buscar y navegar entre clientes y sus perfiles.

| # | Tarea | Prioridad | Estimación |
|---|---|---|---|
| 2.1 | Página de listado de clientes con búsqueda y filtros | Alta | 5h |
| 2.2 | ClientCard component (avatar, nombre, tags, última evaluación) | Alta | 3h |
| 2.3 | Página de perfil del cliente (vista completa) | Alta | 6h |
| 2.4 | Sección de datos personales (editable inline) | Alta | 4h |
| 2.5 | Sección de objetivos actuales | Media | 3h |
| 2.6 | Sección de patologías | Media | 3h |
| 2.7 | Sección de última bioimpedancia | Alta | 4h |
| 2.8 | Galería de fotos del perfil | Alta | 4h |
| 2.9 | Paginación / infinite scroll en el listado | Media | 3h |

**Entrega:** Dashboard funcional con lista de clientes navegable y perfil detallado.

**Demo:** Entrenador busca un cliente, abre su perfil y ve toda su información.

---

### 📦 Sprint 3 — Sistema de Evaluaciones (Semana 7-8)

**Objetivo:** Crear evaluaciones periódicas (mensuales/trimestrales).

| # | Tarea | Prioridad | Estimación |
|---|---|---|---|
| 3.1 | Formulario de nueva evaluación (con datos precargados) | Alta | 5h |
| 3.2 | Registro de bioimpedancia en evaluación (comparativa con anterior) | Alta | 5h |
| 3.3 | Upload de fotos de progreso en evaluación | Alta | 4h |
| 3.4 | Historial de evaluaciones del cliente (timeline) | Alta | 5h |
| 3.5 | Vista detallada de una evaluación | Alta | 4h |
| 3.6 | Indicador de "días desde última evaluación" | Media | 2h |
| 3.7 | Alertas de evaluaciones pendientes en dashboard | Media | 3h |
| 3.8 | Actualización de objetivos durante evaluación | Media | 3h |

**Entrega:** Sistema completo de evaluaciones periódicas con historial.

**Demo:** Entrenador crea evaluación trimestral, registra nuevos datos, ve historial.

---

### 📦 Sprint 4 — Dashboard de Progreso y Gráficas (Semana 9-10)

**Objetivo:** Visualización de la evolución del cliente con gráficas y comparativas.

| # | Tarea | Prioridad | Estimación |
|---|---|---|---|
| 4.1 | Gráfica de evolución de peso a lo largo del tiempo | Alta | 4h |
| 4.2 | Gráfica de composición corporal (grasa vs músculo vs agua) | Alta | 5h |
| 4.3 | Gráfica de evolución de IMC | Media | 3h |
| 4.4 | Tabla comparativa entre evaluaciones (lado a lado) | Alta | 5h |
| 4.5 | Slider antes/después de fotos de progreso | Alta | 6h |
| 4.6 | Indicadores de tendencia (flechas arriba/abajo con %) | Alta | 3h |
| 4.7 | Selector de rango de fechas para las gráficas | Media | 3h |
| 4.8 | Cards resumen en el perfil (últimos datos clave) | Media | 3h |

**Entrega:** Dashboard visual con la evolución completa del cliente.

**Demo:** Entrenador muestra al cliente su progreso con gráficas y fotos comparativas.

---

### 📦 Sprint 5 — Generación de Reportes PDF (Semana 11-12)

**Objetivo:** Generar reportes profesionales en PDF para entregar al cliente.

| # | Tarea | Prioridad | Estimación |
|---|---|---|---|
| 5.1 | Template del reporte PDF (diseño con logo del gym) | Alta | 6h |
| 5.2 | Sección de datos personales en PDF | Alta | 2h |
| 5.3 | Sección de bioimpedancia actual vs anterior | Alta | 4h |
| 5.4 | Inclusión de gráficas en el PDF | Alta | 5h |
| 5.5 | Inclusión de fotos de progreso (comparativa) en PDF | Alta | 4h |
| 5.6 | Sección de objetivos y observaciones del entrenador | Media | 3h |
| 5.7 | API Route para generación y descarga del PDF | Alta | 4h |
| 5.8 | Botón "Generar Reporte" en perfil y evaluación | Alta | 2h |

**Entrega:** Reportes PDF profesionales generados automáticamente.

**Demo:** Entrenador genera un PDF con logo del gym, datos, gráficas y fotos del cliente.

---

### 📦 Sprint 6 — Configuración del Gym y Branding (Semana 13-14)

**Objetivo:** Personalización del gym (logo, colores) y funcionalidades de administración.

| # | Tarea | Prioridad | Estimación |
|---|---|---|---|
| 6.1 | Página de configuración del gym | Alta | 4h |
| 6.2 | Upload y recorte de logo | Alta | 4h |
| 6.3 | Selector de color primario (se aplica a toda la app) | Media | 3h |
| 6.4 | Gestión de entrenadores (invitar, roles) | Media | 5h |
| 6.5 | Perfil del entrenador (editar datos propios) | Media | 3h |
| 6.6 | CSS custom properties dinámicas para theming | Media | 3h |
| 6.7 | Logo visible en header, PDF y portal del cliente | Alta | 2h |

**Entrega:** El gym puede personalizar la app con su logo y colores.

**Demo:** Admin sube el logo, elige color primario, y toda la app refleja la marca.

---

### 📦 Sprint 7 — Portal del Cliente y Notificaciones (Semana 15-16)

**Objetivo:** El cliente puede ver su propio progreso y el sistema envía recordatorios.

| # | Tarea | Prioridad | Estimación |
|---|---|---|---|
| 7.1 | Generar link/token único por cliente | Alta | 3h |
| 7.2 | Portal del cliente (vista read-only) | Alta | 6h |
| 7.3 | Mostrar datos de progreso, gráficas y fotos | Alta | 5h |
| 7.4 | Generar código QR para acceso rápido al perfil | Media | 2h |
| 7.5 | Configurar Resend para emails transaccionales | Media | 3h |
| 7.6 | Email de bienvenida al cliente con link a su portal | Media | 3h |
| 7.7 | Cron job para recordatorio de evaluación (cada 90 días) | Media | 4h |
| 7.8 | Notificación por email al entrenador | Media | 3h |

**Entrega:** Los clientes pueden ver su progreso y el sistema alerta sobre seguimientos.

**Demo:** Cliente accede a su portal con QR, ve sus datos. Entrenador recibe email de recordatorio.

---

### 📦 Sprint 8 — Pulido, Testing y Optimización (Semana 17-18)

**Objetivo:** Testing, accesibilidad, optimización de rendimiento y UX final.

| # | Tarea | Prioridad | Estimación |
|---|---|---|---|
| 8.1 | Tests unitarios para lógica de negocio (Vitest) | Alta | 6h |
| 8.2 | Tests E2E del flujo de onboarding (Playwright) | Alta | 6h |
| 8.3 | Optimización de imágenes (next/image, lazy load, WebP) | Alta | 4h |
| 8.4 | Revisión de accesibilidad (a11y) | Media | 4h |
| 8.5 | Loading states y skeleton screens | Media | 3h |
| 8.6 | Error boundaries y manejo de errores global | Alta | 3h |
| 8.7 | PWA básico (manifest + offline fallback) | Baja | 3h |
| 8.8 | Revisión de seguridad (RLS, sanitización, CORS) | Alta | 4h |
| 8.9 | Documentación README y guía de deploy | Media | 3h |

**Entrega:** Producto pulido, testeado y listo para producción.

---

## 8. Roadmap Visual

```
Semana  1  2  3  4  5  6  7  8  9  10  11  12  13  14  15  16  17  18
        ┌─────┐
Sprint 0│ 🔧  │ Fundación + Auth + Layout
        └─────┘
              ┌─────┐
Sprint 1      │ 📝  │ Wizard de Onboarding         ← PRIMERA ENTREGA USABLE
              └─────┘
                    ┌─────┐
Sprint 2            │ 👥  │ Listado + Perfil
                    └─────┘
                          ┌─────┐
Sprint 3                  │ 📋  │ Evaluaciones
                          └─────┘
                                ┌─────┐
Sprint 4                        │ 📊  │ Dashboard + Gráficas
                                └─────┘
                                      ┌─────┐
Sprint 5                              │ 📄  │ Reportes PDF
                                      └─────┘
                                            ┌─────┐
Sprint 6                                    │ 🎨  │ Branding
                                            └─────┘
                                                  ┌─────┐
Sprint 7                                          │ 🌐  │ Portal + Notif.
                                                  └─────┘
                                                        ┌─────┐
Sprint 8                                                │ ✅  │ Pulido
                                                        └─────┘
```

---

## 9. MVP vs Producto Completo

### 9.1 MVP (Sprints 0-2, ~6 semanas)

Con solo los primeros 3 sprints ya tienes un producto funcional:
- ✅ Login de entrenador
- ✅ Onboarding completo de clientes (wizard de 6 pasos)
- ✅ Listado y búsqueda de clientes
- ✅ Perfil completo del cliente con datos, objetivos, patologías, bioimpedancia y fotos

**Esto ya es suficiente para que un entrenador lo use diariamente.**

### 9.2 Producto Completo (Sprints 0-8, ~18 semanas)

Añade las capas de valor profesional:
- ✅ Todo el MVP
- ✅ Evaluaciones periódicas con historial
- ✅ Gráficas de evolución y comparativas
- ✅ Reportes PDF profesionales
- ✅ Branding personalizable
- ✅ Portal del cliente
- ✅ Notificaciones automáticas

### 9.3 Futuro (Post-lanzamiento)

- Integración directa con básculas de bioimpedancia (Bluetooth/API)
- App móvil nativa con React Native
- Módulo de planes de entrenamiento
- Módulo de nutrición
- Análisis con IA de tendencias y recomendaciones
- Multi-idioma (i18n)
- Exportación masiva de datos (CSV)
- Integración con Google Calendar para citas
- Modo offline (Service Worker + IndexedDB)
- Planes de pago y facturación (Stripe)

---

## 10. Consideraciones de Seguridad y Privacidad

### 10.1 Datos Sensibles

Este sistema maneja **datos de salud** (patologías, composición corporal) y **fotos personales**, lo cual requiere:

| Aspecto | Implementación |
|---|---|
| **Encriptación en tránsito** | HTTPS obligatorio (Vercel lo incluye) |
| **Encriptación en reposo** | Supabase/Neon encriptan por defecto |
| **Acceso a fotos** | URLs firmadas con expiración (signed URLs) |
| **Autenticación** | JWT con refresh tokens, sesiones seguras |
| **Autorización** | RLS en Supabase o middleware en Next.js por rol |
| **Datos médicos** | Consentimiento explícito del cliente al registrarse |
| **Backup** | Backups automáticos diarios de la base de datos |
| **RGPD/GDPR** | Botón de "eliminar mis datos" en el portal del cliente |
| **Auditoría** | Log de quién accedió a qué perfil y cuándo |

### 10.2 Consentimiento del Cliente

En el Step 1 del wizard, incluir un checkbox obligatorio:

> "Autorizo al gimnasio [nombre] a almacenar mis datos personales, datos de salud y fotografías con el fin de realizar seguimiento de mi progreso físico. Puedo solicitar la eliminación de mis datos en cualquier momento."

---

## 11. Métricas de Éxito

| Métrica | Objetivo | Cómo medir |
|---|---|---|
| **Tiempo de onboarding** | < 5 minutos por cliente | Analytics en el wizard |
| **Adopción** | > 80% de clientes registrados en 1 mes | Clientes registrados / clientes totales |
| **Retención** | Evaluación trimestral completada en > 70% | Evaluaciones vs clientes activos |
| **Satisfacción** | NPS > 8 | Encuesta post-evaluación |
| **Reportes generados** | > 50% de evaluaciones generan PDF | PDFs / evaluaciones |

---

## 12. Estimación de Costos de Infraestructura

| Servicio | Plan | Costo Mensual |
|---|---|---|
| **Vercel** | Pro | $20/mes |
| **Supabase** | Pro (8GB DB, 100GB storage) | $25/mes |
| **Resend** | Free (hasta 3,000 emails/mes) | $0 |
| **Cloudinary** (si se usa) | Free tier (25GB) | $0 |
| **Dominio** | .com | ~$12/año |
| **Total estimado** | | **~$46/mes** |

Para un gimnasio pequeño-mediano (hasta ~200 clientes), estos costos son más que suficientes.

---

*Documento generado como plan de referencia. Actualizar conforme avance el desarrollo.*
