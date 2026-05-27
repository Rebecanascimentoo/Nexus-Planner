import { create } from 'zustand'
import {
  metrics,
  urgentTasks,
  weeklyData,
  upcomingEvents,
  habitStreaks,
  financeSummary,
} from '../data/mockData'

const useDashboardStore = create(() => ({
  metrics,
  urgentTasks,
  weeklyData,
  upcomingEvents,
  habitStreaks,
  financeSummary,
}))

export default useDashboardStore
