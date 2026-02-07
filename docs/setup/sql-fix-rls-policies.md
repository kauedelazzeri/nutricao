-- ==================================================
-- FIX: Adicionar policies RLS faltantes
-- ==================================================
-- Execute este SQL no Supabase Dashboard (SQL Editor)
-- para permitir que usuários criem seus registros
-- ==================================================

-- 1. Permitir que usuários autenticados criem seu próprio registro na tabela users
CREATE POLICY "Users can insert own data on signup"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Permitir que nutricionistas criem seu próprio registro
CREATE POLICY "Nutritionists can insert own profile"
  ON nutritionists FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ==================================================
-- Verificação (opcional - executar depois para confirmar)
-- ==================================================
-- SELECT schemaname, tablename, policyname, cmd
-- FROM pg_policies
-- WHERE tablename IN ('users', 'nutritionists')
-- ORDER BY tablename, policyname;
