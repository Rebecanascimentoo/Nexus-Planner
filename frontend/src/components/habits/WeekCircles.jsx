export default function WeekCircles({ weeks = [] }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-sm font-semibold text-white mb-3">Progresso Semanal</p>
      <div className="flex items-center justify-around h-[180px]">
        {weeks.map((w) => {
          const color = w.value >= 80 ? '#10b981' : w.value >= 50 ? '#f59e0b' : '#ef4444'
          return (
            <div key={w.label} className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-base font-bold border-[3px]"
                style={{ borderColor: color, color }}
              >
                {w.value}%
              </div>
              <span className="text-[11px] text-white/40 font-medium">{w.label}</span>
            </div>
          )
        })}
        {weeks.length === 0 && (
          <span className="text-xs text-white/30">Sem dados esta semana</span>
        )}
      </div>
    </div>
  )
}
