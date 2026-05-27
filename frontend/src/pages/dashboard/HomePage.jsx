import { useMemo } from 'react'
import { TrendingUp, Calendar as CalendarIcon, Flame, Wallet, Plus } from 'lucide-react'
import useTasksStore from '../../store/tasksStore'
import useHabitsStore from '../../store/habitsStore'
import useFinanceStore from '../../store/financeStore'
import { calcStreak } from '../../store/habitsStore'
import MetricCard from '../../components/MetricCard'
import WeeklyChart from '../../components/Charts/WeeklyChart'
import Button from '../../components/ui/Button'
import TaskForm from '../../components/tasks/TaskForm'
import { isToday, isOverdue, formatCurrency, formatRelative } from '../../utils/date'
import { useState } from 'react'

export default function HomePage() {
  const tasks = useTasksStore((s) => s.tasks)
  const toggleComplete = useTasksStore((s) => s.toggleComplete)
  const habits = useHabitsStore((s) => s.habits)
  const getFiltered = useFinanceStore((s) => s.getFiltered)
  const getSummary = useFinanceStore((s) => s.getSummary)

  const todayTasks = useMemo(
    () => tasks.filter((t) => !t.completed && t.dueDate && isToday(t.dueDate)),
    [tasks]
  )
  const urgentTasks = useMemo(
    () => tasks.filter(
      (t) => !t.completed && (t.priority === 'high' || t.priority === 'medium' || (t.dueDate && isOverdue(t.dueDate)))
    ),
    [tasks]
  )
  const doneToday = tasks.filter((t) => t.completed && t.completedAt && isToday(t.completedAt)).length
  const pendingToday = todayTasks.length

  const totalStreak = useMemo(
    () => habits.reduce((sum, h) => Math.max(sum, calcStreak(h.logs)), 0),
    [habits]
  )
  const bestStreak = Math.max(1, totalStreak)

  const financeFiltered = useMemo(() => getFiltered(), [getFiltered])
  const financeSummary = useMemo(() => getSummary(financeFiltered), [financeFiltered, getSummary])

  const weeklyData = useMemo(() => {
    const days = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const completed = tasks.filter((t) => t.completedAt?.startsWith(dateStr)).length
      const dayLabel = d.toLocaleDateString('pt-BR', { weekday: 'short' })
      days.push({ day: dayLabel.replace('.', ''), value: completed })
    }
    return days
  }, [tasks])

  const now = new Date()
  const dayName = now.toLocaleDateString('pt-BR', { weekday: 'long' })
  const dateStr = now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

  const nextEvent = (() => {
    const d = new Date()
    const todayStr = d.toISOString().split('T')[0]
    const dueToday = tasks.find((t) => t.dueDate === todayStr && !t.completed)
    if (dueToday) return { title: dueToday.title, time: formatRelative(dueToday.dueDate), color: '#6a4cff' }
    return { title: 'Nenhum evento', time: '—', color: '#64748b' }
  })()

  const metrics = [
    { id: 1, label: 'Tarefas de Hoje', value: `${doneToday}/${pendingToday}`, icon: 'TrendingUp', iconColor: '#10b981', badge: `${doneToday} FEITAS` },
    { id: 2, label: 'Streak de Hábitos', value: `${bestStreak} Dias`, icon: 'TrendingUp', iconColor: '#f59e0b', badge: bestStreak >= 10 ? 'RECORDE!' : 'ATUAL' },
    { id: 3, label: 'Saldo disponível', value: formatCurrency(financeSummary.balance), icon: 'Wallet', iconColor: '#3b82f6', badge: `↑ ${((financeSummary.income / Math.max(financeSummary.expenses, 1)) * 100).toFixed(0)}% MÊS` },
    { id: 4, label: 'Próximo Evento', value: nextEvent.title, icon: 'Calendar', iconColor: '#ec4899', badge: nextEvent.time },
  ]

  const [showQuickTask, setShowQuickTask] = useState(false)

  return (
    <div className="min-h-screen bg-dark-bg p-4 lg:p-8 space-y-6">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Bem-vindo de volta!
          </h1>
          <p className="text-sm text-text-secondary mt-1 capitalize">
            {dayName}, {dateStr} &mdash;{' '}
            <span className="text-accent font-medium">{urgentTasks.length} tarefas prioritárias</span>
          </p>
        </div>
        <Button className="gap-1.5 flex-shrink-0">
          <Plus size={16} />
          Novo Registro
        </Button>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.id} {...m} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp size={18} className="text-accent" />
              <div>
                <h2 className="text-lg font-semibold text-white">Produtividade Semanal</h2>
                <p className="text-xs text-text-secondary mt-0.5">Tarefas concluídas nos últimos 7 dias</p>
              </div>
            </div>
            <span className="text-xs font-medium text-text-secondary bg-dark-bg px-3 py-1.5 rounded-lg border border-dark-border">
              7 Dias
            </span>
          </div>
          <WeeklyChart data={weeklyData} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Next Events */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-accent" />
                <h2 className="text-base font-semibold text-white">Próximos Eventos</h2>
              </div>
            </div>
            <div className="space-y-3">
              {urgentTasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="w-1 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: t.priority === 'high' ? '#ef4444' : t.priority === 'medium' ? '#f59e0b' : '#6366f1' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{t.title}</p>
                    <p className="text-xs text-text-secondary">{t.category}</p>
                  </div>
                  <span className="text-[11px] text-text-secondary bg-dark-bg px-2 py-1 rounded-md border border-dark-border/50 flex-shrink-0">
                    {t.dueDate ? formatRelative(t.dueDate) : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Habits Streak */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-[#f59e0b]" />
                <h2 className="text-base font-semibold text-white">Hábitos</h2>
              </div>
            </div>
            <div className="space-y-3">
              {habits.slice(0, 4).map((h) => {
                const doneToday = h.logs.includes(new Date().toISOString().split('T')[0])
                const streak = calcStreak(h.logs)
                return (
                  <div key={h.id} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        doneToday ? 'border-[#10b981] bg-[#10b981]/20' : 'border-dark-border'
                      }`}
                    >
                      {doneToday && <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${doneToday ? 'text-white' : 'text-text-secondary'}`}>
                        {h.emoji} {h.name}
                      </p>
                      <p className="text-xs text-text-secondary">{streak} dias consecutivos</p>
                    </div>
                    <span className={`text-xs font-semibold ${doneToday ? 'text-[#10b981]' : 'text-text-muted'}`}>
                      {streak}d
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Tasks */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Tarefas Urgentes</h2>
          </div>
          <div className="space-y-2">
            {urgentTasks.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-dark-bg/50 border border-dark-border/30 text-sm"
              >
                <button
                  onClick={() => toggleComplete(t.id)}
                  className="w-4 h-4 rounded-full border-2 border-dark-border hover:border-accent flex-shrink-0 transition-colors"
                />
                <span className="text-white flex-1 truncate">{t.title}</span>
                <span className="text-[10px] font-semibold text-[#ef4444] bg-[#ef4444]/10 px-1.5 py-0.5 rounded">
                  {t.priority === 'high' ? 'Alta' : t.priority === 'medium' ? 'Média' : 'Normal'}
                </span>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full text-xs gap-1 mt-4"
            onClick={() => setShowQuickTask(true)}
          >
            <Plus size={14} />
            Adicionar tarefa rápida
          </Button>
        </div>

        {/* Finance Summary */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Resumo Financeiro</h2>
            <span className="text-xs text-text-secondary bg-dark-bg px-2 py-1 rounded-md border border-dark-border/50">
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
              <p className="text-xs text-text-secondary mb-1">Receitas</p>
              <p className="text-lg font-bold text-[#10b981]">{formatCurrency(financeSummary.income)}</p>
            </div>
            <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
              <p className="text-xs text-text-secondary mb-1">Despesas</p>
              <p className="text-lg font-bold text-[#ef4444]">{formatCurrency(financeSummary.expenses)}</p>
            </div>
            <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
              <p className="text-xs text-text-secondary mb-1">Saldo</p>
              <p className="text-lg font-bold text-accent">{formatCurrency(financeSummary.balance)}</p>
            </div>
          </div>
          {financeSummary.income > 0 && (
            <div className="mt-4 pt-4 border-t border-dark-border/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Taxa de economia</span>
                <span className="text-white font-semibold">
                  {((financeSummary.balance / financeSummary.income) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-dark-bg overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-accent to-[#00d4bb]"
                  style={{ width: `${Math.min(100, Math.max(0, (financeSummary.balance / financeSummary.income) * 100))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showQuickTask && (
        <TaskForm onClose={() => setShowQuickTask(false)} />
      )}
    </div>
  )
}
