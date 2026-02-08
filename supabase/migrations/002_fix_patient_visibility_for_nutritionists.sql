-- ============================================================================
-- Migration: 002 - Permitir nutricionistas verem dados de pacientes
-- Data: 2026-02-07
-- Descrição: Adiciona policy para nutricionistas visualizarem dados básicos
--            dos pacientes que solicitaram avaliações
-- ============================================================================

-- Adiciona policy para nutricionistas verem dados de seus pacientes
CREATE POLICY "Nutritionists can view their patients data" ON users
  FOR SELECT
  USING (
    -- Nutricionista pode ver dados de pacientes que têm avaliações com ele
    EXISTS (
      SELECT 1 FROM evaluations
      WHERE evaluations.patient_id = users.id
      AND evaluations.nutritionist_id = auth.uid()
    )
  );

-- ============================================================================
-- RESULTADO ESPERADO:
-- ============================================================================
-- Nutricionistas poderão ver:
-- - Nome, email e avatar de pacientes que solicitaram avaliações com eles
-- - Não poderão ver dados de outros pacientes
-- - Pacientes não podem ver dados de outros pacientes (mantido)
-- ============================================================================
