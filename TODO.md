# 📝 TODO - Itens Pendentes

## � PRIORIDADE ALTA

### **Descrição opcional no registro de refeição**
- **Problema**: Campo de descrição está obrigatório ao registrar refeição
- **Página**: `/app/patient/register-meal` - RegisterMealPage.tsx
- **Solução**: Remover `required` do campo de descrição
- **Prioridade**: ALTA - primeira tarefa mais importante
- **Sprint**: Próxima

### **Informações dos nutricionistas não aparecem**
- **Problema**: Lista de nutricionistas mostra apenas "Nutricionista" sem nome real, email, especialidades, etc.
- **Causa**: Query não está carregando dados da tabela `users` corretamente
- **Página**: `/app/patient/nutritionists` - NutritionistsListPage.tsx
- **Arquivo**: `app/shared/hooks/useNutritionists.ts`
- **Prioridade**: ALTA - impossível escolher nutricionista sem informações
- **Sprint**: Próxima

---

## �🐛 Bugs Conhecidos (Sprints Futuras)

### 1. **Cloudinary: Delete de fotos não implementado**
- **Problema**: Ao deletar uma refeição, a foto NÃO é removida do Cloudinary
- **Impacto**: Baixo - dentro do plano gratuito (25GB storage)
- **Solução**: Implementar backend function com signature para delete seguro
- **Arquivo**: `app/shared/services/cloudinary.ts` - função `deleteMealPhoto()`
- **Sprint**: A definir (não urgente)

### 2. **Flash de userType incorreto ao recarregar página (F5)**
- **Problema**: Ao dar F5, tela mostra brevemente "nutricionista" antes de ajustar para "patient"
- **Causa**: AuthContext está buscando `userType` assíncrono após carregar sessão
- **Impacto**: Baixo - UX levemente confusa por ~200ms
- **Solução**: Adicionar loading state ou cache do userType no localStorage
- **Arquivo**: `app/shared/contexts/AuthContext.tsx`
- **Sprint**: A definir (melhorias de UX)

### 3. **Links da demo quebrados**
- **Problema**: Rotas `/demo/*` com links quebrados após reestruturação
- **Impacto**: Médio - protótipo não navegável
- **Solução**: Ajustar links internos nas páginas de demo
- **Arquivos**: Páginas em `app/modules/patient/pages/*` e `app/modules/nutritionist/pages/*` (demo)
- **Sprint**: A definir (manutenção)

### 4. **Controle de visibilidade de nutricionistas**
- **Problema**: Definir quem controla se um nutricionista aparece na lista para pacientes
- **Opções**: 
  - Admin controla (campo `available` gerenciado manualmente)
  - Nutricionista autocontrola (toggle na interface do nutricionista)
- **Impacto**: Médio - afeta regra de negócio
- **Decisão**: A definir
- **Arquivo**: `app/shared/hooks/useNutritionists.ts` (filtro) + possível página de admin ou toggle
- **Sprint**: A definir

### 5. **AuthContext fazendo múltiplas requisições de userType**
- **Problema**: AuthContext busca `userType` 3x ao carregar/navegar (renderizações duplicadas)
- **Causa**: Re-renders desnecessários ou falta de cache
- **Impacto**: Médio - overhead de requisições, pode atingir rate limits
- **Solução**: Implementar cache em memória ou localStorage, otimizar dependências do useEffect
- **Arquivo**: `app/shared/contexts/AuthContext.tsx`
- **Sprint**: A definir (performance)

---

## ✅ Sprints Completas

### Sprint 0: Infraestrutura ✅
- Supabase configurado (7 tabelas + RLS)
- Google OAuth funcionando
- Cloudinary configurado (upload de fotos)
- React Query instalado e configurado
- Environment variables

### Sprint 1: Autenticação Google ✅
- Login/Callback/Setup/Dashboard pages
- AuthContext com session management
- Redirect condicional (patient/nutritionist)
- RLS policies corrigidas (users, nutritionists, meals INSERT)

### Sprint 2: Registro de Refeições ✅
- RegisterMealPage com upload de foto e preview
- PatientTimelinePage com agrupamento por data
- MealCard component
- useMeals hooks (CRUD com Cloudinary)
- Delete de refeições funcionando (sem remover foto do Cloudinary)

### Sprint 3: Edição + Perfil de Saúde ✅
- EditMealPage com formulário completo
- Edição de todos os campos da refeição
- Troca de foto opcional (mantém, substitui ou remove)
- PatientHealthProfilePage (idade, peso, altura, atividades, restrições, objetivos, alergias)
- Cálculo automático de IMC
- useHealthProfile hooks (GET/CREATE/UPDATE)

---

## 🎯 Próximas Sprints

### Sprint 4: Avaliações ✅ COMPLETA
**Funcionalidades paciente:**
✅ Solicitar avaliação de nutricionista
✅ Ver lista de nutricionistas disponíveis
✅ Selecionar período para avaliação
⚠️ Visualizar parecer do nutricionista (PENDENTE - precisa criar página de visualização)

**Funcionalidades nutricionista:**
✅ Dashboard com avaliações pendentes
✅ Aceitar/Rejeitar solicitações
✅ Ver refeições do paciente no período
✅ Escrever parecer nutricional (salvar rascunho + finalizar)
✅ Histórico de avaliações (dashboard com estatísticas)

**Detalhes implementados:**
- Batch loading otimizado (1 query para dashboard, 3 para lista paciente)
- RLS policies para evaluation_meals e evaluation_health_snapshots
- Tradução de meal_type para pt-BR
- Timeline de refeições com fotos ampliáveis
- Editor de parecer com save/complete
- Status tracking (pending → accepted → completed)

**Commits:**
- f8b80af: funcionalidades do paciente (solicitar, listar nutricionistas, ver avaliações)
- 573093f: dashboard do nutricionista
- 50ed959: aceitar/rejeitar avaliações
- 010f15c: visualização de refeições e parecer

### Sprint 4.5: UX & Polimento ✅ COMPLETA
**Melhorias implementadas:**
✅ Removidos popups do sistema (alert/confirm) - substituídos por console.error
✅ Corrigido loading state travado ao aceitar avaliação (callback pattern + replace:true)
✅ RLS policy para nutricionistas verem dados dos pacientes (migration 002)
✅ Pricing promocional "GRÁTIS" em todas as telas
✅ Histórico completo de avaliações no dashboard do nutricionista
✅ Removido arquivo duplicado DashboardPage.tsx
✅ Corrigido erro de sintaxe em RequestEvaluationPage

**RLS Policies criadas:**
- Migration 001: Pacientes podem ver dados de nutricionistas (users.user_type='nutritionist')
- Migration 002: Nutricionistas podem ver dados de pacientes que têm avaliações com eles

**Commits:**
- 4c585db: fix UX, RLS policies, promotional pricing

### Sprint 5: Paciente Visualizar Feedback (Próxima)
**Funcionalidade:**
- Página para paciente ver parecer nutricional completo
- Exibir status da avaliação (pending/accepted/rejected/completed)
- Mostrar feedback quando status=completed
- Mostrar motivo quando status=rejected

### Sprint 6: Avaliações com Períodos Fixos + Acompanhamento Futuro 🎯 PLANEJAMENTO
**Objetivo**: Simplificar seleção de período e permitir acompanhamento de futuro com comentários por refeição.

#### **Parte 1: Períodos Fixos (substituir calendário)**
**Funcionalidade:**
- Substituir seleção de datas por botões de período fixo:
  - 📅 **Últimos 7 dias** (hoje - 6 dias até hoje)
  - 📅 **Últimos 30 dias** (hoje - 29 dias até hoje)
  - 📅 **Próximos 7 dias** (hoje até hoje + 6 dias)
  - 📅 **Próximos 30 dias** (hoje até hoje + 29 dias)

**Regras de Negócio:**
1. **Avaliação de Histórico** (últimos X dias):
   - Funciona como hoje: nutricionista vê refeições passadas e escreve parecer final
   - Snapshot de refeições é criado no momento da solicitação
   - Status: `pending` → `accepted` → `completed`/`rejected`
   
2. **Avaliação de Futuro** (próximos X dias):
   - Tipo especial: `evaluation_type = 'future'` (novo campo)
   - Compartilhamento contínuo: paciente registra refeições normalmente durante o período
   - Nutricionista tem acesso em tempo real às novas refeições
   - Nutricionista comenta **por refeição** (não apenas parecer final)
   - Status: `pending` → `accepted` → `in_progress` → `completed`
   - Encerra automaticamente após período + X dias de tolerância

**UI/UX:**
- RequestEvaluationPage: 4 botões grandes com ícone + texto
- Indicação visual clara: passado vs futuro
- Confirmação antes de solicitar avaliação de futuro (explicar que é acompanhamento)

#### **Parte 2: Comentários por Refeição (avaliação futura)**
**Funcionalidade:**
- Nutricionista comenta diretamente em cada refeição do período
- Chat/thread de comentários por refeição
- Notificações para paciente quando receber comentário
- Paciente pode responder aos comentários

**Regras de Negócio:**
1. **Visibilidade**:
   - Nutricionista vê refeições à medida que paciente registra
   - Paciente vê comentários em tempo real
   
2. **Comentários**:
   - Nutricionista pode comentar: "O que é isso?", "Ótima escolha!", "Tente reduzir sal"
   - Paciente pode responder: "É batata doce", "Obrigado!", etc
   - Thread de comentários por refeição (não apenas 1 mensagem)
   
3. **Finalização**:
   - Nutricionista pode finalizar antes do período se achar suficiente
   - Ao finalizar, escreve parecer geral (opcional)
   - Após período, sistema marca como `completed` automaticamente
   
4. **Notificações**:
   - Paciente recebe notificação ao receber comentário
   - Nutricionista recebe quando paciente responde ou registra nova refeição

#### **Modificações Técnicas (Macro)**

**DATABASE:**
- ✅ **Tabela `evaluations`**:
  - Adicionar: `evaluation_type ENUM('history', 'future')` DEFAULT 'history'
  - Adicionar: `period_preset VARCHAR(20)` (ex: 'last_7', 'last_30', 'next_7', 'next_30')
  - Adicionar: `status ENUM('pending', 'accepted', 'in_progress', 'completed', 'rejected')`
  - Manter: `start_date`, `end_date` (calculados baseado no preset + data de criação)

- ✅ **Nova tabela `meal_comments`**:
  ```sql
  CREATE TABLE meal_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    author_type VARCHAR(20) NOT NULL, -- 'nutritionist' ou 'patient'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  ```
  - Index: `meal_id`, `evaluation_id`
  - RLS: Paciente e nutricionista da avaliação podem ver/criar

- ✅ **RLS Policies**:
  - Paciente vê suas próprias refeições
  - Nutricionista vê refeições do paciente SE `evaluation_type='future'` E avaliação está `accepted`/`in_progress`
  - Ambos podem criar/ler `meal_comments` da sua avaliação

**BACKEND/HOOKS:**
- ✅ **useMeals**:
  - Modificar para incluir `comments` ao buscar refeição (JOIN com meal_comments)
  
- ✅ **useEvaluations**:
  - Adicionar `evaluation_type` e `period_preset` no create
  - Calcular `start_date`/`end_date` baseado em `period_preset` + data de solicitação
  
- ✅ **Nova hook `useMealComments`**:
  - `useMealComments(mealId, evaluationId)` - listar comentários
  - `useCreateMealComment()` - criar comentário
  - Real-time subscriptions (Supabase Realtime) para updates

- ✅ **Background Job** (Supabase Edge Function ou cron):
  - Verificar avaliações `in_progress` onde `end_date + 2 dias` passou
  - Auto-completar avaliações expiradas

**FRONTEND:**
- ✅ **RequestEvaluationPage**:
  - Substituir date pickers por 4 botões de período
  - Modal de confirmação para avaliações futuras
  - Enviar `evaluation_type` e `period_preset` na criação

- ✅ **NutritionistEvaluationDetailPage**:
  - Se `evaluation_type='future'`: mostrar MealTimeline com botão "Comentar" por refeição
  - Se `evaluation_type='history'`: manter como está (parecer final)
  - Adicionar status `in_progress` no fluxo
  
- ✅ **Novo componente `MealCommentThread`**:
  - Exibe thread de comentários por refeição
  - Input para nutricionista/paciente adicionar comentário
  - Avatar + nome + timestamp por comentário
  - Real-time updates (Supabase Realtime)

- ✅ **PatientTimelinePage** (ou nova página):
  - Exibir badge se refeição tem comentários não lidos
  - Ao clicar, abrir modal/drawer com MealCommentThread
  - Notificação visual quando receber novo comentário

- ✅ **Notificações**:
  - Badge no ícone de avaliações quando houver comentário novo
  - Toast notification quando receber comentário (se tela aberta)

**PRIORIDADE:** Implementar após Sprint 5 (visualizar feedback)

**ESTIMATIVA:** 2-3 sprints
- Sprint 6.1: Períodos fixos + migration + evaluation_type
- Sprint 6.2: meal_comments table + hooks + RLS
- Sprint 6.3: UI de comentários + real-time + notificações

---

## 🎨 Backlog UI/UX

### Landing Page & Design System
**Prioridade**: Melhorar interface antes de lançamento
- Ajustar landing page (`/`) para ficar igual ao protótipo
- Melhorar design das páginas existentes
- Adicionar animações e transições
- Componentizar com melhor estrutura CSS
- Criar design system consistente (cores, tipografia, spacing)

### Melhorias específicas
- RegisterMealPage: UI mais amigável e moderna
- PatientTimelinePage: Cards de refeição mais visuais
- Dashboard: Gráficos e métricas mais intuitivos

---

## 💡 Recomendação de Prioridade

**Sequência sugerida:**
1. ✅ Sprint 4.5: UX & Polimento (COMPLETO)
2. 🎯 Sprint 5: Paciente visualizar feedback (PRÓXIMO)
3. 🎯 Sprint 6: Avaliações com períodos fixos + acompanhamento futuro
4. 🎨 Backlog UI/UX: Refinamento visual (paralelo ou após MVP funcional)

**Razão**: 
- Funcionalidades core primeiro (MVP funcional)
- Validar fluxo completo antes de refinar UI
- UI pode ser melhorada com base em feedback real de uso
- Protótipos em `/demo` servem de referência visual


