# Integração Supabase + Vercel

Este guia mostra como configurar as variáveis de ambiente do Supabase no Vercel para deploy em produção.

## 📋 Pré-requisitos

- Projeto Supabase criado
- Projeto Vercel conectado ao repositório GitHub
- Variáveis de ambiente coletadas (veja passo 1)

---

## 🔧 Passo a Passo

### 1. Coletar Credenciais do Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Project Settings** → **API**
4. Copie as seguintes informações:
   - **Project URL** (formato: `https://[projeto].supabase.co`)
   - **anon public** key (API Key para uso público)

### 2. Adicionar Variáveis no Vercel

#### Via Dashboard (Recomendado)

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto (`nutricao`)
3. Vá em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

| Name | Value | Environments |
|------|-------|--------------|
| `VITE_SUPABASE_URL` | `https://[seu-projeto].supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` (sua anon key) | Production, Preview, Development |
| `VITE_CLOUDINARY_CLOUD_NAME` | `[seu-cloud-name]` | Production, Preview, Development |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `[seu-preset]` | Production, Preview, Development |

5. Clique em **Save** para cada variável

#### Via Vercel CLI (Alternativa)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link ao projeto
vercel link

# Adicionar variáveis
vercel env add VITE_SUPABASE_URL production
# (cole o valor quando solicitado)

vercel env add VITE_SUPABASE_ANON_KEY production
# (cole o valor quando solicitado)

vercel env add VITE_CLOUDINARY_CLOUD_NAME production
# (cole o valor quando solicitado)

vercel env add VITE_CLOUDINARY_UPLOAD_PRESET production
# (cole o valor quando solicitado)

# Repetir para preview e development se necessário
```

### 3. Redeploy da Aplicação

Após adicionar as variáveis de ambiente:

1. Via Dashboard: Vá em **Deployments** → clique nos três pontos do último deploy → **Redeploy**
2. Via push: Faça qualquer commit e push para `main` (deploy automático)
3. Via CLI: `vercel --prod`

### 4. Verificar Configuração

Após o deploy:

1. Acesse sua aplicação em produção
2. Abra DevTools → Console
3. Se houver erro "Missing Supabase environment variables", verifique:
   - Variáveis foram salvas corretamente
   - Redeploy foi feito após adicionar variáveis
   - Nome das variáveis está exato (case-sensitive)

---

## 🔐 Segurança

### ⚠️ IMPORTANTE

- **NUNCA** commitar `.env.local` no Git (já está no `.gitignore`)
- **anon key** é segura para client-side (protegida por RLS no Supabase)
- **service_role key** NUNCA deve ser exposta no frontend
- Variáveis com prefixo `VITE_` são expostas publicamente no bundle JS

### RLS (Row Level Security)

As credenciais `anon` são seguras porque o Supabase usa **Row Level Security**:
- Políticas SQL controlam quem acessa o quê
- Mesmo com a anon key, usuários só veem seus próprios dados
- Queries não autorizadas são bloqueadas no servidor

Exemplo de policy que já está no schema:
```sql
CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🧪 Testar Localmente

Para testar localmente com as mesmas variáveis:

1. Copie `.env.local.example` para `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edite `.env.local` com suas credenciais

3. Reinicie o servidor de dev:
   ```bash
   npm run dev
   ```

---

## 🔄 Ambientes Vercel

Vercel tem 3 tipos de ambiente:

1. **Production**: Branch `main` → `nutricao.vercel.app`
2. **Preview**: Pull Requests → `nutricao-git-[branch].vercel.app`
3. **Development**: Vercel CLI local

Configure as variáveis para todos os ambientes ou separe por ambiente se necessário (ex: banco de staging).

---

## 📚 Referências

- [Supabase + Vercel Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-vercel)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 🆘 Troubleshooting

### Erro: "Missing Supabase environment variables"

**Causa**: Variáveis não estão sendo carregadas

**Solução**:
1. Verificar ortografia das variáveis (case-sensitive)
2. Garantir que redeploy foi feito após adicionar variáveis
3. Verificar que variável tem prefixo `VITE_`

### Erro: "Invalid API key"

**Causa**: anon key incorreta ou expirada

**Solução**:
1. Copiar novamente do Supabase Dashboard
2. Verificar que copiou a **anon** key (não a service_role)
3. Atualizar no Vercel e redeploy

### Preview deploy não funciona

**Causa**: Variáveis não configuradas para ambiente "Preview"

**Solução**:
1. Editar cada variável no Vercel
2. Marcar checkbox "Preview"
3. Salvar
4. Recriar preview (push novamente ou reabrir PR)

---

**Última atualização**: 6 de Fevereiro de 2026
