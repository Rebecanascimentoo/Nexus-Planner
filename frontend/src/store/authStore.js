import { create } from 'zustand'

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,

  login: (email, _password) => {
    /* Autenticação simulada — sem backend ainda.
       Define usuário fixo e marca como autenticado. */
    set({
      isAuthenticated: true,
      user: { name: 'Paulo', email },
    })
  },

  logout: () => {
    set({ isAuthenticated: false, user: null })
  },
}))

export default useAuthStore
