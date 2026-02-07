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
  ↓ [Scroll pela página ou clica "Entrar" na navbar]
  ↓
Seção de Login (scroll ou showLogin ativado)
  ↓ [Clica "Entrar com Google" ou "Entrar com Apple"]
  ↓
Timeline (/app/timeline)
```

### Detalhamento

#### 1. Landing Page (`/`)

**Elementos visíveis:**
- Navbar fixo no topo (backdrop-blur, z-50) com logo "🥗 NutriSnap" e botão "Entrar"
- Hero section com CTA "📸 Começar Agora — Grátis" (chama `scrollToLogin()`)
- Badge pulsante "100% GRATUITO no lançamento"
- Seção de problemas (4 cards de dor do usuário + 1 card verde de missão)
- Seção "Como Funciona" (3 passos visuais)
- Features (6 benefícios em grid)
- Seção CTA/Login com botões de autenticação
- Footer com créditos

**Ações disponíveis:**
- Scroll pela página para conhecer o produto
- Clicar em "Entrar" na navbar → scroll suave até a seção de login
- Clicar em "📸 Começar Agora — Grátis" → ativa `showLogin` e scroll até login
- Clicar em "Entrar com Google" → login como paciente
- Clicar em "Entrar com Apple" → login como paciente
- Clicar em "Sou Nutricionista" → login como nutricionista

> **Nota:** Tanto Google quanto Apple fazem login mockado como paciente (mesmo `mockPatient`). A diferenciação de OAuth será implementada no backend.

#### 2. Timeline (Primeira Visão)

**Estado inicial com dados mockados (14 dias de refeições):**
- Mensagem de boas-vindas: "Olá, [Nome]! 👋"
- Filtros de período: 7 dias (padrão) | 14 dias | 30 dias | Tudo
- Contador de refeições: "X refeições"
- Refeições agrupadas por dia
- Bottom tab bar: 📸 Início | 📋 Avaliações | 👤 Perfil
- FAB (botão flutuante) 📸 no canto inferior direito

**Empty state (se sem refeições no período):**
- Ícone 📷 (text-5xl)
- Se filtro por período: "Nenhuma refeição nos últimos X dias."
- Se filtro "Tudo": "Nenhuma refeição registrada ainda."
- Subtexto: "Tire uma foto do seu prato!"

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
  ↓ [Toast: "✅ Refeição registrada!" (2.5s)]
```

### Detalhamento

#### 1. Captura de Foto

**Ação do usuário:**
- Clica no botão flutuante 📸 (bottom right, acima do tab bar)

**Sistema:**
- Abre file picker nativo (web) com atributo `capture` para câmera (futuro com Capacitor)
- Aceita formatos: `image/*`

#### 2. Processamento Automático

**Sistema detecta automaticamente:**
- **Horário atual** → ISO timestamp
- **Tipo de refeição** baseado no horário (minutos desde meia-noite):
  - 05:00 – 09:00 → ☕ Café da Manhã
  - 09:01 – 11:00 → 🍎 Lanche da Manhã
  - 11:01 – 14:00 → 🍽️ Almoço
  - 14:01 – 17:00 → 🥤 Lanche da Tarde
  - 17:01 – 21:00 → 🌙 Jantar
  - 21:01 – 04:59 → 🍵 Ceia

#### 3. Timeline Atualizada

**Nova refeição aparece:**
- No topo da timeline (prepend ao array)
- Agrupada por dia
- Card com foto (rounded-2xl), ícone + tipo de refeição e horário
- Hint "Editar →" discreto no canto inferior

---

## ✏️ Fluxo 3: Paciente - Editar Refeição

### Jornada

```
Timeline (/app/timeline)
  ↓ [Clica em qualquer card de refeição]
  ↓
Modal de Edição (bottom sheet, slide-up)
  ↓ [Edita campos]
  ↓ [Clica "✅ Salvar Alterações"]
  ↓
Timeline (atualizada)
```

### Detalhamento

#### Modal de Edição (MealEditModal)

**Aparência:**
- Overlay escuro (`bg-black/60`)
- Modal slide-up a partir do rodapé (animação `slideUp`)
- Foto da refeição no topo (cover, h-56)
- Badge de tipo de refeição sobre a foto
- Botão ✕ no canto superior direito

**Campos editáveis:**

1. **🍽️ Tipo de Refeição** (grid 3 colunas × 2 linhas)
   - ☕ Café da Manhã
   - 🍎 Lanche da Manhã
   - 🍽️ Almoço
   - 🥤 Lanche da Tarde
   - 🌙 Jantar
   - 🍵 Ceia

2. **📅 Data** (input type="date")
   - Formato: YYYY-MM-DD

3. **⏰ Horário** (input type="time")
   - Formato: HH:MM

4. **📝 Observações** (textarea)
   - Placeholder: "Ex: Arroz integral, frango grelhado, salada de rúcula..."

**Ações:**
- ✅ Salvar Alterações (botão verde)
- 🗑️ Excluir refeição → exibe confirmação com "Cancelar" e "🗑️ Confirmar Exclusão"
- ✕ Fechar modal (botão X ou clique no backdrop)

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
Avaliações (/app/evaluations)
  ↓ [Clica "+ Nova" no header]
  ↓  (ou no empty state: "Solicitar primeira avaliação →")
  ↓
Solicitar Avaliação (/app/request-evaluation)
  ↓
Step 1: Escolher Período (7 ou 30 dias)
  ↓ [Clica "Continuar →"]
  ↓
Step 2: Escolher Nutricionista
  ↓ [Seleciona uma ou "Qualquer"]
  ↓ [Clica "Continuar →"]
  ↓
Step 3: Confirmar (com banner GRÁTIS)
  ↓ [Clica "✅ Confirmar Solicitação Gratuita"]
  ↓
Minhas Avaliações (/app/evaluations)
  ↓ [Nova solicitação com status "Pendente"]
```

### Detalhamento

#### Navegação de Steps

- Indicadores de progresso (1, 2, 3) no topo com linha conectora
- Botão "← " (voltar) muda de step ou retorna à página anterior
- Step ativo = verde, completado = check verde, futuro = cinza

#### Step 1: Período

**Opções (cards selecionáveis com borda verde quando ativo):**
- **📅 Últimos 7 dias** — R$ 10,00 (valor exibido, sem strikethrough)
- **📅 Últimos 30 dias** — R$ 20,00 (valor exibido, sem strikethrough)

**Informações exibidas:**
- Quantidade de refeições registradas no período selecionado
- Preço do período

> **Nota:** O strikethrough + badge GRÁTIS aparecem apenas no Step 3 (confirmação).

#### Step 2: Nutricionista

**Opções:**

1. **🌐 Qualquer nutricionista disponível**
   - "A primeira disponível aceitará sua solicitação"

2. **Lista de nutricionistas** (3 mockadas)
   - Foto avatar (48x48)
   - Nome (ex: Dra. Mariana Costa)
   - CRN (ex: CRN-3 12345)
   - Rating (⭐ 4.8)
   - Avaliações concluídas (156)
   - Especialidades (tags: Emagrecimento, Nutrição Esportiva)

#### Step 3: Confirmação

**Banner de promoção:**
- Fundo verde gradiente (`from-green-500 to-emerald-600`)
- Badge "PROMOÇÃO 🎉" com `rotate-12` (rotação de 12°)
- Subtexto: "Lançamento NutriSnap"
- Título: "Avaliação Grátis!"
- Texto: "Por tempo limitado, todas as avaliações são 100% gratuitas."

**Resumo (card branco):**
- Período: Últimos X dias
- Refeições: Y fotos
- Nutricionista: [Nome ou "Qualquer disponível"]
- Total: ~~R$ X,00~~ **GRÁTIS** (preço riscado + badge verde)

**Botão:** "✅ Confirmar Solicitação Gratuita"

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
Toast: "✅ Perfil atualizado!" (2s)
```

### Campos do Perfil

**Visão (não editando):**
- Avatar, nome, email (não editáveis, card no topo)
- Peso, altura, IMC em 3 cards lado a lado
- IMC colorido (text-[cor]) + categoria:
  - Azul: "Abaixo do peso"
  - Verde: "Peso normal"
  - Amarelo: "Sobrepeso"
  - Vermelho: "Obesidade"
- Objetivo: 🎯 Emagrecer (ou outro)
- Restrições: ⚠️ Lactose, Glúten (tags vermelhas)
- Observações: texto em card cinza
- **Botão "Sair da Conta"** (vermelho, no rodapé)

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
- Recalculado ao salvar (no `updateHealthProfile` do Context)

---

## 👩‍⚕️ Fluxo 7: Nutricionista - Dashboard

### Jornada

```
Login como Nutricionista
  ↓
Dashboard (/nutri/dashboard)
```

### Elementos do Dashboard

**Métricas (3 cards em grid):**
- 📩 **Novas** — solicitações com status "pending" (amarelo)
- 🔍 **Em Análise** — status "in-progress" (azul)
- ✅ **Concluídas** — status "completed" (verde)

**Filtro de visibilidade:**
- Exibe avaliações onde `nutritionistId === currentUser.id` **OU** `nutritionistId === null` (abertas para qualquer nutricionista)

**Lista de Solicitações (grid 2 colunas em desktop):**
- Cards clicáveis → Link para `/nutri/request/:id`
- Paciente # [últimos 4 chars do ID]
- Período (X dias), quantidade de refeições, valor (R$)
- Badge de status colorido (amarelo/azul/verde/vermelho)
- Miniatura de até 4 fotos + contador "+X" (se houver mais)
- Data da solicitação no formato DD/MM

**Empty state:**
- 📭 "Nenhuma solicitação recebida ainda."

**Sidebar (desktop ≥768px):**
- Logo "🥗 NutriSnap" + subtexto "Painel da Nutricionista"
- Avatar + nome + email da nutricionista
- Menu: 📊 Dashboard | 👩‍⚕️ Meu Perfil
- Botão "🚪 Sair" (chama `logout()`)

**Bottom Nav (mobile <768px):**
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
  ↓ [← Voltar ao Dashboard (link no topo)]
  ↓
[Status = Pendente]
  ↓ [Opção A: Clica "✅ Aceitar Solicitação"]
  ↓ [Status muda para "Em Análise" (permanece na mesma página)]
  ↓
  ↓ [Opção B: Clica "❌ Recusar"]
  ↓ [Status → "Recusada", redireciona ao Dashboard]
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

#### Header da Página

- Link "← Voltar ao Dashboard"
- Título: "Avaliação #[últimos 4 chars do ID]"
- Badge de status colorido
- Info: período (X dias), quantidade de refeições, valor

#### Layout da Página (grid md:grid-cols-3)

**Coluna Esquerda (md:col-span-1):**

1. **Card de Dados do Paciente**
   - Peso, altura, IMC em grid 3 colunas
   - Categoria do IMC colorida (azul/verde/amarelo/vermelho)
   - Objetivo: 🎯 [label]
   - Restrições: ⚠️ tags vermelhas
   - Observações: texto em card cinza (se houver)

2. **Ações (se status = pendente)**
   - ✅ Aceitar Solicitação (verde, full width)
   - ❌ Recusar (borda vermelha, full width)
   - Aceitar **não redireciona** → status muda inline para "Em Análise"
   - Recusar **redireciona** → volta ao Dashboard

3. **Área de Parecer (se status = em análise)**
   - Textarea (6 linhas)
   - Placeholder: "Escreva seu parecer nutricional aqui..."
   - Botão "Enviar Parecer" (desabilitado se vazio)
   - Enviar **redireciona** ao Dashboard

4. **Parecer Enviado (se status = concluída)**
   - Card com fundo verde claro (`bg-green-50 border-green-100`)
   - "📝 Parecer Enviado" como heading
   - Texto do feedback completo

**Coluna Direita (md:col-span-2):**

**Galeria de Fotos:**
- Título "📸 Fotos das Refeições" com contador
- Agrupadas por dia (header com data formatada)
- Grid 2 colunas (mobile) / 3 colunas (desktop)
- Cards clicáveis com:
  - Foto da refeição (cover, h-32)
  - Ícone + tipo de refeição
  - Horário

**Lightbox:**
- Clique em qualquer foto abre overlay fullscreen (`fixed inset-0 z-50`)
- Fundo preto 80% opacidade (`bg-black/80`)
- Foto centralizada (`object-contain max-w-full max-h-full`)
- Clique fora fecha (sem botão X explícito)

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

--- (alternativo) ---

PENDING
  ↓ [Nutricionista recusa]
  ↓
REJECTED → redireciona ao Dashboard
```

### Cores dos Status

- **Pendente** → Amarelo (bg-yellow-100, text-yellow-800)
- **Em Análise** → Azul (bg-blue-100, text-blue-800)
- **Concluída** → Verde (bg-green-100, text-green-800)
- **Recusada** → Vermelho (bg-red-100, text-red-800)

---

## 🔓 Fluxo 9: Logout

### Jornada (Paciente)

```
Perfil (/app/profile)
  ↓ [Scroll até o final da página]
  ↓ [Clica "Sair da Conta" (botão vermelho)]
  ↓
AppContext.logout()
  ↓ [Limpa currentUser e localStorage]
  ↓
Landing Page (/)
```

### Jornada (Nutricionista — Desktop)

```
Sidebar (qualquer página /nutri/*)
  ↓ [Clica "🚪 Sair" na parte inferior da sidebar]
  ↓
AppContext.logout() → Landing Page (/)
```

### Jornada (Nutricionista — Mobile)

```
Bottom Nav (qualquer página /nutri/*)
  ↓ [Clica "🚪 Sair" no bottom nav]
  ↓
AppContext.logout() → Landing Page (/)
```

### Comportamento

- Chama `logout()` do AppContext
- Remove `"nutri-user"` do `localStorage`
- Define `currentUser = null`
- Redireciona para `/`

---

## 📖 Fluxo 10: Paciente - Visualizar Parecer da Avaliação

### Jornada

```
Minhas Avaliações (/app/evaluations)
  ↓ [Visualiza card de avaliação com status "Concluída"]
  ↓
Feedback visível inline (não abre nova página)
```

### Detalhamento

- Na lista de avaliações, cada card mostra:
  - Avatar da nutricionista (ou ícone placeholder se `nutritionistId === null`)
  - Nome da nutricionista (ou "Qualquer nutricionista")
  - Período e quantidade de fotos
  - Badge de status colorido
  - Miniatura de até **6 fotos** + contador "+X" (se houver mais)
- Se `status === "completed"`:
  - Card expandido com fundo verde claro
  - Título "📝 Parecer da Nutricionista"
  - Texto completo do feedback

> **Nota:** O paciente não abre uma página de detalhe — o feedback é exibido inline no card da avaliação.

---

## 🚫 Fluxo 11: Nutricionista - Recusar Solicitação

### Jornada

```
Detalhe da Solicitação (/nutri/request/:id)
  ↓ [Status = Pendente]
  ↓ [Clica "❌ Recusar"]
  ↓
AppContext.rejectEvaluation(id)
  ↓ [Status → "rejected"]
  ↓
Dashboard (/nutri/dashboard)
```

### Comportamento

- Muda `status` da avaliação para `"rejected"`
- Redireciona ao Dashboard via `navigate("/nutri/dashboard")`
- Avaliação aparece com badge vermelho "Recusada" no Dashboard
- Paciente vê o status "Recusada" na lista de avaliações

---

## 🔄 Fluxo 12: Persistência de Sessão

### Jornada

```
Usuário faz login (qualquer perfil)
  ↓
AppContext salva currentUser em localStorage ("nutri-user")
  ↓
[Usuário fecha o navegador / recarrega a página]
  ↓
AppContext carrega currentUser do localStorage
  ↓
Sessão restaurada (usuário continua logado)
```

### Limitações

- Apenas `currentUser` persiste (nome, email, role, avatar)
- **Meals, evaluations, healthProfile NÃO persistem** → voltam aos dados mockados originais
- Não há sincronização entre abas do navegador

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
- Toasts para ações com duração variável:
  - Timeline (refeição registrada): 2.5s
  - Perfil (atualizado): 2.0s
- Loading states (futuro)
- Empty states com ícone grande + texto descritivo
- Transições suaves (Tailwind default ~150ms)
- Active states (scale-[0.98]) em botões
- Animação `slideUp` no modal de edição
