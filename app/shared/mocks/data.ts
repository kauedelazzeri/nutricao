import type {
  Patient,
  Nutritionist,
  MealEntry,
  EvaluationRequest,
  HealthProfile,
} from "~/shared/types";

// ==================== HEALTH PROFILES ====================

export const mockHealthProfile: HealthProfile = {
  weight: 78,
  height: 175,
  bmi: 25.5,
  goal: "lose-weight",
  dietaryRestrictions: ["Lactose", "Glúten"],
  notes: "Tenho gastrite e prefiro refeições leves à noite.",
  updatedAt: "2026-01-20T10:00:00Z",
};

// ==================== PATIENTS ====================

export const mockPatient: Patient = {
  id: "p1",
  name: "Kaue Silva",
  email: "kaue@gmail.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kaue",
  role: "patient",
  healthProfile: mockHealthProfile,
};

export const mockPatient2: Patient = {
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
    updatedAt: "2026-01-25T10:00:00Z",
  },
};

// ==================== NUTRITIONISTS ====================

export const mockNutritionists: Nutritionist[] = [
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
    evaluationsCompleted: 156,
  },
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
    evaluationsCompleted: 98,
  },
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
    evaluationsCompleted: 210,
  },
];

// ==================== FOOD PHOTOS (Lorem Picsum) ====================

const foodPhotos = [
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop", // breakfast
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", // lunch
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", // salad
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", // pizza
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop", // eggs
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop", // pancakes
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop", // bowl
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop", // plate
  "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=400&h=300&fit=crop", // bbq
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop", // fruit
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop", // smoothie
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop", // toast
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", // healthy
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop", // pasta
  "https://images.unsplash.com/photo-1432139509613-5c4255a1d197?w=400&h=300&fit=crop", // soup
];

// ==================== GENERATE MEAL ENTRIES ====================

function generateMeals(patientId: string, daysBack: number): MealEntry[] {
  const meals: MealEntry[] = [];
  const now = new Date();
  let photoIndex = 0;

  for (let d = 0; d < daysBack; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);

    const dayMeals: { type: typeof mealTimes[number]["type"]; hour: number; minute: number }[] = [];
    const mealTimes = [
      { type: "cafe-da-manha" as const, hour: 7, minute: 30 },
      { type: "lanche-da-manha" as const, hour: 10, minute: 0 },
      { type: "almoco" as const, hour: 12, minute: 30 },
      { type: "lanche-da-tarde" as const, hour: 15, minute: 30 },
      { type: "jantar" as const, hour: 19, minute: 30 },
    ];

    // Randomly skip some meals to look realistic
    for (const m of mealTimes) {
      if (Math.random() > 0.25) {
        dayMeals.push(m);
      }
    }

    for (const meal of dayMeals) {
      const mealDate = new Date(date);
      mealDate.setHours(meal.hour, meal.minute + Math.floor(Math.random() * 20), 0, 0);

      meals.push({
        id: `meal-${patientId}-${d}-${meal.type}`,
        patientId,
        photoUrl: foodPhotos[photoIndex % foodPhotos.length],
        mealType: meal.type,
        timestamp: mealDate.toISOString(),
      });
      photoIndex++;
    }
  }

  return meals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const mockMeals: MealEntry[] = generateMeals("p1", 14);

export const mockMealsPatient2: MealEntry[] = generateMeals("p2", 10);

// ==================== EVALUATION REQUESTS ====================

export const mockEvaluations: EvaluationRequest[] = [
  {
    id: "eval-1",
    patientId: "p1",
    nutritionistId: "n1",
    period: 7,
    price: 10,
    status: "completed",
    createdAt: "2026-01-15T14:00:00Z",
    meals: mockMeals.slice(0, 20),
    healthProfile: mockHealthProfile,
    feedback:
      "Kaue, sua alimentação está no caminho certo! Percebi que você tem consumido boas fontes de proteína no almoço. Sugiro incluir mais vegetais no jantar e evitar carboidratos simples à noite. O café da manhã poderia ser mais reforçado — tente incluir ovos ou aveia. No geral, a frequência de refeições está boa, mas sugiro diminuir os lanchinhos industrializados que apareceram em alguns dias. Continue assim! 💪",
    completedAt: "2026-01-17T09:30:00Z",
  },
  {
    id: "eval-2",
    patientId: "p1",
    nutritionistId: "n3",
    period: 30,
    price: 20,
    status: "in-progress",
    createdAt: "2026-02-01T10:00:00Z",
    meals: mockMeals,
    healthProfile: mockHealthProfile,
  },
  {
    id: "eval-3",
    patientId: "p1",
    nutritionistId: null,
    period: 7,
    price: 10,
    status: "pending",
    createdAt: "2026-02-05T16:00:00Z",
    meals: mockMeals.slice(0, 15),
    healthProfile: mockHealthProfile,
  },
  {
    id: "eval-4",
    patientId: "p2",
    nutritionistId: "n1",
    period: 7,
    price: 10,
    status: "pending",
    createdAt: "2026-02-04T11:00:00Z",
    meals: mockMealsPatient2.slice(0, 18),
    healthProfile: mockPatient2.healthProfile!,
  },
];
