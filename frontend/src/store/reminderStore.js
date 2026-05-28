import { create } from 'zustand'
import { isToday, isOverdue } from '../utils/date'

/* Store de lembretes — estado 100% derivado (só queries, sem estado próprio).
   Recebe tasks e habits como parâmetro e retorna lembretes ordenados por severidade.
   Usa get() entre métodos pra manter consistência. */
const useReminderStore = create((_set, get) => ({
  /* Gera lembretes de tarefa: atrasada (high) ou vencendo hoje (medium).
     Ignora tarefas já concluídas. */
  getTaskReminders: (tasks) => {
    const reminders = []
    tasks.forEach((t) => {
      if (t.completed) return
      if (t.dueDate && isOverdue(t.dueDate)) {
        reminders.push({
          id: `task-overdue-${t.id}`,
          type: 'task_overdue',
          title: 'Tarefa atrasada',
          message: `"${t.title}" venceu ${new Date(t.dueDate).toLocaleDateString('pt-BR')}`,
          severity: 'high',
          taskId: t.id,
        })
      }
      if (t.dueDate && isToday(t.dueDate)) {
        reminders.push({
          id: `task-today-${t.id}`,
          type: 'task_today',
          title: 'Tarefa para hoje',
          message: `"${t.title}" vence hoje`,
          severity: 'medium',
          taskId: t.id,
        })
      }
    })
    return reminders
  },

  /* Gera lembretes de hábito: todo hábito que ainda não foi check-in hoje. */
  getHabitReminders: (habits) => {
    const today = new Date().toISOString().split('T')[0]
    return habits
      .filter((h) => !h.logs.includes(today))
      .map((h) => ({
        id: `habit-${h.id}`,
        type: 'habit_pending',
        title: 'Hábito pendente',
        message: `Você ainda não fez "${h.name}" hoje`,
        severity: 'low',
        habitId: h.id,
      }))
  },

  /* União de tasks + habits, ordenado por severidade (high → medium → low). */
  getAll: (tasks, habits) => {
    const taskReminders = get().getTaskReminders(tasks)
    const habitReminders = get().getHabitReminders(habits)
    const all = [...taskReminders, ...habitReminders]
    const order = { high: 0, medium: 1, low: 2 }
    return all.sort((a, b) => order[a.severity] - order[b.severity])
  },

  getCount: (tasks, habits) => {
    return get().getAll(tasks, habits).length
  },
}))

export default useReminderStore
