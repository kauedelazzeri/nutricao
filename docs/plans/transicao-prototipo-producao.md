# Plano de Transição: Protótipo → Produção

## 📋 Visão Geral

Este documento detalha o plano completo para transição do protótipo navegável atual para uma aplicação em produção com backend real, autenticação e persistência de dados.

### Objetivos
- Manter landing page no root (`/`)
- Mover protótipo atual para `/demo/*` (funcional com dados mockados)
- Implementar versão de produção conectada a Supabase + Cloudinary
- Seguir metodologia ágil com entregáveis pequenos e testáveis
- Implementar fluxos completos de usuário por sprint

### Stack Tecnológico

**Frontend (atual)**
- React 19.2.4 + Vite 7.1.7 + TypeScript 5.9.2
- React Router v7.12.0 (SPA mode)
- Tailwind CSS v4.1.13

**Backend & Serviços**
- **Supabase**: Database PostgreSQL + Auth (Google OAuth, Apple OAuth posteriormente)
- **Cloudinary**: Upload e CDN de imagens (plano gratuito: 25GB storage, 25GB bandwidth/mês)
- **Vercel**: Deploy e hosting (já conectado)

**Decisão Pendente: State Management**
- React Query vs Context Puro (análise detalhada abaixo)

---

## 🗂️ Reestruturação do Repositório

### Estrutura Atual
```
app/
  routes/
    _index.tsx (landing page)
    patient.*.tsx (rotas do paciente)
    nutritionist.*.tsx (rotas do nutricionista)
  shared/
    contexts/AppContext.tsx (state in-memory)
    mocks/data.ts (dados mockados)
```

### Estrutura Proposta

```
app/
  routes/
    _index.tsx                          # Landing page (mantém atual)
    
    demo/                               # Protótipo navegável
      _layout.tsx                       # Layout com banner "Modo Demo"
      patient.*.tsx                     # Rotas do paciente (mock)
      nutritionist.*.tsx                # Rotas do nutricionista (mock)
    
    auth/                               # Autenticação real
      callback.tsx                      # OAuth callback
      login.tsx                         # Tela de login
    
    app/                                # Aplicação de produção
      patient/
        dashboard.tsx                   # Dashboard do paciente
        register-meal.tsx               # Registrar refeição
        timeline.tsx                    # Timeline de refeições
        health-profile.tsx              # Perfil de saúde
        request-evaluation.tsx          # Solicitar avaliação
        evaluation-feedback.tsx         # Visualizar parecer
      
      nutritionist/
        dashboard.tsx                   # Dashboard do nutricionista
        pending-evaluations.tsx         # Avaliações pendentes
        evaluate.tsx                    # Realizar avaliação
        my-evaluations.tsx              # Minhas avaliações
  
  shared/
    contexts/
      AppContext.tsx                    # Context atual (apenas para /demo)
      AuthContext.tsx                   # NOVO: Sessão do usuário
      DataContext.tsx ou QueryProvider  # NOVO: State management (decisão pendente)
    
    mocks/
      data.ts                           # Mantém para /demo
    
    services/
      supabase.ts                       # NOVO: Cliente Supabase
      cloudinary.ts                     # NOVO: Upload de imagens
      api/
        auth.ts                         # NOVO: Login/logout
        meals.ts                        # NOVO: CRUD de refeições
        evaluations.ts                  # NOVO: CRUD de avaliações
        health.ts                       # NOVO: Perfil de saúde
        nutritionists.ts                # NOVO: Listagem de nutricionistas
    
    hooks/
      useAuth.ts                        # NOVO: Hook de autenticação
      useMeals.ts                       # NOVO: Hook de refeições
      useEvaluations.ts                 # NOVO: Hook de avaliações
      useHealthProfile.ts               # NOVO: Hook de perfil de saúde
    
    components/
      (mantém componentes atuais)
    
    types/
      index.ts                          # Mantém tipos atuais
      database.ts                       # NOVO: Tipos do Supabase

.env.local                              # NOVO: Variáveis de ambiente
```

---

## 🗄️ Schema do Banco de Dados (Supabase)

### Tabelas Principais

#### 1. `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'nutritionist')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

#### 2. `health_profiles`
```sql
CREATE TABLE health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  dietary_restrictions TEXT[],
  health_goals TEXT[],
  activity_level TEXT,
  allergies TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS Policies
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health profile"
  ON health_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health profile"
  ON health_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health profile"
  ON health_profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

#### 3. `meals`
```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'supper')),
  description TEXT NOT NULL,
  photo_url TEXT,
  photo_public_id TEXT,  -- Cloudinary public_id para deleção
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX meals_user_id_date_idx ON meals(user_id, date DESC);

-- RLS Policies
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Nutritionists can view meals in their evaluations"
  ON meals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM evaluation_meals em
      JOIN evaluations e ON e.id = em.evaluation_id
      WHERE em.meal_id = meals.id
      AND e.nutritionist_id = auth.uid()
    )
  );
```

#### 4. `nutritionists`
```sql
CREATE TABLE nutritionists (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialties TEXT[] NOT NULL,
  bio TEXT,
  years_experience INTEGER,
  consultation_fee DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  total_evaluations INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE nutritionists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available nutritionists"
  ON nutritionists FOR SELECT
  USING (available = TRUE);

CREATE POLICY "Nutritionists can update own profile"
  ON nutritionists FOR UPDATE
  USING (auth.uid() = id);
```

#### 5. `evaluations`
```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nutritionist_id UUID NOT NULL REFERENCES nutritionists(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  feedback TEXT,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX evaluations_nutritionist_status_idx ON evaluations(nutritionist_id, status);
CREATE INDEX evaluations_patient_idx ON evaluations(patient_id);

-- RLS Policies
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own evaluations"
  ON evaluations FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert own evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Nutritionists can view their evaluations"
  ON evaluations FOR SELECT
  USING (auth.uid() = nutritionist_id);

CREATE POLICY "Nutritionists can update their evaluations"
  ON evaluations FOR UPDATE
  USING (auth.uid() = nutritionist_id);
```

#### 6. `evaluation_meals`
```sql
CREATE TABLE evaluation_meals (
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  PRIMARY KEY (evaluation_id, meal_id)
);

-- RLS Policies
ALTER TABLE evaluation_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evaluation meals"
  ON evaluation_meals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM evaluations e
      WHERE e.id = evaluation_id
      AND (e.patient_id = auth.uid() OR e.nutritionist_id = auth.uid())
    )
  );
```

#### 7. `evaluation_health_snapshots`
```sql
CREATE TABLE evaluation_health_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  dietary_restrictions TEXT[],
  health_goals TEXT[],
  activity_level TEXT,
  allergies TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(evaluation_id)
);

-- RLS Policies
ALTER TABLE evaluation_health_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evaluation health snapshots"
  ON evaluation_health_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM evaluations e
      WHERE e.id = evaluation_id
      AND (e.patient_id = auth.uid() OR e.nutritionist_id = auth.uid())
    )
  );
```

### Triggers para `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_health_profiles_updated_at
  BEFORE UPDATE ON health_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON meals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_nutritionists_updated_at
  BEFORE UPDATE ON nutritionists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_evaluations_updated_at
  BEFORE UPDATE ON evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 🔐 Configuração de Autenticação

### Supabase Auth Setup

1. **Ativar Google OAuth no Supabase Dashboard**
   - Project Settings → Authentication → Providers
   - Enable Google
   - Adicionar Client ID e Client Secret do Google Cloud Console

2. **Configurar Google Cloud Console**
   - Criar projeto no Google Cloud Console
   - Ativar Google+ API
   - Criar OAuth 2.0 Credentials
   - Authorized redirect URIs: `https://[YOUR-PROJECT].supabase.co/auth/v1/callback`

3. **Configurar .env.local**
```env
VITE_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_[YOUR-KEY]
VITE_CLOUDINARY_CLOUD_NAME=[YOUR-CLOUD-NAME]
VITE_CLOUDINARY_UPLOAD_PRESET=[YOUR-PRESET]
```

**Nota**: Supabase agora usa `PUBLISHABLE_KEY` (antiga `ANON_KEY`). Nunca use Secret Key no frontend.

### Cliente Supabase (`app/shared/services/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
```

### AuthContext (`app/shared/contexts/AuthContext.tsx`)

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { UserType } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: UserType | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Buscar tipo de usuário
        fetchUserType(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserType(session.user.id);
        } else {
          setUserType(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserType = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserType(data.user_type as UserType);
    } catch (error) {
      console.error('Error fetching user type:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userType,
      loading,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 📤 Configuração do Cloudinary

### Setup

1. **Criar conta gratuita** em cloudinary.com
2. **Criar Upload Preset** (Settings → Upload → Upload presets)
   - Mode: Unsigned
   - Folder: `nutricao-app/meals`
   - Transformations: Crop/resize automático

### Upload Helper (`app/shared/services/cloudinary.ts`)

```typescript
interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

export async function uploadMealPhoto(file: File): Promise<CloudinaryResponse> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Missing Cloudinary configuration');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'nutricao-app/meals');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
}

export async function deleteMealPhoto(publicId: string): Promise<void> {
  // Delete requer backend signature por segurança
  // Por ora, manter fotos no Cloudinary (dentro do limite gratuito)
  // Implementar cleanup manual ou backend function posteriormente
  console.log('Photo deletion not implemented:', publicId);
}
```

---

## ⚖️ React Query vs Context Puro

### Análise Comparativa

#### **Opção 1: React Query** ⭐ (RECOMENDADO)

**Prós:**
1. **Cache automático**: Dados ficam em cache, reduz requisições
2. **Refetch inteligente**: Atualiza dados automaticamente (focus, reconnect)
3. **Loading/Error states**: Gerenciamento automático de estados
4. **Optimistic updates**: Facilita updates otimistas
5. **Menos código boilerplate**: Menos lógica manual
6. **DevTools**: Excelente ferramenta de debug

**Contras:**
1. **Dependência externa**: +40KB (gzipped: ~11KB)
2. **Curva de aprendizado**: Conceitos novos (stale time, cache time, etc)
3. **Overhead**: Para app pequeno, pode ser overengineering

**Exemplo de implementação:**

```typescript
// app/shared/hooks/useMeals.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { uploadMealPhoto } from '../services/cloudinary';
import type { Meal } from '../types';

export function useMeals(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ['meals', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (error) throw error;
      return data as Meal[];
    }
  });
}

export function useAddMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meal: Omit<Meal, 'id' | 'user_id'> & { photo?: File }) => {
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
          ...meal,
          photo_url: photoUrl,
          photo_public_id: photoPublicId,
          photo: undefined // Remove file do objeto
        })
        .select()
        .single();

      if (error) throw error;
      return data as Meal;
    },
    onSuccess: () => {
      // Invalida cache para refetch automático
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    }
  });
}

export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Meal> & { photo?: File } }) => {
      let photoUrl = updates.photo_url;
      let photoPublicId = updates.photo_public_id;

      // Upload nova foto se existir
      if (updates.photo) {
        const result = await uploadMealPhoto(updates.photo);
        photoUrl = result.secure_url;
        photoPublicId = result.public_id;
      }

      const { data, error } = await supabase
        .from('meals')
        .update({
          ...updates,
          photo_url: photoUrl,
          photo_public_id: photoPublicId,
          photo: undefined
        })
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
```

**Uso no componente:**

```typescript
// app/routes/app/patient/timeline.tsx
import { useMeals, useDeleteMeal } from '~/shared/hooks/useMeals';

export default function Timeline() {
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-01-14');
  
  const { data: meals, isLoading, error } = useMeals(startDate, endDate);
  const deleteMeal = useDeleteMeal();

  const handleDelete = async (id: string) => {
    await deleteMeal.mutateAsync(id);
    toast.success('Refeição excluída');
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {meals?.map(meal => (
        <MealCard
          key={meal.id}
          meal={meal}
          onDelete={() => handleDelete(meal.id)}
        />
      ))}
    </div>
  );
}
```

#### **Opção 2: Context Puro**

**Prós:**
1. **Zero dependências**: Sem bibliotecas externas
2. **Controle total**: Controle completo sobre lógica
3. **Simplicidade**: Conceitos familiares do React
4. **Bundle menor**: Sem peso adicional

**Contras:**
1. **Mais código boilerplate**: Precisa implementar tudo manualmente
2. **Sem cache inteligente**: Cache manual ou re-fetch em toda navegação
3. **Loading states manuais**: Gerenciar todos os estados manualmente
4. **Sem optimistic updates**: Implementação manual complexa
5. **Sem DevTools**: Debug mais difícil
6. **Re-renders**: Pode causar re-renders desnecessários sem otimização

**Exemplo de implementação:**

```typescript
// app/shared/contexts/DataContext.tsx
import { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { uploadMealPhoto } from '../services/cloudinary';
import type { Meal, Evaluation, HealthProfile } from '../types';

interface DataContextType {
  // Meals
  meals: Meal[];
  mealsLoading: boolean;
  mealsError: Error | null;
  fetchMeals: (startDate: Date, endDate: Date) => Promise<void>;
  addMeal: (meal: Omit<Meal, 'id' | 'user_id'> & { photo?: File }) => Promise<void>;
  updateMeal: (id: string, updates: Partial<Meal> & { photo?: File }) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  
  // Evaluations
  evaluations: Evaluation[];
  evaluationsLoading: boolean;
  evaluationsError: Error | null;
  fetchEvaluations: () => Promise<void>;
  createEvaluation: (evaluation: Omit<Evaluation, 'id'>) => Promise<void>;
  // ... mais métodos
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Meals state
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [mealsError, setMealsError] = useState<Error | null>(null);

  const fetchMeals = useCallback(async (startDate: Date, endDate: Date) => {
    setMealsLoading(true);
    setMealsError(null);
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: false });

      if (error) throw error;
      setMeals(data as Meal[]);
    } catch (error) {
      setMealsError(error as Error);
    } finally {
      setMealsLoading(false);
    }
  }, []);

  const addMeal = useCallback(async (meal: Omit<Meal, 'id' | 'user_id'> & { photo?: File }) => {
    setMealsLoading(true);
    setMealsError(null);
    try {
      let photoUrl: string | undefined;
      let photoPublicId: string | undefined;

      if (meal.photo) {
        const result = await uploadMealPhoto(meal.photo);
        photoUrl = result.secure_url;
        photoPublicId = result.public_id;
      }

      const { data, error } = await supabase
        .from('meals')
        .insert({
          ...meal,
          photo_url: photoUrl,
          photo_public_id: photoPublicId,
          photo: undefined
        })
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar estado local
      setMeals(prev => [data as Meal, ...prev]);
    } catch (error) {
      setMealsError(error as Error);
      throw error;
    } finally {
      setMealsLoading(false);
    }
  }, []);

  // ... implementar todos os outros métodos (updateMeal, deleteMeal, etc)

  return (
    <DataContext.Provider value={{
      meals,
      mealsLoading,
      mealsError,
      fetchMeals,
      addMeal,
      updateMeal,
      deleteMeal,
      // ... outros valores
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
```

**Uso no componente:**

```typescript
// app/routes/app/patient/timeline.tsx
import { useEffect } from 'react';
import { useData } from '~/shared/contexts/DataContext';

export default function Timeline() {
  const { meals, mealsLoading, mealsError, fetchMeals, deleteMeal } = useData();
  
  useEffect(() => {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-01-14');
    fetchMeals(startDate, endDate);
  }, [fetchMeals]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMeal(id);
      toast.success('Refeição excluída');
    } catch (error) {
      toast.error('Erro ao excluir refeição');
    }
  };

  if (mealsLoading) return <LoadingSpinner />;
  if (mealsError) return <ErrorMessage error={mealsError} />;

  return (
    <div>
      {meals.map(meal => (
        <MealCard
          key={meal.id}
          meal={meal}
          onDelete={() => handleDelete(meal.id)}
        />
      ))}
    </div>
  );
}
```

### Tabela Comparativa

| Aspecto | React Query | Context Puro |
|---------|-------------|--------------|
| **Bundle size** | +40KB (~11KB gzipped) | 0KB |
| **Código boilerplate** | Mínimo | Muito |
| **Cache automático** | ✅ Sim | ❌ Manual |
| **Loading states** | ✅ Automático | ❌ Manual |
| **Error handling** | ✅ Automático | ❌ Manual |
| **Refetch em focus** | ✅ Automático | ❌ Manual |
| **Optimistic updates** | ✅ Facilitado | ❌ Complexo |
| **DevTools** | ✅ Excelente | ❌ Não |
| **Curva aprendizado** | Média | Baixa |
| **Controle total** | Médio | Alto |
| **DX (Developer Experience)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 📊 Recomendação

**React Query é a escolha recomendada** pelos seguintes motivos:

1. **Menos código**: Reduz ~60% do código de state management
2. **Melhor DX**: DevTools e debugging facilitado
3. **Performance**: Cache inteligente reduz requisições
4. **Manutenibilidade**: Padrões estabelecidos, fácil onboarding
5. **Bundle size aceitável**: 11KB gzipped é razoável para os benefícios

**Context Puro faz sentido se:**
- Bundle size é crítico (PWA offline-first, por exemplo)
- Precisa controle absoluto sobre cada aspecto
- Lógica de dados é extremamente simples

**Para este projeto**: Com múltiplas entidades (meals, evaluations, health profiles), autenticação, e uploads, React Query economizará semanas de desenvolvimento e evitará bugs comuns de state management.

---

## 📅 Plano de Sprints

### Sprint 0: Infraestrutura (3-4 dias)
**Meta**: Preparar ambiente e banco de dados

**Tarefas:**
1. ✅ Criar projeto Supabase
2. ✅ Executar schema SQL completo (7 tabelas + RLS)
3. ✅ Configurar Google OAuth no Supabase
4. ✅ Criar conta Cloudinary + Upload Preset
5. ✅ Configurar variáveis de ambiente (.env.local)
6. ✅ Instalar dependências
   ```bash
   npm install @supabase/supabase-js @tanstack/react-query
   # ou para Context Puro: npm install @supabase/supabase-js
   ```
7. ✅ Mover rotas atuais para `/demo/*`
8. ✅ Criar estrutura de pastas (services, hooks, contexts)
9. ✅ Implementar cliente Supabase
10. ✅ Implementar AuthContext
11. ✅ Configurar Vercel environment variables

**Entregável**: Infraestrutura pronta, protótipo em `/demo`, auth setup completo

**Testes:**
- Login Google funciona
- Callback redireciona corretamente
- Session persiste após refresh
- Variables de ambiente corretas

---

### Sprint 1: Login Google (2-3 dias)
**Meta**: Usuário consegue fazer login com Google e escolher tipo de conta

**Fluxo:**
1. Usuário clica "Entrar com Google" em `/auth/login`
2. OAuth flow no Google
3. Callback em `/auth/callback`
4. Se primeiro acesso: tela de seleção de tipo (Paciente/Nutricionista)
5. Criar registro em `users` table
6. Se nutricionista: preencher perfil em `nutritionists` table
7. Redirecionar para dashboard apropriado

**Tarefas:**
1. ✅ Criar rota `/auth/login` com botão Google
2. ✅ Criar rota `/auth/callback` com loading
3. ✅ Criar rota `/auth/setup` para seleção de tipo
4. ✅ Implementar lógica de criação de usuário
5. ✅ Implementar redirect condicional (patient/nutritionist)
6. ✅ Criar layout base de `/app/*` com navbar
7. ✅ Criar dashboards vazios (patient e nutritionist)
8. ✅ Implementar logout

**Entregável**: Login funcional com Google, criação de conta, dashboards vazios

**Testes:**
- [ ] Login com Google cria usuário em `users`
- [ ] Seleção de tipo persiste corretamente
- [ ] Nutricionista cria registro em `nutritionists`
- [ ] Redirect para dashboard correto
- [ ] Logout funciona
- [ ] Session persiste após refresh

---

### Sprint 2: Registrar Refeições (4-5 dias)
**Meta**: Paciente consegue registrar refeições com foto

**Fluxo:** (Flow 2 da documentação)
1. Dashboard → botão "Registrar refeição"
2. Formulário com data, hora, tipo, descrição, foto
3. Upload para Cloudinary
4. Salvar em `meals` table
5. Redirecionar para timeline
6. Toast de sucesso

**Tarefas:**
1. ✅ Criar rota `/app/patient/register-meal`
2. ✅ Implementar formulário completo
3. ✅ Implementar upload de foto (Cloudinary)
4. ✅ Implementar preview de imagem
5. ✅ Criar service `meals.ts` com operações CRUD
6. ✅ Implementar hook `useMeals` (React Query) ou método Context
7. ✅ Implementar hook `useAddMeal` (React Query) ou método Context
8. ✅ Criar rota `/app/patient/timeline` (lista de refeições)
9. ✅ Implementar componente `MealCard`
10. ✅ Implementar agrupamento por dia
11. ✅ Implementar empty state

**Entregável**: Paciente consegue registrar e visualizar refeições

**Testes:**
- [ ] Formulário valida campos obrigatórios
- [ ] Upload de foto funciona (Cloudinary)
- [ ] Refeição aparece na timeline após criar
- [ ] Timeline agrupa por dia corretamente
- [ ] Empty state aparece quando sem refeições
- [ ] RLS permite apenas owner ver/criar refeições

---

### Sprint 3: Editar/Excluir Refeições + Perfil de Saúde (4-5 dias)
**Meta**: Paciente consegue gerenciar refeições e perfil de saúde

**Fluxos:** (Flows 3, 4, 7 da documentação)

**Tarefas:**
1. ✅ Adicionar botão de editar em `MealCard`
2. ✅ Criar rota `/app/patient/edit-meal/:id`
3. ✅ Reutilizar formulário de registro (mode: edit)
4. ✅ Implementar `useUpdateMeal` (React Query) ou método Context
5. ✅ Implementar substituição de foto
6. ✅ Adicionar botão de excluir em `MealCard`
7. ✅ Implementar modal de confirmação
8. ✅ Implementar `useDeleteMeal` (React Query) ou método Context
9. ✅ Criar rota `/app/patient/health-profile`
10. ✅ Implementar formulário de perfil de saúde
11. ✅ Criar service `health.ts`
12. ✅ Implementar hook `useHealthProfile` (React Query) ou método Context
13. ✅ Implementar save/update de perfil
14. ✅ Adicionar link para perfil na navbar

**Entregável**: CRUD completo de refeições + perfil de saúde

**Testes:**
- [ ] Edição de refeição atualiza timeline
- [ ] Substituição de foto mantém apenas última
- [ ] Exclusão remove refeição da timeline
- [ ] Modal de confirmação aparece
- [ ] Perfil de saúde salva corretamente
- [ ] Perfil carrega dados existentes
- [ ] RLS permite apenas owner editar/excluir

---

### Sprint 4: Solicitar Avaliação (4-5 dias)
**Meta**: Paciente consegue solicitar avaliação de nutricionista

**Fluxos:** (Flows 5, 6 da documentação)

**Tarefas:**
1. ✅ Criar rota `/app/patient/request-evaluation`
2. ✅ Implementar Step 1: Seleção de período (14 dias)
3. ✅ Implementar listagem de refeições do período
4. ✅ Implementar Step 2: Seleção de nutricionista
5. ✅ Criar service `nutritionists.ts`
6. ✅ Implementar hook `useNutritionists` (React Query) ou método Context
7. ✅ Implementar componente `NutritionistCard`
8. ✅ Implementar Step 3: Resumo e confirmação
9. ✅ Criar service `evaluations.ts`
10. ✅ Implementar hook `useCreateEvaluation` (React Query) ou método Context
11. ✅ Implementar criação de avaliação com snapshot
12. ✅ Implementar navegação entre steps
13. ✅ Adicionar card de "Solicitar Avaliação" no dashboard
14. ✅ Implementar visualização de avaliações no dashboard
15. ✅ Criar rota `/app/patient/evaluation-feedback/:id`
16. ✅ Implementar visualização de parecer completo

**Entregável**: Fluxo completo de solicitação de avaliação

**Testes:**
- [ ] Seleção de período calcula 14 dias corretamente
- [ ] Apenas refeições do período aparecem
- [ ] Lista nutricionistas disponíveis
- [ ] Resumo mostra dados corretos
- [ ] Avaliação criada com status "pending"
- [ ] Snapshot de saúde vinculado
- [ ] Refeições vinculadas via `evaluation_meals`
- [ ] Card aparece no dashboard do paciente
- [ ] Visualização de parecer mostra feedback
- [ ] RLS permite paciente ver próprias avaliações

---

### Sprint 5: Fluxo do Nutricionista (4-5 dias)
**Meta**: Nutricionista consegue aceitar/recusar/avaliar solicitações

**Fluxos:** (Flows 8, 10, 11 da documentação)

**Tarefas:**
1. ✅ Criar rota `/app/nutritionist/dashboard`
2. ✅ Implementar hook `useMyEvaluations` (React Query) ou método Context
3. ✅ Implementar listagem de avaliações pendentes
4. ✅ Implementar componente `EvaluationCard`
5. ✅ Criar rota `/app/nutritionist/evaluate/:id`
6. ✅ Implementar visualização de refeições da avaliação
7. ✅ Implementar visualização de perfil de saúde (snapshot)
8. ✅ Implementar botões aceitar/recusar
9. ✅ Implementar hook `useAcceptEvaluation` (React Query) ou método Context
10. ✅ Implementar hook `useRejectEvaluation` (React Query) ou método Context
11. ✅ Implementar área de texto para parecer
12. ✅ Implementar botão "Finalizar Avaliação"
13. ✅ Implementar hook `useCompleteEvaluation` (React Query) ou método Context
14. ✅ Implementar tabs (Pendentes / Aceitas / Concluídas)
15. ✅ Implementar notificações de novas solicitações (opcional)

**Entregável**: Fluxo completo do nutricionista

**Testes:**
- [ ] Nutricionista vê apenas avaliações atribuídas a ele
- [ ] Aceitar muda status para "accepted"
- [ ] Recusar muda status para "rejected"
- [ ] Finalizar muda status para "completed"
- [ ] Parecer salva corretamente
- [ ] Paciente vê parecer após conclusão
- [ ] Tabs filtram corretamente
- [ ] RLS permite nutricionista ver/editar avaliações dele
- [ ] RLS permite nutricionista ver refeições vinculadas

---

## 📈 Timeline Estimado

| Sprint | Duração | Acumulado |
|--------|---------|-----------|
| Sprint 0 | 3-4 dias | 3-4 dias |
| Sprint 1 | 2-3 dias | 5-7 dias |
| Sprint 2 | 4-5 dias | 9-12 dias |
| Sprint 3 | 4-5 dias | 13-17 dias |
| Sprint 4 | 4-5 dias | 17-22 dias |
| Sprint 5 | 4-5 dias | 21-27 dias |

**Total: 21-27 dias de desenvolvimento** (considerando 1 desenvolvedor full-time)

---

## 🧪 Estratégia de Testes

### Testes Manuais por Sprint

Cada sprint deve ter:
1. **Checklist de testes funcionais** (listado acima em cada sprint)
2. **Teste de RLS**: Tentar acessar dados de outro usuário (deve falhar)
3. **Teste de edge cases**: Campos vazios, erros de rede, etc
4. **Teste mobile**: Responsividade em device mobile

### Testes Automatizados (Futuro)

Para fase posterior, considerar:
- **Vitest + React Testing Library**: Testes de componentes
- **Playwright**: Testes E2E dos fluxos principais
- **Supabase pg_tap**: Testes de RLS policies

---

## 🚀 Deploy e CI/CD

### Vercel

1. **Environment Variables** (adicionar no dashboard):
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_CLOUDINARY_CLOUD_NAME
   VITE_CLOUDINARY_UPLOAD_PRESET
   ```

2. **Deploy automático**: Push para `main` → deploy automático

3. **Preview deployments**: Cada PR gera preview URL

### Branches

- `main`: Produção (auto-deploy)
- `develop`: Desenvolvimento (preview deploy)
- `feature/*`: Features individuais (preview deploy)

---

## 📝 Próximos Passos

1. **Decisão**: Escolher entre React Query ou Context Puro
2. **Sprint 0**: Executar setup de infraestrutura
3. **Sprint 1**: Implementar login Google
4. **Sprints 2-5**: Implementar features incrementalmente
5. **Testes**: Testar cada sprint antes de próximo
6. **Deploy**: Deploy contínuo via Vercel

---

## 🔄 Migração de Dados do Protótipo

Como protótipo usa dados mockados localmente, **não há migração de dados** necessária. Todos os usuários começam do zero no banco de produção.

Se posteriormente quiser "popular" banco com dados exemplo:
1. Criar script SQL com INSERTs
2. Executar via Supabase SQL Editor
3. Respeitar UUIDs e relacionamentos

---

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [React Router v7 Docs](https://reactrouter.com/en/main)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)

---

**Última atualização**: 6 de Fevereiro de 2026
