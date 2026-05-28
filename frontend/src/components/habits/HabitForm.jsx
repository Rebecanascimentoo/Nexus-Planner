import { useState } from 'react'
import { X } from 'lucide-react'
import useHabitsStore from '../../store/habitsStore'
import Button from '../ui/Button'

const emojis = ['💪', '🧘', '📚', '🏃', '🎯', '✍️', '🎨', '💧', '🧠', '🌱', '🎵', '☕', '📞', '🧹', '🛒', '📖']

const presetCategories = [
  { value: 'saude', label: 'Saúde' },
  { value: 'estudos', label: 'Estudos' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'pessoal', label: 'Pessoal' },
  { value: 'social', label: 'Social' },
  { value: 'criatividade', label: 'Criatividade' },
]

const frequencyOptions = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
]

// Modal de criação/edição de hábito com campos nome, frequência, meta mensal, categoria e ícone
// Props: { habit?: object (null = criação), onClose: () => void }
// Ao submeter chama addHabit (criação) ou updateHabit (edição) da store
export default function HabitForm({ habit, onClose }) {
  const addHabit = useHabitsStore((s) => s.addHabit)
  const updateHabit = useHabitsStore((s) => s.updateHabit)
  const isEditing = !!habit

  const [name, setName] = useState(habit?.name || '')
  const [emoji, setEmoji] = useState(habit?.emoji || '💪')
  const [category, setCategory] = useState(habit?.category || 'pessoal')
  const [customCategory, setCustomCategory] = useState(habit?.customCategory || '')
  const [frequency, setFrequency] = useState(habit?.frequency || 'daily')
  const [monthlyTarget, setMonthlyTarget] = useState(habit?.monthlyTarget || '')

  function suggestTarget(freq) {
    if (freq === 'daily') return 30
    if (freq === 'weekly') return 4
    return 1
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    const data = {
      name: name.trim(),
      emoji,
      category: category === 'custom' ? 'custom' : category,
      customCategory: category === 'custom' ? customCategory.trim() : '',
      frequency,
      monthlyTarget: monthlyTarget ? Number(monthlyTarget) : suggestTarget(frequency),
    }
    if (isEditing) {
      updateHabit(habit.id, data)
    } else {
      addHabit(data)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-card rounded-2xl shadow-2xl" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(32px)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? 'Editar Hábito' : 'Novo Hábito'}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Nome <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Meditar 10 minutos"
              autoFocus
              className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Frequência</label>
              <div className="flex gap-1.5">
                {frequencyOptions.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => {
                      setFrequency(f.value)
                      if (!monthlyTarget) setMonthlyTarget(suggestTarget(f.value))
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      frequency === f.value
                        ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                        : 'bg-white/[0.05] text-white/50 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Meta mensal</label>
              <input
                type="number"
                min={1}
                max={31}
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value ? Number(e.target.value) : '')}
                placeholder={String(suggestTarget(frequency))}
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Categoria</label>
            <div className="grid grid-cols-3 gap-1.5">
              {presetCategories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                    category === c.value
                      ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                      : 'bg-white/[0.05] text-white/50 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {c.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCategory('custom')}
                className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === 'custom'
                    ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                    : 'bg-white/[0.05] text-white/50 border border-white/10 hover:border-white/30'
                }`}
              >
                Outra
              </button>
            </div>
            {category === 'custom' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Nome da categoria"
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition-all mt-2"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Ícone</label>
            <div className="grid grid-cols-8 gap-2">
              {emojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-lg text-base flex items-center justify-center transition-all ${
                    emoji === e
                      ? 'bg-accent/20 border-2 border-accent'
                      : 'bg-white/[0.05] border-2 border-white/10 hover:border-white/30'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={!name.trim()}>
              {isEditing ? 'Salvar' : 'Criar Hábito'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
