export const metrics = [
  {
    id: 1,
    label: 'Tarefas de Hoje',
    value: '12/18',
    icon: 'CheckCircle',
    iconColor: '#10b981',
    badge: '+2 HOJE',
  },
  {
    id: 2,
    label: 'Streak de Hábitos',
    value: '15 Dias',
    icon: 'TrendingUp',
    iconColor: '#f59e0b',
    badge: 'RECORDE!',
  },
  {
    id: 3,
    label: 'Saldo disponível',
    value: 'R$ 4.250',
    icon: 'Wallet',
    iconColor: '#3b82f6',
    badge: '↑ 12% MÊS',
  },
  {
    id: 4,
    label: 'Próximo Evento',
    value: '14:30h',
    icon: 'Calendar',
    iconColor: '#ec4899',
    badge: 'REUNIÃO NEXUS',
  },
]

export const urgentTasks = [
  { id: 1, title: 'Finalizar API de Auth', time: '10:00', priority: 'high', category: 'Dev' },
  { id: 2, title: 'Revisão do Prisma Schema', time: '14:00', priority: 'medium', category: 'Dev' },
  { id: 3, title: 'Setup Tailwind 4', time: '16:30', priority: 'normal', category: 'Dev' },
  { id: 4, title: 'Meeting com a equipe', time: '18:00', priority: 'low', category: 'Work' },
]

export const weeklyData = [
  { day: 'Seg', value: 8 },
  { day: 'Ter', value: 12 },
  { day: 'Qua', value: 10 },
  { day: 'Qui', value: 15 },
  { day: 'Sex', value: 7 },
  { day: 'Sáb', value: 5 },
  { day: 'Dom', value: 9 },
]

export const upcomingEvents = [
  { id: 1, title: 'Reunião Nexus', time: '14:30 - 15:30', day: 'Hoje', color: '#6a4cff' },
  { id: 2, title: 'Review de Código', time: '10:00 - 11:00', day: 'Amanhã', color: '#2d6bff' },
  { id: 3, title: 'Workshop UI/UX', time: '09:00 - 12:00', day: 'Qua, 28', color: '#00d4bb' },
  { id: 4, title: 'Almoço equipe', time: '12:00 - 13:00', day: 'Qui, 29', color: '#f59e0b' },
]

export const habitStreaks = [
  { id: 1, label: 'Meditar', streak: 15, done: true },
  { id: 2, label: 'Beber Água', streak: 12, done: true },
  { id: 3, label: 'Exercício', streak: 8, done: false },
  { id: 4, label: 'Ler 30 min', streak: 22, done: true },
]

export const financeSummary = {
  income: 'R$ 8.450',
  expenses: 'R$ 4.200',
  balance: 'R$ 4.250',
  period: 'Maio 2026',
}

export const sidebarLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Tarefas', path: '/tasks', icon: 'CheckSquare' },
  { label: 'Hábitos', path: '/habits', icon: 'Flame' },
  { label: 'Calendário', path: '/calendar', icon: 'Calendar' },
  { label: 'Finanças', path: '/finance', icon: 'Wallet' },
]
