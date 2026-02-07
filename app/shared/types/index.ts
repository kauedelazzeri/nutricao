// ==================== ENUMS ====================

// Re-export database types
export type { Meal, User as DbUser, HealthProfile as DbHealthProfile, Nutritionist as DbNutritionist, Evaluation, EvaluationMeal, EvaluationHealthSnapshot } from './database';

export type UserRole = "patient" | "nutritionist";

export type MealType =
  | "cafe-da-manha"
  | "lanche-da-manha"
  | "almoco"
  | "lanche-da-tarde"
  | "jantar"
  | "ceia";

export type EvaluationStatus = "pending" | "in-progress" | "completed" | "rejected";

export type EvaluationPeriod = 7 | 30;

export type HealthGoal = "lose-weight" | "gain-muscle" | "maintain" | "improve-health";

// ==================== MODELS ====================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface Patient extends User {
  role: "patient";
  healthProfile?: HealthProfile;
}

export interface Nutritionist extends User {
  role: "nutritionist";
  crn: string;
  specialties: string[];
  bio: string;
  rating: number;
  evaluationsCompleted: number;
}

export interface HealthProfile {
  weight: number; // kg
  height: number; // cm
  bmi: number;
  goal: HealthGoal;
  dietaryRestrictions: string[];
  notes: string;
  updatedAt: string;
}

export interface MealEntry {
  id: string;
  patientId: string;
  photoUrl: string;
  mealType: MealType;
  timestamp: string; // ISO date string
  notes?: string;
}

export interface EvaluationRequest {
  id: string;
  patientId: string;
  nutritionistId: string | null; // null = open for any
  period: EvaluationPeriod;
  price: number;
  status: EvaluationStatus;
  createdAt: string;
  meals: MealEntry[];
  healthProfile: HealthProfile;
  feedback?: string;
  completedAt?: string;
}

// ==================== HELPERS ====================

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  "cafe-da-manha": "Café da Manhã",
  "lanche-da-manha": "Lanche da Manhã",
  "almoco": "Almoço",
  "lanche-da-tarde": "Lanche da Tarde",
  "jantar": "Jantar",
  "ceia": "Ceia",
};

export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  "cafe-da-manha": "☕",
  "lanche-da-manha": "🍎",
  "almoco": "🍽️",
  "lanche-da-tarde": "🥤",
  "jantar": "🌙",
  "ceia": "🍵",
};

export const HEALTH_GOAL_LABELS: Record<HealthGoal, string> = {
  "lose-weight": "Emagrecer",
  "gain-muscle": "Ganhar Massa",
  "maintain": "Manter Peso",
  "improve-health": "Melhorar Saúde",
};

export const EVALUATION_STATUS_LABELS: Record<EvaluationStatus, string> = {
  pending: "Pendente",
  "in-progress": "Em Análise",
  completed: "Concluída",
  rejected: "Recusada",
};

export const EVALUATION_PRICES: Record<EvaluationPeriod, number> = {
  7: 10,
  30: 20,
};
