// ============================================
// API Response Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface DashboardStats {
  pendingEvaluations: PendingEvaluation[];
  stats: {
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
  };
}

export interface PendingEvaluation {
  id: string;
  name: string;
  lastEvaluationDate: string | null;
  daysSinceLastEvaluation: number | "Never";
}

// ============================================
// Client Types
// ============================================

export type ClientStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Client {
  id: string;
  gymId: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  height: number;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
  objectives: Objective[];
  pathologies?: Pathology[];
  evaluations?: Evaluation[];
}

export interface Objective {
  id?: string;
  content: string;
}

export interface Pathology {
  id?: string;
  name: string;
  severity?: "Low" | "Medium" | "High";
  notes?: string;
}

export interface CreateClientDTO {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  gender?: Gender;
  height?: number;
  objectives?: { content: string }[];
  pathologies?: { name: string; severity?: "Low" | "Medium" | "High"; notes?: string }[];
}

export interface UpdateClientDTO extends Partial<Omit<CreateClientDTO, "objectives" | "pathologies">> {
  status?: ClientStatus;
}

// ============================================
// Evaluation Types
// ============================================

export interface Evaluation {
  id: string;
  clientId: string;
  date: string;
  notes: string | null;
  objectivesSnapshot: unknown | null;
  createdAt: string;
  updatedAt: string;
  bioimpedance: Bioimpedance | null;
  photos: ProgressPhoto | null;
}

export interface Bioimpedance {
  id: string;
  evaluationId: string;
  weight: number;
  bmi: number | null;
  bodyFat: number | null;
  muscleMass: number | null;
  visceralFat: number | null;
  bodyWater: number | null;
  skeletalMuscleMass: number | null;
  basalMetabolism: number | null;
  imageUrl?: string | null;
}

export interface ProgressPhoto {
  id: string;
  evaluationId: string;
  frontUrl: string | null;
  backUrl: string | null;
  sideUrl: string | null;
  notes: string | null;
}

export interface CreateEvaluationFormData {
  clientId: string;
  date?: string;
  notes?: string;
  weight: number;
  bmi?: number;
  bodyFat?: number;
  muscleMass?: number;
  visceralFat?: number;
  bodyWater?: number;
  skeletalMuscleMass?: number;
  basalMetabolism?: number;
  front?: File;
  back?: File;
  side?: File;
  bioimpedanceImage?: File;
}

// ============================================
// User & Auth Types
// ============================================

export type Role = "ADMIN" | "TRAINER" | "CLIENT";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  gymId: string | null;
}

export interface Session {
  user: User;
  expires: string;
}

export interface UpdateProfileDTO {
  name?: string;
  image?: string;
}

// ============================================
// Gym Config Types
// ============================================

export interface Gym {
  id: string;
  name: string;
  logo: string | null;
  primaryColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateGymDTO {
  name?: string;
  logo?: string;
  primaryColor?: string;
}
