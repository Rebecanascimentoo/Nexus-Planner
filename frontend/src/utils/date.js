// Utilitarios de data e moeda.
// formatRelative, isToday, isOverdue usados em cards e listas.
// getMonthDays / getEventsForDay usados no calendario.

import { MS_PER_DAY } from '../constants'

// Retorna true se a data cai no dia atual
export function isToday(date) {
  const d = new Date(date)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

// Retorna true se a data ja passou (considera 23:59:59 do dia como limite)
export function isOverdue(date) {
  if (!date) return false
  const d = new Date(date)
  const now = new Date()
  d.setHours(23, 59, 59, 999)
  return d < now
}

// Retorna string relativa: "Hoje", "Amanha", "Em 3 dias", "Ha 2 dias",
// ou data abreviada como "15 mai"
export function formatRelative(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round((target - today) / MS_PER_DAY)

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Amanhã'
  if (diffDays === -1) return 'Ontem'
  if (diffDays > 0 && diffDays <= 6) return `Em ${diffDays} dias`
  if (diffDays < 0 && diffDays >= -6) return `Há ${Math.abs(diffDays)} dias`

  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

// Retorna o numero de dias de um mes (1-indexado)
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

// Retorna o nome extenso do mes em portugues
export function getMonthName(year, month) {
  return new Date(year, month).toLocaleDateString('pt-BR', { month: 'long' })
}

// Preenche array com os dias do mes, com nulls para alinhar o primeiro dia
export function getMonthDays(year, month) {
  const days = []
  const totalDays = getDaysInMonth(year, month)
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null)
  for (let d = 1; d <= totalDays; d++) days.push(d)
  return days
}

// Filtra eventos que ocorrem em uma data especifica
export function getEventsForDay(events, year, month, day) {
  return events.filter((ev) => {
    const d = new Date(ev.date)
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
  })
}

// Formata numero como moeda BRL (R$ 1.234,56)
export function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
