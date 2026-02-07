import { useQuery } from '@tanstack/react-query';
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
