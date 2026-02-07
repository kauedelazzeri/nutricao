import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type {
  User,
  Patient,
  Nutritionist,
  MealEntry,
  EvaluationRequest,
  MealType,
  EvaluationPeriod,
  HealthProfile,
} from "~/shared/types";
import { EVALUATION_PRICES } from "~/shared/types";
import {
  mockPatient,
  mockNutritionists,
  mockMeals,
  mockEvaluations,
  mockHealthProfile,
} from "~/shared/mocks/data";
import { classifyMealByTime } from "~/shared/utils/mealClassifier";

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: "patient" | "nutritionist") => void;
  logout: () => void;

  // Patient data
  meals: MealEntry[];
  addMeal: (photoUrl: string, notes?: string) => void;
  updateMeal: (id: string, updates: Partial<MealEntry>) => void;
  deleteMeal: (id: string) => void;
  healthProfile: HealthProfile;
  updateHealthProfile: (profile: Partial<HealthProfile>) => void;

  // Evaluations
  evaluations: EvaluationRequest[];
  createEvaluation: (period: EvaluationPeriod, nutritionistId: string | null) => void;
  acceptEvaluation: (evalId: string) => void;
  completeEvaluation: (evalId: string, feedback: string) => void;
  rejectEvaluation: (evalId: string) => void;

  // Nutritionists list
  nutritionists: Nutritionist[];
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("nutri-user");
    return saved ? JSON.parse(saved) : null;
  });

  const [meals, setMeals] = useState<MealEntry[]>(mockMeals);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>(mockHealthProfile);
  const [evaluations, setEvaluations] = useState<EvaluationRequest[]>(mockEvaluations);

  const login = useCallback((role: "patient" | "nutritionist") => {
    const user = role === "patient" ? mockPatient : mockNutritionists[0];
    setCurrentUser(user);
    localStorage.setItem("nutri-user", JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("nutri-user");
  }, []);

  const addMeal = useCallback(
    (photoUrl: string, notes?: string) => {
      const now = new Date();
      const mealType: MealType = classifyMealByTime(now);
      const newMeal: MealEntry = {
        id: `meal-${Date.now()}`,
        patientId: currentUser?.id ?? "p1",
        photoUrl,
        mealType,
        timestamp: now.toISOString(),
        notes,
      };
      setMeals((prev) => [newMeal, ...prev]);
    },
    [currentUser]
  );

  const updateMeal = useCallback((id: string, updates: Partial<MealEntry>) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const deleteMeal = useCallback((id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateHealthProfile = useCallback((partial: Partial<HealthProfile>) => {
    setHealthProfile((prev) => {
      const updated = { ...prev, ...partial, updatedAt: new Date().toISOString() };
      // Recalculate BMI if weight or height changed
      if (partial.weight || partial.height) {
        const h = (partial.height ?? prev.height) / 100;
        updated.bmi = Math.round(((partial.weight ?? prev.weight) / (h * h)) * 10) / 10;
      }
      return updated;
    });
  }, []);

  const createEvaluation = useCallback(
    (period: EvaluationPeriod, nutritionistId: string | null) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - period);
      const periodMeals = meals.filter(
        (m) => new Date(m.timestamp) >= cutoff && m.patientId === (currentUser?.id ?? "p1")
      );

      const newEval: EvaluationRequest = {
        id: `eval-${Date.now()}`,
        patientId: currentUser?.id ?? "p1",
        nutritionistId,
        period,
        price: EVALUATION_PRICES[period],
        status: "pending",
        createdAt: new Date().toISOString(),
        meals: periodMeals,
        healthProfile,
      };
      setEvaluations((prev) => [newEval, ...prev]);
    },
    [meals, currentUser, healthProfile]
  );

  const acceptEvaluation = useCallback((evalId: string) => {
    setEvaluations((prev) =>
      prev.map((e) => (e.id === evalId ? { ...e, status: "in-progress" as const } : e))
    );
  }, []);

  const completeEvaluation = useCallback((evalId: string, feedback: string) => {
    setEvaluations((prev) =>
      prev.map((e) =>
        e.id === evalId
          ? { ...e, status: "completed" as const, feedback, completedAt: new Date().toISOString() }
          : e
      )
    );
  }, []);

  const rejectEvaluation = useCallback((evalId: string) => {
    setEvaluations((prev) =>
      prev.map((e) => (e.id === evalId ? { ...e, status: "rejected" as const } : e))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        meals,
        addMeal,
        updateMeal,
        deleteMeal,
        healthProfile,
        updateHealthProfile,
        evaluations,
        createEvaluation,
        acceptEvaluation,
        completeEvaluation,
        rejectEvaluation,
        nutritionists: mockNutritionists,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
