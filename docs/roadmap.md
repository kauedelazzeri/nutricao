# Roadmap - NutriSnap

## 🎯 Visão Geral

Este documento lista as funcionalidades planejadas para transformar o protótipo navegável em um produto completo (MVP) e além.

---

## ✅ Fase 1: Protótipo (Concluída)

**Status:** ✅ 100% Completo  
**Data:** Fevereiro 2026

### Entregas

- [x] Landing page com explicação do produto
- [x] Login mockado (Google/Apple)
- [x] Módulo do paciente (mobile-first)
  - [x] Timeline de refeições com fotos
  - [x] Filtro de período (7/14/30 dias/tudo)
  - [x] Registro por foto (file picker)
  - [x] Edição de refeição (modal)
  - [x] Classificação automática de tipo de refeição
  - [x] Perfil de saúde editável
  - [x] Solicitação de avaliação (wizard 3 steps)
  - [x] Lista de avaliações com status
- [x] Módulo da nutricionista (desktop-first)
  - [x] Dashboard com métricas
  - [x] Lista de solicitações
  - [x] Detalhe com galeria de fotos
  - [x] Aceitar/recusar solicitações
  - [x] Área de parecer
  - [x] Perfil profissional
- [x] Dados mockados completos
- [x] React Context para estado global
- [x] Documentação completa

---

## 🚀 Fase 2: MVP Backend (3-4 meses)

**Status:** ⏸️ Não Iniciado  
**Prioridade:** Alta

### 2.1 Infraestrutura

- [ ] Configurar projeto backend (Node.js + Express ou NestJS)
- [ ] Database setup (PostgreSQL + Prisma ORM)
- [ ] Deploy infrastructure (AWS/Vercel/Railway)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Ambiente staging + produção

### 2.2 Autenticação

- [ ] Google OAuth integration
- [ ] Apple Sign In integration
- [ ] JWT tokens (access + refresh)
- [ ] Session management
- [ ] Protected routes no backend
- [ ] Middleware de autenticação

### 2.3 Upload de Imagens

- [ ] Integração com storage (AWS S3 / Cloudflare R2 / Supabase Storage)
- [ ] Image compression (Sharp.js)
- [ ] Resize automático (thumbnail + full size)
- [ ] CDN para servir imagens
- [ ] Signed URLs para segurança

### 2.4 API REST

**Endpoints:**

```
Auth
  POST   /api/auth/google
  POST   /api/auth/apple
  POST   /api/auth/refresh
  POST   /api/auth/logout

Users
  GET    /api/users/me
  PATCH  /api/users/me

Meals
  GET    /api/meals
  POST   /api/meals
  GET    /api/meals/:id
  PATCH  /api/meals/:id
  DELETE /api/meals/:id

Health Profile
  GET    /api/health-profile
  PATCH  /api/health-profile

Evaluations
  GET    /api/evaluations
  POST   /api/evaluations
  GET    /api/evaluations/:id
  PATCH  /api/evaluations/:id/accept
  PATCH  /api/evaluations/:id/complete
  PATCH  /api/evaluations/:id/reject

Nutritionists
  GET    /api/nutritionists
  GET    /api/nutritionists/:id
```

### 2.5 Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatar    String?
  role      UserRole
  createdAt DateTime @default(now())
  
  // Relations
  meals         Meal[]
  evaluations   Evaluation[] @relation("PatientEvaluations")
  healthProfile HealthProfile?
}

model Meal {
  id         String   @id @default(cuid())
  userId     String
  photoUrl   String
  mealType   MealType
  timestamp  DateTime
  notes      String?
  createdAt  DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model HealthProfile {
  id                   String   @id @default(cuid())
  userId               String   @unique
  weight               Float
  height               Float
  bmi                  Float
  goal                 HealthGoal
  dietaryRestrictions  String[]
  notes                String?
  updatedAt            DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Evaluation {
  id              String           @id @default(cuid())
  patientId       String
  nutritionistId  String?
  period          Int
  price           Float
  status          EvaluationStatus
  feedback        String?
  completedAt     DateTime?
  createdAt       DateTime         @default(now())
  
  patient       User @relation("PatientEvaluations", fields: [patientId], references: [id])
  nutritionist  User? @relation("NutritionistEvaluations", fields: [nutritionistId], references: [id])
  meals         EvaluationMeal[]
}
```

### 2.6 Frontend Refactor

- [ ] Substituir React Context por React Query / SWR
- [ ] Adicionar loading states
- [ ] Adicionar error handling
- [ ] Toast notifications (biblioteca: sonner ou react-hot-toast)
- [ ] Skeleton loaders
- [ ] Infinite scroll na timeline (opcional)
- [ ] Optimistic updates

### 2.7 Testes

- [ ] Unit tests (Vitest)
- [ ] Integration tests (Playwright)
- [ ] E2E critical paths
- [ ] API tests (Supertest)

---

## 💳 Fase 3: Pagamentos (1-2 meses)

**Status:** ⏸️ Não Iniciado  
**Prioridade:** Alta (pós-MVP backend)

### 3.1 Integração Stripe

- [ ] Stripe setup (conta + keys)
- [ ] Checkout session para avaliações
- [ ] Webhooks para confirmar pagamento
- [ ] Subscription model (futuro para planos mensais)
- [ ] Histórico de pagamentos

### 3.2 Fluxo de Pagamento

- [ ] Tela de checkout (frontend)
- [ ] Confirmação de pagamento
- [ ] Email de confirmação (SendGrid ou Resend)
- [ ] Reembolsos (painel admin)

### 3.3 Precificação

**Modelo Inicial:**
- Avaliação 7 dias: R$ 10
- Avaliação 30 dias: R$ 20

**Futuro (assinatura):**
- Free: 1 avaliação por mês
- Basic (R$ 19/mês): 4 avaliações por mês
- Pro (R$ 49/mês): Avaliações ilimitadas

---

## 📱 Fase 4: App Nativo (2-3 meses)

**Status:** ⏸️ Não Iniciado  
**Prioridade:** Média

### 4.1 Capacitor Setup

- [ ] `npm install @capacitor/core @capacitor/cli`
- [ ] `npx cap init`
- [ ] `npx cap add ios`
- [ ] `npx cap add android`

### 4.2 Camera Integration

- [ ] `npm install @capacitor/camera`
- [ ] Substituir file picker por Camera API
- [ ] Permissões (iOS + Android)
- [ ] Cropping de imagem (optional)

### 4.3 Push Notifications

- [ ] `npm install @capacitor/push-notifications`
- [ ] FCM setup (Firebase)
- [ ] APNS setup (Apple)
- [ ] Notificar quando avaliação estiver pronta

### 4.4 Build e Deploy

- [ ] iOS build (Xcode)
- [ ] Android build (Android Studio)
- [ ] App Store submission
- [ ] Google Play submission
- [ ] TestFlight beta (iOS)
- [ ] Google Play beta track

---

## 🎨 Fase 5: Melhorias de UX (contínuo)

### 5.1 Timeline

- [ ] **Infinite scroll** em vez de filtro de período
- [ ] **Swipe to delete** na timeline (mobile)
- [ ] **Bulk actions** (selecionar múltiplas refeições)
- [ ] **Export** de refeições para PDF ou imagem
- [ ] **Categorias customizáveis** (além dos 6 tipos padrão)
- [ ] **Notas de voz** em vez de texto (opcional)

### 5.2 Gamificação

- [ ] **Streaks** — dias consecutivos registrando refeições
- [ ] **Badges** — conquistas (ex: "100 refeições registradas")
- [ ] **Progresso visual** no perfil
- [ ] **Metas semanais** (ex: registrar 5 refeições/dia)

### 5.3 Análises Avançadas

- [ ] **Gráficos** de frequência de refeições
- [ ] **Distribuição de tipos** (pizza chart)
- [ ] **Evolução de peso** ao longo do tempo
- [ ] **Comparação** antes/depois de avaliações

### 5.4 Social

- [ ] **Compartilhar refeição** (foto) no Instagram/WhatsApp
- [ ] **Feed público** (opcional, opt-in)
- [ ] **Comentários** de nutricionistas em refeições específicas

---

## 🤖 Fase 6: IA e Automação (longo prazo)

**Status:** 💡 Ideias  
**Prioridade:** Baixa

### 6.1 Reconhecimento de Alimentos (Computer Vision)

- [ ] Integração com API de reconhecimento (Google Vision, Clarifai, ou custom model)
- [ ] Sugestão automática de tipo de refeição com base na foto
- [ ] Detecção de alimentos na imagem ("Detectamos: arroz, frango, brócolis")
- [ ] Estimativa calórica automática (opcional, com disclaimer)

### 6.2 Sugestões Automáticas

- [ ] **Receitas sugeridas** com base em restrições alimentares
- [ ] **Plano de refeições semanal** gerado por IA
- [ ] **Alertas inteligentes**: "Você não registrou o café da manhã hoje"

### 6.3 Chatbot Nutricional

- [ ] **Assistente por chat** para dúvidas rápidas (GPT-4 API)
- [ ] **Pareceres parciais** antes da nutricionista avaliar
- [ ] **FAQ automático** sobre alimentação saudável

---

## 👩‍⚕️ Fase 7: Painel da Nutricionista Avançado (médio prazo)

### 7.1 Ferramentas Profissionais

- [ ] **Anotações privadas** por refeição (não visíveis ao paciente)
- [ ] **Templates de parecer** (reusáveis)
- [ ] **Planos alimentares** — nutricionista cria cardápio semanal
- [ ] **Follow-ups** — agendar revisões futuras
- [ ] **Pacientes favoritos** / lista de prioridades

### 7.2 Dashboard Avançado

- [ ] **Estatísticas de atendimento** (tempo médio, taxa de aceitação)
- [ ] **Gráficos de receita** (mensal, anual)
- [ ] **Agenda integrada** (futuro: consultas presenciais)
- [ ] **Relatórios para exportar** (PDF) para paciente

### 7.3 Marketplace

- [ ] **Perfil público** da nutricionista (bio, avaliações, fotos)
- [ ] **Sistema de reviews** (pacientes avaliam nutricionista)
- [ ] **Filtros de busca** (especialidade, preço, disponibilidade)
- [ ] **Agendamento direto** (calendário Calendly-like)

---

## 🛡️ Fase 8: Segurança e Compliance (contínuo)

### 8.1 LGPD / GDPR

- [ ] **Política de privacidade** detalhada
- [ ] **Termos de uso** legais
- [ ] **Consentimento explícito** para uso de dados
- [ ] **Direito ao esquecimento** — delete account
- [ ] **Export de dados** (JSON / CSV)

### 8.2 Segurança

- [ ] **Rate limiting** em todas as APIs
- [ ] **2FA** (autenticação de dois fatores)
- [ ] **Logs de auditoria** (quem acessou o quê)
- [ ] **Criptografia end-to-end** para fotos sensíveis (opcional)
- [ ] **Backups automáticos** do banco de dados

### 8.3 Saúde Digital

- [ ] **Certificação HIPAA** (se expandir para EUA)
- [ ] **Integração com CFN** (Conselho Federal de Nutricionistas)
- [ ] **Validação de CRN** ao cadastrar nutricionista
- [ ] **Disclaimer médico** claro (não substitui consulta presencial)

---

## 💼 Fase 9: Monetização e Crescimento (médio/longo prazo)

### 9.1 Modelos de Receita

**Atual (Comissão):**
- Plataforma cobra 20-30% de cada avaliação paga

**Futuro:**

1. **Assinatura Paciente:**
   - Free: 1 avaliação por mês
   - Basic (R$ 19/mês): 4 avaliações
   - Pro (R$ 49/mês): Ilimitado + IA features

2. **Assinatura Nutricionista:**
   - Free: Até 10 pacientes/mês
   - Pro (R$ 99/mês): Pacientes ilimitados + ferramentas avançadas

3. **Marketplace:**
   - Taxa por agendamento de consulta presencial (ex: 10%)

4. **White Label:**
   - Vendemos versão customizada para clínicas (R$ 999/mês)

### 9.2 Marketing

- [ ] **Blog de nutrição** (SEO)
- [ ] **YouTube** — dicas de nutricionistas parceiras
- [ ] **Instagram** — antes/depois, depoimentos
- [ ] **TikTok** — conteúdo viral sobre alimentação
- [ ] **Email marketing** — newsletter semanal
- [ ] **Referral program** — indique e ganhe desconto

### 9.3 Parcerias

- [ ] **Academia de nutrição** — parceria educacional
- [ ] **Clínicas** — white label
- [ ] **Influencers fitness** — embaixadores
- [ ] **SUS / Saúde pública** — projeto piloto gratuito

---

## 📊 Fase 10: Analytics e Insights (contínuo)

### 10.1 Business Intelligence

- [ ] **Metabase** ou similar para dashboards internos
- [ ] **KPIs principais:**
  - DAU / MAU (usuários ativos)
  - Retention rate (7d, 30d)
  - Churn rate
  - LTV (Lifetime Value)
  - CAC (Customer Acquisition Cost)
- [ ] **Cohort analysis** — comportamento por coorte
- [ ] **Funnel analysis** — onde usuários desistem

### 10.2 User Tracking

- [ ] **Mixpanel / Amplitude** para product analytics
- [ ] **Hotjar / FullStory** para session replays
- [ ] **Google Analytics 4**
- [ ] **A/B testing** (Optimizely, Split.io)

---

## 🌍 Fase 11: Expansão Internacional (longo prazo)

### 11.1 Idiomas

- [ ] **Inglês (US/UK)**
- [ ] **Espanhol (LATAM)**
- [ ] **Francês**
- [ ] **i18n framework** (react-intl ou similar)

### 11.2 Moedas

- [ ] Suporte multi-moeda (USD, EUR, MXN, etc.)
- [ ] Stripe multi-currency

### 11.3 Regulamentações

- [ ] Adaptar para regulamentação de saúde de cada país
- [ ] Certificações profissionais locais (ex: RD nos EUA)

---

## 🎯 Prioridades

### Alta (0-6 meses)
1. ✅ Protótipo navegável (concluído)
2. 🚀 MVP Backend + API
3. 💳 Integração de pagamentos
4. 📱 App nativo (Capacitor)

### Média (6-12 meses)
5. 🎨 Melhorias de UX (gamificação, análises)
6. 👩‍⚕️ Painel avançado da nutricionista
7. 🛡️ LGPD/Segurança compliance
8. 💼 Modelos de monetização

### Baixa (1-2 anos)
9. 🤖 IA e reconhecimento de alimentos
10. 📊 BI e analytics avançados
11. 🌍 Expansão internacional

---

## 📈 Métricas de Sucesso

### MVP (3 meses pós-lançamento)
- **100 pacientes ativos** (registrando ≥1 refeição/semana)
- **10 nutricionistas** cadastradas
- **50 avaliações** completadas
- **4.5+ rating** médio das nutricionistas

### Ano 1
- **10.000 usuários** cadastrados
- **1.000 avaliações/mês**
- **R$ 50k MRR** (Monthly Recurring Revenue)
- **30% retention** (30 dias)

### Ano 2
- **100k usuários**
- **500 nutricionistas**
- **R$ 500k MRR**
- **Break-even** financeiro

---

## 💡 Ideias Futuras (Backlog)

- [ ] **Integração com Apple Health / Google Fit** (dados de peso automáticos)
- [ ] **Modo família** (pais registram refeições dos filhos)
- [ ] **Desafios comunitários** ("30 dias de alimentação saudável")
- [ ] **API pública** para desenvolvedores
- [ ] **Plugin WordPress** para nutricionistas
- [ ] **Alexa / Google Assistant** ("Ok Google, registrar café da manhã")
- [ ] **Smart watch app** (Apple Watch, Wear OS)
- [ ] **Impressão de receitas** (QR code leva ao app)

---

## 🚧 Riscos e Mitigações

### Risco 1: Adoção de nutricionistas
**Mitigação:** Programa de early adopters com 0% comissão nos primeiros 6 meses

### Risco 2: Qualidade de fotos ruins
**Mitigação:** Tutorial no onboarding + dicas de iluminação

### Risco 3: Compliance LGPD
**Mitigação:** Consultoria jurídica antes do lançamento

### Risco 4: Competição (MyFitnessPal, Noom, etc.)
**Mitigação:** Foco em nicho brasileiro, precificação acessível, UX superior

---

## 📅 Timeline Estimado

```
Q1 2026 (Fev-Abr)
  ✅ Protótipo navegável

Q2 2026 (Mai-Jul)
  🚀 MVP Backend + API
  💳 Pagamentos

Q3 2026 (Ago-Out)
  📱 App nativo (iOS + Android)
  🎨 Melhorias UX (v1)

Q4 2026 (Nov-Dez)
  👩‍⚕️ Painel avançado nutricionista
  📊 Analytics + BI

2027+
  🤖 IA features
  🌍 Expansão internacional
```

---

## 🤝 Contribuindo

Este roadmap é vivo e pode mudar conforme feedback de usuários. Sugestões são bem-vindas!

**Contato:** [inserir email ou Discord]
