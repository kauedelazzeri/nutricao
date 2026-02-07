# Guia de Desenvolvimento - NutriSnap

## 🚀 Quick Start

### Pré-requisitos

- **Node.js:** 18+ (recomendado: 20 LTS)
- **npm:** 9+
- **Git:** Qualquer versão recente
- **Editor:** VS Code (recomendado)

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd nutricao

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse no navegador
http://localhost:5173
```

---

## 📦 Scripts Disponíveis

### `npm run dev`
Inicia o servidor de desenvolvimento com hot reload.
- Porta padrão: `5173`
- HMR (Hot Module Replacement) ativado
- TypeScript checking em tempo real

### `npm run build`
Compila o projeto para produção.
- Output: `build/` directory
- Minificação e otimização automáticas
- Type checking antes do build

### `npm run start`
Serve o build de produção (após `npm run build`).
- Útil para testar build local

### `npm run typecheck`
Executa o TypeScript compiler em modo check-only.
- Não gera arquivos
- Útil para CI/CD

---

## 🏗️ Estrutura do Projeto

```
nutricao/
├── app/                      # Código-fonte principal
│   ├── modules/              # Módulos por feature
│   │   ├── auth/            # Login + Landing page
│   │   ├── patient/         # Paciente (mobile-first)
│   │   └── nutritionist/    # Nutricionista (desktop-first)
│   ├── shared/              # Compartilhado
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # React Context (estado global)
│   │   ├── mocks/           # Dados mockados
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Funções utilitárias
│   ├── app.css              # Estilos globais + Tailwind
│   ├── root.tsx             # Root component + providers
│   └── routes.ts            # Definição de rotas
├── docs/                     # Documentação (esta pasta)
├── public/                   # Assets estáticos
├── node_modules/            # Dependências (git ignored)
├── package.json             # Metadados e scripts
├── tsconfig.json            # Config TypeScript
├── vite.config.ts           # Config Vite
└── react-router.config.ts   # Config React Router v7
```

---

## 🛠️ Tecnologias

### Core

- **React 19.2.4** — UI library
- **TypeScript 5.9.2** — Type safety
- **Vite 7.1.7** — Build tool
- **React Router 7.12.0** — Roteamento (SPA mode)

### Styling

- **Tailwind CSS 4.1.13** — Utility-first CSS
- **@tailwindcss/vite** — Plugin Vite
- **Inter (Google Fonts)** — Tipografia

### Development

- **@react-router/dev** — Dev tools
- **vite-tsconfig-paths** — Path mapping
- **TypeScript ESLint** (futuro)

---

## 📁 Convenções de Arquivos

### Naming

- **Componentes:** PascalCase (`TimelinePage.tsx`, `BottomTabBar.tsx`)
- **Utilitários:** camelCase (`mealClassifier.ts`, `data.ts`)
- **Types:** index.ts ou feature.types.ts
- **Estilos:** kebab-case (app.css)

### Organização

```
modules/
  feature/
    layouts/
      FeatureLayout.tsx
    pages/
      PageName.tsx
    components/
      ComponentName.tsx (específicos do módulo)
```

### Imports

Use path aliases (`~/*`):
```tsx
import { useApp } from "~/shared/contexts/AppContext";
import { MEAL_TYPE_LABELS } from "~/shared/types";
```

---

## 🎨 Tailwind Config

### Custom Theme

Definido em `app.css`:

```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  
  --color-primary: #22c55e;
  --color-primary-dark: #16a34a;
  --color-primary-light: #86efac;
  --color-accent: #f97316;
  --color-surface: #f8fafc;
  --color-surface-dark: #f1f5f9;
}
```

### Breakpoints (padrão)

- `sm:` 640px
- `md:` 768px (mobile/desktop toggle)
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

### Classes Comuns

```css
/* Cards */
.card {
  @apply bg-white rounded-2xl shadow-sm border border-gray-100;
}

/* Botões Primary */
.btn-primary {
  @apply bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-3 
         font-medium transition-colors active:scale-[0.98];
}

/* Bottom Tab Active */
.tab-active {
  @apply text-green-600;
}
```

---

## 🧪 Testando o Protótipo

### Cenário 1: Paciente Completo

1. Acesse `/`
2. Clique em "Entrar com Google"
3. Redireciona para `/app/timeline`
4. **Timeline vazia inicialmente**
5. Clique no FAB 📸
6. Selecione uma imagem
7. Toast: "✅ Refeição registrada!"
8. Card aparece na timeline
9. Clique no card → modal de edição abre
10. Altere tipo, data, hora, observações
11. Salve → card atualizado
12. Vá para "Avaliações" (tab bar)
13. Clique "+ Nova"
14. Wizard de 3 steps:
    - Selecione 7 dias
    - Selecione Dra. Mariana
    - Confirme (veja banner GRÁTIS)
15. Solicitação criada com status "Pendente"
16. Vá para "Perfil"
17. Clique "Editar"
18. Altere peso, objetivo
19. Salve → IMC recalculado

### Cenário 2: Nutricionista

1. Acesse `/`
2. Clique em "Sou Nutricionista"
3. Redireciona para `/nutri/dashboard`
4. **Dashboard exibe:**
   - 2 Novas solicitações
   - 1 Em Análise
   - 1 Concluída
5. Clique em uma solicitação "Pendente"
6. Visualize dados do paciente + fotos
7. Clique em foto → lightbox abre
8. Clique "✅ Aceitar Solicitação"
9. Status muda para "Em Análise"
10. Textarea aparece
11. Escreva parecer: "Sua alimentação está ótima..."
12. Clique "Enviar Parecer"
13. Status → "Concluída"
14. Redireciona ao Dashboard

---

## 🐛 Debugging

### Erros Comuns

#### 1. "useApp must be used within AppProvider"

**Causa:** Componente tentou usar `useApp()` fora do `<AppProvider>`

**Solução:** Verifique que o componente está dentro da árvore do `root.tsx`

---

#### 2. "Cannot read property 'filter' of undefined"

**Causa:** `meals` ou `evaluations` não inicializados

**Solução:** Adicione optional chaining:
```tsx
const userMeals = meals?.filter(...) ?? [];
```

---

#### 3. Hot reload não funciona

**Causa:** File watcher atingiu limite (Linux)

**Solução:**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

#### 4. Build falha com TypeScript errors

**Causa:** Type errors não capturados em dev

**Solução:** Execute `npm run typecheck` antes de buildar

---

### DevTools

#### React DevTools

Instale a extensão do navegador:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Firefox](https://addons.mozilla.org/firefox/addon/react-devtools/)

**Uso:**
- Inspecione componentes
- Veja props e state
- Trace rerenders

#### Vite DevTools

Integrado ao browser console:
- Hot reload logs
- Module graph
- Performance metrics

---

## 🔧 Configuração Avançada

### Adicionar Nova Rota

1. Crie a página em `app/modules/[feature]/pages/`
2. Adicione ao `app/routes.ts`:

```typescript
import { route } from "@react-router/dev/routes";

export default [
  // ...
  route("nova-rota", "modules/feature/pages/NovaPage.tsx"),
];
```

3. Acesse `/nova-rota`

---

### Adicionar Novo Tipo

1. Edite `app/shared/types/index.ts`:

```typescript
export interface NewType {
  id: string;
  name: string;
}

export const NEW_TYPE_LABELS: Record<string, string> = {
  type1: "Tipo 1",
  type2: "Tipo 2",
};
```

2. Use em componentes:

```tsx
import type { NewType } from "~/shared/types";
import { NEW_TYPE_LABELS } from "~/shared/types";
```

---

### Adicionar Dados Mockados

1. Edite `app/shared/mocks/data.ts`:

```typescript
export const mockNewData: NewType[] = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
];
```

2. Exporte e use no contexto ou componentes

---

### Adicionar Função ao Context

1. Edite `app/shared/contexts/AppContext.tsx`:

```typescript
interface AppState {
  // ...
  newFunction: (param: string) => void;
}

// No AppProvider:
const newFunction = useCallback((param: string) => {
  // lógica aqui
}, []);

// No value do Provider:
return (
  <AppContext.Provider
    value={{
      // ...
      newFunction,
    }}
  >
    {children}
  </AppContext.Provider>
);
```

2. Use em componentes:

```tsx
const { newFunction } = useApp();
newFunction("test");
```

---

## 📱 Testando em Mobile (PWA)

### Local Network

1. No terminal, após `npm run dev`:
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.XXX:5173/
   ```

2. Acesse o IP da Network no celular (mesma rede Wi-Fi)

### Simulando Mobile no Desktop

**Chrome DevTools:**
1. F12 → Toggle Device Toolbar
2. Selecione dispositivo (iPhone, Pixel, etc.)
3. Teste gestos, viewport, etc.

**Responsivo:**
- Desktop: ≥768px (sidebar para nutricionista)
- Mobile: <768px (bottom nav)

---

## 🚢 Deploy (Futuro)

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload pasta build/ via Netlify dashboard
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3000
```

---

## 🔍 Code Quality

### TypeScript

- **Strict mode:** Ativado
- **No implicit any:** Ativado
- **Unused locals:** Warning

**Boas práticas:**
- Sempre tipifique props e state
- Use interfaces para objetos
- Use type para unions/primitives

### Componentes

**Boas práticas:**
- Um componente por arquivo
- Props tipificadas
- Default exports para páginas
- Named exports para componentes compartilhados

### Performance

- Use `useMemo` para computações caras
- Use `useCallback` para funções passadas como props
- Evite criar funções inline em JSX
- Use `React.memo` para componentes pesados (futuro)

---

## 📚 Recursos

### Documentação Oficial

- [React 19](https://react.dev/)
- [React Router v7](https://reactrouter.com/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Ferramentas

- [Figma](https://figma.com) — Design (futuro)
- [Excalidraw](https://excalidraw.com) — Diagramas
- [Unsplash](https://unsplash.com) — Fotos placeholder

### Comunidade

- [React Router Discord](https://rmx.as/discord)
- [Tailwind Discord](https://tailwindcss.com/discord)

---

## 💡 Dicas

### Produtividade

1. **Use snippets do VS Code** para criar componentes rapidamente
2. **Ative Tailwind IntelliSense** (extensão do VS Code)
3. **Configure Prettier** para formatação automática
4. **Use Git hooks** (Husky) para type checking antes de commit

### Debugging

1. **Console logs estratégicos** nos useEffects
2. **React DevTools** para inspecionar rerenders
3. **Network tab** para verificar carregamento de imagens
4. **localStorage** para verificar dados persistidos

### Performance

1. **Lazy loading** de rotas (futuro com React.lazy)
2. **Image optimization** (futuro com next/image ou similar)
3. **Code splitting** automático do Vite

---

## 🎯 Próximos Passos

Ver [roadmap.md](./roadmap.md) para lista completa de features futuras.
