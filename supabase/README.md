# Supabase Database Management

Este diretório contém a estrutura e histórico do banco de dados Supabase.

## 📁 Estrutura

```
supabase/
├── README.md           # Este arquivo
├── schema.sql          # Snapshot atual completo do database
└── migrations/         # Histórico de mudanças aplicadas
    ├── 001_fix_users_rls.sql
    └── ...
```

## 📝 Arquivos

### `schema.sql`
- **Propósito**: Snapshot completo e atual do schema do banco
- **Conteúdo**: Todas as tabelas, indexes, policies, triggers, functions
- **Atualização**: Atualizado após cada migration aplicada
- **Uso**: Referência rápida da estrutura atual

### `migrations/`
- **Propósito**: Histórico cronológico de todas as mudanças no banco
- **Nomenclatura**: `XXX_descricao.sql` (exemplo: `001_fix_users_rls.sql`)
- **Regra**: NUNCA deletar migrations antigas
- **Ordem**: Executar em ordem numérica

## 🚀 Como Aplicar Mudanças

### 1. Criar Nova Migration

Quando precisar fazer mudanças no banco:

```bash
# Criar novo arquivo numerado
supabase/migrations/002_nome_da_mudanca.sql
```

Estrutura do arquivo:
```sql
-- ============================================================================
-- Migration: 002 - Nome da Mudança
-- Data: YYYY-MM-DD
-- Descrição: O que esta migration faz
-- ============================================================================

-- Seu SQL aqui
ALTER TABLE ...

-- ============================================================================
-- Como reverter (opcional):
-- ============================================================================
-- DROP ...
```

### 2. Aplicar no Supabase

1. Abra [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Cole o conteúdo da migration
4. Execute (Run)
5. Verifique se não há erros

### 3. Atualizar Schema

Após aplicar com sucesso:

1. Atualize `schema.sql` refletindo as mudanças
2. Commit dos arquivos no git:
   ```bash
   git add supabase/
   git commit -m "Migration: descrição da mudança"
   ```

## 📋 Migrations Aplicadas

| # | Nome | Data | Descrição | Status |
|---|------|------|-----------|--------|
| 001 | fix_users_rls | 2026-02-07 | Permite pacientes verem dados de nutricionistas | ✅ Aplicada |

## 🔍 Queries Úteis

### Ver todas as tabelas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Ver colunas de uma tabela
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'nome_da_tabela'
ORDER BY ordinal_position;
```

### Ver policies RLS
```sql
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Ver indexes
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

## ⚠️ Convenções

1. **Sempre use IF EXISTS / IF NOT EXISTS**: Evita erros em re-execuções
2. **Políticas RLS**: Sempre use `DROP POLICY IF EXISTS` antes de criar
3. **Comentários**: Explique o "por quê" da mudança
4. **Teste local**: Se possível, teste em ambiente de dev primeiro
5. **Backup**: Supabase faz backup automático, mas verifique antes de mudanças grandes
6. **Reversão**: Documente como reverter mudanças críticas

## 🔄 Workflow Recomendado

```
1. Identificar necessidade de mudança
   ↓
2. Criar arquivo migrations/XXX_nome.sql
   ↓
3. Executar no Supabase SQL Editor
   ↓
4. Verificar funcionamento (teste na aplicação)
   ↓
5. Atualizar schema.sql
   ↓
6. Commit no git
```

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [SQL Best Practices](https://www.sqlstyle.guide/)
