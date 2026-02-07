import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Nutritionist } from '../types';

export function useNutritionists() {
  return useQuery({
    queryKey: ['nutritionists'],
    queryFn: async () => {
      // Primeiro busca apenas nutritionists
      const { data, error } = await supabase
        .from('nutritionists')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return [];
      }

      // Depois busca os dados de users para cada nutricionista
      const nutritionistsWithUsers = await Promise.all(
        data.map(async (n: any) => {
          const { data: userData } = await supabase
            .from('users')
            .select('id, full_name, email, avatar_url')
            .eq('id', n.id)
            .maybeSingle();

          return {
            id: n.id,
            full_name: userData?.full_name || 'Nutricionista',
            email: userData?.email || '',
            avatar_url: userData?.avatar_url || null,
            specialties: n.specialties || [],
            bio: n.bio,
            years_experience: n.years_experience,
            consultation_fee: parseFloat(n.consultation_fee),
            rating: parseFloat(n.rating),
            total_evaluations: n.total_evaluations,
            available: n.available
          };
        })
      );

      return nutritionistsWithUsers;
    }
  });
}

// Hook para buscar perfil do nutricionista atual
export function useNutritionistProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['nutritionist-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase
        .from('nutritionists')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });
}

// Hook para atualizar perfil do nutricionista
export function useUpdateNutritionistProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { 
      userId: string; 
      data: {
        specialties?: string[];
        bio?: string;
        years_experience?: number;
        consultation_fee?: number;
        available?: boolean;
      }
    }) => {
      const { error } = await supabase
        .from('nutritionists')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nutritionist-profile', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['nutritionists'] });
    }
  });
}

// Hook para criar perfil do nutricionista (caso não exista)
export function useCreateNutritionistProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { 
      userId: string; 
      data: {
        specialties: string[];
        bio?: string;
        years_experience?: number;
        consultation_fee: number;
      }
    }) => {
      const { error } = await supabase
        .from('nutritionists')
        .insert({
          id: userId,
          specialties: data.specialties,
          bio: data.bio || null,
          years_experience: data.years_experience || null,
          consultation_fee: data.consultation_fee,
          rating: 0,
          total_evaluations: 0,
          available: true
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nutritionist-profile', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['nutritionists'] });
    }
  });
}
