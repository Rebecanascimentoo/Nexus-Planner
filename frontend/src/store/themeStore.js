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

  const accent = customAccent || '#6a4cff'
  root.style.setProperty('--accent', accent)
  root.style.setProperty('--color-accent', accent)
  root.style.setProperty('--accent-hover', accent)
  root.style.setProperty('--color-accent-hover', accent)
}

const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'dark',
      customAccent: null,

      /* Inicializa tema no mount — chamado por onRehydrateStorage
     e pelo useEffect em App.jsx para garantir consistência. */
  initTheme: () => {
        const { mode, customAccent } = get()
        applyThemeToDoc(mode, customAccent)
      },

      setMode: (mode) => {
        set({ mode })
        applyThemeToDoc(mode, get().customAccent)
      },

      setCustomAccent: (color) => {
        set({ customAccent: color, mode: 'custom' })
        applyThemeToDoc('custom', color)
      },

      resetTheme: () => {
        set({ mode: 'dark', customAccent: null })
        applyThemeToDoc('dark', null)
      },
    }),
    {
      name: 'nexus-theme',
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
