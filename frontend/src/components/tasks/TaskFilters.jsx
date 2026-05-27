import { Search, X } from 'lucide-react'
import useTasksStore, { categories, priorities } from '../../store/tasksStore'
import { PRIORITY_LABELS } from '../../constants'

const statusTabs = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'completed', label: 'Concluídas' },
]

export default function TaskFilters() {
  const filter = useTasksStore((s) => s.filter)
  const setFilter = useTasksStore((s) => s.setFilter)
  const resetFilter = useTasksStore((s) => s.resetFilter)

  const hasActiveFilter =
    filter.status !== 'all' ||
    filter.priority !== 'all' ||
    filter.category !== 'all' ||
    filter.search !== ''

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          placeholder="Buscar tarefa..."
          className="glass-input w-full rounded-lg pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all"
        />
        {filter.search && (
          <button
            onClick={() => setFilter({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg border border-white/10 p-0.5">
          {statusTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter({ status: key })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filter.status === key
                  ? 'bg-[#6a4cff] text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Priority */}
        <select
          value={filter.priority}
          onChange={(e) => setFilter({ priority: e.target.value })}
          className="glass-input rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 outline-none cursor-pointer appearance-none"
        >
          {Object.entries({ all: 'Todas', ...PRIORITY_LABELS }).map(([key, label]) => (
            <option key={key} value={key}>
              {key === 'all' ? label : `${label} Prioridade`}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          value={filter.category}
          onChange={(e) => setFilter({ category: e.target.value })}
          className="glass-input rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 outline-none cursor-pointer appearance-none"
        >
          <option value="all">Todas Categorias</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Clear */}
        {hasActiveFilter && (
          <button
            onClick={resetFilter}
            className="text-xs text-[#6a4cff] hover:underline ml-auto"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  )
}
