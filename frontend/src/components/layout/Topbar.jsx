import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Menu } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useTasksStore from '../../store/tasksStore'
import useHabitsStore from '../../store/habitsStore'
import useReminderStore from '../../store/reminderStore'

export default function Topbar({ onToggleSidebar }) {
  const user = useAuthStore((s) => s.user)
  const tasks = useTasksStore((s) => s.tasks)
  const habits = useHabitsStore((s) => s.habits)
  const getCount = useReminderStore((s) => s.getCount)
  const navigate = useNavigate()

  const reminderCount = useMemo(() => getCount(tasks, habits), [tasks, habits, getCount])

  return (
    <header className="glass-topbar flex items-center justify-between h-16 px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-white/60 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar..."
            className="glass-input w-64 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/notifications')}
          className="relative w-9 h-9 rounded-lg glass-input flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
        >
          <Bell size={16} />
          {reminderCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#6a4cff] text-[9px] font-bold text-white flex items-center justify-center">
              {reminderCount > 9 ? '9+' : reminderCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#6a4cff]/20 flex items-center justify-center text-xs font-bold text-[#6a4cff]">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-tight">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-white/50">Online</p>
          </div>
        </div>
      </div>
    </header>
  )
}
