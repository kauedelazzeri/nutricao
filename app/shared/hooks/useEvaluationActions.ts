import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export function useEvaluationDetails(evaluationId: string) {
  return useQuery({
    queryKey: ['evaluationDetails', evaluationId],
    queryFn: async () => {
      // Buscar avaliação
      const { data: evaluation, error: evalError } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', evaluationId)
        .single();

      if (evalError) throw evalError;

      // Buscar dados do paciente
      const { data: patient } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .eq('id', evaluation.patient_id)
        .maybeSingle();

      // Buscar meals vinculadas
      const { data: evaluationMeals } = await supabase
        .from('evaluation_meals')
        .select('meal_id')
        .eq('evaluation_id', evaluationId);

      const mealIds = (evaluationMeals || []).map(em => em.meal_id);

      let meals = [];
      if (mealIds.length > 0) {
        const { data: mealsData } = await supabase
          .from('meals')
          .select('*')
          .in('id', mealIds)
          .order('date', { ascending: true })
          .order('time', { ascending: true });

        meals = mealsData || [];
      }

      // Buscar snapshot do perfil de saúde
      const { data: healthSnapshot } = await supabase
        .from('evaluation_health_snapshots')
        .select('*')
        .eq('evaluation_id', evaluationId)
        .maybeSingle();

      return {
        ...evaluation,
        patient_name: patient?.full_name || 'Paciente',
        patient_email: patient?.email || '',
        patient_avatar: patient?.avatar_url || null,
        meals,
        health_snapshot: healthSnapshot
      };
    },
    enabled: !!evaluationId
  });
}

export function useAcceptEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evaluationId: string) => {
      const { data, error } = await supabase
        .from('evaluations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString()
        } as any)
        .eq('id', evaluationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionistEvaluations'] });
      queryClient.invalidateQueries({ queryKey: ['evaluationDetails'] });
    }
  });
}

export function useRejectEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ evaluationId, reason }: { evaluationId: string; reason: string }) => {
      const { data, error } = await supabase
        .from('evaluations')
        .update({
          status: 'rejected',
          rejection_reason: reason
        } as any)
        .eq('id', evaluationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionistEvaluations'] });
      queryClient.invalidateQueries({ queryKey: ['evaluationDetails'] });
    }
  });
}
