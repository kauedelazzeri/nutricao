import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Evaluation, HealthProfile } from '../types';

interface CreateEvaluationInput {
  nutritionist_id: string;
  period_start: string;
  period_end: string;
}

export function useMyEvaluations() {
  return useQuery({
    queryKey: ['myEvaluations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      // Buscar avaliações do paciente
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return [];

      // Buscar IDs únicos de nutricionistas
      const uniqueNutritionistIds = [...new Set(data.map((e: any) => e.nutritionist_id))];

      // Buscar dados de todos os nutricionistas de uma vez
      const { data: nutritionistsData } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .in('id', uniqueNutritionistIds);

      // Criar mapa para lookup rápido
      const nutritionistsMap = new Map(
        (nutritionistsData || []).map(n => [n.id, n])
      );

      // Buscar IDs únicos de avaliações para contar meals
      const evaluationIds = data.map((e: any) => e.id);

      // Buscar todas as evaluation_meals de uma vez
      const { data: allMeals } = await supabase
        .from('evaluation_meals')
        .select('evaluation_id')
        .in('evaluation_id', evaluationIds);

      // Contar meals por avaliação
      const mealCounts = new Map<string, number>();
      (allMeals || []).forEach((meal: any) => {
        mealCounts.set(meal.evaluation_id, (mealCounts.get(meal.evaluation_id) || 0) + 1);
      });

      // Combinar dados
      return data.map((evaluation: any) => {
        const nutritionist = nutritionistsMap.get(evaluation.nutritionist_id);
        return {
          ...evaluation,
          nutritionist_name: nutritionist?.full_name || 'Nutricionista',
          nutritionist_email: nutritionist?.email || '',
          nutritionist_avatar: nutritionist?.avatar_url || null,
          meal_count: mealCounts.get(evaluation.id) || 0
        };
      });
    }
  });
}

export function useCreateEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEvaluationInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      // 1. Criar avaliação
      const { data: evaluation, error: evalError } = await supabase
        .from('evaluations')
        .insert({
          patient_id: user.id,
          nutritionist_id: input.nutritionist_id,
          period_start: input.period_start,
          period_end: input.period_end,
          status: 'pending'
        } as any)
        .select()
        .single();

      if (evalError) throw evalError;

      // 2. Buscar refeições do período
      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('id')
        .eq('user_id', user.id)
        .gte('date', input.period_start)
        .lte('date', input.period_end);

      if (mealsError) throw mealsError;

      // 3. Criar vínculos com refeições
      if (meals && meals.length > 0) {
        const mealLinks = meals.map(m => ({
          evaluation_id: evaluation.id,
          meal_id: m.id
        }));

        const { error: linksError } = await supabase
          .from('evaluation_meals')
          .insert(mealLinks as any);

        if (linksError) throw linksError;
      }

      // 4. Criar snapshot do perfil de saúde
      const { data: healthProfile } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (healthProfile) {
        const { error: snapshotError } = await supabase
          .from('evaluation_health_snapshots')
          .insert({
            evaluation_id: evaluation.id,
            age: healthProfile.age,
            weight: healthProfile.weight,
            height: healthProfile.height,
            dietary_restrictions: healthProfile.dietary_restrictions,
            health_goals: healthProfile.health_goals,
            activity_level: healthProfile.activity_level,
            allergies: healthProfile.allergies
          } as any);

        if (snapshotError) throw snapshotError;
      }

      return evaluation as Evaluation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEvaluations'] });
    }
  });
}
