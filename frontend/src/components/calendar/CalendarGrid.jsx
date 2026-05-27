import { getMonthDays } from '../../utils/date'
import DayCell from './DayCell'

const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarGrid({ year, month, tasks, events, onDayClick }) {
  const days = getMonthDays(year, month)
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-white/40 py-2">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isToday = dateStr === todayStr
          const dayTasks = tasks.filter((t) => t.dueDate === dateStr)
          const dayEvents = events.filter((ev) => {
            const ed = new Date(ev.date)
            return ed.getFullYear() === year && ed.getMonth() === month && ed.getDate() === day
          })
          return (
            <DayCell
              key={dateStr}
              day={day}
              isToday={isToday}
              isCurrentMonth={true}
              tasks={dayTasks}
              events={dayEvents}
              onClick={() => onDayClick?.(dateStr, dayTasks, dayEvents)}
            />
          )
        })}
      </div>
    </div>
  )
}
