import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { HealthProfile } from '../types';

interface HealthProfileInput {
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  dietary_restrictions?: string[];
  health_goals?: string[];
  activity_level?: string | null;
  allergies?: string[];
}

export function useHealthProfile() {
  return useQuery({
    queryKey: ['healthProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as HealthProfile | null;
    }
  });
}

export function useSaveHealthProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: HealthProfileInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      // Verificar se perfil já existe
      const { data: existingProfile } = await supabase
        .from('health_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        // UPDATE
        const { data, error } = await supabase
          .from('health_profiles')
          .update(profileData as any)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        return data as HealthProfile;
      } else {
        // INSERT
        const { data, error } = await supabase
          .from('health_profiles')
          .insert({
            user_id: user.id,
            ...profileData
          } as any)
          .select()
          .single();

        if (error) throw error;
        return data as HealthProfile;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthProfile'] });
    }
  });
}
