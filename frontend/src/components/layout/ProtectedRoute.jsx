import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

// Guard de autenticação: redireciona para /login se o usuário não estiver logado
// Props: { children: ReactNode } — conteúdo protegido renderizado apenas se autenticado
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}
