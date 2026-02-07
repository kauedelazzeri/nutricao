import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Nutritionist } from '../types';

export function useNutritionists() {
  return useQuery({
    queryKey: ['nutritionists'],
    queryFn: async () => {
      // Busca nutritionists com dados de users em uma query
      const { data, error } = await supabase
        .from('nutritionists')
        .select(`
          *,
          users!inner (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('available', true)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching nutritionists:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return [];
      }

      // Mapeia os dados para o formato esperado
      return data.map((n: any) => ({
        id: n.id,
        full_name: n.users?.full_name || 'Nutricionista',
        email: n.users?.email || '',
        avatar_url: n.users?.avatar_url || null,
        specialties: n.specialties || [],
        bio: n.bio || null,
        years_experience: n.years_experience || 0,
        consultation_fee: n.consultation_fee ? parseFloat(n.consultation_fee) : 0,
        rating: n.rating ? parseFloat(n.rating) : 0,
        total_evaluations: n.total_evaluations || 0,
        available: n.available
      }));
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

// Hook para atualizar informações do usuário (nome e avatar)
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      fullName, 
      avatarUrl 
    }: { 
      userId: string; 
      fullName?: string; 
      avatarUrl?: string;
    }) => {
      const updates: any = {
        updated_at: new Date().toISOString()
      };

      if (fullName !== undefined) {
        updates.full_name = fullName;
      }

      if (avatarUrl !== undefined) {
        updates.avatar_url = avatarUrl;
      }

      // Atualiza a tabela users
      const { error: dbError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (dbError) {
        console.error('Error updating users table:', dbError);
        throw dbError;
      }

      // Atualiza os metadados do usuário no auth
      if (fullName !== undefined || avatarUrl !== undefined) {
        const metadataUpdates: any = {};
        if (fullName !== undefined) metadataUpdates.full_name = fullName;
        if (avatarUrl !== undefined) metadataUpdates.avatar_url = avatarUrl;

        const { error: authError } = await supabase.auth.updateUser({
          data: metadataUpdates
        });

        if (authError) {
          console.error('Error updating auth metadata:', authError);
          throw authError;
        }
      }

      console.log('User updated successfully');
    },
    onSuccess: async (_, variables) => {
      // Invalida queries mas não espera reload (evita delay)
      queryClient.invalidateQueries({ queryKey: ['nutritionist-profile', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['nutritionists'] });
      
      // Força reload do user auth sem bloquear
      await supabase.auth.getUser();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });
}

// Função helper para upload de foto de perfil no Cloudinary
export async function uploadProfilePhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'nutricao_profiles');
  formData.append('folder', 'nutricao/profiles');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao fazer upload da foto');
  }

  const data = await response.json();
  return data.secure_url;
}
