export default function DayCell({ day, isToday, isCurrentMonth, tasks, events, onClick }) {
  const hasItems = tasks.length > 0 || events.length > 0

  return (
    <button
      onClick={onClick}
      disabled={!day}
      className={`relative flex flex-col items-center justify-start p-1.5 rounded-lg transition-all min-h-[72px] ${
        !day ? 'invisible' : ''
      } ${
        isToday
          ? 'bg-accent/15 border border-accent/30'
          : 'hover:bg-white/[0.04] border border-transparent'
      } ${!isCurrentMonth ? 'opacity-30' : ''}`}
    >
      <span className={`text-xs font-medium mb-1 ${isToday ? 'text-accent' : 'text-white/70'}`}>
        {day}
      </span>
      {hasItems && (
        <div className="flex flex-wrap gap-0.5 justify-center">
          {tasks.length > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" title={`${tasks.length} tarefa(s)`} />
          )}
          {events.length > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" title={`${events.length} evento(s)`} />
          )}
        </div>
      )}
      {tasks.length > 0 && (
        <span className="text-[10px] text-white/40 mt-auto truncate w-full text-center">
          {tasks[0].title}
        </span>
      )}
    </button>
  )
}
