# 🎨 Plan de Desarrollo Frontend - GymProfile Pro

Este documento desglosa las tareas, componentes y UX del frontend, basándose en el roadmap general del proyecto.

## 🛠️ Stack Tecnológico
- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **UI Kit:** shadcn/ui
- **Iconos:** Lucide React
- **Estado/Formularios:** React Hook Form + Zod + Zustand (si es necesario estado global complejo)
- **Gráficas:** Recharts
- **Animaciones:** Framer Motion
- **Soporte Visual:** React-pdf (viewer), React-dropzone, React-compare-slider

---

## 🖌️ Roadmap Frontend por Sprints

### 📦 Sprint 0: Fundación UI y Auth

**Objetivo:** Configurar el sistema de diseño y las vistas de acceso.

1.  **Setup Inicial**
    -   Instalar Next.js, Tailwind y shadcn/ui.
    -   Configurar fuente (Inter o similar) y variables CSS para colores (soporte para personalización futura).
2.  **Componentes Base (shadcn/ui)**
    -   Instalar: Button, Input, Card, Sheet, Avatar, DropdownMenu, Form, Toast.
3.  **Layouts**
    -   `AppLayout`: Sidebar de navegación responsiva, Header con usuario actual.
    -   `AuthLayout`: Centrado, limpio, para login/registro.
4.  **Páginas de Autenticación**
    -   Formulario de Login y Registro con validación Zod.
    -   Feedback visual de errores (toasts).

### 📦 Sprint 1: The Wizard (Onboarding de Cliente)

**Objetivo:** Crear la experiencia central de captura de datos. Esta es la parte más compleja del UI.

1.  **Arquitectura del Wizard**
    -   Crear hook `useClientWizard` para manejar el estado entre pasos (sin perder datos al ir atrás).
    -   Componente `StepIndicator`: Visualización de progreso (paso 1 de 6).
2.  **Pasos del Formulario (Componentes)**
    -   `StepPersonalData`: Inputs estándar + upload de avatar.
    -   `StepObjectives`: Tarjetas seleccionables (fuerza, pérdida peso) + inputs de texto.
    -   `StepPathologies`: Lista de checkbox con detalles condicionales "Si sí, ¿cuál?".
    -   `StepBioimpedance`: Grid de inputs numéricos (peso, % grasa, etc.).
    -   `StepPhotos`: Componente de upload múltiple (Frente, Perfil, Espalda). Integración con `react-dropzone`.
    -   `StepReview`: Resumen de todo antes de enviar.
3.  **Feedback de Carga**
    -   States de loading mientras se suben imágenes y se guardan datos.

### 📦 Sprint 2: Dashboard y Perfiles

**Objetivo:** Listar clientes y mostrar su "Ficha Técnica".

1.  **Directorio de Clientes**
    -   Tabla/Grid de clientes con buscador en tiempo real (debounce).
    -   Filtros (Activos, Archivados, Etiquetas).
    -   `ClientCard`: Componente resumen con foto, nombre y status.
2.  **Perfil de Cliente (Vista Detallada)**
    -   Header del perfil con acciones rápidas (Nueva eval, Editar).
    -   Tabs de navegación interna: "Resumen", "Evaluaciones", "Fotos", "Configuración".
    -   Visualización de datos actuales (Bioimpedancia más reciente).

### 📦 Sprint 3: Flujo de Evaluación

**Objetivo:** Interfaz para actualizaciones periódicas.

1.  **Formulario de Evaluación**
    -   Variante simplificada del Wizard: Solo Bioimpedancia + Fotos + Notas.
    -   Visualización de "Datos Anteriores" al lado de los inputs para referencia rápida (UX vital).
2.  **Timeline**
    -   Lista vertical de evaluaciones pasadas.
    -   Click en una evaluación para ver detalle histórico.

### 📦 Sprint 4: Visualización de Datos (The "Wow" Factor)

**Objetivo:** Gráficas y comparativas visuales.

1.  **Gráficas de Progreso (Recharts)**
    -   `WeightChart`: Línea de tiempo de peso.
    -   `CompositionChart`: Área apilada o líneas multi-eje (Masa Muscular vs Grasa).
2.  **Comparador de Fotos**
    -   Implementar `react-compare-slider`.
    -   Interfaz para seleccionar "Fecha A" y "Fecha B" y comparar las fotos.
3.  **Indicadores de Cambio**
    -   Badges con flechas (⬇️ 2.4kg) calculados en el frontend o recibidos del back.

### 📦 Sprint 5: Reportes y PDF

**Objetivo:** Visualización y descarga de entregables.

1.  **Diseño de PDF**
    -   Crear documento React-PDF (`<Document>`, `<Page>`) que replique el branding.
2.  **UI de Generación**
    -   Botón con estado de carga "Generando reporte...".
    -   Modal de vista previa (opcional) o descarga directa.

### 📦 Sprint 6: Branding y Ajustes UI

**Objetivo:** Personalización estética.

1.  **Manejo de Temas**
    -   Usar variables CSS (`--primary`) que puedan ser sobreescritas por la configuración del Gym obtenida del backend.
2.  **UI de Configuración**
    -   Formularios para subir Logo del gym.
    -   Color picker para elegir color de marca.

### 📦 Sprint 7: Portal Cliente

**Objetivo:** Vista simplificada para el usuario final.

1.  **Layout Cliente**
    -   Versión "Read-Only" del perfil. Similiar al perfil del entrenador pero sin botones de edición.
    -   Mobile-first: Optimizado para ver en celular.

---

## 🎨 Guía de Estilo UI
-   **Tipografía:** Limpia, sans-serif (Inter, Geist Sans).
-   **Espaciado:** Generoso, usar escalas de Tailwind (p-4, p-6, p-8).
-   **Feedback:** Todo botón de acción debe tener estado `loading` o `disabled`.
-   **Mobile:** El dashboard del entrenador debe ser usable en iPad/Tablet.
