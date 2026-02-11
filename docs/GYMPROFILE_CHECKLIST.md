# Checklist del Proyecto - GymProfile Pro

Este checklist unifica las tareas de Backend y Frontend para el seguimiento del desarrollo de GymProfile Pro.

## Fase 0 — Fundación (Semana 1–2)

### Sprint 0: Infraestructura, Auth y Base de Datos
**Backend**
- [ ] Configuración inicial Supabase/Neon + Variables de Entorno
- [ ] Prisma Init + Schema Base (User, Gym, Account)
- [ ] Seed inicial (Admin/Entrenador)
- [ ] Configuración NextAuth v5 (Providers, Callbacks, Middleware)
- [ ] Configuración Storage (Supabase/Cloudinary) + Utilidades de subida

**Frontend**
- [ ] Setup Next.js + Tailwind CSS + shadcn/ui
- [ ] Configuración de fuentes y variables CSS (Theming base)
- [ ] Instalación componentes shadcn esenciales (Button, Input, Card, Sheet, Avatar, Form, Toast)
- [ ] Layouts: `AppLayout` (Sidebar + Header) y `AuthLayout` (Centrado)
- [ ] Páginas: Login y Registro con validación Zod
- [ ] Feedback visual de errores (Toasts)

---

## Fase 1 — Core Core: Onboarding (Semana 3–4)

### Sprint 1: Wizard de Clientes
**Backend**
- [ ] Schema Extendido: Client, Objective, Pathology, Bioimpedance, ProgressPhoto
- [ ] Migraciones DB ejecutadas
- [ ] Server Action: `createClient` (Transacción compleja)
- [ ] Server Action/API: Upload de fotos de progreso (seguro)
- [ ] Validación Zod estricta en servidor

**Frontend**
- [ ] Hook `useClientWizard` (Gestión estado multi-paso)
- [ ] Componente `StepIndicator` (Progreso visual)
- [ ] Step 1: Datos Personales + Avatar
- [ ] Step 2: Objetivos (Tarjetas seleccionables)
- [ ] Step 3: Patologías (Checklists condicionales)
- [ ] Step 4: Bioimpedancia (Formulario métricas)
- [ ] Step 5: Fotos (Upload múltiple con `react-dropzone`)
- [ ] Step 6: Review + Submit
- [ ] States de Loading y feedback

---

## Fase 2 — Gestión y Fidelización (Semana 5–8)

### Sprint 2: Dashboard y Perfiles
**Backend**
- [ ] Query `getClients`: Paginación, Búsqueda, Filtros
- [ ] Query `getClientById`: Fetch relaciones (Objetivos, Última Evaluación)
- [ ] Action `updateClient`: Edición de perfil
- [ ] Action `toggleClientStatus`: Activar/Archivar

**Frontend**
- [ ] Directorio de Clientes: Tabla/Grid con búsqueda (debounce)
- [ ] `ClientCard`: Resumen visual
- [ ] Perfil Detallado: Header + Tabs (Resumen, Evaluaciones, Fotos)
- [ ] Visualización de última Bioimpedancia en perfil

### Sprint 3: Sistema de Evaluaciones
**Backend**
- [ ] Relación DB: Evaluation -> Bioimpedancia/Fotos
- [ ] Action `createEvaluation`: Snapshot del estado actual
- [ ] Query `getClientHistory`: Timeline de evaluaciones ordenadas

**Frontend**
- [ ] Formulario `NewEvaluation`: Bioimpedancia + Fotos + Notas
- [ ] Visualización "Side-by-side": Inputs actuales vs Datos anteriores
- [ ] Timeline component: Lista vertical de historial

---

## Fase 3 — Valor Diferencial (Semana 9–12)

### Sprint 4: Analítica y Visualización (Wow Factor)
**Backend**
- [ ] Endpoint `getClientProgressStats`: JSON optimizado para gráficas
- [ ] Cálculo de Deltas (Cambio vs evaluación anterior)
- [ ] Query "Evaluaciones Pendientes" para Dashboard Entrenador

**Frontend**
- [ ] Gráfica `WeightChart` (Evolución peso) con Recharts
- [ ] Gráfica `CompositionChart` (Masa Muscular vs Grasa)
- [ ] Comparador Fotos: `react-compare-slider` (Antes vs Después)
- [ ] Badges de indicadores de cambio (⬇️ kg / ⬆️ músculo)

### Sprint 5: Reportes PDF
**Backend**
- [ ] Setup `@react-pdf/renderer` en servidor
- [ ] Endpoint para stream de PDF (Seguro, solo owner)

**Frontend**
- [ ] Diseño documento PDF (React-PDF components)
- [ ] UI Generación: Botón "Generar Reporte" + Loading/Preview
- [ ] Descarga directa del archivo

---

## Fase 4 — Producto Polished (Semana 13–16)

### Sprint 6: Configuración y Branding
**Backend**
- [ ] Action `updateGymSettings` (Logo, Colores)
- [ ] Gestión usuarios (Invitar entrenadores - RBAC básico)

**Frontend**
- [ ] Theme Provider dinámico (Variables CSS desde DB)
- [ ] UI Configuración: Upload logo + Color Picker
- [ ] Aplicar branding en Header, PDF y Login

### Sprint 7: Portal Cliente y Automatización
**Backend**
- [ ] Generación de Magic Links / Tokens permanentes
- [ ] Cron Job: Detectar evaluaciones vencidas (>90 días)
- [ ] Email Service (Resend): Recordatorios y Bienvenida

**Frontend**
- [ ] Layout "Portal": Read-only, mobile-optimized
- [ ] Vista de progreso simplificada para cliente

---

## Fase 5 — Optimización
### Sprint 8: Pulido Final
- [ ] [BE/FE] Tests E2E (Playwright) Flujo Onboarding
- [ ] [BE/FE] Accesibilidad (A11y check)
- [ ] [FE] Skeleton Loads y Error Boundaries
- [ ] [BE] Revisión seguridad RLS y Headers
