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

      // Upload de foto se existir
      if (meal.photo) {
        const result = await uploadMealPhoto(meal.photo);
        photoUrl = result.secure_url;
        photoPublicId = result.public_id;
      }

      const { data, error } = await supabase
        .from('meals')
        .insert({
          date: meal.date,
          time: meal.time,
          meal_type: meal.meal_type,
          description: meal.description,
          photo_url: photoUrl,
          photo_public_id: photoPublicId,
          user_id: (await supabase.auth.getUser()).data.user!.id
        } as any)
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
      let photoUrl = undefined;
      let photoPublicId = undefined;

      // Upload nova foto se existir
      if (updates.photo) {
        const result = await uploadMealPhoto(updates.photo);
        photoUrl = result.secure_url;
        photoPublicId = result.public_id;
      }

      const updateData: any = { ...updates };
      delete updateData.photo;
      
      if (photoUrl) {
        updateData.photo_url = photoUrl;
        updateData.photo_public_id = photoPublicId;
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
