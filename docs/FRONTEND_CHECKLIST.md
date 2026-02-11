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
- [ ] Directorio de Clientes: Tabla/Grid con búsqueda (debounce)
- [ ] Componente `ClientCard` para listados
- [ ] Página Perfil: Header con acciones rápidas
- [ ] Tabs de navegación interna (Resumen, Historial, Fotos)
- [ ] Vista de "Última Bioimpedancia" en el perfil

### Sprint 3: Evaluaciones e Historial
- [ ] Formulario `NewEvaluation`: Versión simplificada del wizard
- [ ] UX "Side-by-side": Inputs actuales vs Datos anteriores
- [ ] Componente Timeline para historial de evaluaciones
- [ ] Visualización de detalles de evaluación pasada

---

## Fase 3 — Visualización (Semana 9–12)

### Sprint 4: Gráficas y Comparativas
- [ ] Implementación Recharts: `WeightChart` (Línea de tiempo)
- [ ] Implementación Recharts: `CompositionChart` (Áreas apiladas)
- [ ] Componente `react-compare-slider` (Fotos Antes/Después)
- [ ] Badges de tendencia (⬇️ 2kg, ⬆️ 1.5% masa)

### Sprint 5: Reportes PDF
- [ ] Diseño de documento PDF con componentes React-PDF
- [ ] UI de generación: Botón con estado loading
- [ ] Modal de previsualización (opcional) o descarga directa

---

## Fase 4 — Pulido y Cliente (Semana 13–16)

### Sprint 6: Branding y Temas
- [ ] Provider de temas dinámico (CSS Variables desde DB)
- [ ] UI Configuración: Upload de logo y Color Picker
- [ ] Aplicación de marca en Header y componentes clave

### Sprint 7: Portal Cliente
- [ ] Layout simplificado para clientes (Mobile-first)
- [ ] Vistas de lectura (Progreso, Gráficas, Fotos)
- [ ] Optimización de imágenes (Lazy loading, formatos modernos)

---

## Fase 5 — Calidad Final
- [ ] Tests E2E (Playwright) del flujo de Onboarding
- [ ] Auditoría de accesibilidad (A11y)
- [ ] Implementación de Skeleton Loaders
- [ ] Error Boundaries globales
