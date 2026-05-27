import { Search } from 'lucide-react'
import useFinanceStore, { transactionCategories, transactionTypes, paymentMethods, transactionStatuses } from '../../store/financeStore'

export default function TransactionFilters() {
  const filter = useFinanceStore((s) => s.filter)
  const setFilter = useFinanceStore((s) => s.setFilter)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[160px] max-w-[240px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          placeholder="Buscar transação..."
          className="glass-input w-full rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-white/30 outline-none"
        />
      </div>

      <select
        value={filter.month}
        onChange={(e) => setFilter({ month: Number(e.target.value) })}
        className="glass-input rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 outline-none cursor-pointer appearance-none"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={i}>
            {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
          </option>
        ))}
      </select>

      <select
        value={filter.type}
        onChange={(e) => setFilter({ type: e.target.value })}
        className="glass-input rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 outline-none cursor-pointer appearance-none"
      >
        <option value="all">Todos</option>
        {transactionTypes.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <select
        value={filter.category}
        onChange={(e) => setFilter({ category: e.target.value })}
        className="glass-input rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 outline-none cursor-pointer appearance-none"
      >
        <option value="all">Todas Categorias</option>
        {transactionCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        value={filter.paymentMethod}
        onChange={(e) => setFilter({ paymentMethod: e.target.value })}
        className="glass-input rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 outline-none cursor-pointer appearance-none"
      >
        <option value="all">Todos Pagamentos</option>
        {paymentMethods.map((pm) => (
          <option key={pm.value} value={pm.value}>{pm.label}</option>
        ))}
      </select>

      <select
        value={filter.status}
        onChange={(e) => setFilter({ status: e.target.value })}
        className="glass-input rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 outline-none cursor-pointer appearance-none"
      >
        <option value="all">Todos Status</option>
        {transactionStatuses.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <select
        value={filter.essential}
        onChange={(e) => setFilter({ essential: e.target.value })}
        className="glass-input rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 outline-none cursor-pointer appearance-none"
      >
        <option value="all">Essencialidade</option>
        <option value="true">Essencial</option>
        <option value="false">Não Essencial</option>
      </select>
    </div>
  )
}
