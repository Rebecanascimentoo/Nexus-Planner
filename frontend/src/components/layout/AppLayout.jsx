import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

// Layout raiz do app autenticado: Sidebar + Topbar + área de conteúdo
// Renderiza as rotas filhas via <Outlet /> do React Router
export default function AppLayout() {
  // Estado do drawer lateral no mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen bg-[var(--dark-bg)] overflow-hidden">
      {/* Overlay escuro que fecha o drawer ao clicar fora */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer lateral para mobile (< lg) com transição */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-60 transform transition-transform duration-200 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Sidebar fixa no desktop (>= lg) */}
      <Sidebar />

      {/* Coluna principal: Topbar fixo + conteúdo scrollável */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
