import { useState } from 'react'
import { X, CreditCard, Landmark, Banknote, Heart, HeartOff, Repeat } from 'lucide-react'
import useFinanceStore, { transactionCategories, transactionTypes, paymentMethods, transactionStatuses } from '../../store/financeStore'
import Button from '../ui/Button'

const methodIcons = { credito: CreditCard, debito: Landmark, dinheiro: Banknote }

export default function TransactionForm({ transaction, onClose }) {
  const addTransaction = useFinanceStore((s) => s.addTransaction)
  const updateTransaction = useFinanceStore((s) => s.updateTransaction)
  const isEditing = !!transaction

  const [description, setDescription] = useState(transaction?.description || '')
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [type, setType] = useState(transaction?.type || 'expense')
  const [category, setCategory] = useState(transaction?.category || 'Outros')
  const [date, setDate] = useState(transaction?.date || new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState(transaction?.paymentMethod || 'debito')
  const [essential, setEssential] = useState(transaction?.essential ?? true)
  const [status, setStatus] = useState(transaction?.status || 'pago')
  const [recurring, setRecurring] = useState(transaction?.recurring || null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!description.trim() || !amount) return
    const data = { description: description.trim(), amount: parseFloat(amount), type, category, date, paymentMethod, essential, status, recurring }
    if (isEditing) {
      updateTransaction(transaction.id, data)
    } else {
      addTransaction(data)
    }
    onClose()
  }

  const filterTypes = type === 'income' ? transactionStatuses.filter(s => s.value !== 'agendado') : transactionStatuses

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-card rounded-2xl shadow-2xl" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(32px)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Descrição <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário Maio"
              autoFocus
              className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Valor <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Tipo</label>
              <div className="flex gap-2">
                {transactionTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setType(t.value)
                      if (t.value === 'income' && status === 'agendado') setStatus('pago')
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      type === t.value
                        ? t.value === 'income'
                          ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                          : 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30'
                        : 'bg-white/[0.05] text-white/50 border border-white/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer appearance-none"
              >
                {transactionCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Forma de Pagamento</label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((pm) => {
                const Icon = methodIcons[pm.value]
                return (
                  <button
                    key={pm.value}
                    type="button"
                    onClick={() => setPaymentMethod(pm.value)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      paymentMethod === pm.value
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'bg-white/[0.05] text-white/50 border border-white/10'
                    }`}
                  >
                    <Icon size={14} />
                    {pm.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Essencialidade</label>
              <button
                type="button"
                onClick={() => setEssential(!essential)}
                className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                  essential
                    ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                    : 'bg-white/[0.05] text-white/50 border border-white/10'
                }`}
              >
                {essential ? <Heart size={14} /> : <HeartOff size={14} />}
                {essential ? 'Essencial' : 'Não Essencial'}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer appearance-none"
              >
                {filterTypes.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Recorrência</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRecurring(null)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  !recurring
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'bg-white/[0.05] text-white/50 border border-white/10'
                }`}
              >
                  Única
              </button>
              <button
                type="button"
                onClick={() => setRecurring('monthly')}
                className={`flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  recurring === 'monthly'
                    ? 'bg-[#14b8a6]/20 text-[#14b8a6] border border-[#14b8a6]/30'
                    : 'bg-white/[0.05] text-white/50 border border-white/10'
                }`}
              >
                <Repeat size={12} />
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setRecurring('yearly')}
                className={`flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  recurring === 'yearly'
                    ? 'bg-[#14b8a6]/20 text-[#14b8a6] border border-[#14b8a6]/30'
                    : 'bg-white/[0.05] text-white/50 border border-white/10'
                }`}
              >
                <Repeat size={12} />
                Anual
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={!description.trim() || !amount}>
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
