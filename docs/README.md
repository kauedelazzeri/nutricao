# NutriSnap - Documentação do Protótipo

**Versão:** 1.0.0 (Protótipo Navegável)  
**Data:** Fevereiro 2026  
**Status:** MVP Funcional com dados mockados

---

## 🎯 Visão Geral

NutriSnap é uma plataforma que democratiza o acesso à orientação nutricional profissional através de um sistema simples de registro fotográfico de refeições.

### Problema que Resolvemos

1. **Acesso limitado** - Consultas nutricionais são caras e infrequentes
2. **Registro complicado** - Apps tradicionais exigem entrada manual de dados
3. **Dados bloqueados** - Usuários perdem acesso ao histórico quando cancelam planos
4. **Custo proibitivo** - Acompanhamento nutricional mensal custa centenas de reais

### Nossa Solução

- **Registro instantâneo por foto** - Um clique para registrar refeições
- **Dados sempre acessíveis** - Seu histórico nunca é bloqueado
- **Orientação sob demanda** - Solicite avaliação quando quiser
- **Preço justo** - 100% gratuito no lançamento

---

## 🏗️ Arquitetura Técnica

### Stack

- **Framework:** React 19 + Vite 7 + TypeScript 5
- **Roteamento:** React Router v7 (SPA mode)
- **Estilização:** Tailwind CSS v4
- **Estado Global:** React Context API
- **Dados:** Mockados em memória (futuro: backend)

### Estrutura de Pastas

```
app/
├── modules/
│   ├── auth/               # Autenticação e landing page
│   │   └── LoginPage.tsx
│   ├── patient/            # Módulo do paciente (mobile-first)
│   │   ├── layouts/
│   │   │   └── PatientLayout.tsx
│   │   └── pages/
│   │       ├── TimelinePage.tsx
│   │       ├── MyEvaluationsPage.tsx
│   │       ├── RequestEvaluationPage.tsx
│   │       └── HealthProfilePage.tsx
│   └── nutritionist/       # Módulo da nutricionista (desktop-first)
│       ├── layouts/
│       │   └── NutritionistLayout.tsx
│       └── pages/
│           ├── DashboardPage.tsx
│           ├── RequestDetailPage.tsx
│           └── ProfessionalProfilePage.tsx
├── shared/
│   ├── components/         # Componentes compartilhados
│   │   ├── BottomTabBar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNutriNav.tsx
│   ├── contexts/
│   │   └── AppContext.tsx  # Estado global
│   ├── mocks/
│   │   └── data.ts         # Dados mockados
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── utils/
│       └── mealClassifier.ts
├── routes.ts               # Definição de rotas
├── root.tsx                # Root component com providers
└── app.css                 # Estilos globais
```

---

## 📱 Perfis de Usuário

### 1. Paciente (Mobile-First)

**Objetivo:** Registrar refeições e receber orientação nutricional

**Características:**
- Interface otimizada para celular
- Bottom tab bar para navegação
- Foco em captura rápida de fotos
- Timeline visual das refeições

### 2. Nutricionista (Desktop-First)

**Objetivo:** Avaliar solicitações e fornecer pareceres

**Características:**
- Layout com sidebar
- Dashboard com métricas
- Visualização em galeria
- Área de texto para pareceres

---

## 📖 Índice da Documentação

1. [**Fluxos de Usuário**](./fluxos-usuario.md) - Jornadas completas de paciente e nutricionista
2. [**Componentes**](./componentes.md) - Documentação de componentes principais
3. [**Dados Mockados**](./dados-mockados.md) - Estrutura dos dados de teste
4. [**API Context**](./api-context.md) - Funções e estado global
5. [**Guia de Desenvolvimento**](./guia-desenvolvimento.md) - Como rodar e desenvolver
6. [**Roadmap**](./roadmap.md) - Próximas funcionalidades

---

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Acessar
http://localhost:5173
```

### Contas de Teste

**Paciente:**
- Clique em "Entrar com Google" ou "Entrar com Apple" (mockado)
- Acessa: `/app/timeline`

**Nutricionista:**
- Clique em "Sou Nutricionista"
- Acessa: `/nutri/dashboard`

---

## 🎨 Design System

### Cores Principais

- **Primary:** Green-600 (#16a34a)
- **Accent:** Emerald-600 (#059669)
- **Success:** Green-600
- **Warning:** Yellow-600
- **Error:** Red-600

### Tipografia

- **Font:** Inter (Google Fonts)
- **Headings:** Bold, 700
- **Body:** Regular, 400
- **Small:** 12px, 500

### Componentes Base

- **Border Radius:** 12px (rounded-xl) para cards
- **Shadow:** sm para cards, lg para modais
- **Transitions:** 200ms ease
- **Spacing:** Sistema 4px (Tailwind padrão)

---

## 📊 Métricas do Protótipo

- **Páginas:** 9 (1 landing + 4 paciente + 4 nutricionista)
- **Componentes:** 12 principais
- **Rotas:** 8 navegáveis
- **Dados Mock:** 14 dias de refeições, 3 nutricionistas, 4 avaliações
- **Linhas de Código:** ~2.500 (TypeScript + TSX)

---

## 🔐 Próximos Passos (Backend)

1. Autenticação real (Google/Apple OAuth)
2. Upload de imagens (AWS S3 / Cloudflare R2)
3. API REST ou GraphQL
4. Banco de dados (PostgreSQL / MongoDB)
5. Sistema de pagamentos (Stripe)
6. Notificações push (FCM)
7. Migração para Capacitor (app nativo)

---

## 📞 Contato

Para dúvidas sobre a documentação ou implementação, consulte os outros arquivos desta pasta.
