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

### Sprint 5: Paciente Visualizar Feedback (Próxima)
**Funcionalidade:**
- Página para paciente ver parecer nutricional completo
- Exibir status da avaliação (pending/accepted/rejected/completed)
- Mostrar feedback quando status=completed
- Mostrar motivo quando status=rejected

### Sprint 6: UI/UX - Landing Page
**Prioridade**: Melhorar interface antes de novas features
- Ajustar landing page (`/`) para ficar igual ao protótipo
- Melhorar design das páginas existentes
- Adicionar animações e transições
- Componentizar com melhor estrutura CSS

### Opção B: Refatoração UI - Aplicar Protótipos
**Prioridade**: Melhorar interface antes de novas features
- Ajustar landing page (`/`) para ficar igual ao protótipo
- Melhorar design do RegisterMealPage
- Melhorar design do PatientTimelinePage
- Adicionar animações e transições
- Componentizar com Tailwind CSS

**Benefícios**:
- Interface mais polida desde o início
- Evita refatoração futura de UI
- Melhor primeira impressão

---

## 💡 Recomendação

**Sugestão**: Opção A - Continuar com funcionalidades

**Razão**: 
1. Protótipos são navegáveis em `/demo` - podem servir de referência
2. Melhor validar o fluxo completo primeiro (MVP funcional)
3. Design pode ser refinado depois com base em feedback real
4. Funcionalidades core são mais críticas que UI neste momento
5. UI pode ser atualizada em paralelo posteriormente

**Exceção**: Se houver algo na UI atual que esteja **impedindo** a validação do produto, aí sim faz sentido ajustar antes.

O que você acha? A UI atual está "boa o suficiente" para validar as funcionalidades ou está muito feia/confusa?
