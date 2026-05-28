// Componente raiz da aplicacao. Define as rotas publicas e protegidas,
// inicializa o tema e renderiza o container de toasts globais.

import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useThemeStore from './store/themeStore'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import HomePage from './pages/dashboard/HomePage'
import ToastContainer from './components/Toast'

// Lazy loading — cada pagina so carrega quando a rota e acessada
const TasksPage = lazy(() => import('./pages/tasks/TasksPage'))
const HabitsPage = lazy(() => import('./pages/habits/HabitsPage'))
const CalendarPage = lazy(() => import('./pages/calendar/CalendarPage'))
const FinancePage = lazy(() => import('./pages/finance/FinancePage'))
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'))
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage'))

// Wrapper que exibe um spinner enquanto a pagina lazy carrega
function Lazy({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export default function App() {
  // Le o tema salvo (localStorage) e aplica na inicializacao
  useEffect(() => {
    useThemeStore.getState().initTheme()
  }, [])

  return (
    <>
      <ToastContainer />
      <Routes>
      {/* Public — landing, login, cadastro, recuperar senha */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected — Autenticacao obrigatoria. Renderiza Sidebar + Topbar ao redor */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/tasks" element={<Lazy><TasksPage /></Lazy>} />
        <Route path="/habits" element={<Lazy><HabitsPage /></Lazy>} />
        <Route path="/calendar" element={<Lazy><CalendarPage /></Lazy>} />
        <Route path="/finance" element={<Lazy><FinancePage /></Lazy>} />
        <Route path="/settings" element={<Lazy><SettingsPage /></Lazy>} />
        <Route path="/notifications" element={<Lazy><NotificationsPage /></Lazy>} />
      </Route>

      {/* Rota curinga — redireciona para a landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}
