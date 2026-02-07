-- Only create the nutritionists INSERT policy (users policy already exists)

CREATE POLICY "Nutritionists can insert own profile"
  ON nutritionists
  FOR INSERT
  WITH CHECK (auth.uid() = id);
