import { create } from 'zustand'
import { DEFAULT_TOAST_DURATION } from '../constants'

const useNotificationStore = create((set, get) => ({
  toasts: [],

  addToast: (message, type = 'success', duration = DEFAULT_TOAST_DURATION) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },

  success: (msg) => get().addToast(msg, 'success'),
  error: (msg) => get().addToast(msg, 'error'),
  info: (msg) => get().addToast(msg, 'info'),

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export default useNotificationStore
