import { useState } from 'react'
import { X } from 'lucide-react'
import useTasksStore, { categories, priorities } from '../../store/tasksStore'
import { PRIORITY_LABELS } from '../../constants'
import Button from '../ui/Button'

// Modal de criação/edição de tarefa com título, descrição, prioridade, categoria e data de vencimento
// Props: { task?: object (null = criação), onClose: () => void }
// handleSubmit valida título e chama addTask (criação) ou updateTask (edição) da store
export default function TaskForm({ task, onClose }) {
  const addTask = useTasksStore((s) => s.addTask)
  const updateTask = useTasksStore((s) => s.updateTask)

  const isEditing = !!task
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState(task?.priority || 'normal')
  const [category, setCategory] = useState(task?.category || 'Geral')
  const [dueDate, setDueDate] = useState(task?.dueDate || '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    const data = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || null,
    }

    if (isEditing) {
      updateTask(task.id, data)
    } else {
      addTask(data)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-card rounded-2xl shadow-2xl" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(32px)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Título <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que precisa ser feito?"
              autoFocus
              className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais..."
              rows={3}
              className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all resize-none"
            />
          </div>

          {/* Priority + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer appearance-none"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Data de vencimento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all [color-scheme:dark]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {isEditing ? 'Salvar' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
