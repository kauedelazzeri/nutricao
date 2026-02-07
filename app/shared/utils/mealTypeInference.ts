import type { MealType } from '../types';

/**
 * Infere o tipo de refeição baseado no horário atual
 */
export function inferMealTypeFromTime(date: Date = new Date()): MealType {
  const hour = date.getHours();

  // Café da manhã: 5h - 10h
  if (hour >= 5 && hour < 10) {
    return 'breakfast';
  }
  
  // Lanche da manhã: 10h - 12h
  if (hour >= 10 && hour < 12) {
    return 'morning_snack';
  }
  
  // Almoço: 12h - 15h
  if (hour >= 12 && hour < 15) {
    return 'lunch';
  }
  
  // Lanche da tarde: 15h - 18h
  if (hour >= 15 && hour < 18) {
    return 'afternoon_snack';
  }
  
  // Jantar: 18h - 22h
  if (hour >= 18 && hour < 22) {
    return 'dinner';
  }
  
  // Ceia: 22h - 5h
  return 'supper';
}
