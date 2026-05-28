import { create } from 'zustand'
import {
  metrics,
  urgentTasks,
  weeklyData,
  upcomingEvents,
  habitStreaks,
  financeSummary,
} from '../data/mockData'

/* Store do Dashboard — apenas dados mockados, sem mutações.
   Cada propriedade corresponde a uma seção da página inicial.
   Futuramente vai buscar do backend ou agregar de outras stores. */
const useDashboardStore = create(() => ({
  metrics,
  urgentTasks,
  weeklyData,
  upcomingEvents,
  habitStreaks,
  financeSummary,
}))

export default useDashboardStore
