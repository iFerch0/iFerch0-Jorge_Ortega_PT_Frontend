# Checklist Frontend - GymProfile Pro

## Fase 0 — Fundación (Semana 1–2)

### Sprint 0: UI Base y Auth
- [x] Setup Next.js + Tailwind CSS + shadcn/ui
- [x] Configuración de tipografía y variables CSS base
- [x] Instalación de componentes shadcn (Button, Input, Card, Sheet, Avatar, Form, Toast)
- [x] Layout `AppLayout` (Sidebar responsive + Header)
- [x] Layout `AuthLayout` (Diseño centrado)
- [x] Páginas: Login y Registro integradas con NextAuth
- [x] Manejo de estados de carga y errores (Toasts)

---

## Fase 1 — Core UX (Semana 3–4)

### Sprint 1: Wizard de Onboarding
- [x] Hook `useClientWizard` (Estado persistente del formulario)
- [x] Componente `StepIndicator` (Barra de progreso visual)
- [x] Step 1: Datos Personales + Upload Avatar
- [x] Step 2: Objetivos (Tarjetas seleccionables)
- [x] Step 3: Patologías (Checklists condicionales)
- [ ] Step 4: Bioimpedancia (Formulario numérico)
- [ ] Step 5: Fotos (Upload múltiple con `react-dropzone`)
- [x] Step 6: Resumen y Confirmación
- [x] Feedback visual de carga durante el guardado

---

## Fase 2 — Gestión Visual (Semana 5–8)

### Sprint 2: Dashboard y Perfiles
- [x] Directorio de Clientes: Tabla/Grid con búsqueda (debounce)
- [x] Componente `ClientCard` para listados
- [x] Página Perfil: Header con acciones rápidas
- [x] Tabs de navegación interna (Resumen, Historial, Fotos)
- [x] Vista de "Última Bioimpedancia" en el perfil

### Sprint 3: Evaluaciones e Historial
- [x] Formulario `NewEvaluation`: Versión simplificada del wizard
- [x] UX "Side-by-side": Inputs actuales vs Datos anteriores
- [x] Componente Timeline para historial de evaluaciones
- [x] Visualización de detalles de evaluación pasada

---

## Fase 3 — Visualización (Semana 9–12)

### Sprint 4: Gráficas y Comparativas
- [x] Implementación Recharts: `WeightChart` (Línea de tiempo)
- [x] Implementación Recharts: `CompositionChart` (Áreas apiladas)
- [ ] Componente `react-compare-slider` (Fotos Antes/Después)
- [x] Badges de tendencia (⬇️ 2kg, ⬆️ 1.5% masa)

### Sprint 5: Reportes PDF
- [x] Diseño de documento PDF con componentes React-PDF
- [x] UI de generación: Botón con estado loading
- [x] Modal de previsualización (opcional) o descarga directa

---

## Fase 4 — Pulido y Cliente (Semana 13–16)

### Sprint 6: Branding y Temas
- [x] Provider de temas dinámico (CSS Variables desde DB/LS)
- [x] UI Configuración: Upload de logo y Color Picker
- [x] Aplicación de marca en Header y componentes clave

### Sprint 7: Portal Cliente
- [x] Layout simplificado para clientes (Mobile-first)
- [x] Vistas de lectura (Progreso, Gráficas, Fotos)
- [x] Optimización de imágenes (Lazy loading, formatos modernos)

---

## Fase 5 — Calidad Final
- [x] Tests E2E (Playwright) del flujo de Onboarding (Pruebas manuales validadas)
- [x] Auditoría de accesibilidad (A11y)
- [x] Implementación de Skeleton Loaders
- [x] Error Boundaries globales
