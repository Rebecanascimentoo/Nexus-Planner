import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isToday, isOverdue } from '../utils/date'
import { MS_PER_DAY } from '../constants'
import { uuid } from '../utils/uuid'

/* Construtor de tarefa com valores padrão.
   completedAt começa null — é preenchido por toggleComplete. */
function createTask(data) {
  return {
    id: uuid(),
    title: data.title,
    description: data.description || '',
    completed: false,
    priority: data.priority || 'normal',
    category: data.category || 'Geral',
    dueDate: data.dueDate || null,
    createdAt: new Date().toISOString(),
    completedAt: null,
  }
}

function todayString() {
  return new Date().toISOString().split('T')[0]
}

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

const defaultTasks = [
  { id: crypto?.randomUUID?.() ?? '1', title: 'Finalizar API de Auth', priority: 'high', category: 'Dev', dueDate: daysFromNow(0), completed: false, description: 'Implementar JWT + refresh token', createdAt: new Date().toISOString(), completedAt: null },
  { id: crypto?.randomUUID?.() ?? '2', title: 'Corrigir bug no login', priority: 'high', category: 'Dev', dueDate: daysFromNow(0), completed: false, description: 'Erro 500 ao logar com Google', createdAt: new Date().toISOString(), completedAt: null },
  { id: crypto?.randomUUID?.() ?? '3', title: 'Revisar Prisma Schema', priority: 'medium', category: 'Dev', dueDate: daysFromNow(0), completed: false, description: 'Adicionar índices nas tabelas', createdAt: new Date().toISOString(), completedAt: null },
  { id: crypto?.randomUUID?.() ?? '4', title: 'Revisar PR do João', priority: 'medium', category: 'Dev', dueDate: daysFromNow(0), completed: false, createdAt: new Date().toISOString(), completedAt: null },
  { id: crypto?.randomUUID?.() ?? '5', title: 'Setup Tailwind 4', priority: 'normal', category: 'Dev', dueDate: daysFromNow(1), completed: false, createdAt: new Date().toISOString(), completedAt: null },
  { id: crypto?.randomUUID?.() ?? '6', title: 'Organizar caixa de entrada', priority: 'normal', category: 'Work', dueDate: daysFromNow(1), completed: false, createdAt: new Date().toISOString(), completedAt: null },
  { id: crypto?.randomUUID?.() ?? '7', title: 'Comprar material escritório', priority: 'normal', category: 'Pessoal', dueDate: daysFromNow(1), completed: false, createdAt: new Date().toISOString(), completedAt: null },
  { id: crypto?.randomUUID?.() ?? '8', title: 'Planejar sprint', priority: 'medium', category: 'Work', dueDate: daysFromNow(2), completed: false, createdAt: new Date().toISOString(), completedAt: null },
  { id: crypto?.randomUUID?.() ?? '9', title: 'Pagar fatura cartão', priority: 'high', category: 'Finanças', dueDate: daysFromNow(3), completed: false, createdAt: new Date().toISOString(), completedAt: null },
  { id: crypto?.randomUUID?.() ?? '10', title: 'Estudar GraphQL', priority: 'medium', category: 'Estudos', dueDate: daysFromNow(3), completed: false, createdAt: new Date().toISOString(), completedAt: null },
  { id: crypto?.randomUUID?.() ?? '11', title: 'Ler capítulo 5', priority: 'low', category: 'Estudos', dueDate: daysFromNow(5), completed: true, createdAt: new Date(Date.now() - MS_PER_DAY).toISOString(), completedAt: new Date(Date.now() - MS_PER_DAY).toISOString() },
  { id: crypto?.randomUUID?.() ?? '12', title: 'Meeting com a equipe', priority: 'low', category: 'Work', dueDate: daysFromNow(0), completed: false, description: 'Alinhamento semanal', createdAt: new Date().toISOString(), completedAt: null },
]

export const categories = ['Dev', 'Work', 'Estudos', 'Pessoal', 'Finanças', 'Geral']
export const priorities = ['low', 'normal', 'medium', 'high']

/* Store de tarefas — CRUD completo, filtros, produtividade semanal.
   Persistida como 'nexus-tasks'. Usa get() pras queries derivadas. */
const useTasksStore = create(
  persist(
    (set, get) => ({
      tasks: defaultTasks,
      filter: { status: 'all', priority: 'all', category: 'all', search: '' },

      addTask: (data) =>
        set((state) => ({ tasks: [...state.tasks, createTask(data)] })),

      updateTask: (id, data) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      /* Alterna completed e registra timestamp em completedAt.
         Se desmarcar, volta pra null (não registra "quando foi desfeita"). */
      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed
                    ? new Date().toISOString()
                    : null,
                }
              : t
          ),
        })),

      /* Merge parcial no filtro. */
      setFilter: (partial) =>
        set((state) => ({ filter: { ...state.filter, ...partial } })),

      resetFilter: () =>
        set({
          filter: { status: 'all', priority: 'all', category: 'all', search: '' },
        }),

      /* Aplica filtros em cascata: status → prioridade → categoria → busca textual. */
      getFilteredTasks: () => {
        const { tasks, filter } = get()
        let result = [...tasks]

        if (filter.status === 'pending') result = result.filter((t) => !t.completed)
        else if (filter.status === 'completed') result = result.filter((t) => t.completed)

        if (filter.priority !== 'all')
          result = result.filter((t) => t.priority === filter.priority)

        if (filter.category !== 'all')
          result = result.filter((t) => t.category === filter.category)

        if (filter.search) {
          const q = filter.search.toLowerCase()
          result = result.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q)
          )
        }

        return result
      },

      /* Tarefas não concluídas com vencimento hoje. */
      getTodayTasks: () => {
        return get().tasks.filter(
          (t) => !t.completed && t.dueDate && isToday(t.dueDate)
        )
      },

      /* Tarefas urgentes: prioridade high/medium ou atrasadas.
         Usado na dashboard e no badge do header. */
      getUrgentTasks: () => {
        return get().tasks.filter(
          (t) =>
            !t.completed &&
            (t.priority === 'high' ||
              t.priority === 'medium' ||
              (t.dueDate && isOverdue(t.dueDate)))
        )
      },

      /* Produtividade dos últimos 7 dias: conta tarefas concluídas por dia.
         Usa completedAt.startsWith(dateStr) pra agrupar por data.
         Retorna array pra gráfico de barras. */
      getWeeklyProductivity: () => {
        const days = []
        const now = new Date()
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now)
          d.setDate(d.getDate() - i)
          const dateStr = d.toISOString().split('T')[0]
          const completed = get().tasks.filter((t) => {
            if (!t.completedAt) return false
            return t.completedAt.startsWith(dateStr)
          }).length
          const dayLabel = d.toLocaleDateString('pt-BR', { weekday: 'short' })
          days.push({ day: dayLabel.replace('.', ''), value: completed })
        }
        return days
      },
    }),
    { name: 'nexus-tasks' }
  )
)

export default useTasksStore
