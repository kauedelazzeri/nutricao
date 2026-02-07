-- Adicionar política INSERT para evaluation_meals
-- Execute no Supabase SQL Editor

CREATE POLICY "Patients can create evaluation_meals when creating evaluation"
  ON evaluation_meals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM evaluations 
      WHERE evaluations.id = evaluation_meals.evaluation_id 
      AND evaluations.patient_id = auth.uid()
    )
  );
