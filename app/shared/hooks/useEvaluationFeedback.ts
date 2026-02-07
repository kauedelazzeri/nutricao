import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Evaluation } from '../types/database';

interface EvaluationWithDetails extends Evaluation {
  patient_name: string;
  patient_email: string;
  patient_avatar: string | null;
  meals: Array<{
    id: string;
    date: string;
    time: string;
    type: string;
    description: string | null;
    photo_url: string | null;
  }>;
  health_snapshot: {
    age: number | null;
    weight: number | null;
    height: number | null;
    activity_level: string | null;
    health_goals: string[] | null;
    dietary_restrictions: string[] | null;
    allergies: string[] | null;
  } | null;
}

export function useAcceptedEvaluation(evaluationId: string) {
  return useQuery({
    queryKey: ['acceptedEvaluation', evaluationId],
    queryFn: async () => {
      // 1. Buscar avaliação
      const { data: evaluation, error: evalError } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', evaluationId)
        .single();

      if (evalError) throw evalError;
      if (!evaluation) throw new Error('Avaliação não encontrada');

      // 2. Buscar dados do paciente
      const { data: patientData } = await supabase
        .from('users')
        .select('full_name, email, avatar_url')
        .eq('id', evaluation.patient_id);

      const patient = patientData?.[0] || null;

      // 3. Buscar refeições vinculadas à avaliação
      const { data: evaluationMeals } = await supabase
        .from('evaluation_meals')
        .select('meal_id')
        .eq('evaluation_id', evaluationId);

      const mealIds = evaluationMeals?.map(em => em.meal_id) || [];

      let meals: any[] = [];
      if (mealIds.length > 0) {
        const { data: mealsData } = await supabase
          .from('meals')
          .select('id, date, time, meal_type, description, photo_url')
          .in('id', mealIds)
          .order('date', { ascending: true })
          .order('time', { ascending: true });

        meals = mealsData || [];
      }

      // 4. Buscar snapshot de saúde
      const { data: healthSnapshotData } = await supabase
        .from('evaluation_health_snapshots')
        .select('*')
        .eq('evaluation_id', evaluationId);

      const healthSnapshot = healthSnapshotData?.[0] || null;

      return {
        ...evaluation,
        patient_name: patient?.full_name || 'Paciente',
        patient_email: patient?.email || '',
        patient_avatar: patient?.avatar_url || null,
        meals,
        health_snapshot: healthSnapshot || null,
      } as EvaluationWithDetails;
    },
    enabled: !!evaluationId,
  });
}

export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ evaluationId, feedback }: { evaluationId: string; feedback: string }) => {
      const { data, error } = await supabase
        .from('evaluations')
        .update({ feedback })
        .eq('id', evaluationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['acceptedEvaluation', variables.evaluationId] });
      queryClient.invalidateQueries({ queryKey: ['nutritionistEvaluations'] });
    },
  });
}

export function useCompleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ evaluationId, feedback }: { evaluationId: string; feedback: string }) => {
      const { data, error } = await supabase
        .from('evaluations')
        .update({
          feedback,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', evaluationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['acceptedEvaluation', variables.evaluationId] });
      queryClient.invalidateQueries({ queryKey: ['nutritionistEvaluations'] });
      queryClient.invalidateQueries({ queryKey: ['myEvaluations'] });
    },
  });
}
