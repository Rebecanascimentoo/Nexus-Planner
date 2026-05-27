import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, AlertTriangle, Clock, Flame, CheckCircle } from 'lucide-react'
import useTasksStore from '../../store/tasksStore'
import useHabitsStore from '../../store/habitsStore'
import useReminderStore from '../../store/reminderStore'
import Button from '../../components/ui/Button'

const severityConfig = {
  high: { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'Alta' },
  medium: { icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Média' },
  low: { icon: Flame, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', label: 'Baixa' },
}

export default function NotificationsPage() {
  const tasks = useTasksStore((s) => s.tasks)
  const habits = useHabitsStore((s) => s.habits)
  const getAll = useReminderStore((s) => s.getAll)
  const navigate = useNavigate()

  const reminders = useMemo(() => getAll(tasks, habits), [tasks, habits, getAll])

  const total = reminders.length
  const high = reminders.filter((r) => r.severity === 'high').length

  return (
    <div className="min-h-screen bg-dark-bg p-4 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Bell size={20} className="text-accent" />
        <div>
          <h1 className="text-xl font-bold text-white">Notificações</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {total} notificação{total !== 1 ? 'ões' : ''}
            {high > 0 && ` · ${high} prioritária${high !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-card border border-dark-border/50 flex items-center justify-center mb-4">
            <CheckCircle size={28} className="text-[#10b981]" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Tudo em dia!</h3>
          <p className="text-sm text-text-secondary mb-6 max-w-xs">
            Nenhuma notificação pendente. Você está com tudo em ordem.
          </p>
          <Button variant="ghost" onClick={() => navigate('/tasks')}>
            Ver tarefas
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {reminders.map((r) => {
            const cfg = severityConfig[r.severity]
            const Icon = cfg.icon
            return (
              <div
                key={r.id}
                className="glass-card rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:bg-white/[0.08] transition-all"
                onClick={() => {
                  if (r.taskId) navigate('/tasks')
                  else if (r.habitId) navigate('/habits')
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <Icon size={16} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{r.title}</p>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ color: cfg.color, backgroundColor: cfg.bg }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{r.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
