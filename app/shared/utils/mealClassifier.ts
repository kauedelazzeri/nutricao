import type { MealType } from "~/shared/types";

/**
 * Classifica o tipo de refeição com base no horário.
 *
 * Café da manhã:   05:00 – 09:00
 * Lanche da manhã: 09:01 – 11:00
 * Almoço:          11:01 – 14:00
 * Lanche da tarde: 14:01 – 17:00
 * Jantar:          17:01 – 21:00
 * Ceia:            21:01 – 04:59
 */
export function classifyMealByTime(date: Date): MealType {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 300 && totalMinutes <= 540) return "cafe-da-manha";
  if (totalMinutes > 540 && totalMinutes <= 660) return "lanche-da-manha";
  if (totalMinutes > 660 && totalMinutes <= 840) return "almoco";
  if (totalMinutes > 840 && totalMinutes <= 1020) return "lanche-da-tarde";
  if (totalMinutes > 1020 && totalMinutes <= 1260) return "jantar";
  return "ceia";
}

/**
 * Formata data para exibição no formato brasileiro.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

/**
 * Agrupa refeições por dia (chave = YYYY-MM-DD)
 */
export function groupMealsByDay(meals: MealEntry[]): Record<string, MealEntry[]> {
  const groups: Record<string, MealEntry[]> = {};
  for (const meal of meals) {
    const day = meal.timestamp.split("T")[0];
    if (!groups[day]) groups[day] = [];
    groups[day].push(meal);
  }
  return groups;
}

import type { MealEntry } from "~/shared/types";
