import { Trash2, Pencil } from 'lucide-react'
import { calcStreak } from '../../store/habitsStore'

function dateKey(year, month, day) {
  return new Date(year, month, day).toISOString().split('T')[0]
}

function Cell({ checked, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-4 h-4 rounded-sm transition-all flex-shrink-0 ${
        checked
          ? 'bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.35)] border border-[#10b981]/40'
          : 'bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08]'
      }`}
    />
  )
}

function WeekCell({ habit, days, year, month, onCellClick }) {
  return (
    <div className="flex gap-1">
      {days.map((d) => {
        const key = dateKey(year, month, d)
        return (
          <Cell
            key={d}
            checked={habit.logs.includes(key)}
            onClick={() => onCellClick(habit.id, key)}
          />
        )
      })}
    </div>
  )
}

const CAT_SCHEMA = {
  saude: { label: 'Saúde', color: '#10b981', border: 'border-l-[#10b981]' },
  estudos: { label: 'Estudos', color: '#3b82f6', border: 'border-l-[#3b82f6]' },
  trabalho: { label: 'Trabalho', color: '#8b5cf6', border: 'border-l-[#8b5cf6]' },
  pessoal: { label: 'Pessoal', color: '#f59e0b', border: 'border-l-[#f59e0b]' },
  social: { label: 'Social', color: '#ec4899', border: 'border-l-[#ec4899]' },
  criatividade: { label: 'Criatividade', color: '#06b6d4', border: 'border-l-[#06b6d4]' },
}

// Tabela mensal de hábitos: colunas por semana (S1-S4) + dias extras, meta, streak e score
// Props:
//   habits, year, month — dados e período
//   onCellClick(id, dateKey) — marca/desmarca check-in
//   onEdit(habit), onDelete(id) — ações por linha
//   showCategorySep — separador visual entre categorias
// Subcomponentes: Cell (checkbox), WeekCell (linha semanal)
export default function HabitTable({ habits, year, month, onCellClick, onEdit, onDelete, showCategorySep }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const extras = [29, 30, 31].filter((d) => d <= daysInMonth)

  const weekColumns = [
    { label: 'S1', days: [1, 2, 3, 4, 5, 6, 7] },
    { label: 'S2', days: [8, 9, 10, 11, 12, 13, 14] },
    { label: 'S3', days: [15, 16, 17, 18, 19, 20, 21] },
    { label: 'S4', days: [22, 23, 24, 25, 26, 27, 28] },
  ]

  const targetDefault = (freq) => freq === 'daily' ? daysInMonth : freq === 'weekly' ? 4 : 1

  const rows = habits.map((h) => {
    const cols = weekColumns.map((w) =>
      w.days.filter((d) => h.logs.includes(dateKey(year, month, d))).length
    )
    const extraChecked = extras.filter((d) => h.logs.includes(dateKey(year, month, d))).length
    const checkins = cols.reduce((a, b) => a + b, 0) + extraChecked
    const target = h.monthlyTarget || targetDefault(h.frequency)
    const score = Math.min(100, Math.round((checkins / (target || 1)) * 100))
    const streak = calcStreak(h.logs)
    return { ...h, checkins, target, score, streak }
  })

  let prevCategory = null
  let catIndex = 0

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-white/[0.03] border-b border-white/[0.08]">
            <th className="text-left py-3 pl-4 pr-3 text-[11px] font-semibold text-white/50 uppercase tracking-wider w-40">Hábito</th>
            {weekColumns.map((w) => (
              <th key={w.label} className="text-center py-3 px-1.5 text-[11px] font-semibold text-white/40 uppercase tracking-wider w-[70px]">{w.label}</th>
            ))}
            <th className="text-center py-3 px-1.5 text-[11px] font-semibold text-white/40 uppercase tracking-wider w-[60px]">+dias</th>
            <th className="text-center py-3 px-2 text-[11px] font-semibold text-white/50 uppercase tracking-wider w-14">Meta</th>
            <th className="text-center py-3 px-2 text-[11px] font-semibold text-white/50 uppercase tracking-wider w-[58px]">🔥</th>
            <th className="text-center py-3 px-2 text-[11px] font-semibold text-white/50 uppercase tracking-wider w-[60px]">%</th>
            <th className="w-14" />
          </tr>
        </thead>
        <tbody>
          {rows.map((h) => {
            const isNewCategory = showCategorySep && prevCategory !== null && h.category !== prevCategory
            prevCategory = h.category
            const schema = CAT_SCHEMA[h.category] || CAT_SCHEMA.pessoal
            if (isNewCategory) catIndex++

            return (
              <tr
                key={h.id}
                className={`group transition-colors ${
                  catIndex % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'
                } ${isNewCategory ? 'border-t border-white/[0.06]' : ''} hover:bg-white/[0.04]`}
              >
                <td className={`py-2.5 pl-4 pr-3 border-l-2 ${schema.border}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base leading-none">{h.emoji}</span>
                    <span className="text-sm text-white/90 font-medium truncate">{h.name}</span>
                  </div>
                </td>
                {weekColumns.map((w, i) => (
                  <td key={w.label} className="py-2.5 px-1.5 align-middle">
                    <div className="flex justify-center">
                      <WeekCell habit={h} days={w.days} year={year} month={month} onCellClick={onCellClick} />
                    </div>
                  </td>
                ))}
                <td className="py-2.5 px-1.5 align-middle">
                  <div className="flex justify-center gap-1">
                    {extras.map((d) => {
                      const key = dateKey(year, month, d)
                      return (
                        <Cell
                          key={d}
                          checked={h.logs.includes(key)}
                          onClick={() => onCellClick(h.id, key)}
                        />
                      )
                    })}
                    {extras.length === 0 && <span className="text-[11px] text-white/20">—</span>}
                  </div>
                </td>
                <td className="py-2.5 px-2 text-center align-middle">
                  <span className="text-xs text-white/50 font-mono">{h.target || '-'}</span>
                </td>
                <td className="py-2.5 px-2 text-center align-middle">
                  <span className={`text-xs font-semibold ${h.streak > 0 ? 'text-[#f59e0b]' : 'text-white/30'}`}>
                    {h.streak > 0 ? `🔥${h.streak}` : '—'}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-center align-middle">
                  <span className={`inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-md text-xs font-bold ${
                    h.score >= 80 ? 'bg-[#10b981]/15 text-[#10b981]' : h.score >= 50 ? 'bg-[#f59e0b]/15 text-[#f59e0b]' : 'bg-[#ef4444]/15 text-[#ef4444]'
                  }`}>
                    {h.score}%
                  </span>
                </td>
                <td className="py-2.5 pr-3 align-middle">
                  <div className="flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(h)}
                      className="p-1.5 rounded-md text-white/30 hover:text-white hover:bg-white/[0.08] transition-all"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(h.id)}
                      className="p-1.5 rounded-md text-white/30 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center py-16 text-white/25 text-sm">
                <p className="mb-1">Nenhum hábito ainda</p>
                <p className="text-xs text-white/20">Clique em "Novo" para começar</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
