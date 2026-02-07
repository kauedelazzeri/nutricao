-- Verificar políticas RLS da tabela meals

SELECT 
  tablename,
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies
WHERE tablename = 'meals'
ORDER BY cmd;
