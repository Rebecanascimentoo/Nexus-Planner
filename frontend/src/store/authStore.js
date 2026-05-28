import { create } from 'zustand'

/* Store de autenticação mockada — controla estado de login no frontend.
   Sem backend ainda; login apenas define um usuário fixo. */
const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,

  /* Simula autenticação — armazena nome fixo + email informado.
     O _password é ignorado; futuramente será validado contra backend. */
  login: (email, _password) => {
    set({
      isAuthenticated: true,
      user: { name: 'Paulo', email },
    })
  },

  /* Limpa sessão local. Não invalida token externo. */
  logout: () => {
    set({ isAuthenticated: false, user: null })
  },
}))

export default useAuthStore
