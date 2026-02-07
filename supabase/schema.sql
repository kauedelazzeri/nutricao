-- ============================================================================
-- SUPABASE DATABASE SCHEMA - Nutricao App
-- ============================================================================
-- Este arquivo documenta o schema ATUAL do banco de dados Supabase
-- Última atualização: 2026-02-07
-- ============================================================================

-- TABELA: users
-- Armazena informações básicas de todos os usuários (pacientes e nutricionistas)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  user_type TEXT NOT NULL, -- 'patient' ou 'nutritionist'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABELA: nutritionists
-- Perfil profissional dos nutricionistas
CREATE TABLE nutritionists (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialties TEXT[] NOT NULL,
  bio TEXT,
  years_experience INTEGER,
  consultation_fee NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 0,
  total_evaluations INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABELA: health_profiles
-- Perfil de saúde dos pacientes
CREATE TABLE health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age INTEGER,
  weight NUMERIC,
  height NUMERIC,
  dietary_restrictions TEXT[],
  health_goals TEXT[],
  activity_level TEXT,
  allergies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABELA: meals
-- Refeições registradas pelos pacientes
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  meal_type TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  photo_public_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABELA: evaluations
-- Avaliações nutricionais solicitadas por pacientes
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nutritionist_id UUID NOT NULL REFERENCES nutritionists(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  feedback TEXT,
  accepted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABELA: evaluation_meals
-- Relacionamento entre avaliações e refeições incluídas
CREATE TABLE evaluation_meals (
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  PRIMARY KEY (evaluation_id, meal_id)
);

-- TABELA: evaluation_health_snapshots
-- Snapshot do perfil de saúde no momento da avaliação
CREATE TABLE evaluation_health_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  age INTEGER,
  weight NUMERIC,
  height NUMERIC,
  dietary_restrictions TEXT[],
  health_goals TEXT[],
  activity_level TEXT,
  allergies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- RLS POLICIES ATUAIS
-- ============================================================================

-- USERS TABLE
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- SELECT: Usuários podem ver próprios dados OU dados de nutricionistas
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Anyone can view nutritionist user data" ON users
  FOR SELECT USING (user_type = 'nutritionist' OR auth.uid() = id);

-- INSERT: Usuários podem inserir próprios dados no signup
CREATE POLICY "Users can insert own data on signup" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: Usuários podem atualizar próprios dados
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- NUTRITIONISTS TABLE
ALTER TABLE nutritionists ENABLE ROW LEVEL SECURITY;

-- SELECT: Qualquer pessoa pode ver todos nutricionistas
CREATE POLICY "Anyone can view all nutritionists" ON nutritionists
  FOR SELECT USING (true);

-- INSERT: Nutricionistas podem inserir próprio perfil
CREATE POLICY "Nutritionists can insert own profile" ON nutritionists
  FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: Nutricionistas podem atualizar próprio perfil
CREATE POLICY "Nutritionists can update own profile" ON nutritionists
  FOR UPDATE USING (auth.uid() = id);

-- HEALTH_PROFILES TABLE
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health profile" ON health_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health profile" ON health_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health profile" ON health_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- MEALS TABLE
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meals" ON meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Nutritionists can view meals in their evaluations" ON meals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM evaluation_meals em
      JOIN evaluations e ON e.id = em.evaluation_id
      WHERE em.meal_id = meals.id 
      AND e.nutritionist_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own meals" ON meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals" ON meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals" ON meals
  FOR DELETE USING (auth.uid() = user_id);

-- EVALUATIONS TABLE
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own evaluations" ON evaluations
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Nutritionists can view their evaluations" ON evaluations
  FOR SELECT USING (auth.uid() = nutritionist_id);

CREATE POLICY "Patients can insert own evaluations" ON evaluations
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Nutritionists can update their evaluations" ON evaluations
  FOR UPDATE USING (auth.uid() = nutritionist_id);

-- EVALUATION_MEALS TABLE
ALTER TABLE evaluation_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evaluation meals" ON evaluation_meals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM evaluations e
      WHERE e.id = evaluation_meals.evaluation_id
      AND (e.patient_id = auth.uid() OR e.nutritionist_id = auth.uid())
    )
  );

CREATE POLICY "Patients can create evaluation_meals when creating evaluation" ON evaluation_meals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM evaluations
      WHERE evaluations.id = evaluation_meals.evaluation_id
      AND evaluations.patient_id = auth.uid()
    )
  );

-- EVALUATION_HEALTH_SNAPSHOTS TABLE
ALTER TABLE evaluation_health_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evaluation health snapshots" ON evaluation_health_snapshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM evaluations e
      WHERE e.id = evaluation_health_snapshots.evaluation_id
      AND (e.patient_id = auth.uid() OR e.nutritionist_id = auth.uid())
    )
  );

CREATE POLICY "Patients can create health snapshot when creating evaluation" ON evaluation_health_snapshots
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM evaluations
      WHERE evaluations.id = evaluation_health_snapshots.evaluation_id
      AND evaluations.patient_id = auth.uid()
    )
  );
