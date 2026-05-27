import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Calendar,
  Wallet,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import nexusLogo from '../../assets/nexuslogo.png'

const iconMap = {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Calendar,
  Wallet,
  Bell,
  Settings,
}

const links = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Tarefas', path: '/tasks', icon: 'CheckSquare' },
  { label: 'Hábitos', path: '/habits', icon: 'Flame' },
  { label: 'Calendário', path: '/calendar', icon: 'Calendar' },
  { label: 'Finanças', path: '/finance', icon: 'Wallet' },
  { label: 'Notificações', path: '/notifications', icon: 'Bell' },
  { label: 'Configurações', path: '/settings', icon: 'Settings' },
]

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen glass-sidebar flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
        <img src={nexusLogo} alt="" className="w-8 h-8 object-contain" />
        <span className="text-lg font-bold text-white tracking-tight">
          Nexus<span className="text-[#6a4cff]">.</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ label, path, icon }) => {
          const Icon = iconMap[icon]
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#6a4cff]/15 text-[#6a4cff] border border-[#6a4cff]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`
              }
            >
              {Icon && <Icon size={18} />}
              {label}
            </NavLink>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#6a4cff]/20 flex items-center justify-center text-xs font-bold text-[#6a4cff]">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-white/50 truncate">{user?.email || ''}</p>
          </div>
          <button
            onClick={logout}
            className="text-white/40 hover:text-[#ef4444] transition-colors"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
