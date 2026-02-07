# API Context - NutriSnap

## 📍 Localização

`app/shared/contexts/AppContext.tsx`

---

## 🏗️ Arquitetura

O protótipo usa **React Context API** para gerenciar todo o estado global da aplicação. Não há backend — tudo é mockado e gerenciado em memória.

### Provider Hierarquia

```tsx
<AppProvider>
  <Router>
    <Routes>
      {/* Todas as páginas têm acesso ao useApp() */}
    </Routes>
  </Router>
</AppProvider>
```

**Localização do Provider:** `app/root.tsx`

---

## 🎯 Interface AppState

```typescript
interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: "patient" | "nutritionist") => void;
  logout: () => void;

  // Patient data
  meals: MealEntry[];
  addMeal: (photoUrl: string, notes?: string) => void;
  updateMeal: (id: string, updates: Partial<MealEntry>) => void;
  deleteMeal: (id: string) => void;
  healthProfile: HealthProfile;
  updateHealthProfile: (profile: Partial<HealthProfile>) => void;

  // Evaluations
  evaluations: EvaluationRequest[];
  createEvaluation: (period: EvaluationPeriod, nutritionistId: string | null) => void;
  acceptEvaluation: (evalId: string) => void;
  completeEvaluation: (evalId: string, feedback: string) => void;
  rejectEvaluation: (evalId: string) => void;

  // Nutritionists list
  nutritionists: Nutritionist[];
}
```

---

## 🔐 Autenticação

### login(role)

**Assinatura:**
```typescript
login: (role: "patient" | "nutritionist") => void
```

**Comportamento:**
- Se `role === "patient"` → define `currentUser` como `mockPatient`
- Se `role === "nutritionist"` → define `currentUser` como `mockNutritionists[0]`
- Salva no `localStorage` (`"nutri-user"`)
- Após login, o app redireciona (fora do contexto, na página de login)

**Exemplo:**
```tsx
const { login } = useApp();
login("patient");
navigate("/app/timeline");
```

---

### logout()

**Assinatura:**
```typescript
logout: () => void
```

**Comportamento:**
- Define `currentUser` como `null`
- Remove `localStorage.getItem("nutri-user")`
- Usuário é redirecionado para `/` (não pelo contexto, mas pelo componente que chama)

**Exemplo:**
```tsx
const { logout } = useApp();
logout();
navigate("/");
```

---

### currentUser

**Tipo:** `User | null`

**Inicialização:**
- Verifica `localStorage` ao montar
- Se existe, carrega usuário salvo
- Se não, `null`

**Uso:**
```tsx
const { currentUser } = useApp();
console.log(currentUser?.name); // "Kaue Silva"
console.log(currentUser?.role); // "patient"
```

---

### isAuthenticated

**Tipo:** `boolean`

**Derivado:** `!!currentUser`

**Uso:**
```tsx
const { isAuthenticated } = useApp();
if (!isAuthenticated) {
  return <Navigate to="/" />;
}
```

---

## 🍽️ Meals (Refeições)

### meals

**Tipo:** `MealEntry[]`

**Inicialização:** `mockMeals` (array com ~50-60 refeições)

**Uso:**
```tsx
const { meals } = useApp();
const userMeals = meals.filter(m => m.patientId === currentUser?.id);
```

---

### addMeal(photoUrl, notes?)

**Assinatura:**
```typescript
addMeal: (photoUrl: string, notes?: string) => void
```

**Comportamento:**
1. Cria novo objeto `MealEntry`
   - `id`: `meal-${Date.now()}`
   - `patientId`: `currentUser?.id ?? "p1"`
   - `photoUrl`: recebido do file picker
   - `mealType`: classificado por `classifyMealByTime(new Date())`
   - `timestamp`: `new Date().toISOString()`
   - `notes`: opcional
2. Adiciona ao início do array (prepend)

**Exemplo:**
```tsx
const { addMeal } = useApp();
const file = e.target.files[0];
const url = URL.createObjectURL(file);
addMeal(url);
```

---

### updateMeal(id, updates)

**Assinatura:**
```typescript
updateMeal: (id: string, updates: Partial<MealEntry>) => void
```

**Comportamento:**
- Encontra refeição por `id`
- Faz merge: `{ ...meal, ...updates }`
- Atualiza no array

**Exemplo:**
```tsx
const { updateMeal } = useApp();
updateMeal("meal-123", {
  mealType: "almoco",
  timestamp: "2026-02-05T12:30:00Z",
  notes: "Arroz integral, frango grelhado"
});
```

---

### deleteMeal(id)

**Assinatura:**
```typescript
deleteMeal: (id: string) => void
```

**Comportamento:**
- Remove refeição do array por `id`

**Exemplo:**
```tsx
const { deleteMeal } = useApp();
deleteMeal("meal-123");
```

---

## 💪 Health Profile

### healthProfile

**Tipo:** `HealthProfile`

**Inicialização:** `mockHealthProfile`

```typescript
{
  weight: 78,
  height: 175,
  bmi: 25.5,
  goal: "lose-weight",
  dietaryRestrictions: ["Lactose", "Glúten"],
  notes: "Tenho gastrite...",
  updatedAt: "2026-01-20T10:00:00Z"
}
```

---

### updateHealthProfile(partial)

**Assinatura:**
```typescript
updateHealthProfile: (profile: Partial<HealthProfile>) => void
```

**Comportamento:**
1. Merge: `{ ...healthProfile, ...partial }`
2. Atualiza `updatedAt` para agora
3. **Recalcula IMC** se `weight` ou `height` mudaram:
   ```typescript
   const h = height / 100;
   const bmi = Math.round((weight / (h * h)) * 10) / 10;
   ```

**Exemplo:**
```tsx
const { updateHealthProfile } = useApp();
updateHealthProfile({
  weight: 80,
  goal: "maintain"
});
// IMC é recalculado automaticamente
```

---

## 📋 Evaluations (Avaliações)

### evaluations

**Tipo:** `EvaluationRequest[]`

**Inicialização:** `mockEvaluations` (4 avaliações)

---

### createEvaluation(period, nutritionistId)

**Assinatura:**
```typescript
createEvaluation: (period: EvaluationPeriod, nutritionistId: string | null) => void
```

**Comportamento:**
1. Filtra refeições do período:
   ```typescript
   const cutoff = new Date();
   cutoff.setDate(cutoff.getDate() - period);
   const periodMeals = meals.filter(
     m => new Date(m.timestamp) >= cutoff && m.patientId === currentUser?.id
   );
   ```
2. Cria novo objeto `EvaluationRequest`:
   - `id`: `eval-${Date.now()}`
   - `patientId`: `currentUser?.id`
   - `nutritionistId`: null ou específico
   - `period`: 7 ou 30
   - `price`: `EVALUATION_PRICES[period]` (10 ou 20)
   - `status`: "pending"
   - `createdAt`: agora
   - `meals`: refeições filtradas
   - `healthProfile`: cópia do perfil atual
3. Adiciona ao início do array

**Exemplo:**
```tsx
const { createEvaluation } = useApp();
createEvaluation(7, "n1"); // Dra. Mariana, 7 dias
createEvaluation(30, null); // Qualquer, 30 dias
```

---

### acceptEvaluation(evalId)

**Assinatura:**
```typescript
acceptEvaluation: (evalId: string) => void
```

**Comportamento:**
- Muda `status` de "pending" para "in-progress"

**Exemplo:**
```tsx
const { acceptEvaluation } = useApp();
acceptEvaluation("eval-3");
```

---

### completeEvaluation(evalId, feedback)

**Assinatura:**
```typescript
completeEvaluation: (evalId: string, feedback: string) => void
```

**Comportamento:**
- Muda `status` para "completed"
- Define `feedback` com o parecer
- Define `completedAt` para agora

**Exemplo:**
```tsx
const { completeEvaluation } = useApp();
completeEvaluation("eval-2", "Sua alimentação está ótima! Continue assim.");
```

---

### rejectEvaluation(evalId)

**Assinatura:**
```typescript
rejectEvaluation: (evalId: string) => void
```

**Comportamento:**
- Muda `status` para "rejected"

**Exemplo:**
```tsx
const { rejectEvaluation } = useApp();
rejectEvaluation("eval-4");
```

---

## 👩‍⚕️ Nutritionists

### nutritionists

**Tipo:** `Nutritionist[]`

**Valor:** `mockNutritionists` (constante, 3 nutricionistas)

**Uso:**
```tsx
const { nutritionists } = useApp();
const nutri = nutritionists.find(n => n.id === "n1");
```

---

## 🔗 Hook: useApp()

**Uso:**
```tsx
import { useApp } from "~/shared/contexts/AppContext";

function MyComponent() {
  const {
    currentUser,
    meals,
    addMeal,
    updateMeal,
    deleteMeal,
    healthProfile,
    updateHealthProfile,
    evaluations,
    createEvaluation,
    // ...
  } = useApp();

  // ...
}
```

**Erro se usado fora do Provider:**
```typescript
if (!ctx) throw new Error("useApp must be used within AppProvider");
```

---

## 🧪 Exemplos de Uso

### Exemplo 1: Registrar Refeição

```tsx
function TimelinePage() {
  const { addMeal } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addMeal(url);
      // Toast de sucesso aqui
    }
  };

  return (
    <>
      <button onClick={handleCapture}>📸</button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        hidden
      />
    </>
  );
}
```

### Exemplo 2: Filtrar Refeições do Paciente

```tsx
function Timeline() {
  const { meals, currentUser } = useApp();
  
  const userMeals = useMemo(() => {
    return meals.filter(m => m.patientId === (currentUser?.id ?? "p1"));
  }, [meals, currentUser]);

  const grouped = groupMealsByDay(userMeals);
  // ...
}
```

### Exemplo 3: Aceitar Avaliação

```tsx
function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { evaluations, acceptEvaluation } = useApp();
  const navigate = useNavigate();

  const evaluation = evaluations.find(e => e.id === id);

  const handleAccept = () => {
    acceptEvaluation(id!);
    // Status muda para "in-progress"
  };

  return (
    <>
      {evaluation?.status === "pending" && (
        <button onClick={handleAccept}>
          ✅ Aceitar Solicitação
        </button>
      )}
    </>
  );
}
```

### Exemplo 4: Completar Avaliação

```tsx
function RequestDetailPage() {
  const [feedback, setFeedback] = useState("");
  const { completeEvaluation } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleComplete = () => {
    if (feedback.trim()) {
      completeEvaluation(id!, feedback);
      navigate("/nutri/dashboard");
    }
  };

  return (
    <>
      <textarea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder="Escreva seu parecer..."
      />
      <button onClick={handleComplete}>Enviar Parecer</button>
    </>
  );
}
```

---

## ⚠️ Limitações Atuais

### 1. Persistência
- **Meals, evaluations, healthProfile** não persistem após refresh
- Apenas `currentUser` persiste em `localStorage`

### 2. Concorrência
- Múltiplas abas não sincronizam
- Storage events não implementados

### 3. Validação
- Sem validação de dados
- Assume inputs sempre válidos

### 4. Erro Handling
- Sem try/catch
- Sem feedback de erro

---

## 🚀 Próximos Passos (Backend)

### Refatoração Necessária

1. **Substituir Context por React Query / SWR**
   - Gerenciamento de cache
   - Revalidação automática
   - Optimistic updates

2. **API REST Endpoints**
   ```
   POST   /api/auth/login
   POST   /api/auth/logout
   GET    /api/meals
   POST   /api/meals
   PATCH  /api/meals/:id
   DELETE /api/meals/:id
   GET    /api/health-profile
   PATCH  /api/health-profile
   GET    /api/evaluations
   POST   /api/evaluations
   PATCH  /api/evaluations/:id/accept
   PATCH  /api/evaluations/:id/complete
   ```

3. **Upload de Imagens**
   - Substituir `URL.createObjectURL()` por upload real
   - AWS S3 / Cloudflare R2 / Supabase Storage
   - Retornar URL público

4. **Auth Real**
   - Google OAuth
   - Apple Sign In
   - JWT tokens
   - Refresh tokens

5. **Estado Server-Side**
   - Meals, evaluations, users em database
   - PostgreSQL / MongoDB
   - Prisma ORM / Mongoose

---

## 📖 Referências

- [React Context API](https://react.dev/reference/react/useContext)
- [React Query](https://tanstack.com/query/latest) (futuro)
- [SWR](https://swr.vercel.app/) (alternativa)
