import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* Lê preferência do sistema (claro/escuro).
   Usada como fallback quando mode === 'system'. */
function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/* Aplica tema no DOM: seta data-theme no <html>
   e define variáveis CSS de cor de destaque. */
function applyThemeToDoc(mode, customAccent) {
  const root = document.documentElement
  const isLight =
    mode === 'light' || (mode === 'system' && getSystemTheme() === 'light')

  root.setAttribute('data-theme', isLight ? 'light' : 'dark')

  /* Fallback da accent pra roxo padrão se null. */
  const accent = customAccent || '#6a4cff'
  root.style.setProperty('--accent', accent)
  root.style.setProperty('--color-accent', accent)
  root.style.setProperty('--accent-hover', accent)
  root.style.setProperty('--color-accent-hover', accent)
}

/* Store de tema — modo (claro/escuro/system) + cor de destaque customizada.
   Persistida como 'nexus-theme'. Reaplica no DOM ao reidratar do localStorage.
   NOTA: mode='custom' é definido por setCustomAccent; o theme fica escuro com accent custom. */
const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'dark',
      customAccent: null,

      /* Reaplica o tema salvo no DOM. Chamado automaticamente na reidratação
         via onRehydrateStorage e manualmente no mount do App.jsx. */
      initTheme: () => {
        const { mode, customAccent } = get()
        applyThemeToDoc(mode, customAccent)
      },

      /* Troca modo (dark/light/system) e aplica no DOM imediatamente. */
      setMode: (mode) => {
        set({ mode })
        applyThemeToDoc(mode, get().customAccent)
      },

      /* Define cor de destaque customizada e força mode='custom'.
         'custom' é essencialmente dark com accent diferente. */
      setCustomAccent: (color) => {
        set({ customAccent: color, mode: 'custom' })
        applyThemeToDoc('custom', color)
      },

      /* Volta ao tema escuro padrão com accent roxo. */
      resetTheme: () => {
        set({ mode: 'dark', customAccent: null })
        applyThemeToDoc('dark', null)
      },
    }),
    {
      name: 'nexus-theme',
      /* Garante que o tema seja aplicado ao carregar dados do localStorage,
         antes de qualquer componente renderizar. */
      onRehydrateStorage: () => (state) => {
        state?.initTheme()
      },
    }
  )
)

/* Listener global: detecta mudança de tema do sistema (ex: Windows modo claro/escuro).
   Se mode === 'system', reaplica o tema automaticamente.
   Roda no módulo (não em componente) para estar ativo desde o start. */
let mq = null
if (typeof window !== 'undefined') {
  mq = window.matchMedia('(prefers-color-scheme: light)')
  mq.addEventListener('change', () => {
    const state = useThemeStore.getState()
    if (state.mode === 'system') {
      applyThemeToDoc('system', state.customAccent)
    }
  })
}

export default useThemeStore
