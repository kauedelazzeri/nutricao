-- ============================================================================
-- FIX: Permitir que pacientes vejam dados de nutricionistas
-- ============================================================================
-- PROBLEMA: 
-- A policy "Users can view own data" impede que pacientes vejam dados
-- de nutricionistas quando fazem JOIN na query de listagem.
--
-- SOLUÇÃO:
-- Adicionar policy que permite ver dados públicos (nome, email, avatar)
-- de usuários que são nutricionistas.
-- ============================================================================

-- Remove a policy restritiva antiga (opcional, pode manter as duas)
-- DROP POLICY IF EXISTS "Users can view own data" ON users;

-- Nova policy: Qualquer autenticado pode ver dados de nutricionistas
CREATE POLICY "Anyone can view nutritionist user data" ON users
  FOR SELECT
  USING (
    user_type = 'nutritionist'
    OR auth.uid() = id  -- Ainda pode ver próprios dados
  );

-- ============================================================================
-- RESULTADO ESPERADO:
-- ============================================================================
-- Após executar esta query:
-- 1. Pacientes poderão ver dados (nome, avatar, email) de nutricionistas
-- 2. A listagem de nutricionistas mostrará informações completas
-- 3. O botão "Salvar alterações" não ficará mais travado em "Salvando..."
-- 4. Cada usuário ainda pode ver apenas os próprios dados (exceto nutricionistas)
-- ============================================================================

-- ============================================================================
-- ALTERNATIVA: Se a policy acima der conflito, use esta:
-- ============================================================================
-- Remove TODAS as policies de SELECT em users
-- DROP POLICY IF EXISTS "Users can view own data" ON users;
-- DROP POLICY IF EXISTS "Anyone can view nutritionist user data" ON users;

-- Cria UMA policy única que permite:
-- 1. Ver próprios dados
-- 2. Ver dados de nutricionistas
-- CREATE POLICY "Users can view permitted data" ON users
--   FOR SELECT
--   USING (
--     auth.uid() = id 
--     OR user_type = 'nutritionist'
--   );
