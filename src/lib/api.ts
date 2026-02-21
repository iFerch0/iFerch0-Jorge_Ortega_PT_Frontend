import type {
  Client,
  CreateClientDTO,
  UpdateClientDTO,
  CreateEvaluationFormData,
  DashboardStats,
  Evaluation,
  PaginatedResponse,
  Session,
  UpdateProfileDTO,
  Gym,
  UpdateGymDTO,
  // New types for onboarding and me/trainer endpoints
  OnboardingStatus,
  AcceptConsentDTO,
  ChangePasswordDTO,
  ClientProfile,
  UpdateClientProfileDTO,
  UpdateAssessmentDTO,
  Bioimpedance,
  ProgressPhoto,
} from "@/types/api";

const API_BASE = "/api";

// ============================================
// Core fetch wrapper
// ============================================

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(options?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new ApiError(401, "No autenticado");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || body.message || `Error ${res.status}`);
  }

  // Handle empty responses (204, etc.)
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

// ============================================
// Auth
// ============================================

export const auth = {
  async getCsrfToken(): Promise<string> {
    const res = await fetch(`${API_BASE}/auth/csrf`, { credentials: "include" });
    const data = await res.json();
    return data.csrfToken;
  },

  async login(email: string, password: string): Promise<{ ok: boolean; error?: string; role?: string }> {
    const csrfToken = await this.getCsrfToken();

    const res = await fetch(`${API_BASE}/auth/callback/credentials`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken,
        email,
        password,
      }),
      redirect: "manual",
    });

    // NextAuth redirects on success (302 to /) or failure (302 to /login?error=...)
    const location = res.headers.get("location") || "";

    if (location.includes("error=")) {
      const errorParam = new URL(location, window.location.origin).searchParams.get("error");
      return {
        ok: false,
        error: errorParam === "CredentialsSignin"
          ? "Credenciales incorrectas. Verifica tu email/cédula y contraseña"
          : `Error de autenticación: ${errorParam}`,
      };
    }

    // Verify the session was established (cookie was set properly)
    const session = await this.getSession();
    if (!session?.user) {
      return {
        ok: false,
        error: "Credenciales incorrectas o no se pudo establecer la sesión.",
      };
    }

    return { ok: true, role: session.user.role };
  },

  async logout(): Promise<void> {
    const csrfToken = await this.getCsrfToken();
    await fetch(`${API_BASE}/auth/signout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ csrfToken }),
      redirect: "manual",
    });
  },

  async getSession(): Promise<Session | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/session`, { credentials: "include" });
      const data = await res.json();
      if (data?.user?.email) return data as Session;
      return null;
    } catch {
      return null;
    }
  },
};

// ============================================
// Dashboard
// ============================================

export const dashboard = {
  getStats(): Promise<DashboardStats> {
    return apiFetch<DashboardStats>("/dashboard/stats");
  },
};

// ============================================
// Clients
// ============================================

export const clients = {
  list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Client>> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.status && params.status !== "all") query.set("status", params.status.toUpperCase());
    const qs = query.toString();
    return apiFetch<PaginatedResponse<Client>>(`/clients${qs ? `?${qs}` : ""}`);
  },

  get(id: string): Promise<Client> {
    return apiFetch<Client>(`/clients/${id}`);
  },

  create(data: CreateClientDTO): Promise<Client> {
    return apiFetch<Client>("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateClientDTO): Promise<Client> {
    return apiFetch<Client>(`/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  archive(id: string): Promise<Client> {
    return this.update(id, { status: "ARCHIVED" });
  },
};

// ============================================
// Evaluations
// ============================================

export const evaluations = {
  getHistory(clientId: string): Promise<Evaluation[]> {
    return apiFetch<Evaluation[]>(`/clients/${clientId}/history`);
  },

  create(data: CreateEvaluationFormData): Promise<Evaluation> {
    const formData = new FormData();
    formData.append("clientId", data.clientId);
    if (data.date) formData.append("date", data.date);
    if (data.notes) formData.append("notes", data.notes);
    formData.append("weight", String(data.weight));
    if (data.bmi !== undefined) formData.append("bmi", String(data.bmi));
    if (data.bodyFat !== undefined) formData.append("bodyFat", String(data.bodyFat));
    if (data.muscleMass !== undefined) formData.append("muscleMass", String(data.muscleMass));
    if (data.visceralFat !== undefined) formData.append("visceralFat", String(data.visceralFat));
    // Removed boneMass
    if (data.skeletalMuscleMass !== undefined) formData.append("skeletalMuscleMass", String(data.skeletalMuscleMass));
    if (data.bodyWater !== undefined) formData.append("bodyWater", String(data.bodyWater));
    // Removed metabolicAge
    if (data.basalMetabolism !== undefined) formData.append("basalMetabolism", String(data.basalMetabolism));
    if (data.front) formData.append("front", data.front);
    if (data.back) formData.append("back", data.back);
    if (data.side) formData.append("side", data.side);
    if (data.bioimpedanceImage) formData.append("bioimpedance", data.bioimpedanceImage);

    return apiFetch<Evaluation>("/evaluations", {
      method: "POST",
      body: formData,
    });
  },

  async downloadPdf(evaluationId: string, filename?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/reports/evaluation/${evaluationId}/pdf`, {
      credentials: "include",
    });
    if (!res.ok) throw new ApiError(res.status, "Error al generar PDF");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `reporte-${evaluationId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};

// ============================================
// User Profile
// ============================================

export const users = {
  getProfile(): Promise<{ id: string; name: string; email: string; image: string | null; role: string; clientProfile?: { id: string } }> {
    return apiFetch("/users/profile");
  },

  updateProfile(data: UpdateProfileDTO) {
    return apiFetch("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// Gym Config
// ============================================

export const gym = {
  get(): Promise<Gym> {
    return apiFetch<Gym>("/gym");
  },

  update(data: UpdateGymDTO): Promise<Gym> {
    return apiFetch<Gym>("/gym", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// Me (Client Portal) - Onboarding & Profile
// ============================================

export const me = {
  // Onboarding
  getOnboardingStatus(): Promise<OnboardingStatus> {
    return apiFetch<OnboardingStatus>("/me/onboarding-status");
  },

  changePassword(data: ChangePasswordDTO): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>("/me/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  acceptConsent(data: AcceptConsentDTO): Promise<{ success: boolean; consentId: string }> {
    return apiFetch<{ success: boolean; consentId: string }>("/me/consents/accept", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  completeWizard(): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>("/me/wizard-complete", {
      method: "POST",
    });
  },

  // Profile
  getProfile(): Promise<ClientProfile> {
    return apiFetch<ClientProfile>("/me/profile");
  },

  updateProfile(data: UpdateClientProfileDTO): Promise<ClientProfile> {
    return apiFetch<ClientProfile>("/me/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Assessments (read-only for clients)
  getAssessments(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Evaluation>> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiFetch<PaginatedResponse<Evaluation>>(`/me/assessments${qs ? `?${qs}` : ""}`);
  },

  getAssessment(id: string): Promise<Evaluation> {
    return apiFetch<Evaluation>(`/me/assessments/${id}`);
  },

  // Photo upload
  async uploadPhotos(files: { front?: File; back?: File; side?: File }): Promise<ProgressPhoto> {
    const formData = new FormData();
    if (files.front) formData.append("front", files.front);
    if (files.back) formData.append("back", files.back);
    if (files.side) formData.append("side", files.side);

    return apiFetch<ProgressPhoto>("/me/photos", {
      method: "POST",
      body: formData,
    });
  },

  // Bioimpedance ticket upload
  async uploadBioimpedanceTicket(file: File): Promise<Bioimpedance> {
    const formData = new FormData();
    formData.append("ticket", file);

    return apiFetch<Bioimpedance>("/me/bioimpedance/ticket", {
      method: "POST",
      body: formData,
    });
  },
};

// ============================================
// Trainer - Assessment Management
// ============================================

export const trainer = {
  getAssessments(params?: { page?: number; limit?: number; clientId?: string }): Promise<PaginatedResponse<Evaluation & { client?: { firstName: string; lastName: string } }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.clientId) searchParams.set("clientId", params.clientId);
    const qs = searchParams.toString();
    return apiFetch(`/trainer/assessments${qs ? `?${qs}` : ""}`);
  },

  getAssessment(id: string): Promise<Evaluation> {
    return apiFetch<Evaluation>(`/trainer/assessments/${id}`);
  },

  updateAssessment(id: string, data: UpdateAssessmentDTO): Promise<Evaluation> {
    return apiFetch<Evaluation>(`/trainer/assessments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteAssessment(id: string): Promise<void> {
    return apiFetch<void>(`/trainer/assessments/${id}`, {
      method: "DELETE",
    });
  },

  async uploadClientTicket(clientId: string, file: File): Promise<Bioimpedance> {
    const formData = new FormData();
    formData.append("ticket", file);

    return apiFetch<Bioimpedance>(`/trainer/clients/${clientId}/bioimpedance/ticket`, {
      method: "POST",
      body: formData,
    });
  },
};
