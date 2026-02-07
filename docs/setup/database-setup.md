# Setup do Banco de Dados Supabase

Este guia detalha a ordem de execução dos comandos SQL para criar o schema completo do banco de dados.

## 📋 Pré-requisitos

- Projeto Supabase criado
- Acesso ao SQL Editor no Supabase Dashboard

---

## 🗄️ Ordem de Execução

Execute os comandos SQL na seguinte ordem no **Supabase SQL Editor** (Project → SQL Editor → New Query):

### 1. Criar Tabela `users`
**Referência**: `docs/plans/transicao-prototipo-producao.md` - Seção "Schema do Banco de Dados (Supabase)" → Item 1

```sql
-- Copiar o bloco completo de CREATE TABLE + RLS policies
-- Tabela principal de usuários (pacientes e nutricionistas)
```

### 2. Criar Tabela `health_profiles`
**Referência**: `docs/plans/transicao-prototipo-producao.md` - Seção "Schema do Banco de Dados (Supabase)" → Item 2

```sql
-- Copiar o bloco completo de CREATE TABLE + RLS policies
-- Perfil de saúde dos pacientes (1:1 com users)
```

### 3. Criar Tabela `meals`
**Referência**: `docs/plans/transicao-prototipo-producao.md` - Seção "Schema do Banco de Dados (Supabase)" → Item 3

⚠️ **ATENÇÃO**: Execute em duas etapas (ver `docs/setup/sql-fix-meals.md`):

```sql
-- Etapa 1: Criar tabela SEM a última policy (evita erro de dependência)
-- Copiar do arquivo de correção: docs/setup/sql-fix-meals.md
-- Tabela meals com 4 policies básicas (sem policy de nutritionists)
```

**A 5ª policy será adicionada DEPOIS de criar evaluation_meals (Item 6)**

### 4. Criar Tabela `nutritionists`
**Referência**: `docs/plans/transicao-prototipo-producao.md` - Seção "Schema do Banco de Dados (Supabase)" → Item 4

```sql
-- Copiar o bloco completo de CREATE TABLE + RLS policies
-- Informações profissionais dos nutricionistas (1:1 com users)
```

### 5. Criar Tabela `evaluations`
**Referência**: `docs/plans/transicao-prototipo-producao.md` - Seção "Schema do Banco de Dados (Supabase)" → Item 5

```sql
-- Copiar o bloco completo de CREATE TABLE + índices + RLS policies
-- Avaliações nutricionais (vincula paciente + nutricionista)
```

### 6. Criar Tabela `evaluation_meals`
**Referência**: `docs/plans/transicao-prototipo-producao.md` - Seção "Schema do Banco de Dados (Supabase)" → Item 6

```sql
-- Copiar o bloco completo de CREATE TABLE + RLS policies
-- Tabela de junção (N:M entre evaluations e meals)
```

### 7. Criar Tabela `evaluation_health_snapshots`
**Referência**: `docs/plans/transicao-prototipo-producao.md` - Seção "Schema do Banco de Dados (Supabase)" → Item 7

```sql
-- Copiar o bloco completo de CREATE TABLE + RLS policies
-- Snapshot do perfil de saúde no momento da avaliação
```

### 8. Criar Triggers para `updated_at`
**Referência**: `docs/plans/transicao-prototipo-producao.md` - Seção "Triggers para updated_at"

```sql
-- Copiar o bloco completo de CREATE FUNCTION + todos os CREATE TRIGGER
-- Atualiza automaticamente o campo updated_at em updates
```

---

## ✅ Verificação

Após executar todos os comandos, verificar:

### No SQL Editor:

```sql
-- Listar todas as tabelas criadas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Verificar RLS habilitado
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Contar policies criadas
SELECT schemaname, tablename, COUNT(*) as policy_count
FROM pg_policies
GROUP BY schemaname, tablename
ORDER BY tablename;
```

**Resultado esperado**:
- 7 tabelas: users, health_profiles, meals, nutritionists, evaluations, evaluation_meals, evaluation_health_snapshots
- RLS habilitado em todas (rowsecurity = true)
- Total de ~15 policies

### No Table Editor:

1. Vá em **Database** → **Tables**
2. Verificar que todas as 7 tabelas aparecem
3. Clicar em cada tabela e verificar colunas

---

## 🔐 Segurança (RLS)

Todas as policies RLS já estão incluídas nos blocos SQL. Principais controles:

- **users**: Usuários veem apenas seus próprios dados
- **health_profiles**: Pacientes veem/editam apenas próprio perfil
- **meals**: Pacientes veem/editam apenas próprias refeições; Nutricionistas veem refeições de avaliações atribuídas
- **nutritionists**: Todos veem nutricionistas disponíveis; Nutricionista edita apenas próprio perfil
- **evaluations**: Paciente vê próprias avaliações; Nutricionista vê/edita avaliações atribuídas a ele
- **evaluation_meals**: Visível para paciente e nutricionista da avaliação
- **evaluation_health_snapshots**: Visível para paciente e nutricionista da avaliação

---

## 🧪 Testes Manuais (Opcional)

### Teste 1: Inserir usuário teste

```sql
-- Inserir paciente
INSERT INTO users (id, email, full_name, user_type)
VALUES (gen_random_uuid(), 'paciente@teste.com', 'Paciente Teste', 'patient');

-- Inserir nutricionista
INSERT INTO users (id, email, full_name, user_type)
VALUES (gen_random_uuid(), 'nutri@teste.com', 'Nutricionista Teste', 'nutritionist');
```

### Teste 2: Verificar RLS

```sql
-- Tentar acessar meals sem autenticação (deve retornar vazio)
SELECT * FROM meals;

-- Com autenticação real (via app), só verá próprias meals
```

---

## 🔄 Rollback (se necessário)

Para deletar tudo e recomeçar:

```sql
-- CUIDADO: Deleta todas as tabelas e dados
DROP TABLE IF EXISTS evaluation_health_snapshots CASCADE;
DROP TABLE IF EXISTS evaluation_meals CASCADE;
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS nutritionists CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS health_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
```

---

## 📚 Próximos Passos

Após setup do banco:

1. ✅ Configurar variáveis de ambiente no Vercel (ver `docs/setup/vercel-integration.md`)
2. ✅ Configurar Cloudinary upload preset (ver `docs/setup/cloudinary-setup.md`)
3. ✅ Configurar Google OAuth no Supabase (ver Sprint 1 no plano)
4. ✅ Instalar dependências: `npm install @supabase/supabase-js`
5. ✅ Copiar `.env.local.example` para `.env.local` e preencher
6. ✅ Testar conexão local: `npm run dev`

---

**Última atualização**: 6 de Fevereiro de 2026
