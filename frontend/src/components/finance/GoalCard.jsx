import { useState } from 'react'
import { Plus, PiggyBank, Target, TrendingUp, X, Trash2, Pencil } from 'lucide-react'
import useFinanceStore, { goalTypes } from '../../store/financeStore'
import Button from '../ui/Button'
import { formatCurrency } from '../../utils/date'

const typeConfig = {
  reserva: { icon: PiggyBank, color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/15' },
  caixinha: { icon: Target, color: 'text-[#10b981]', bg: 'bg-[#10b981]/15' },
  investimento: { icon: TrendingUp, color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/15' },
}

export function GoalForm({ goal, onClose }) {
  const addGoal = useFinanceStore((s) => s.addGoal)
  const updateGoal = useFinanceStore((s) => s.updateGoal)
  const isEditing = !!goal

  const [name, setName] = useState(goal?.name || '')
  const [targetAmount, setTargetAmount] = useState(goal ? String(goal.targetAmount) : '')
  const [currentAmount, setCurrentAmount] = useState(goal ? String(goal.currentAmount) : '')
  const [type, setType] = useState(goal?.type || 'reserva')
  const [deadline, setDeadline] = useState(goal?.deadline || '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !targetAmount) return
    const data = { name: name.trim(), targetAmount, currentAmount: currentAmount || 0, type, deadline }
    if (isEditing) {
      updateGoal(goal.id, data)
    } else {
      addGoal(data)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-card rounded-2xl shadow-2xl" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(32px)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{isEditing ? 'Editar Meta' : 'Nova Meta'}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Nome <span className="text-[#ef4444]">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Reserva de Emergência" autoFocus className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Meta <span className="text-[#ef4444]">*</span></label>
              <input type="number" step="0.01" min="0" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="0,00" className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Já tenho</label>
              <input type="number" step="0.01" min="0" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="0,00" className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer appearance-none">
                {goalTypes.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Prazo</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none [color-scheme:dark]" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={!name.trim() || !targetAmount}>{isEditing ? 'Salvar' : 'Criar Meta'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function GoalCard({ goal }) {
  const contributeToGoal = useFinanceStore((s) => s.contributeToGoal)
  const deleteGoal = useFinanceStore((s) => s.deleteGoal)
  const [showContribute, setShowContribute] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [contributeAmount, setContributeAmount] = useState('')

  const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0
  const Config = typeConfig[goal.type] || typeConfig.reserva
  const Icon = Config.icon

  function handleContribute(e) {
    e.preventDefault()
    if (!contributeAmount) return
    contributeToGoal(goal.id, contributeAmount)
    setContributeAmount('')
    setShowContribute(false)
  }

  return (
    <>
      <div className="glass-card rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${Config.bg} flex items-center justify-center`}>
              <Icon size={18} className={Config.color} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{goal.name}</p>
              <p className="text-[11px] text-white/40">{goalTypes.find(g => g.value === goal.type)?.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowEdit(true)} className="p-1.5 rounded-md text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
              <Pencil size={14} />
            </button>
            <button onClick={() => deleteGoal(goal.id)} className="p-1.5 rounded-md text-white/30 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-white/50">Progresso</span>
            <span className="text-white font-medium">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${goal.type === 'reserva' ? 'bg-[#3b82f6]' : goal.type === 'caixinha' ? 'bg-[#10b981]' : 'bg-[#8b5cf6]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#10b981]">{formatCurrency(goal.currentAmount)}</span>
            <span className="text-white/40">{formatCurrency(goal.targetAmount)}</span>
          </div>
        </div>

        {goal.deadline && (
          <p className="text-[11px] text-white/40">Prazo: {new Date(goal.deadline + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
        )}

        {showContribute ? (
          <form onSubmit={handleContribute} className="flex gap-2">
            <input type="number" step="0.01" min="0" value={contributeAmount} onChange={(e) => setContributeAmount(e.target.value)} placeholder="Valor" className="glass-input flex-1 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 outline-none" autoFocus />
            <Button type="submit" size="sm" disabled={!contributeAmount}>OK</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowContribute(false)}>X</Button>
          </form>
        ) : (
          <Button variant="ghost" size="sm" className="w-full gap-1 text-xs" onClick={() => setShowContribute(true)}>
            <Plus size={12} />
            Adicionar Valor
          </Button>
        )}
      </div>

      {showEdit && (
        <GoalForm goal={goal} onClose={() => setShowEdit(false)} />
      )}
    </>
  )
}
