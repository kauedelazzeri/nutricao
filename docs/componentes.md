# Componentes - NutriSnap

## 📦 Componentes Compartilhados

### BottomTabBar

**Localização:** `app/shared/components/BottomTabBar.tsx`

**Descrição:** Barra de navegação inferior para o módulo do paciente (mobile-first).

**Props:** Nenhuma (usa React Router internamente)

**Estrutura:**
```tsx
<nav> (fixed bottom, z-50, safe-area)
  <NavLink to="/app/timeline">📸 Início</NavLink>
  <NavLink to="/app/evaluations">📋 Avaliações</NavLink>
  <NavLink to="/app/profile">👤 Perfil</NavLink>
</nav>
```

**Estilos:**
- Active: `text-green-600`
- Inactive: `text-gray-400 hover:text-gray-600`
- Height: `h-16` + `pb-[env(safe-area-inset-bottom)]`

**Uso:**
- Renderizado no `PatientLayout`
- Sempre visível em todas as páginas do paciente

---

### Sidebar

**Localização:** `app/shared/components/Sidebar.tsx`

**Descrição:** Barra lateral de navegação para o módulo da nutricionista (desktop-first).

**Props:** Nenhuma

**Seções:**

1. **Logo** (top)
   - 🥗 NutriSnap
   - Subtitle: "Painel da Nutricionista"

2. **User Info**
   - Avatar 40x40
   - Nome
   - Email (truncado)

3. **Navigation Menu**
   - 📊 Dashboard → `/nutri/dashboard`
   - 👩‍⚕️ Meu Perfil → `/nutri/profile`

4. **Logout** (bottom)
   - 🚪 Sair

**Responsividade:**
- Desktop: `md:flex` (256px width, sticky)
- Mobile: `hidden md:flex`

---

### MobileNutriNav

**Localização:** `app/shared/components/MobileNutriNav.tsx`

**Descrição:** Bottom navigation para nutricionista em mobile.

**Props:** Nenhuma

**Itens:**
- 📊 Dashboard
- 👩‍⚕️ Perfil
- 🚪 Sair

**Responsividade:**
- Mobile: `md:hidden` (visível apenas < 768px)
- Desktop: Substituído pela Sidebar

---

## 🏠 Layouts

### PatientLayout

**Localização:** `app/modules/patient/layouts/PatientLayout.tsx`

**Descrição:** Wrapper para todas as páginas do paciente.

**Estrutura:**
```tsx
<div> (min-h-screen, bg-gray-50, pb-20)
  <Outlet /> (React Router)
  <BottomTabBar />
</div>
```

**Características:**
- Padding bottom de 80px (20rem) para o bottom tab bar
- Background cinza claro
- Outlet renderiza as páginas filhas

---

### NutritionistLayout

**Localização:** `app/modules/nutritionist/layouts/NutritionistLayout.tsx`

**Descrição:** Wrapper para todas as páginas da nutricionista.

**Estrutura:**
```tsx
<div> (min-h-screen, bg-gray-50, flex)
  <Sidebar />
  <main> (flex-1, pb-20 md:pb-0)
    <Outlet />
  </main>
  <MobileNutriNav />
</div>
```

**Características:**
- Layout flex horizontal
- Sidebar fixa à esquerda (desktop)
- Main content responsivo
- Bottom nav (mobile)

---

## 📄 Páginas do Paciente

### TimelinePage

**Localização:** `app/modules/patient/pages/TimelinePage.tsx`

**Rota:** `/app/timeline`

**Estado Local:**
- `showSuccess` — toast de sucesso ao adicionar refeição
- `filter` — período de filtro (7 | 14 | 30 | "all")
- `editingMeal` — refeição sendo editada (modal)

**Componentes Internos:**

#### MealEditModal (sub-componente)
- Renderizado condicionalmente quando `editingMeal !== null`
- Bottom sheet animado (slide-up)
- Props: `{ meal, onSave, onDelete, onClose }`

**Estrutura:**
1. Header fixo com filtros (pills)
2. Timeline agrupada por dia
3. Cards de refeição (clicáveis)
4. FAB para adicionar foto
5. Modal de edição (condicional)

**Fluxos:**
- Adicionar: FAB → file picker → `addMeal()`
- Editar: clique no card → modal → `updateMeal()`
- Deletar: modal → confirmação → `deleteMeal()`

---

### MyEvaluationsPage

**Localização:** `app/modules/patient/pages/MyEvaluationsPage.tsx`

**Rota:** `/app/evaluations`

**Estado:** Nenhum (lê do contexto)

**Estrutura:**
1. Header com botão "+ Nova"
2. Lista de avaliações (cards)
3. Empty state se não houver

**Card de Avaliação:**
- Avatar da nutricionista (ou placeholder)
- Nome (ou "Qualquer nutricionista")
- Período e quantidade de fotos
- Badge de status colorido
- Miniatura de fotos (6 primeiras + contador)
- Parecer expandido se `status === "completed"`

---

### RequestEvaluationPage

**Localização:** `app/modules/patient/pages/RequestEvaluationPage.tsx`

**Rota:** `/app/request-evaluation`

**Estado Local:**
- `period` — EvaluationPeriod (7 | 30)
- `selectedNutri` — string | null
- `step` — "period" | "nutritionist" | "confirm"

**Wizard de 3 Steps:**

#### Step 1: Período
- Cards selecionáveis (7 ou 30 dias)
- Exibe quantidade de refeições
- Preço riscado + GRÁTIS

#### Step 2: Nutricionista
- Opção "Qualquer" (🌐)
- Lista de nutricionistas (avatar, nome, CRN, rating, especialidades)
- Cards selecionáveis

#### Step 3: Confirmação
- Banner de promoção (gradiente verde)
- Badge "PROMOÇÃO 🎉" rotacionado
- Resumo da solicitação
- Botão "✅ Confirmar Solicitação Gratuita"

**Navegação:**
- Botão voltar (← ) muda de step ou volta à página anterior
- Indicadores de progresso (1, 2, 3) no topo

---

### HealthProfilePage

**Localização:** `app/modules/patient/pages/HealthProfilePage.tsx`

**Rota:** `/app/profile`

**Estado Local:**
- `editing` — boolean
- `form` — HealthProfile (cópia para edição)
- `saved` — boolean (toast)

**Seções:**

1. **User Card** (não editável)
   - Avatar 80x80
   - Nome
   - Email

2. **Dados de Saúde**
   - Modo leitura: cards com peso/altura/IMC, objetivo, restrições, observações
   - Modo edição: inputs para todos os campos
   - Botão "Editar" / "Cancelar"

3. **Logout** (button vermelho)

**Cálculo de IMC:**
- Automático ao salvar se peso ou altura mudaram
- Categoria colorida (azul/verde/amarelo/vermelho)

---

## 🏥 Páginas da Nutricionista

### DashboardPage

**Localização:** `app/modules/nutritionist/pages/DashboardPage.tsx`

**Rota:** `/nutri/dashboard`

**Estado:** Nenhum (lê do contexto)

**Estrutura:**

1. **Header**
   - Título "Dashboard"
   - Subtitle

2. **Cards de Métricas** (grid 3 colunas)
   - Novas (📩, amarelo)
   - Em Análise (🔍, azul)
   - Concluídas (✅, verde)

3. **Lista de Solicitações** (grid 2 colunas em desktop)
   - Cards clicáveis (Link to `/nutri/request/:id`)
   - Paciente #ID
   - Período, refeições, valor
   - Badge de status
   - Thumbnails (4 fotos + contador)
   - Data

4. **Empty State** (se não houver)
   - 📭 "Nenhuma solicitação recebida ainda"

---

### RequestDetailPage

**Localização:** `app/modules/nutritionist/pages/RequestDetailPage.tsx`

**Rota:** `/nutri/request/:id`

**Estado Local:**
- `feedback` — string (textarea)
- `selectedPhoto` — string | null (lightbox)

**Layout:**

**Coluna Esquerda (md:col-span-1):**
- Card de dados do paciente
- Ações (se pending): Aceitar / Recusar
- Área de parecer (se in-progress)
- Parecer enviado (se completed)

**Coluna Direita (md:col-span-2):**
- Galeria de fotos agrupadas por dia
- Cards clicáveis (abrem lightbox)

**Lightbox:**
- Fixed fullscreen overlay
- Background preto 80%
- Foto centralizada (max-w-full, max-h-full)
- Clique fecha

**Ações:**
- `acceptEvaluation(id)` → status = "in-progress"
- `rejectEvaluation(id)` → status = "rejected", redirect
- `completeEvaluation(id, feedback)` → status = "completed", redirect

---

### ProfessionalProfilePage

**Localização:** `app/modules/nutritionist/pages/ProfessionalProfilePage.tsx`

**Rota:** `/nutri/profile`

**Estado:** Nenhum (lê `currentUser` do contexto)

**Estrutura:**

1. **Header**
   - Avatar 96x96
   - Nome
   - Email
   - CRN

2. **Sobre** (card cinza)
   - Bio da nutricionista

3. **Especialidades** (tags verdes)

4. **Métricas** (grid 2 colunas)
   - ⭐ Rating
   - Avaliações Concluídas

---

## 🎯 Componente: MealEditModal (TimelinePage)

**Tipo:** Sub-componente funcional

**Props:**
```typescript
{
  meal: MealEntry;
  onSave: (meal: MealEntry) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}
```

**Estado Local:**
- `form` — MealEntry (cópia para edição)
- `showDeleteConfirm` — boolean

**Estrutura:**

1. **Overlay** (backdrop, onClick fecha)
2. **Modal** (bottom-rounded, slide-up animation)
   - Foto (cover, 224px height)
   - Botão fechar (top-right, ✕)
   - Badge de tipo de refeição (sobre a foto)
3. **Form**
   - Tipo de refeição (grid 3x2 de botões)
   - Data (input date)
   - Horário (input time)
   - Observações (textarea)
4. **Ações**
   - ✅ Salvar Alterações (verde)
   - Excluir (vermelho, confirmação)

**Animação:**
```css
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0.5; }
  to { transform: translateY(0); opacity: 1; }
}
```

**Conversão de dados:**
- `timestamp` (ISO string) → `dateValue` (YYYY-MM-DD)
- `timestamp` → `timeValue` (HH:MM)
- Ao editar, reconstrói o timestamp ISO

---

## 🎨 Convenções de Design

### Cards
- Border radius: `rounded-2xl` (16px)
- Shadow: `shadow-sm`
- Border: `border border-gray-100`
- Padding: `p-4` ou `p-5`

### Botões
- Primary: `bg-green-600 hover:bg-green-700`
- Secondary: `bg-white border-2 border-gray-200`
- Danger: `bg-red-600 hover:bg-red-700`
- Active state: `active:scale-[0.98]`
- Transition: `transition-all` ou `transition-colors`

### Badges
- Small: `text-[10px] px-2.5 py-1 rounded-full font-semibold`
- Medium: `text-xs px-3 py-1.5 rounded-full font-medium`

### Modal/Overlay
- Background: `bg-black/60` ou `bg-black/80`
- Z-index: `z-50`
- Position: `fixed inset-0`

### Empty States
- Icon: `text-5xl` (emoji)
- Text: `text-gray-500 text-sm`
- Padding: `py-20` ou `py-16`

### Loading/Success Toast
- Position: `fixed top-4 left-1/2 -translate-x-1/2`
- Background: `bg-green-600 text-white`
- Border radius: `rounded-xl`
- Padding: `px-5 py-3`
- Animation: `animate-bounce` (Tailwind)
- Duration: 2500ms (setTimeout)

### Responsive Breakpoints (Tailwind)
- `sm:` 640px
- `md:` 768px (switch entre mobile/desktop)
- `lg:` 1024px

---

## 🔧 Utilities

### mealClassifier.ts

**Funções:**

```typescript
classifyMealByTime(date: Date): MealType
```
- Classifica tipo de refeição baseado em horário
- Lógica: minutos desde meia-noite (0-1440)

```typescript
formatDate(dateStr: string): string
```
- ISO → "quinta-feira, 06 de fevereiro"
- Locale: pt-BR

```typescript
formatTime(dateStr: string): string
```
- ISO → "19:30"
- Locale: pt-BR

```typescript
formatShortDate(dateStr: string): string
```
- ISO → "06/02"
- Locale: pt-BR

```typescript
groupMealsByDay(meals: MealEntry[]): Record<string, MealEntry[]>
```
- Agrupa refeições por dia (chave = YYYY-MM-DD)
- Retorna objeto com arrays

---

## 📚 TypeScript Types

**Principais interfaces em `app/shared/types/index.ts`:**

```typescript
type MealType = "cafe-da-manha" | "lanche-da-manha" | 
                "almoco" | "lanche-da-tarde" | "jantar" | "ceia"

type EvaluationStatus = "pending" | "in-progress" | 
                        "completed" | "rejected"

type HealthGoal = "lose-weight" | "gain-muscle" | 
                  "maintain" | "improve-health"

interface MealEntry {
  id: string;
  patientId: string;
  photoUrl: string;
  mealType: MealType;
  timestamp: string; // ISO
  notes?: string;
}

interface EvaluationRequest {
  id: string;
  patientId: string;
  nutritionistId: string | null;
  period: 7 | 30;
  price: number;
  status: EvaluationStatus;
  createdAt: string;
  meals: MealEntry[];
  healthProfile: HealthProfile;
  feedback?: string;
  completedAt?: string;
}
```

**Helpers:** Labels, ícones, preços em constantes exportadas.
