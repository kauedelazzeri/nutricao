# Guia de Configuração do Cloudinary

Este guia mostra passo a passo como configurar o Cloudinary para upload de imagens de refeições.

## 📋 Pré-requisitos

- Conta gratuita no Cloudinary (25GB storage, 25GB bandwidth/mês)

---

## 🚀 Passo 1: Criar Conta Cloudinary

1. Acesse [cloudinary.com](https://cloudinary.com/)
2. Clique em **Sign Up**
3. Escolha o plano **Free** (suficiente para começar)
4. Preencha os dados e confirme email

---

## 🔑 Passo 2: Coletar Cloud Name

Após login:

1. Você será redirecionado para o **Dashboard**
2. No topo, você verá:
   ```
   Cloud name: [seu-cloud-name]
   ```
3. **Copie esse valor** - você vai precisar dele

Exemplo: Se o Cloud Name é `nutricao-app`, sua variável será:
```env
VITE_CLOUDINARY_CLOUD_NAME=nutricao-app
```

---

## ⚙️ Passo 3: Criar Upload Preset

### 3.1 Acessar Configurações

1. No menu lateral esquerdo, clique no **ícone de engrenagem** (⚙️)
2. Ou acesse diretamente: `https://console.cloudinary.com/settings/upload`

### 3.2 Criar Novo Preset

1. Vá na aba **Upload** (menu superior)
2. Role até a seção **Upload presets**
3. Clique em **Add upload preset**

### 3.3 Configurar Preset

Preencha os seguintes campos:

#### Básico
| Campo | Valor | Descrição |
|-------|-------|-----------|
| **Preset name** | `nutricao_meals` | Nome do preset (use _ no lugar de espaços) |
| **Signing Mode** | **Unsigned** | ⚠️ IMPORTANTE: Deve ser Unsigned para funcionar no frontend |
| **Folder** | `nutricao-app/meals` | Pasta onde imagens serão salvas |

#### Transformações (Opcional mas Recomendado)

Role até a seção **Edit** → **Transformations**:

1. Clique em **Add transformation**
2. Configure:
   - **Resize mode**: `Limit` (mantém aspect ratio)
   - **Width**: `1200` (largura máxima)
   - **Height**: `1200` (altura máxima)
   - **Quality**: `auto:good` (compressão automática)
   - **Format**: `auto` (formato otimizado automaticamente)

Isso garante que fotos grandes sejam redimensionadas automaticamente.

#### Configurações Adicionais (Opcional)

- **Unique filename**: Marcar ✅ (evita conflitos de nome)
- **Overwrite**: Desmarcar ❌ (não sobrescrever arquivos)
- **Use filename as Public ID**: Desmarcar ❌

### 3.4 Salvar Preset

1. Role até o final
2. Clique em **Save**
3. Você verá o preset listado com o nome `nutricao_meals`

---

## 📝 Passo 4: Configurar Variáveis de Ambiente

### 4.1 Localmente (.env.local)

Edite seu arquivo `.env.local`:

```env
VITE_CLOUDINARY_CLOUD_NAME=seu-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=nutricao_meals
```

**Exemplo real**:
```env
VITE_CLOUDINARY_CLOUD_NAME=nutricao-app
VITE_CLOUDINARY_UPLOAD_PRESET=nutricao_meals
```

### 4.2 No Vercel

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione:

| Name | Value | Environments |
|------|-------|--------------|
| `VITE_CLOUDINARY_CLOUD_NAME` | `seu-cloud-name` | Production, Preview, Development |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `nutricao_meals` | Production, Preview, Development |

5. Redeploy após adicionar as variáveis

---

## 🧪 Passo 5: Testar Upload

### Teste Manual via Browser

1. Abra DevTools (F12)
2. Cole no Console:

```javascript
const formData = new FormData();
formData.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
formData.append('upload_preset', 'nutricao_meals');

fetch('https://api.cloudinary.com/v1_1/SEU-CLOUD-NAME/image/upload', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(data => console.log('Upload success:', data))
.catch(err => console.error('Upload failed:', err));
```

**Substitua `SEU-CLOUD-NAME`** pelo seu Cloud Name real.

Se funcionar, você verá no console:
```javascript
{
  public_id: "nutricao-app/meals/abc123",
  secure_url: "https://res.cloudinary.com/...",
  width: 1,
  height: 1,
  format: "png"
}
```

### Teste via App

1. Reinicie o servidor local:
   ```bash
   npm run dev
   ```

2. No app, tente registrar uma refeição com foto
3. Verifique no Cloudinary Dashboard → **Media Library** se a foto aparece na pasta `nutricao-app/meals`

---

## 🔐 Segurança

### ⚠️ Por que "Unsigned"?

- **Unsigned presets** permitem upload direto do browser sem backend
- É seguro porque:
  - Só aceita uploads para a pasta especificada (`nutricao-app/meals`)
  - Não permite deletar ou modificar outras imagens
  - Transformações são pré-definidas no preset

### 🔒 Proteções Recomendadas

Para evitar abuso, configure no Cloudinary:

1. **Settings** → **Security** → **Allowed fetch domains**
   - Adicione: `seu-dominio.vercel.app`
   - Isso impede uploads de outros sites

2. **Settings** → **Upload** → **Upload restrictions**
   - Limite de tamanho: `10MB` (padrão já é bom)
   - Formatos permitidos: `jpg, jpeg, png, webp`

---

## 📊 Monitoramento de Uso

### Verificar Quota

1. Dashboard principal: Veja o gráfico de uso
2. **Settings** → **Account** → **Usage**
   - Storage usado
   - Bandwidth usado
   - Transformations usadas

### Plano Free Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/mês
- **Transformations**: 25 credits/mês (muitas transformações)

Para ~1000 fotos de 2MB cada = 2GB (dentro do limite tranquilamente).

---

## 🆘 Troubleshooting

### Erro: "Invalid signature"

**Causa**: Preset está como "Signed" em vez de "Unsigned"

**Solução**:
1. Editar preset
2. Mudar **Signing Mode** para **Unsigned**
3. Salvar

### Erro: "Upload preset not found"

**Causa**: Nome do preset está incorreto

**Solução**:
1. Verificar nome exato no Cloudinary (Settings → Upload → Upload presets)
2. Atualizar variável `VITE_CLOUDINARY_UPLOAD_PRESET` com nome correto

### Erro: "Missing Cloudinary configuration"

**Causa**: Variáveis de ambiente não foram carregadas

**Solução**:
1. Verificar que `.env.local` existe e tem as variáveis
2. Reiniciar servidor de dev: `npm run dev`
3. Limpar cache: `rm -rf node_modules/.vite`

### Upload lento

**Causa**: Imagens muito grandes

**Solução**:
1. Adicionar transformações no preset (resize para 1200x1200)
2. Ou comprimir imagens no client antes de upload (usando `canvas`)

---

## 🎨 Recursos Adicionais

### Cloudinary Widgets (Alternativa)

Se preferir um UI pronto em vez de input file:

```javascript
import { Cloudinary } from '@cloudinary/url-gen';

// Instalar: npm install @cloudinary/react @cloudinary/url-gen

// Usar: https://cloudinary.com/documentation/upload_widget
```

### Otimização de Imagens

O Cloudinary otimiza automaticamente com `f_auto,q_auto`:
- **f_auto**: Converte para WebP/AVIF quando suportado
- **q_auto**: Ajusta qualidade automaticamente

Isso já é aplicado se você configurou `Format: auto` e `Quality: auto:good` no preset.

---

## 📚 Referências

- [Cloudinary Docs - Unsigned Upload](https://cloudinary.com/documentation/upload_images#unsigned_upload)
- [Upload Presets Guide](https://cloudinary.com/documentation/upload_presets)
- [React Integration](https://cloudinary.com/documentation/react_integration)

---

**Última atualização**: 6 de Fevereiro de 2026
