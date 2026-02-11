# Guía de Integración Frontend - GymProfile Pro

Este documento describe el flujo de integración de los servicios Backend para la aplicación Frontend.

## 🔐 1. Autenticación y Sesión

- **Mecanismo**: Cookies `httpOnly` (NextAuth v5).
- **Persistencia**: Automática. El navegador envía la cookie en cada petición a `/api/*`.
- **Login**: Se gestiona vía `/api/auth/signin` (Formulario de NextAuth).
- **Middleware**: Si la cookie no existe, el backend retornará `401 Unauthorized`.

### Endpoint: Login (`POST /api/auth/callback/credentials`)

Para iniciar sesión desde un frontend externo, debes usar este endpoint.

**Body (JSON):**
```json
{
  "email": "ejemplo@gym.com",
  "password": "password123",
  "redirect": false,
  "csrfToken": "..." // Opcional dependiendo de la config, intentar primero sin él o obtenerlo de /api/auth/csrf
}
```

**Respuesta Exitosa:**
El backend seteará la cookie `authjs.session-token` automáticamente.
- **Status**: 200 OK
- **Body**: Objeto JSON con la sesión o URL de redirección.


---

## 📊 2. Dashboard Principal

Al entrar, el usuario (Entrenador) ve un resumen de su actividad.

### Endpoint: `GET /api/dashboard/stats`

**Uso**: Cargar contadores y lista de "Evaluaciones Pendientes" (Clientes activos sin evaluar en 30+ días).

**Respuesta JSON:**
```json
{
  "pendingEvaluations": [
    {
      "id": "client_id_123",
      "name": "Juan Perez",
      "lastEvaluationDate": "2024-01-15T10:00:00.000Z", // o null
      "daysSinceLastEvaluation": 26 // o "Never"
    }
  ],
  "stats": {
    "totalClients": 50,
    "activeClients": 45,
    "inactiveClients": 5
  }
}
```

---

## 👥 3. Gestión de Clientes

### Flujo A: Listado y Búsqueda
Vista principal de clientes con tabla/lista paginada.

**Endpoint:** `GET /api/clients`

**Parámetros (Query Strings):**
- `page`: Número de página (default 1).
- `limit`: Items por página (default 10).
- `search`: Texto para buscar por nombre o email.
- `status`: Filtro (`ACTIVE`, `INACTIVE`, `ARCHIVED`).

**Ejemplo de llamada:**
`/api/clients?page=1&limit=20&search=maria&status=ACTIVE`

**Respuesta:**
```json
{
  "data": [ ...array de clientes ],
  "meta": { "total": 40, "page": 1, "lastPage": 2 }
}
```

### Flujo B: Crear Nuevo Cliente
Botón "Nuevo Cliente" -> Modal/Formulario.

**Endpoint:** `POST /api/clients`

**Body JSON:**
```json
{
  "firstName": "Carlos",
  "lastName": "Ruiz",
  "email": "carlos@gmail.com", // Opcional
  "phone": "+573001234567", // Opcional
  "birthDate": "1995-05-20", // String ISO YYYY-MM-DD
  "gender": "MALE", // MALE, FEMALE, OTHER
  "height": 175, // cm (Number)
  // Opcional: Objetivos iniciales
  "objectives": [{ "content": "Aumentar masa muscular" }],
  // Opcional: Patologías
  "pathologies": [{ "name": "Asma", "severity": "Low" }]
}
```

### Flujo C: Detalle del Cliente
Al hacer clic en un cliente.

**Endpoint:** `GET /api/clients/:id`

Muestra perfil, objetivos activos y accesos directos a historial. Retorna también la **última evaluación** (bioimpedancia y fotos) para mostrar progreso rápido.

---

## 📝 4. Nueva Evaluación (Core Flow)

Desde el detalle del cliente -> Botón "Nueva Evaluación".

**Endpoint:** `POST /api/evaluations`

⚠️ **Importante**: Requiere `multipart/form-data` por las fotos.

**Campos del Formulario:**
1. **Datos Básicos**: `clientId` (Hidden), `date` (Date picker), `notes` (Textarea).
2. **Bioimpedancia** (Inputs Numéricos):
   - `weight` (Requerido)
   - `fatPercentage`, `muscleMass`, `visceralFat`, `boneMass`, `bodyWater`, `metabolicAge`
3. **Fotos de Progreso** (File Input):
   - `front`, `back`, `side`

**Ejemplo de Integración (JavaScript):**
```javascript
const formData = new FormData();
formData.append('clientId', 'xyz_123');
formData.append('weight', 75.5);
formData.append('notes', 'Mejora notable en espalda');
if (fileFront) formData.append('front', fileFront);
if (fileBack) formData.append('back', fileBack);
// Etc...

await fetch('/api/evaluations', {
  method: 'POST',
  body: formData // No setear Content-Type manual, el navegador lo hace con boundary
});
```

---

## 📈 5. Historial y Reportes

### Flujo A: Ver Historial
Pestaña "Progreso" o "Historial" en el perfil del cliente.

**Endpoint:** `GET /api/clients/:id/history`

Retorna array de evaluaciones ordenadas por fecha (más reciente primero). Ideal para gráficos de línea (Progreso de Peso/Grasa).

### Flujo B: Descargar PDF
Botón "Descargar PDF" en una evaluación específica del historial.

**Endpoint:** `GET /api/reports/evaluation/:evaluationId/pdf`

Este endpoint retorna un `stream` de archivo. El frontend debe manejarlo como descarga de Blob.

**Ejemplo:**
```javascript
const res = await fetch(`/api/reports/evaluation/${evalId}/pdf`);
const blob = await res.blob();
const url = window.URL.createObjectURL(blob);
// Crear link temporal y clicarlo
const a = document.createElement('a');
a.href = url;
a.download = `Reporte-${date}.pdf`;
a.click();
```

---

## ⚙️ 6. Configuración (Entrenador/Gym)

### Mi Perfil
**GET** `/api/users/profile`  
**PATCH** `/api/users/profile` (Nombre, Avatar)

### Configuración del Gym (Branding)
**GET** `/api/gym`  
**PATCH** `/api/gym`

Permite cambiar:
- `name`: Nombre del gimnasio.
- `primaryColor`: Color hexadecimal (ej. `#FF5733`) para personalizar los PDFs y el UI.
- `logo`: URL del logo (usar componente de subida similar a fotos o URL directa).

---

## 🧩 Anexo: Tipos TypeScript

Copia y pega estos tipos en tu proyecto Frontend (ej. `src/types/api.ts`) para tener autocompletado y validación.

```typescript
// --- CLIENTS ---

export interface CreateClientDTO {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: string; // ISO Date YYYY-MM-DD
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  height?: number;
  objectives?: { content: string }[];
  pathologies?: { 
    name: string; 
    severity?: 'Low' | 'Medium' | 'High'; 
    notes?: string; 
  }[];
}

export interface UpdateClientDTO extends Partial<Omit<CreateClientDTO, 'objectives' | 'pathologies'>> {
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

// --- EVALUATIONS ---

// Nota: Al usar FormData, estos son los nombres de los keys.
export interface CreateEvaluationFormData {
  clientId: string;
  date?: string; // ISO DateTime
  notes?: string;
  weight: number; // Requerido
  fatPercentage?: number;
  muscleMass?: number;
  visceralFat?: number;
  boneMass?: number;
  bodyWater?: number;
  metabolicAge?: number;
  // Archivos (File objects)
  front?: File;
  back?: File;
  side?: File;
}

// --- USERS & CONFIG ---

export interface InviteTrainerDTO {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role?: 'TRAINER'; // Default
}

export interface UpdateProfileDTO {
  name?: string;
  image?: string; // URL
}

export interface UpdateGymDTO {
  name?: string;
  logo?: string; // URL
  primaryColor?: string; // Hex format #RRGGBB
}

// --- AUTH ---

export interface LoginDTO {
  email: string;
  password: string;
  redirect: false;
  csrfToken?: string;
}
```

