import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export function useNutritionistEvaluations(status?: 'pending' | 'accepted' | 'rejected' | 'completed') {
  return useQuery({
    queryKey: ['nutritionistEvaluations', status],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      // Buscar avaliações do nutricionista
      let query = supabase
        .from('evaluations')
        .select('*')
        .eq('nutritionist_id', user.id)
        .order('created_at', { ascending: false });

      // Filtrar por status se especificado
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data || data.length === 0) return [];

      // Buscar IDs únicos de pacientes
      const uniquePatientIds = [...new Set(data.map((e: any) => e.patient_id))];

      // Buscar dados de todos os pacientes de uma vez
      const { data: patientsData } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .in('id', uniquePatientIds);

      // Criar mapa para lookup rápido
      const patientsMap = new Map(
        (patientsData || []).map(p => [p.id, p])
      );

      // Buscar IDs de avaliações para contar meals
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
        const patient = patientsMap.get(evaluation.patient_id);
        return {
          ...evaluation,
          patient_name: patient?.full_name || 'Paciente',
          patient_email: patient?.email || '',
          patient_avatar: patient?.avatar_url || null,
          meal_count: mealCounts.get(evaluation.id) || 0
        };
      });
    }
  });
}
