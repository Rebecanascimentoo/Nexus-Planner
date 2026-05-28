import { memo } from 'react'
import { Trash2, Pencil, ArrowUpRight, ArrowDownRight, CreditCard, Landmark, Banknote, Heart, HeartOff, Clock, AlertTriangle, CheckCircle, Repeat } from 'lucide-react'
import { formatCurrency } from '../../utils/date'

const methodIcons = { credito: CreditCard, debito: Landmark, dinheiro: Banknote }
const methodColors = { credito: 'text-[#f59e0b]', debito: 'text-[#3b82f6]', dinheiro: 'text-[#10b981]' }

const statusConfig = {
  pago: { icon: CheckCircle, label: 'Pago', class: 'text-[#10b981] bg-[#10b981]/10' },
  pendente: { icon: Clock, label: 'Pendente', class: 'text-[#f59e0b] bg-[#f59e0b]/10' },
  agendado: { icon: AlertTriangle, label: 'Agendado', class: 'text-[#8b5cf6] bg-[#8b5cf6]/10' },
}

const recurringLabels = { monthly: 'Mensal', yearly: 'Anual' }

// Linha de uma transação na listagem: ícone (receita/despesa), descrição, status, recorrência, categoria, data, método, essencialidade, valor e ações (editar/excluir)
// Componente memoizado para evitar re-renders desnecessários. Props: transaction, onEdit(transaction), onDelete(id)
export default memo(function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income'
  const PaymentIcon = methodIcons[transaction.paymentMethod] || Landmark
  const StatusIcon = statusConfig[transaction.status]?.icon || CheckCircle

  return (
    <div className="group flex items-center gap-4 px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-all">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isIncome ? 'bg-[#10b981]/15' : 'bg-[#ef4444]/15'
        }`}
      >
        {isIncome
          ? <ArrowUpRight size={16} className="text-[#10b981]" />
          : <ArrowDownRight size={16} className="text-[#ef4444]" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white truncate">{transaction.description}</p>
          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium leading-none ${statusConfig[transaction.status].class}`}>
            <StatusIcon size={10} />
            {statusConfig[transaction.status].label}
          </span>
          {transaction.recurring && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium leading-none text-[#14b8a6] bg-[#14b8a6]/10">
              <Repeat size={10} />
              {recurringLabels[transaction.recurring]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[11px] text-white/40">{transaction.category}</span>
          <span className="text-[11px] text-white/30">·</span>
          <span className="text-[11px] text-white/40">
            {new Date(transaction.date + 'T12:00:00').toLocaleDateString('pt-BR')}
          </span>
          <span className="text-[11px] text-white/30">·</span>
          <span className={`inline-flex items-center gap-0.5 ${methodColors[transaction.paymentMethod] || 'text-white/40'}`}>
            <PaymentIcon size={11} />
          </span>
          {!transaction.essential && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-white/40">
              <HeartOff size={11} />
              <span>Não Essencial</span>
            </span>
          )}
          {transaction.essential && transaction.type === 'expense' && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-[#10b981]/60">
              <Heart size={11} />
            </span>
          )}
        </div>
      </div>

      <span className={`text-sm font-semibold flex-shrink-0 ${isIncome ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(transaction)}
          className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(transaction.id)}
          className="p-1.5 rounded-md text-white/40 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
})
