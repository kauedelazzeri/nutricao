# Correção do SQL - Tabela Meals

## ⚠️ Problema

A tabela `meals` (Item 3) tem uma policy que referencia `evaluation_meals` (Item 6), causando erro:
```
ERROR: 42P01: relation "evaluation_meals" does not exist
```

## ✅ Solução

Execute o SQL da tabela `meals` em **duas etapas**:

---

### Etapa 1: Criar tabela meals SEM a última policy

```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'supper')),
  description TEXT NOT NULL,
  photo_url TEXT,
  photo_public_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX meals_user_id_date_idx ON meals(user_id, date DESC);

-- RLS Policies
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  USING (auth.uid() = user_id);
```

✅ **Execute isso agora** (deve funcionar)

---

### Etapa 2: Adicionar policy para nutricionistas DEPOIS de criar evaluation_meals

**⏱️ Execute isso APENAS APÓS criar as tabelas 4, 5 e 6**

```sql
-- ATENÇÃO: Só executar depois de criar evaluation_meals (Item 6)
CREATE POLICY "Nutritionists can view meals in their evaluations"
  ON meals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM evaluation_meals em
      JOIN evaluations e ON e.id = em.evaluation_id
      WHERE em.meal_id = meals.id
      AND e.nutritionist_id = auth.uid()
    )
  );
```

---

## 📋 Ordem Completa Corrigida

1. ✅ `users` - OK
2. ✅ `health_profiles` - OK
3. ✅ `meals` - **Usar Etapa 1 (sem última policy)**
4. ✅ `nutritionists` - OK (pode continuar normal)
5. ✅ `evaluations` - OK (pode continuar normal)
6. ✅ `evaluation_meals` - OK (pode continuar normal)
7. ✅ `evaluation_health_snapshots` - OK (pode continuar normal)
8. ✅ `triggers` - OK (pode continuar normal)
9. ✅ **VOLTAR e executar Etapa 2 de meals** (adicionar policy de nutricionistas)

---

## 🧪 Verificação Final

Após executar tudo, verificar que a policy foi criada:

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'meals';
```

**Resultado esperado**: 5 policies
- Users can view own meals
- Users can insert own meals
- Users can update own meals
- Users can delete own meals
- Nutritionists can view meals in their evaluations ← Esta será a última

---

**Última atualização**: 6 de Fevereiro de 2026
