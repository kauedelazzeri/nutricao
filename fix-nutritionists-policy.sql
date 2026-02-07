-- Permitir que qualquer um veja todos os nutricionistas (não apenas os available)
-- Execute no Supabase SQL Editor

DROP POLICY IF EXISTS "Anyone can view available nutritionists" ON nutritionists;

CREATE POLICY "Anyone can view all nutritionists"
  ON nutritionists FOR SELECT
  USING (true);

-- OU, se preferir apenas ativar os nutricionistas existentes:
-- UPDATE nutritionists SET available = true;
