-- Check existing RLS policies for users and nutritionists tables

-- View all policies on users table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('users', 'nutritionists')
ORDER BY tablename, policyname;

-- Alternative simpler view
SELECT 
  tablename,
  policyname,
  cmd as command
FROM pg_policies
WHERE tablename IN ('users', 'nutritionists')
ORDER BY tablename, cmd;
