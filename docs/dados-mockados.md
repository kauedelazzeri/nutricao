# Dados Mockados - NutriSnap

## 📍 Localização

`app/shared/mocks/data.ts`

---

## 👤 Pacientes

### mockPatient (Usuário Principal)

```typescript
{
  id: "p1",
  name: "Kaue Silva",
  email: "kaue@gmail.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kaue",
  role: "patient",
  healthProfile: mockHealthProfile
}
```

**Perfil de Saúde:**
```typescript
{
  weight: 78, // kg
  height: 175, // cm
  bmi: 25.5,
  goal: "lose-weight",
  dietaryRestrictions: ["Lactose", "Glúten"],
  notes: "Tenho gastrite e prefiro refeições leves à noite.",
  updatedAt: "2026-01-20T10:00:00Z"
}
```

### mockPatient2 (Secundário)

```typescript
{
  id: "p2",
  name: "Ana Oliveira",
  email: "ana@gmail.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
  role: "patient",
  healthProfile: {
    weight: 62,
    height: 163,
    bmi: 23.3,
    goal: "gain-muscle",
    dietaryRestrictions: [],
    notes: "Treino musculação 4x na semana.",
    updatedAt: "2026-01-25T10:00:00Z"
  }
}
```

---

## 👩‍⚕️ Nutricionistas

### Dra. Mariana Costa (n1)

```typescript
{
  id: "n1",
  name: "Dra. Mariana Costa",
  email: "mariana@nutri.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mariana",
  role: "nutritionist",
  crn: "CRN-3 12345",
  specialties: ["Emagrecimento", "Nutrição Esportiva"],
  bio: "Nutricionista há 8 anos, especialista em reeducação alimentar e performance esportiva.",
  rating: 4.8,
  evaluationsCompleted: 156
}
```

### Dr. Rafael Mendes (n2)

```typescript
{
  id: "n2",
  name: "Dr. Rafael Mendes",
  email: "rafael@nutri.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rafael",
  role: "nutritionist",
  crn: "CRN-3 67890",
  specialties: ["Nutrição Clínica", "Intolerâncias Alimentares"],
  bio: "Especialista em nutrição clínica com foco em alergias e intolerâncias alimentares.",
  rating: 4.6,
  evaluationsCompleted: 98
}
```

### Dra. Camila Ferreira (n3)

```typescript
{
  id: "n3",
  name: "Dra. Camila Ferreira",
  email: "camila@nutri.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=camila",
  role: "nutritionist",
  crn: "CRN-4 11223",
  specialties: ["Nutrição Funcional", "Ganho de Massa"],
  bio: "Nutricionista funcional com abordagem integrativa. Atendo presencial e online.",
  rating: 4.9,
  evaluationsCompleted: 210
}
```

---

## 🍽️ Refeições

### Fonte das Fotos

**15 URLs de Unsplash** (comidas variadas):
- Breakfast, lunch, salad, pizza, eggs, pancakes, bowls, plates, bbq, fruits, smoothies, toast, healthy food, pasta, soup

Exemplos:
```
https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop
https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop
...
```

### Geração de Refeições (mockMeals)

**Função:** `generateMeals(patientId: string, daysBack: number)`

**Lógica:**
- Para cada dia (D dias atrás)
- Gera 5 tipos de refeições possíveis:
  - ☕ Café da manhã (07:30)
  - 🍎 Lanche da manhã (10:00)
  - 🍽️ Almoço (12:30)
  - 🥤 Lanche da tarde (15:30)
  - 🌙 Jantar (19:30)
- **Aleatoriedade:** 75% de chance de aparecer (Math.random() > 0.25)
- Adiciona variação de ±20 minutos no horário
- IDs únicos: `meal-${patientId}-${dia}-${tipo}`
- Fotos rotativas (cicla pelos 15 URLs)

**Datasets:**
```typescript
mockMeals = generateMeals("p1", 14) 
// ~50-60 refeições dos últimos 14 dias

mockMealsPatient2 = generateMeals("p2", 10)
// ~35-45 refeições dos últimos 10 dias
```

---

## 📋 Avaliações

### eval-1 (Concluída)

```typescript
{
  id: "eval-1",
  patientId: "p1",
  nutritionistId: "n1", // Dra. Mariana
  period: 7,
  price: 10,
  status: "completed",
  createdAt: "2026-01-15T14:00:00Z",
  meals: mockMeals.slice(0, 20), // 20 primeiras refeições
  healthProfile: mockHealthProfile,
  feedback: "Kaue, sua alimentação está no caminho certo! Percebi que você tem consumido boas fontes de proteína no almoço. Sugiro incluir mais vegetais no jantar e evitar carboidratos simples à noite. O café da manhã poderia ser mais reforçado — tente incluir ovos ou aveia. No geral, a frequência de refeições está boa, mas sugiro diminuir os lanchinhos industrializados que apareceram em alguns dias. Continue assim! 💪",
  completedAt: "2026-01-17T09:30:00Z"
}
```

### eval-2 (Em Análise)

```typescript
{
  id: "eval-2",
  patientId: "p1",
  nutritionistId: "n3", // Dra. Camila
  period: 30,
  price: 20,
  status: "in-progress",
  createdAt: "2026-02-01T10:00:00Z",
  meals: mockMeals, // todas as refeições
  healthProfile: mockHealthProfile
}
```

### eval-3 (Pendente, Qualquer Nutricionista)

```typescript
{
  id: "eval-3",
  patientId: "p1",
  nutritionistId: null, // aberta para qualquer
  period: 7,
  price: 10,
  status: "pending",
  createdAt: "2026-02-05T16:00:00Z",
  meals: mockMeals.slice(0, 15),
  healthProfile: mockHealthProfile
}
```

### eval-4 (Pendente, Paciente 2)

```typescript
{
  id: "eval-4",
  patientId: "p2",
  nutritionistId: "n1",
  period: 7,
  price: 10,
  status: "pending",
  createdAt: "2026-02-04T11:00:00Z",
  meals: mockMealsPatient2.slice(0, 18),
  healthProfile: mockPatient2.healthProfile!
}
```

---

## 🔢 Estatísticas dos Dados

### Refeições
- **mockMeals (p1):** ~50-60 refeições (14 dias)
- **mockMealsPatient2 (p2):** ~35-45 refeições (10 dias)
- **Total mockado:** ~85-105 refeições

### Avaliações
- **Total:** 4
- **Por status:**
  - Completed: 1
  - In-progress: 1
  - Pending: 2
  - Rejected: 0

### Nutricionistas
- **Total:** 3
- **Especialidades únicas:** 6 (Emagrecimento, Nutrição Esportiva, Clínica, Intolerâncias, Funcional, Ganho de Massa)

---

## 📸 URLs de Fotos (Unsplash)

**Query parameters:** `?w=400&h=300&fit=crop`

1. `photo-1525351484163-7529414344d8` — breakfast
2. `photo-1504674900247-0877df9cc836` — lunch
3. `photo-1546069901-ba9599a7e63c` — salad
4. `photo-1565299624946-b28f40a0ae38` — pizza
5. `photo-1482049016688-2d3e1b311543` — eggs
6. `photo-1567620905732-2d1ec7ab7445` — pancakes
7. `photo-1540189549336-e6e99c3679fe` — bowl
8. `photo-1476224203421-9ac39bcb3327` — plate
9. `photo-1499028344343-cd173ffc68a9` — bbq
10. `photo-1495521821757-a1efb6729352` — fruit
11. `photo-1551183053-bf91a1d81141` — smoothie
12. `photo-1484723091739-30a097e8f929` — toast
13. `photo-1512621776951-a57141f2eefd` — healthy
14. `photo-1473093295043-cdd812d0e601` — pasta
15. `photo-1432139509613-5c4255a1d197` — soup

**Rotação:** As fotos são usadas de forma circular. A foto[i % 15] é aplicada ao index i da refeição.

---

## 🔄 Como os Dados São Usados

### Login
- Paciente → retorna `mockPatient`
- Nutricionista → retorna `mockNutritionists[0]` (Dra. Mariana)

### Timeline
- Filtra `mockMeals` por `patientId === currentUser.id`
- Agrupa por dia
- Aplica filtro de período (7/14/30/all)

### Dashboard Nutricionista
- Avaliações onde `nutritionistId === currentUser.id` **OU** `nutritionistId === null`
- Contadores por status

### Solicitação de Avaliação
- Cria novo objeto `EvaluationRequest`
- Copia refeições do período selecionado
- Copia `healthProfile` do paciente
- Status inicial: "pending"
- ID gerado: `eval-${Date.now()}`

---

## 🧪 Cenários de Teste

### Teste 1: Paciente sem Refeições
- Login como paciente
- Delete todas as refeições mockadas
- Veja empty state: "📷 Nenhuma refeição registrada ainda"

### Teste 2: Nutricionista com Múltiplas Solicitações
- Login como nutricionista
- Dashboard exibe:
  - 2 Novas (eval-3, eval-4)
  - 1 Em Análise (eval-2)
  - 1 Concluída (eval-1)

### Teste 3: Fluxo Completo de Avaliação
1. Paciente cria solicitação (eval-3)
2. Nutricionista aceita → status = "in-progress"
3. Nutricionista escreve parecer e envia
4. Status = "completed", paciente vê feedback

### Teste 4: Edição de Refeição
1. Clique em qualquer card na timeline
2. Modal abre com dados preenchidos
3. Altere tipo, data, hora, observações
4. Salve → card atualizado imediatamente

### Teste 5: Filtro de Período
1. Timeline com 14 dias de refeições
2. Clique em "7 dias" → filtra última semana
3. Clique em "Tudo" → exibe tudo novamente
4. Contador atualiza dinamicamente

---

## 💾 Persistência (Atual)

**Estado:** Em memória com React Context

**Limitações:**
- Refresh da página perde alterações
- Login persiste em `localStorage` apenas o `currentUser`
- Meals, evaluations, healthProfile resetam ao refresh

**Futuro (Backend):**
- Database persistente (PostgreSQL/MongoDB)
- API REST ou GraphQL
- JWT tokens para auth
- Upload real de imagens (S3/R2)
