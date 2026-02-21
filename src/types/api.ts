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
export type TrainingPlace = "GYM" | "HOME" | "OUTDOOR";

export interface Client {
  id: string;
  gymId: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  cedula?: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  gender: Gender | null;
  height: number | null;
  trainingPlace?: TrainingPlace;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
  objectives: Objective[];
  pathologies?: Pathology[];
  evaluations?: Evaluation[];
  bioimpedances?: Bioimpedance[];
  photos?: ProgressPhoto[];
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
  cedula: string;
  password?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  gender?: Gender;
  height?: number;
  trainingPlace?: TrainingPlace;
  objectives?: { content: string }[];
  pathologies?: { name: string; severity?: "Low" | "Medium" | "High"; notes?: string }[];
}

export interface UpdateClientDTO extends Partial<Omit<CreateClientDTO, "cedula">> {
  status?: ClientStatus;
  objectives?: { id?: string; content: string }[];
  pathologies?: { id?: string; name: string; severity?: "Low" | "Medium" | "High"; notes?: string }[];
}

// ============================================
// Evaluation Types
// ============================================

export interface Evaluation {
  id: string;
  clientId: string;
  trainerId?: string;
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
  clientId?: string;
  evaluationId?: string;
  date?: string;
  weight: number;
  bmi: number | null;
  bodyFat: number | null;
  muscleMass: number | null;
  visceralFat: number | null;
  bodyWater: number | null;
  skeletalMuscleMass: number | null;
  basalMetabolism: number | null;
  imageUrl?: string | null;
  // Audit fields
  ticketUploadedByRole?: string;
  ticketUploadedByUserId?: string;
  ticketUploadedAt?: string;
}

export interface ProgressPhoto {
  id: string;
  clientId?: string;
  evaluationId?: string;
  date?: string;
  frontUrl: string | null;
  backUrl: string | null;
  sideUrl: string | null;
  notes: string | null;
  // Audit fields
  uploadedByRole?: string;
  uploadedByUserId?: string;
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
  // Onboarding fields
  mustChangePassword?: boolean;
  wizardCompleted?: boolean;
  // Client profile reference (for CLIENT role)
  clientProfile?: {
    id: string;
  };
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
// Onboarding Types
// ============================================

export interface OnboardingStatus {
  mustChangePassword: boolean;
  hasAcceptedCurrentPolicy: boolean;
  wizardCompleted: boolean;
}

export interface ConsentScopes {
  dataTreatment: boolean;
  photos?: boolean;
  sensitiveHealthData?: boolean;
}

export interface UserConsent {
  id: string;
  userId: string;
  acceptedAt: string;
  policyVersion: string;
  policyHash: string;
  scopes: ConsentScopes;
  ip?: string;
  userAgent?: string;
}

export interface AcceptConsentDTO {
  policyVersion: string;
  scopes: ConsentScopes;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================
// Client Profile Types (for /me endpoints)
// ============================================

export interface ClientProfile extends Client {
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
}

export interface UpdateClientProfileDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  gender?: Gender;
  height?: number;
  trainingPlace?: TrainingPlace;
  objectives?: { id?: string; content: string }[];
  pathologies?: { id?: string; name: string; severity?: "Low" | "Medium" | "High"; notes?: string }[];
}

// ============================================
// Trainer Assessment Types
// ============================================

export interface UpdateAssessmentDTO {
  date?: string;
  notes?: string;
  bioimpedance?: {
    weight?: number;
    bmi?: number;
    bodyFat?: number;
    muscleMass?: number;
    visceralFat?: number;
    bodyWater?: number;
    skeletalMuscleMass?: number;
    basalMetabolism?: number;
  };
  photos?: {
    frontUrl?: string;
    backUrl?: string;
    sideUrl?: string;
    notes?: string;
  };
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
