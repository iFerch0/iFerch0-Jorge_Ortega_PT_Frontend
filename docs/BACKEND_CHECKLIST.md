# Checklist Backend - GymProfile Pro

## Fase 0 — Fundación (Semana 1–2)

### Sprint 0: Infraestructura y Auth
- [x] Initializar proyecto Supabase/Neon + Variables de Entorno
- [x] `npx prisma init` + Configuración inicial
- [x] Schema Base: `User`, `Gym`, `Account` (NextAuth)
- [x] Script `seed.ts` (Admin/Entrenador inicial)
- [x] Configuración NextAuth v5 (Providers, Callbacks, Middleware)
- [x] Configuración Storage (Supabase/Cloudinary)
- [x] Utilidades de servidor para subida de archivos
- [x] Configuración Swagger (OpenAPI) + Swagger UI


---

## Fase 1 — MVP Operable (Semana 3–4)

### Sprint 1: Lógica de Clientes (Onboarding)
- [x] Schema Extendido: `Client`, `Objective`, `Pathology`, `Bioimpedance`, `ProgressPhoto`
- [x] Migraciones de base de datos ejecutadas
- [x] API Endpoint: `POST /api/clients` (Creación con transacciones)
- [x] Validaciones Zod estrictas en backend
- [x] API Endpoints para subida segura de fotos de progreso

---

## Fase 2 — Gestión y Datos (Semana 5–8)

### Sprint 2: Consultas y Gestión
- [x] API Endpoint `GET /api/clients`: Paginación, Búsqueda y Filtros
- [x] API Endpoint `GET /api/clients/:id`: Fetch profundo (con última evaluación)
- [x] API Endpoint `PATCH /api/clients/:id`: Edición de datos personales
- [x] API Endpoint `DELETE /api/clients/:id`: Archivado lógico

### Sprint 3: Sistema de Evaluaciones
- [x] Modelado DB: Relación Evaluation -> Bioimpedancia/Fotos
- [x] API Endpoint `POST /api/evaluations`: Registro de snapshot periódico
- [x] Lógica para copiar objetivos al historial
- [x] API Endpoint `GET /api/clients/:id/history`: Timeline cronológico

---

## Fase 3 — Valor Diferencial (Semana 9–12)

### Sprint 4: Analítica
- [x] Endpoint `getClientProgressStats`: JSON para Recharts
- [x] Lógica de cálculo de Deltas (Actual vs Anterior)
- [x] Query "Evaluaciones Pendientes" para dashboard
- [x] Aggregations: Contadores de clientes activos/totales

### Sprint 5: Reportes y Archivos
- [x] Configuración `@react-pdf/renderer` en servidor
- [x] Endpoint para generación de stream PDF
- [x] Seguridad: Validación de permisos para descarga

---

## Fase 4 — Operación y Configuración (Semana 13–16)

### Sprint 6: Configuración del Gym
- [x] API Endpoint `PATCH /api/gym`: Configuración (Logo, Colores)
- [x] Lógica de actualización de usuario/entrenador
- [x] Sistema de invitación de usuarios (básico)

### Sprint 7: Automatización
- [x] Generación de tokens de acceso para clientes
- [x] Configuración Cron Jobs (Vercel Cron) para alertas
- [x] Integración Resend (Emails de alerta y bienvenida)

---

### Fase 5 — Seguridad y Mantenimiento
- [x] Revisión de RLS (Row Level Security logic via GymId)
- [x] Auditoría de logs (AuditLog implementation)
- [x] Tests de integración para flujos críticos
