import { useState } from 'react'
import { Pencil, Check, X, Wallet } from 'lucide-react'
import useFinanceStore from '../../store/financeStore'
import { formatCurrency } from '../../utils/date'

function BudgetRow({ item }) {
  const updateBudget = useFinanceStore((s) => s.updateBudget)
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(item.planned))

  function handleSave() {
    updateBudget(item.category, parseFloat(value) || 0)
    setEditing(false)
  }

  const overBudget = item.actual > item.planned && item.planned > 0
  const usedPercent = item.planned > 0 ? (item.actual / item.planned) * 100 : 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/70">{item.category}</span>
        <div className="flex items-center gap-2">
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="glass-input w-20 rounded px-2 py-0.5 text-xs text-white outline-none"
                autoFocus
              />
              <button onClick={handleSave} className="p-0.5 text-[#10b981] hover:text-[#10b981]/80"><Check size={12} /></button>
              <button onClick={() => setEditing(false)} className="p-0.5 text-white/40 hover:text-white"><X size={12} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${overBudget ? 'text-[#ef4444]' : 'text-white'}`}>
                {formatCurrency(item.actual)} / {formatCurrency(item.planned)}
              </span>
              {item.planned > 0 && (
                <button onClick={() => { setValue(String(item.planned)); setEditing(true) }} className="p-0.5 text-white/20 hover:text-white/60"><Pencil size={10} /></button>
              )}
            </div>
          )}
        </div>
      </div>
      {item.planned > 0 && (
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${overBudget ? 'bg-[#ef4444]' : 'bg-[#10b981]'}`}
            style={{ width: `${Math.min(usedPercent, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default function BudgetCard() {
  const getBudgetComparison = useFinanceStore((s) => s.getBudgetComparison)
  const comparison = getBudgetComparison()

  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Planejado vs Real</h2>
        <div className="flex items-center gap-1 text-xs text-white/40">
          <Wallet size={12} />
          <span className={comparison.remainingToSpend >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>
            Resta: {formatCurrency(comparison.remainingToSpend)}
          </span>
        </div>
      </div>

      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#10b981] to-[#f59e0b] transition-all"
          style={{ width: `${Math.min((comparison.totalActual / comparison.totalPlanned) * 100, 100)}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center text-xs">
        <div className="bg-white/[0.05] rounded-lg py-2">
          <p className="text-white/50">Planejado</p>
          <p className="text-white font-semibold">{formatCurrency(comparison.totalPlanned)}</p>
        </div>
        <div className="bg-white/[0.05] rounded-lg py-2">
          <p className="text-white/50">Real</p>
          <p className={`font-semibold ${comparison.totalActual > comparison.totalPlanned ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
            {formatCurrency(comparison.totalActual)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {comparison.items.filter(i => i.planned > 0).map((item) => (
          <BudgetRow key={item.category} item={item} />
        ))}
      </div>
    </div>
  )
}
