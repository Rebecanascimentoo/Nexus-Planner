import { Clock, Trash2, Pencil } from 'lucide-react'
import { formatRelative, isOverdue } from '../../utils/date'
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../constants'

const priorityBg = {
  high: 'rgba(239,68,68,0.12)',
  medium: 'rgba(245,158,11,0.12)',
  normal: 'rgba(99,102,241,0.12)',
  low: 'rgba(16,185,129,0.12)',
}

// Card de uma tarefa com checkbox (toggle), título, prioridade, categoria, data e ações
// Props: { task, onToggle(id), onEdit(task), onDelete(id) }
// Marca "ATRASADA" em vermelho se dueDate passou e task não foi concluída
// Ações de editar/excluir aparecem no hover (opacity 0 → 1)
export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = !task.completed && task.dueDate && isOverdue(task.dueDate)

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3 rounded-lg border transition-all ${
        task.completed
          ? 'bg-white/[0.02] border-white/[0.06]'
          : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12]'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-[#10b981] border-[#10b981]'
            : 'border-white/20 hover:border-[#6a4cff]'
        }`}
      >
        {task.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-medium truncate transition-all ${
              task.completed
                ? 'text-white/40 line-through'
                : 'text-white'
            }`}
          >
            {task.title}
          </p>
          {overdue && (
            <span className="text-[10px] font-semibold text-[#ef4444] bg-[#ef4444]/10 px-1.5 py-0.5 rounded flex-shrink-0">
              ATRASADA
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{ color: PRIORITY_COLORS[task.priority], backgroundColor: priorityBg[task.priority] }}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="text-[11px] text-white/40">{task.category}</span>
          {task.dueDate && (
            <span
              className={`text-[11px] flex items-center gap-1 ${
                overdue ? 'text-[#ef4444]' : 'text-white/40'
              }`}
            >
              <Clock size={10} />
              {formatRelative(task.dueDate)}
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-xs text-white/40 mt-1.5 line-clamp-1">
            {task.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
          title="Editar"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-md text-white/40 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
          title="Excluir"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
