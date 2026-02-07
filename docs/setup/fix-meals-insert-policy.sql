-- Adicionar policy de INSERT para a tabela meals
-- Permite que usuários insiram suas próprias refeições

CREATE POLICY "Users can insert own meals"
  ON meals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
