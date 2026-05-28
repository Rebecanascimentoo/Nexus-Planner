# Login Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign LoginPage into 3 parts (left panel, right panel, right overlay) with subtle CSS animations and orbital SVG background.

**Architecture:** Zero new dependencies. Animações via CSS `@keyframes` + Tailwind `--animate-*` theme. Componentes do painel direito substituem o BrandShowcase na LoginPage (sem afetar RegisterPage/ForgotPasswordPage que ainda usam BrandShowcase).

**Tech Stack:** React 19, Tailwind CSS v4, Vite, Lucide React (icons), SVG inline.

---

## File Changes

| File | Action | Responsibility |
|------|--------|----------------|
| `src/index.css` | Modify | Add `@keyframes` + `--animate-*` theme tokens |
| `src/pages/auth/LoginLogo.jsx` | Create | Brand image with fade-in + float animation |
| `src/pages/auth/LoginForm.jsx` | Create | Extracted form (email, password, remember-me, submit) |
| `src/pages/auth/OrbitalBackground.jsx` | Create | SVG orbital circles + radial lines + rotation |
| `src/pages/auth/OverlayLogo.jsx` | Create | Large logo overlay with float + glow-pulse |
| `src/pages/auth/LoginPage.jsx` | Modify | Compose new components, remove BrandShowcase import |

---

### Task 1: Add CSS animations to `index.css`

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add `@keyframes` and `--animate-*` theme tokens**

```css
/* Add after the existing @theme block but before the body rule */

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

Edit the existing `@theme` block to add animation tokens:

```css
@theme {
  /* ... existing tokens ... */

  --animate-fade-in: fade-in 1s ease-out;
  --animate-float: float 4s ease-in-out infinite;
  --animate-glow-pulse: glow-pulse 6s ease-in-out infinite;
  --animate-spin-slow: spin-slow 60s linear infinite;
  --animate-spin-slower: spin-slower 40s linear infinite;
}
```

- [ ] **Step 2: Verify no syntax errors**

Run: `npx tsc --noEmit`
Expected: No errors (or only pre-existing errors unrelated to CSS)

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add CSS animations for login page redesign"
```

---

### Task 2: Create LoginLogo.jsx

**Files:**
- Create: `src/pages/auth/LoginLogo.jsx`

- [ ] **Step 1: Write component**

```jsx
import nexusLogo from '../../assets/nexuslogo.png'

export default function LoginLogo() {
  return (
    <div className="animate-fade-in animate-float mb-8 flex justify-center">
      <img
        src={nexusLogo}
        alt="Nexus Planner"
        className="w-16 h-16 object-contain"
        draggable={false}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create the file with content above**

- [ ] **Step 3: Commit**

```bash
git add src/pages/auth/LoginLogo.jsx
git commit -m "feat: create LoginLogo component with fade-in + float animations"
```

---

### Task 3: Create LoginForm.jsx

**Files:**
- Create: `src/pages/auth/LoginForm.jsx`

- [ ] **Step 1: Write component** (extracted from current LoginPage)

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
    navigate('/dashboard')
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
        Faça login na sua conta
      </h1>
      <p className="text-sm text-[#a0aec0] mb-8">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-[#5a3fff] font-medium hover:text-[#7a62ff] transition-colors hover:underline">
          Cadastre-se
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#a0aec0] font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuário@empresa.com"
            className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3.5 text-white text-sm placeholder-[#4a5568] outline-none focus:border-[#5a3fff] focus:ring-1 focus:ring-[#5a3fff] transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#a0aec0] font-medium">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3.5 text-white text-sm placeholder-[#4a5568] outline-none focus:border-[#5a3fff] focus:ring-1 focus:ring-[#5a3fff] transition-all"
            required
          />
        </div>

        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-dark-border bg-dark-card accent-[#5a3fff] focus:ring-0 cursor-pointer"
            />
            <span className="text-[#a0aec0] group-hover:text-white transition-colors">Lembrar-me</span>
          </label>
          <Link to="/forgot-password" className="text-[#5a3fff] font-medium hover:text-[#7a62ff] transition-colors hover:underline">
            Esqueceu a senha?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-[#5a3fff] text-white font-bold rounded-xl py-3.5 text-sm hover:bg-[#4932d9] active:scale-[0.99] transition-all shadow-xl shadow-[#5a3fff]/10 cursor-pointer mt-2"
        >
          Entrar
        </button>
      </form>
    </>
  )
}
```

Note: Changed hardcoded `bg-[#111726]` and `border-[#1d263b]` to use theme aliases `bg-dark-card` and `border-dark-border` for consistency with `index.css` theme tokens.

- [ ] **Step 2: Create the file with content above**

- [ ] **Step 3: Commit**

```bash
git add src/pages/auth/LoginForm.jsx
git commit -m "feat: extract LoginForm component from LoginPage"
```

---

### Task 4: Create OrbitalBackground.jsx

**Files:**
- Create: `src/pages/auth/OrbitalBackground.jsx`

- [ ] **Step 1: Write component**

```jsx
export default function OrbitalBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full max-w-[700px] max-h-[700px]"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="orbitGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5a3fff" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#3182ce" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#5a3fff" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3182ce" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#5a3fff" stopOpacity="0.20" />
          </linearGradient>
        </defs>

        {/* Círculo externo — rotação horária lenta (60s) */}
        <g className="animate-spin-slow" style={{ transformOrigin: '300px 300px' }}>
          <circle cx="300" cy="300" r="220" stroke="url(#orbitGrad1)" strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />
        </g>

        {/* Círculo médio — rotação anti-horária (40s) */}
        <g className="animate-spin-slower" style={{ transformOrigin: '300px 300px' }}>
          <circle cx="300" cy="300" r="140" stroke="url(#orbitGrad2)" strokeWidth="0.8" strokeDasharray="2 6" opacity="0.4" />
          {/* Linhas radiais */}
          <line x1="300" y1="160" x2="300" y2="440" stroke="url(#orbitGrad1)" strokeWidth="0.5" opacity="0.3" />
          <line x1="160" y1="300" x2="440" y2="300" stroke="url(#orbitGrad1)" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* Círculo interno — rotação horária (30s) */}
        <g className="animate-spin-slow" style={{ transformOrigin: '300px 300px', animationDuration: '30s' }}>
          <circle cx="300" cy="300" r="70" stroke="url(#orbitGrad2)" strokeWidth="0.6" strokeDasharray="3 5" opacity="0.3" />
        </g>
      </svg>
    </div>
  )
}
```

Note: The inner circle uses `style={{ animationDuration: '30s' }}` to override the default 60s from the `animate-spin-slow` class, giving it a different speed while reusing the same keyframe.

- [ ] **Step 2: Create the file with content above**

- [ ] **Step 3: Commit**

```bash
git add src/pages/auth/OrbitalBackground.jsx
git commit -m "feat: create OrbitalBackground SVG component with concentric rotating circles"
```

---

### Task 5: Create OverlayLogo.jsx

**Files:**
- Create: `src/pages/auth/OverlayLogo.jsx`

- [ ] **Step 1: Write component**

```jsx
import nexusLogo from '../../assets/nexuslogo.png'

export default function OverlayLogo() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <img
        src={nexusLogo}
        alt=""
        className="animate-glow-pulse w-52 h-52 md:w-60 md:h-60 object-contain select-none"
        draggable={false}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create the file with content above**

- [ ] **Step 3: Commit**

```bash
git add src/pages/auth/OverlayLogo.jsx
git commit -m "feat: create OverlayLogo component with glow-pulse animation"
```

---

### Task 6: Refactor LoginPage.jsx

**Files:**
- Modify: `src/pages/auth/LoginPage.jsx`

- [ ] **Step 1: Rewrite LoginPage to compose new components**

```jsx
import LoginLogo from './LoginLogo'
import LoginForm from './LoginForm'
import OrbitalBackground from './OrbitalBackground'
import OverlayLogo from './OverlayLogo'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen bg-dark-bg select-none overflow-hidden">
      {/* Painel Esquerdo (1/3): Logo + Formulário */}
      <div className="w-full lg:w-1/3 flex items-center justify-center px-8 lg:px-12 z-20">
        <div className="w-full max-w-[380px]">
          <LoginLogo />
          <LoginForm />
        </div>
      </div>

      {/* Painel Direito (2/3): Orbital Background + Overlay Logo */}
      <div className="hidden lg:flex flex-1 bg-[#0c1020] relative items-center justify-center border-l border-dark-border overflow-hidden">
        <OrbitalBackground />
        <OverlayLogo />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Apply the edit** (replace entire file content)

- [ ] **Step 3: Verify the app compiles**

Run: `npx tsc --noEmit`
Expected: No errors

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/pages/auth/LoginPage.jsx
git commit -m "feat: refactor LoginPage with new 3-panel layout"
```

---

## Execution

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** — Execute tasks in this session with checkpoints

Which approach do you prefer?
