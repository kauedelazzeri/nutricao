# 📝 TODO - Itens Pendentes

## 🔧 Melhorias Técnicas & Bugs

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

### 3. **Controle de visibilidade de nutricionistas**
- **Problema**: Definir quem controla se um nutricionista aparece na lista para pacientes
- **Opções**: 
  - Admin controla (campo `available` gerenciado manualmente)
  - Nutricionista autocontrola (toggle na interface do nutricionista)
- **Impacto**: Médio - afeta regra de negócio
- **Decisão**: A definir
- **Sprint**: A definir

### 4. **AuthContext fazendo múltiplas requisições de userType**
- **Problema**: AuthContext busca `userType` 3x ao carregar/navegar (renderizações duplicadas)
- **Impacto**: Médio - overhead de requisições, pode atingir rate limits
- **Sprint**: Em andamento 🔄

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
✅ Visualizar parecer do nutricionista

**Funcionalidades nutricionista:**
✅ Dashboard com avaliações pendentes
✅ Aceitar/Rejeitar solicitações
✅ Ver refeições do paciente no período
✅ Escrever parecer nutricional (salvar rascunho + finalizar)
✅ Histórico de avaliações (dashboard com estatísticas)



### Sprint 4.5: UX & Polimento ✅ COMPLETA
✅ Removidos popups do sistema
✅ Corrigido loading states
✅ Pricing promocional "GRÁTIS"
✅ Histórico completo de avaliações no dashboard

### Sprint 5: Avaliações com Períodos Fixos + Acompanhamento Futuro 🎯 PRÓXIMA
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
   - Nutricionista vê refeições passadas e escreve parecer final
   - Status: pending → accepted → completed/rejected
   
2. **Avaliação de Futuro** (próximos X dias - ACOMPANHAMENTO):
   - Compartilhamento contínuo: paciente registra refeições durante o período
   - Nutricionista tem acesso em tempo real
   - Nutricionista comenta **por refeição** (não apenas parecer final)
   - Status: pending → accepted → in_progress → completed
   - Encerra automaticamente após período

#### **Parte 2: Comentários por Refeição (avaliação futura)**
**Funcionalidade:**
- Nutricionista comenta diretamente em cada refeição do período
- Chat/thread de comentários por refeição
- Notificações para paciente quando receber comentário
- Paciente pode responder aos comentários

**Funcionalidades:**
- Nutricionista comenta diretamente em cada refeição
- Thread de comentários por refeição (ida e volta)
- Notificações em tempo real
- Auto-finalização após período

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

## 💡 Próximos Passos

**Ordem sugerida:**
1. ✅ Sprint 4.5: UX & Polimento (COMPLETO)
2. 🎯 Sprint 5: Períodos fixos + Acompanhamento futuro (PRÓXIMO)
3. 🎨 Backlog UI/UX: Refinamento visual


