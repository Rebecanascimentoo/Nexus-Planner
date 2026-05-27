import { useState, useMemo } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import useTasksStore from '../../store/tasksStore'
import useDashboardStore from '../../store/dashboardStore'
import CalendarHeader from '../../components/calendar/CalendarHeader'
import CalendarGrid from '../../components/calendar/CalendarGrid'
import { formatRelative } from '../../utils/date'

export default function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTasks, setSelectedTasks] = useState([])
  const [selectedEvents, setSelectedEvents] = useState([])

  const tasks = useTasksStore((s) => s.tasks)
  const events = useDashboardStore((s) => s.upcomingEvents)

  const eventsWithDate = useMemo(() => events.map((ev) => {
    const d = new Date()
    const daysMap = { Hoje: 0, Amanhã: 1 }
    if (ev.day === 'Hoje') return { ...ev, date: d.toISOString().split('T')[0] }
    if (ev.day === 'Amanhã') {
      const dd = new Date(d)
      dd.setDate(dd.getDate() + 1)
      return { ...ev, date: dd.toISOString().split('T')[0] }
    }
    const parts = ev.day.replace(',', '').split(' ')
    if (parts.length >= 2) {
      const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
      const mIdx = monthNames.findIndex((m) => parts[1]?.toLowerCase().startsWith(m))
      if (mIdx >= 0) {
        const dayNum = parseInt(parts[0])
        const dd = new Date()
        dd.setMonth(mIdx)
        dd.setDate(dayNum)
        return { ...ev, date: dd.toISOString().split('T')[0] }
      }
    }
    return { ...ev, date: d.toISOString().split('T')[0] }
  }), [events])

  function handlePrev() {
    if (month === 0) { setYear(year - 1); setMonth(11) }
    else setMonth(month - 1)
  }

  function handleNext() {
    if (month === 11) { setYear(year + 1); setMonth(0) }
    else setMonth(month + 1)
  }

  function handleDayClick(dateStr, dayTasks, dayEvents) {
    setSelectedDate(dateStr)
    setSelectedTasks(dayTasks)
    setSelectedEvents(dayEvents)
  }

  const d = new Date(year, month)
  const monthName = d.toLocaleDateString('pt-BR', { month: 'long' })

  return (
    <div className="min-h-screen bg-dark-bg p-4 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <CalendarIcon size={20} className="text-accent" />
        <div>
          <h1 className="text-xl font-bold text-white">Calendário</h1>
          <p className="text-xs text-text-secondary mt-0.5 capitalize">{monthName} {year}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <CalendarHeader
            year={year}
            month={month}
            onPrev={handlePrev}
            onNext={handleNext}
          />
          <CalendarGrid
            year={year}
            month={month}
            tasks={tasks}
            events={eventsWithDate}
            onDayClick={handleDayClick}
          />
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">
            {selectedDate
              ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
              : 'Selecione um dia'}
          </h2>

          {!selectedDate && (
            <p className="text-sm text-white/40">Clique em um dia no calendário para ver detalhes.</p>
          )}

          {selectedTasks.length === 0 && selectedEvents.length === 0 && selectedDate && (
            <p className="text-sm text-white/40">Nenhum evento ou tarefa neste dia.</p>
          )}

          {selectedTasks.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Tarefas ({selectedTasks.length})
              </h3>
              <div className="space-y-1.5">
                {selectedTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      t.completed
                        ? 'bg-white/[0.03] text-white/40 line-through'
                        : 'bg-white/[0.05] text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        t.completed ? 'bg-[#10b981]' : 'bg-[#6366f1]'
                      }`} />
                      {t.title}
                    </div>
                    {t.dueDate && (
                      <span className="text-[11px] text-white/40 mt-0.5 block">
                        {formatRelative(t.dueDate)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedEvents.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Eventos ({selectedEvents.length})
              </h3>
              <div className="space-y-1.5">
                {selectedEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.05]">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ev.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{ev.title}</p>
                      <p className="text-[11px] text-white/40">{ev.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
