/**
 * Database types for Supabase
 * 
 * Este arquivo será gerado automaticamente pelo Supabase CLI após criar o schema.
 * 
 * Para gerar:
 * 1. Instalar Supabase CLI: npm install -g supabase
 * 2. Login: supabase login
 * 3. Linkar projeto: supabase link --project-ref [YOUR-PROJECT-REF]
 * 4. Gerar types: supabase gen types typescript --linked > app/shared/types/database.ts
 * 
 * Por ora, definir manualmente os tipos básicos.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          user_type: 'patient' | 'nutritionist'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          avatar_url?: string | null
          user_type: 'patient' | 'nutritionist'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          user_type?: 'patient' | 'nutritionist'
          created_at?: string
          updated_at?: string
        }
      }
      health_profiles: {
        Row: {
          id: string
          user_id: string
          age: number | null
          weight: number | null
          height: number | null
          dietary_restrictions: string[] | null
          health_goals: string[] | null
          activity_level: string | null
          allergies: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age?: number | null
          weight?: number | null
          height?: number | null
          dietary_restrictions?: string[] | null
          health_goals?: string[] | null
          activity_level?: string | null
          allergies?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          age?: number | null
          weight?: number | null
          height?: number | null
          dietary_restrictions?: string[] | null
          health_goals?: string[] | null
          activity_level?: string | null
          allergies?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          date: string
          time: string
          meal_type: 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | 'supper'
          description: string
          photo_url: string | null
          photo_public_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          time: string
          meal_type: 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | 'supper'
          description: string
          photo_url?: string | null
          photo_public_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          time?: string
          meal_type?: 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | 'supper'
          description?: string
          photo_url?: string | null
          photo_public_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nutritionists: {
        Row: {
          id: string
          specialties: string[]
          bio: string | null
          years_experience: number | null
          consultation_fee: number
          rating: number
          total_evaluations: number
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          specialties: string[]
          bio?: string | null
          years_experience?: number | null
          consultation_fee: number
          rating?: number
          total_evaluations?: number
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          specialties?: string[]
          bio?: string | null
          years_experience?: number | null
          consultation_fee?: number
          rating?: number
          total_evaluations?: number
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          patient_id: string
          nutritionist_id: string
          status: 'pending' | 'accepted' | 'rejected' | 'completed'
          period_start: string
          period_end: string
          feedback: string | null
          accepted_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          nutritionist_id: string
          status?: 'pending' | 'accepted' | 'rejected' | 'completed'
          period_start: string
          period_end: string
          feedback?: string | null
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          nutritionist_id?: string
          status?: 'pending' | 'accepted' | 'rejected' | 'completed'
          period_start?: string
          period_end?: string
          feedback?: string | null
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      evaluation_meals: {
        Row: {
          evaluation_id: string
          meal_id: string
        }
        Insert: {
          evaluation_id: string
          meal_id: string
        }
        Update: {
          evaluation_id?: string
          meal_id?: string
        }
      }
      evaluation_health_snapshots: {
        Row: {
          id: string
          evaluation_id: string
          age: number | null
          weight: number | null
          height: number | null
          dietary_restrictions: string[] | null
          health_goals: string[] | null
          activity_level: string | null
          allergies: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          evaluation_id: string
          age?: number | null
          weight?: number | null
          height?: number | null
          dietary_restrictions?: string[] | null
          health_goals?: string[] | null
          activity_level?: string | null
          allergies?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          evaluation_id?: string
          age?: number | null
          weight?: number | null
          height?: number | null
          dietary_restrictions?: string[] | null
          health_goals?: string[] | null
          activity_level?: string | null
          allergies?: string[] | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types para facilitar uso
export type Meal = Database['public']['Tables']['meals']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type HealthProfile = Database['public']['Tables']['health_profiles']['Row'];
export type Nutritionist = Database['public']['Tables']['nutritionists']['Row'];
export type Evaluation = Database['public']['Tables']['evaluations']['Row'];
export type EvaluationMeal = Database['public']['Tables']['evaluation_meals']['Row'];
export type EvaluationHealthSnapshot = Database['public']['Tables']['evaluation_health_snapshots']['Row'];
