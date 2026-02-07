# Fluxos de Usuário - NutriSnap

## 🎭 Perfis

### Paciente
Pessoa buscando orientação nutricional através de registro fotográfico de refeições.

### Nutricionista
Profissional que analisa as refeições dos pacientes e fornece pareceres.

---

## 📱 Fluxo 1: Paciente - Primeiro Acesso

### Jornada Completa

```
Landing Page (/) 
  ↓ [Clica "Começar Agora" ou "Entrar com Google/Apple"]
  ↓
Login Mockado
  ↓ [Autenticação simulada]
  ↓
Timeline (/app/timeline)
```

### Detalhamento

#### 1. Landing Page (`/`)

**Elementos visíveis:**
- Navbar fixo no topo com botão "Entrar"
- Hero section com CTA "Começar Agora — Grátis"
- Badge pulsante "100% GRATUITO no lançamento"
- Seção de problemas (4 cards)
- Seção "Como Funciona" (3 passos)
- Features (6 benefícios)
- CTA/Login section
- Footer

**Ações disponíveis:**
- Scroll pela página para conhecer o produto
- Clicar em "Entrar com Google"
- Clicar em "Entrar com Apple"
- Clicar em "Sou Nutricionista"

#### 2. Timeline (Primeira Visão)

**Estado inicial:**
- Nenhuma refeição registrada
- Mensagem de boas-vindas: "Olá, [Nome]!"
- Empty state: "📷 Nenhuma refeição registrada ainda. Tire uma foto do seu prato!"
- Bottom tab bar: Início | Avaliações | Perfil
- FAB (botão flutuante) 📸 no canto inferior direito

---

## 📸 Fluxo 2: Paciente - Registrar Refeição

### Jornada

```
Timeline (/app/timeline)
  ↓ [Clica no FAB 📸]
  ↓
File Picker / Câmera
  ↓ [Seleciona foto]
  ↓
Timeline (atualizada)
  ↓ [Toast: "✅ Refeição registrada!"]
```

### Detalhamento

#### 1. Captura de Foto

**Ação do usuário:**
- Clica no botão flutuante 📸 (bottom right)

**Sistema:**
- Abre file picker nativo (web) ou câmera (futuro com Capacitor)
- Aceita formatos: image/*

#### 2. Processamento Automático

**Sistema detecta automaticamente:**
- **Horário atual** → ISO timestamp
- **Tipo de refeição** baseado no horário:
  - 05:00 – 09:00 → ☕ Café da Manhã
  - 09:01 – 11:00 → 🍎 Lanche da Manhã
  - 11:01 – 14:00 → 🍽️ Almoço
  - 14:01 – 17:00 → 🥤 Lanche da Tarde
  - 17:01 – 21:00 → 🌙 Jantar
  - 21:01 – 04:59 → 🍵 Ceia

#### 3. Timeline Atualizada

**Nova refeição aparece:**
- No topo da timeline
- Agrupada por dia
- Card com foto, tipo de refeição e horário
- Hint "Editar →" discreto

---

## ✏️ Fluxo 3: Paciente - Editar Refeição

### Jornada

```
Timeline (/app/timeline)
  ↓ [Clica em qualquer card de refeição]
  ↓
Modal de Edição (bottom sheet)
  ↓ [Edita campos]
  ↓ [Clica "✅ Salvar Alterações"]
  ↓
Timeline (atualizada)
```

### Detalhamento

#### Modal de Edição

**Campos editáveis:**

1. **Tipo de Refeição** (grid 3x2)
   - ☕ Café da Manhã
   - 🍎 Lanche da Manhã
   - 🍽️ Almoço
   - 🥤 Lanche da Tarde
   - 🌙 Jantar
   - 🍵 Ceia

2. **Data** (input type="date")
   - Formato: YYYY-MM-DD

3. **Horário** (input type="time")
   - Formato: HH:MM

4. **Observações** (textarea)
   - Opcional
   - Ex: "Arroz integral, frango grelhado, salada de rúcula"

**Ações:**
- ✅ Salvar Alterações
- Excluir refeição (com confirmação dupla)
- ✕ Fechar modal (sem salvar)

---

## 🔍 Fluxo 4: Paciente - Filtrar Timeline

### Jornada

```
Timeline (/app/timeline)
  ↓ [Clica em pill de filtro no header]
  ↓
Timeline filtrada
```

### Opções de Filtro

**Pills disponíveis (header fixo):**
- **7 dias** (padrão, selecionado)
- 14 dias
- 30 dias
- Tudo

**Comportamento:**
- Filtro ativo = verde (bg-green-600)
- Filtro inativo = cinza (bg-gray-100)
- Contador de refeições atualiza dinamicamente
- Empty state adapta mensagem: "Nenhuma refeição nos últimos X dias"

---

## 📋 Fluxo 5: Paciente - Solicitar Avaliação

### Jornada Completa

```
Timeline ou Avaliações
  ↓ [Clica "+ Nova" em Avaliações]
  ↓
Solicitar Avaliação (/app/request-evaluation)
  ↓
Step 1: Escolher Período (7 ou 30 dias)
  ↓ [Clica "Continuar"]
  ↓
Step 2: Escolher Nutricionista
  ↓ [Seleciona uma ou "Qualquer"]
  ↓ [Clica "Continuar"]
  ↓
Step 3: Confirmar (com banner GRÁTIS)
  ↓ [Clica "✅ Confirmar Solicitação Gratuita"]
  ↓
Minhas Avaliações (/app/evaluations)
  ↓ [Nova solicitação com status "Pendente"]
```

### Detalhamento

#### Step 1: Período

**Opções:**
- **7 dias** — ~~R$ 10,00~~ GRÁTIS
- **30 dias** — ~~R$ 20,00~~ GRÁTIS

**Informações exibidas:**
- Quantidade de refeições registradas no período
- Preço riscado + badge GRÁTIS

#### Step 2: Nutricionista

**Opções:**

1. **🌐 Qualquer nutricionista**
   - A primeira disponível aceitará

2. **Lista de nutricionistas** (3 mockadas)
   - Foto avatar
   - Nome (ex: Dra. Mariana Costa)
   - CRN (ex: CRN-3 12345)
   - Rating (⭐ 4.8)
   - Avaliações concluídas (156)
   - Especialidades (tags: Emagrecimento, Nutrição Esportiva)

#### Step 3: Confirmação

**Banner de promoção:**
- Fundo verde gradiente
- Badge "PROMOÇÃO 🎉" rotacionado
- Título: "Avaliação Grátis!"
- Texto: "Por tempo limitado, todas as avaliações são 100% gratuitas"

**Resumo:**
- Período: Últimos X dias
- Refeições: Y fotos
- Nutricionista: [Nome ou "Qualquer disponível"]
- Total: ~~R$ X,00~~ **GRÁTIS**

---

## 👤 Fluxo 6: Paciente - Atualizar Perfil de Saúde

### Jornada

```
Perfil (/app/profile)
  ↓ [Clica "Editar"]
  ↓
Formulário habilitado
  ↓ [Preenche campos]
  ↓ [Clica "Salvar Alterações"]
  ↓
Toast: "✅ Perfil atualizado!"
```

### Campos do Perfil

**Visão (não editando):**
- Avatar, nome, email (não editáveis)
- Peso, altura, IMC em cards
- IMC colorido + categoria (ex: "Peso normal")
- Objetivo: 🎯 Emagrecer
- Restrições: ⚠️ Lactose, Glúten (tags vermelhas)
- Observações: texto em card cinza

**Edição:**
- Peso (kg) — input number
- Altura (cm) — input number
- Objetivo — select com 4 opções:
  - Emagrecer
  - Ganhar Massa
  - Manter Peso
  - Melhorar Saúde
- Restrições — input text (separadas por vírgula)
- Observações — textarea

**Cálculo automático:**
- IMC = peso / (altura/100)²
- Atualizado ao salvar

---

## 👩‍⚕️ Fluxo 7: Nutricionista - Dashboard

### Jornada

```
Login como Nutricionista
  ↓
Dashboard (/nutri/dashboard)
```

### Elementos do Dashboard

**Métricas (3 cards):**
- 📩 **Novas** — solicitações com status "pending"
- 🔍 **Em Análise** — status "in-progress"
- ✅ **Concluídas** — status "completed"

**Lista de Solicitações:**
- Cards clicáveis
- Paciente # [ID]
- Período, quantidade de refeições, valor
- Badge de status colorido
- Miniatura de 4 fotos + contador "+X"
- Data da solicitação

**Sidebar (desktop):**
- Logo NutriSnap
- Foto + nome + email da nutricionista
- Menu: Dashboard | Meu Perfil
- Botão "Sair"

**Bottom Nav (mobile):**
- 📊 Dashboard
- 👩‍⚕️ Perfil
- 🚪 Sair

---

## 📝 Fluxo 8: Nutricionista - Avaliar Solicitação

### Jornada Completa

```
Dashboard
  ↓ [Clica em card de solicitação]
  ↓
Detalhe da Solicitação (/nutri/request/:id)
  ↓
[Status = Pendente]
  ↓ [Clica "✅ Aceitar Solicitação"]
  ↓
[Status = Em Análise]
  ↓ [Visualiza fotos + dados do paciente]
  ↓ [Escreve parecer no textarea]
  ↓ [Clica "Enviar Parecer"]
  ↓
[Status = Concluída]
  ↓ [Redirecionado ao Dashboard]
```

### Detalhamento

#### Layout da Página

**Coluna Esquerda (1/3):**

1. **Card de Dados do Paciente**
   - Peso, altura, IMC em grid 3 colunas
   - Categoria do IMC colorida
   - Objetivo: 🎯 [label]
   - Restrições: ⚠️ tags vermelhas
   - Observações: texto em card cinza

2. **Ações (se pendente)**
   - ✅ Aceitar Solicitação (verde)
   - ❌ Recusar (borda vermelha)

3. **Área de Parecer (se em análise)**
   - Textarea (6 linhas)
   - Placeholder: "Escreva seu parecer nutricional aqui..."
   - Botão "Enviar Parecer" (desabilitado se vazio)

4. **Parecer Enviado (se concluída)**
   - Card verde com feedback
   - Ícone 📝

**Coluna Direita (2/3):**

**Galeria de Fotos:**
- Agrupadas por dia (header com data)
- Grid 2-3 colunas (responsivo)
- Cards clicáveis com:
  - Foto da refeição
  - Ícone + tipo de refeição
  - Horário

**Lightbox:**
- Clique em qualquer foto abre modal fullscreen
- Fundo preto 80% opacidade
- Foto centralizada
- Clique fora fecha

---

## 🎯 Estados das Avaliações

### Ciclo de Vida

```
CRIADA (paciente)
  ↓
PENDING → nutritionistId = null ou específico
  ↓ [Nutricionista aceita]
  ↓
IN-PROGRESS → nutritionistId definido
  ↓ [Nutricionista envia parecer]
  ↓
COMPLETED → feedback preenchido, completedAt definido
```

### Cores dos Status

- **Pendente** → Amarelo (bg-yellow-100, text-yellow-800)
- **Em Análise** → Azul (bg-blue-100, text-blue-800)
- **Concluída** → Verde (bg-green-100, text-green-800)
- **Recusada** → Vermelho (bg-red-100, text-red-800)

---

## 🔄 Navegação Rápida

### Paciente

- `/` → Landing page
- `/app/timeline` → Timeline de refeições (com filtro 7/14/30 dias/tudo)
- `/app/evaluations` → Minhas avaliações (lista)
- `/app/request-evaluation` → Solicitar nova avaliação (wizard 3 steps)
- `/app/profile` → Perfil de saúde (editável)

### Nutricionista

- `/nutri/dashboard` → Dashboard com solicitações
- `/nutri/request/:id` → Detalhe de solicitação
- `/nutri/profile` → Perfil profissional

---

## 💡 Convenções de UX

### Mobile-First (Paciente)
- Bottom tab bar sempre visível
- FAB para ação primária (registrar refeição)
- Modais bottom sheet (slide up)
- Cards full-width com padding lateral
- Gestos: clique para editar, swipe futuro

### Desktop-First (Nutricionista)
- Sidebar fixa à esquerda
- Layout multi-coluna (33% / 67%)
- Hover states em cards
- Modais centralizados
- Responsivo: mobile usa bottom nav

### Feedback Visual
- Toasts para ações (2.5s)
- Loading states (futuro)
- Empty states ilustrados
- Transições suaves (200ms)
- Active states (scale-[0.98])
