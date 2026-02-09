import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { uploadMealPhoto } from '../services/cloudinary';
import type { Meal } from '../types';

interface MealInput {
  date: string;
  time: string;
  meal_type: 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | 'supper';
  description: string;
  photo?: File;
}

export function useMeals(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['meals', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('meals')
        .select('*')
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (startDate) {
        query = query.gte('date', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        query = query.lte('date', endDate.toISOString().split('T')[0]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Meal[];
    }
  });
}

export function useAddMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meal: MealInput) => {
      let photoUrl: string | undefined;
      let photoPublicId: string | undefined;

      // Upload de foto se existir (com timeout e retry automático)
      if (meal.photo) {
        try {
          const result = await uploadMealPhoto(meal.photo, {
            timeout: 60000, // 60s timeout
            maxRetries: 3 // 3 tentativas
          });
          photoUrl = result.secure_url;
          photoPublicId = result.public_id;
        } catch (error: any) {
          // Propagar erro mais específico
          throw new Error(
            error.message || 'Falha ao fazer upload da foto. Verifique sua conexão.'
          );
        }
      }

      const userId = (await supabase.auth.getUser()).data.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const insertData = {
        date: meal.date,
        time: meal.time,
        meal_type: meal.meal_type,
        description: meal.description,
        photo_url: photoUrl,
        photo_public_id: photoPublicId,
        user_id: userId
      };

      const { data, error } = await supabase
        .from('meals')
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;
      return data as Meal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    }
  });
}

export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MealInput> }) => {
      const updateData: any = { ...updates };
      
      // Remover o campo photo (File) que não vai pro banco
      delete updateData.photo;

      // Upload nova foto se existir (com timeout e retry automático)
      if (updates.photo) {
        try {
          const result = await uploadMealPhoto(updates.photo, {
            timeout: 60000,
            maxRetries: 3
          });
          // Quando há nova foto, sempre substituir as URLs antigas
          updateData.photo_url = result.secure_url;
          updateData.photo_public_id = result.public_id;
        } catch (error: any) {
          throw new Error(
            error.message || 'Falha ao fazer upload da foto. Verifique sua conexão.'
          );
        }
      }

      const { data, error } = await supabase
        .from('meals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Meal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    }
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    }
  });
}
