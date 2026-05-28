# Login Page Redesign — Design Document

## 1. Context

Redesign da página de login do Nexus Planner. O layout atual tem duas colunas (formulário à esquerda ~1/3, BrandShowcase à direita ~2/3). O novo design divide a tela em **3 partes**: Painel Esquerdo, Painel Direito e Sobreposição Direita, com animações sutis em CSS puro.

## 2. Layout

### Estrutura Geral

```
┌──────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────────────────────────┐  │
│  │ ESQUERDO │  │          DIREITO              │  │
│  │  w-1/3   │  │        w-2/3                  │  │
│  │          │  │  ┌────────────────────────┐   │  │
│  │ logo.png │  │  │ OrbitalBackground.jsx  │   │  │
│  │ fade-in  │  │  │ SVG círculos           │   │  │
│  │ + float  │  │  │ concêntricos + rotação │   │  │
│  │          │  │  │ lenta (60s/40s)        │   │  │
│  │ form     │  │  └────────────────────────┘   │  │
│  │ email    │  │                                │  │
│  │ senha    │  │  ┌──────────────────────┐      │  │
│  │ btn      │  │  │ OverlayLogo.jsx      │      │  │
│  │ links    │  │  │ logo.png grande      │      │  │
│  └──────────┘  │  │ float + glow pulse   │      │  │
│                │  └──────────────────────┘      │  │
│                └──────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘

Responsivo: < lg → painel direito oculto, login full-width
```

### Distribuição

| Elemento | Proporção | Cor de Fundo |
|----------|-----------|--------------|
| Painel Esquerdo | 1/3 (`w-1/3`) | `bg-dark-bg` (#090b13) |
| Painel Direito | 2/3 (`w-2/3`) | `bg-[#0c1020]` |
| Sobreposição Direita | absolute sobre o direito | transparente |

## 3. Componentes

### LoginPage.jsx
- Container `flex flex-row h-screen`
- Importa os 3 subcomponentes
- `useMediaQuery` ou Tailwind `hidden lg:flex` para ocultar painel direito no mobile

### LeftPanel.jsx
- `w-1/3 lg:w-1/3 w-full h-screen flex flex-col justify-center p-10`
- Em mobile: ocupa 100% da largura

### LoginLogo.jsx
- Renderiza `nexuslogo.png` de `src/assets/nexuslogo.png`
- Tamanho: ~64px (formulário), centralizado acima do form
- Animações: `fade-in` (1s no mount) + `float` (sobe/desce 8px em 4s)
- Classes: `animate-fade-in animate-float`

### LoginForm.jsx
- Conteúdo do formulário atual (email, senha, remember-me, botão, links)
- Sem mudanças funcionais — apenas layout adjustments

### OrbitalBackground.jsx
- SVG que preenche todo o painel direito
- Círculos concêntricos (3-4) com stroke sutil:
  - Círculo externo: raio ~40%, rotação 60s sentido horário
  - Círculo médio: raio ~25%, rotação 45s sentido anti-horário
  - Círculo interno: raio ~12%, rotação 30s sentido horário
- 2-3 linhas radiais finas atravessando os círculos
- Opacidade geral ~0.15-0.20
- Cores: stroke `#5a3fff` (accent) e `#3182ce` (calendário/azul oceano)

### OverlayLogo.jsx
- `absolute inset-0 flex items-center justify-center pointer-events-none`
- `nexuslogo.png` em ~200-240px com opacidade ~0.15
- Animações: `float` lento (6px em 6s) + `glow-pulse`
- Camada atrás do conteúdo (z-index baixo)

## 4. Animações (CSS `@keyframes` em `index.css`)

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes float {
  0%, 100% { transform: translateY(0);     }
  50%      { transform: translateY(-8px);  }
}
@keyframes spin-slow {
  to { transform: rotate(360deg); }
}
@keyframes spin-slower {
  to { transform: rotate(-360deg); }
}
@keyframes glow-pulse {
  0%, 100% { opacity: 0.15; filter: brightness(1);   }
  50%      { opacity: 0.25; filter: brightness(1.3); }
}
```

Classes utilitárias Tailwind customizadas (via `@layer utilities` ou `--animate-*` no `@theme`):

```css
@theme {
  --animate-fade-in: fade-in 1s ease-out;
  --animate-float: float 4s ease-in-out infinite;
  --animate-glow-pulse: glow-pulse 6s ease-in-out infinite;
  --animate-spin-slow: spin-slow 60s linear infinite;
  --animate-spin-slower: spin-slower 40s linear infinite;
}
```

## 5. Cores e Estilo

- Fundo esquerdo: `bg-dark-bg` (#090b13) — padronizado com o restante do app
- Fundo direito: `bg-[#0c1020]` — tom ligeiramente mais claro para contraste sutil
- Traços SVG orbital: `stroke-dark-border` + mix de `#5a3fff` e `#3182ce`
- Overlay logo: glow baseado em `#5a3fff` com opacidade baixa

## 6. Responsividade

| Breakpoint | Comportamento |
|------------|--------------|
| >= lg (1024px) | Layout 3 partes normal |
| < lg | Painel direito oculto, OverlayLogo vira background decorativo no esquerdo (opacidade 0.05 atrás do form) |
| Mobile | Scroll normal, form ocupa viewport inteira |

## 7. Dependências

- **Zero novas dependências** — tudo feito com Tailwind CSS v4 `@keyframes` e SVG inline
- Único asset: `src/assets/nexuslogo.png` (já existe)
