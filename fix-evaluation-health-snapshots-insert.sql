-- Adicionar política INSERT para evaluation_health_snapshots
-- Execute no Supabase SQL Editor

CREATE POLICY "Patients can create health snapshot when creating evaluation"
  ON evaluation_health_snapshots FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM evaluations 
      WHERE evaluations.id = evaluation_health_snapshots.evaluation_id 
      AND evaluations.patient_id = auth.uid()
    )
  );
