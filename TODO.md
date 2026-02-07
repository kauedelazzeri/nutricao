# 📝 TODO - Itens Pendentes

## 🐛 Bugs Conhecidos (Sprints Futuras)

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

---

## 🎯 Próximas Sprints

### Opção A: Sprint 3 - Funcionalidades (Recomendado)
**Prioridade**: Completar MVP funcional
- Editar refeição (com troca de foto)
- Perfil de saúde do paciente (health_profiles)
- Dashboard do nutricionista (listagem de avaliações)
- Solicitação de avaliação (paciente → nutricionista)

**Benefícios**: 
- Fluxo completo de ponta a ponta funcionando
- Validação real do produto
- Feedback de usuários mais valioso

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
