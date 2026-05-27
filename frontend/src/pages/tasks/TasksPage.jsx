import { useState, useMemo, useCallback, useEffect } from 'react'
import { Plus, ListChecks } from 'lucide-react'
import useTasksStore from '../../store/tasksStore'
import useNotificationStore from '../../store/notificationStore'
import TaskItem from '../../components/tasks/TaskItem'
import TaskForm from '../../components/tasks/TaskForm'
import TaskFilters from '../../components/tasks/TaskFilters'
import ConfirmDialog from '../../components/ConfirmDialog'
import Button from '../../components/ui/Button'

export default function TasksPage() {
  const tasks = useTasksStore((s) => s.tasks)
  const getFilteredTasks = useTasksStore((s) => s.getFilteredTasks)
  const toggleComplete = useTasksStore((s) => s.toggleComplete)
  const deleteTask = useTasksStore((s) => s.deleteTask)
  const addTask = useTasksStore((s) => s.addTask)
  const updateTask = useTasksStore((s) => s.updateTask)
  const filter = useTasksStore((s) => s.filter)
  const notifySuccess = useNotificationStore((s) => s.success)

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [undo, setUndo] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filteredTasks = useMemo(() => getFilteredTasks(), [tasks, filter, getFilteredTasks])

  const pendingCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  const handleToggle = useCallback((id) => {
    const task = tasks.find((t) => t.id === id)
    if (task && !task.completed) {
      setUndo({ id, title: task.title })
      setTimeout(() => setUndo(null), 5000)
    }
    toggleComplete(id)
    notifySuccess('Tarefa concluída!')
  }, [tasks, toggleComplete, notifySuccess])

  const handleDelete = useCallback((id) => {
    const task = tasks.find((t) => t.id === id)
    setConfirmDelete(task || { id, title: 'esta tarefa' })
  }, [tasks])

  const confirmDeleteTask = useCallback(() => {
    if (confirmDelete) {
      deleteTask(confirmDelete.id)
      notifySuccess('Tarefa excluída')
      setConfirmDelete(null)
    }
  }, [confirmDelete, deleteTask, notifySuccess])

  const handleEdit = useCallback((task) => {
    setEditingTask(task)
    setShowForm(true)
  }, [])

  const handleUndo = useCallback(() => {
    if (undo) {
      toggleComplete(undo.id)
      setUndo(null)
    }
  }, [undo, toggleComplete])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        setEditingTask(null)
        setShowForm(true)
      }
      if (e.key === 'Escape') {
        setShowForm(false)
        setEditingTask(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ListChecks size={20} className="text-accent" />
          <div>
            <h1 className="text-xl font-bold text-white">Tarefas</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              {pendingCount} pendentes · {completedCount} concluídas
            </p>
          </div>
        </div>
        <Button onClick={() => { setEditingTask(null); setShowForm(true) }} className="gap-1.5">
          <Plus size={16} />
          Nova Tarefa
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilters />
      </div>

      {/* Empty state */}
      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-card border border-dark-border/50 flex items-center justify-center mb-4">
            <ListChecks size={28} className="text-text-muted" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            {tasks.length === 0
              ? 'Nenhuma tarefa ainda'
              : 'Nenhuma tarefa encontrada'}
          </h3>
          <p className="text-sm text-text-secondary mb-6 max-w-xs">
            {tasks.length === 0
              ? 'Crie sua primeira tarefa para começar a organizar seu dia.'
              : 'Tente ajustar os filtros ou buscar por outro termo.'}
          </p>
          {tasks.length === 0 && (
            <Button onClick={() => { setEditingTask(null); setShowForm(true) }} className="gap-1.5">
              <Plus size={16} />
              Criar Primeira Tarefa
            </Button>
          )}
        </div>
      )}

      {/* Task list */}
      {filteredTasks.length > 0 && (
        <div className="space-y-1.5">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Footer count */}
      {filteredTasks.length > 0 && (
        <p className="text-xs text-text-muted text-center mt-6">
          Mostrando {filteredTasks.length} de {tasks.length} tarefas
          {filteredTasks.length < tasks.length && ' · '}
          {filteredTasks.length < tasks.length && (
            <button
              onClick={() => useTasksStore.getState().resetFilter()}
              className="text-accent hover:underline"
            >
              limpar filtros
            </button>
          )}
        </p>
      )}

      {/* Form modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={() => { setShowForm(false); setEditingTask(null) }}
        />
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Excluir tarefa"
        message={`Tem certeza que deseja excluir "${confirmDelete?.title}"?`}
        onConfirm={confirmDeleteTask}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Undo toast */}
      {undo && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-dark-card border border-dark-border/50 rounded-xl shadow-2xl px-5 py-3 flex items-center gap-4 animate-fade-in">
          <p className="text-sm text-white">
            Tarefa <span className="font-semibold">{undo.title}</span> concluída
          </p>
          <button
            onClick={handleUndo}
            className="text-xs font-semibold text-accent hover:underline"
          >
            Desfazer
          </button>
        </div>
      )}
    </div>
  )
}
