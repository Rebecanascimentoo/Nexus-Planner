import { create } from 'zustand'
import { DEFAULT_TOAST_DURATION } from '../constants'

/* Store de notificações toast — fila de avisos auto-removíveis.
   Cada toast ganha um id único e some após duration ms. */
const useNotificationStore = create((set, get) => ({
  toasts: [],

  /* Adiciona toast na fila e programa remoção automática.
     O setTimeout é fire-and-forget (não tem cleanup intencional). */
  addToast: (message, type = 'success', duration = DEFAULT_TOAST_DURATION) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },

  /* Atalhos para tipos comuns. */
  success: (msg) => get().addToast(msg, 'success'),
  error: (msg) => get().addToast(msg, 'error'),
  info: (msg) => get().addToast(msg, 'info'),

  /* Remove manual (ex: clique no X do toast). */
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export default useNotificationStore
