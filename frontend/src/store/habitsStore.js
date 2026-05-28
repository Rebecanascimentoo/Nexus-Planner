import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* Normaliza data pra YYYY-MM-DD (chave usada em logs e notes). */
function dateKey(date) {
  return new Date(date).toISOString().split('T')[0]
}

function todayKey() {
  return dateKey(new Date())
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

/* Número da semana dentro do mês (1-5), baseado no dia da semana do dia 1.
   Usado para distribuir check-ins no heatmap semanal. */
function getWeekNumber(dateStr) {
  const d = new Date(dateStr)
  const month = d.getMonth()
  const year = d.getFullYear()
  const firstDay = new Date(year, month, 1).getDay()
  const dayOfMonth = d.getDate()
  return Math.ceil((dayOfMonth + firstDay) / 7)
}

function defaultMonthlyTarget(frequency, year, month) {
  if (frequency === 'daily') return getDaysInMonth(year, month)
  if (frequency === 'weekly') return 4
  return 1
}

function createHabit(data) {
  return {
    id: crypto.randomUUID(),
    name: data.name,
    emoji: data.emoji || '⭐',
    frequency: data.frequency || 'daily',
    category: data.category || 'pessoal',
    customCategory: data.customCategory || '',
    monthlyTarget: data.monthlyTarget || 0,
    logs: [],
    notes: {},
    createdAt: new Date().toISOString(),
  }
}

/* Calcula streak atual: conta dias consecutivos (pra trás) desde hoje.
   Usa Set pra deduplicar múltiplos check-ins no mesmo dia.
   Se ontem não foi marcado, a streak quebra (streak = 0 ou 1 se só hoje). */
export function calcStreak(logs) {
  const dates = [...new Set(logs.map((l) => dateKey(l)))].sort().reverse()
  let streak = 0
  const today = todayKey()
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    if (dates[i] === dateKey(expected)) streak++
    else break
  }
  return streak
}

/* Score percentual de um hábito num mês: check-ins / target, capped em 100. */
function calcHabitScore(habit, year, month) {
  const daysInMonth = getDaysInMonth(year, month)
  const target = habit.monthlyTarget || defaultMonthlyTarget(habit.frequency, year, month)
  let checkins = 0
  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(new Date(year, month, d))
    if (habit.logs.includes(key)) checkins++
  }
  return Math.min(100, Math.round((checkins / target) * 100))
}

const defaultHabits = [
  { id: 'gen1', name: 'Beber 2L de água', emoji: '💧', frequency: 'daily', category: 'saude', monthlyTarget: 30, logs: [todayKey()], notes: {}, createdAt: new Date().toISOString() },
  { id: 'gen2', name: 'Ler 20 minutos', emoji: '📚', frequency: 'daily', category: 'estudos', monthlyTarget: 20, logs: [], notes: {}, createdAt: new Date().toISOString() },
  { id: 'gen3', name: 'Meditar', emoji: '🧘', frequency: 'daily', category: 'saude', monthlyTarget: 15, logs: [], notes: {}, createdAt: new Date().toISOString() },
  { id: 'gen4', name: 'Academia', emoji: '🏋️', frequency: 'weekly', category: 'saude', monthlyTarget: 4, logs: [], notes: {}, createdAt: new Date().toISOString() },
  { id: 'gen5', name: 'Revisar metas', emoji: '🎯', frequency: 'weekly', category: 'trabalho', monthlyTarget: 4, logs: [], notes: {}, createdAt: new Date().toISOString() },
  { id: 'gen6', name: 'Ligar pra família', emoji: '📞', frequency: 'monthly', category: 'social', monthlyTarget: 2, logs: [], notes: {}, createdAt: new Date().toISOString() },
]

/* Store de hábitos — check-ins diários, streaks, notas e score mensal.
   Persistida como 'nexus-habits'. Tem migrate pra categorias antigas. */
const useHabitsStore = create(
  persist(
    (set, get) => ({
      habits: defaultHabits,

      addHabit: (data) =>
        set((state) => ({ habits: [...state.habits, createHabit(data)] })),

      updateHabit: (id, data) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...data } : h)),
        })),

      deleteHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),

      /* Alterna check-in: adiciona ou remove a data do array logs.
         Normaliza a data com dateKey pra evitar duplicatas. */
      toggleCheckIn: (id, dateStr) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h
            const key = dateKey(dateStr)
            const hasLog = h.logs.includes(key)
            return {
              ...h,
              logs: hasLog ? h.logs.filter((l) => l !== key) : [...h.logs, key],
            }
          }),
        }))
      },

      /* Adiciona/sobrescreve anotação textual num dia específico do hábito.
         Chave do objeto notes é a data normalizada (YYYY-MM-DD). */
      addNote: (id, dateStr, text) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? { ...h, notes: { ...h.notes, [dateKey(dateStr)]: text } }
              : h
          ),
        })),

      /* Média geral de score de todos os hábitos no mês. */
      calcScore: (year, month) => {
        const habits = get().habits
        if (habits.length === 0) return 0
        const scores = habits.map((h) => calcHabitScore(h, year, month))
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      },

      /* Score de um hábito específico. */
      calcHabitScore: (id, year, month) => {
        const habit = get().habits.find((h) => h.id === id)
        if (!habit) return 0
        return calcHabitScore(habit, year, month)
      },

      /* Score semanal: média diária de check-ins entre hábitos daily.
         Útil para gráfico de calor semanal na dashboard. */
      getWeeklyScores: (year, month) => {
        const daysInMonth = getDaysInMonth(year, month)
        const weeks = [...new Set(
          Array.from({ length: daysInMonth }, (_, i) => {
            const key = dateKey(new Date(year, month, i + 1))
            return getWeekNumber(key)
          })
        )]
        return weeks.map((w) => {
          const weekDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
            .filter((d) => getWeekNumber(dateKey(new Date(year, month, d))) === w)
          const scoredDays = weekDays.map((d) => {
            const habits = get().habits
            const dayScore = habits.map((h) => {
              const key = dateKey(new Date(year, month, d))
              return h.frequency === 'daily' && h.logs.includes(key) ? 1 : 0
            }).reduce((a, b) => a + b, 0)
            const dailyHabits = habits.filter((h) => h.frequency === 'daily').length
            return dailyHabits > 0 ? (dayScore / dailyHabits) * 100 : 0
          })
          const value = scoredDays.length > 0
            ? Math.round(scoredDays.reduce((a, b) => a + b, 0) / scoredDays.length)
            : 0
          return { week: w, value }
        })
      },

      /* Dados completos pra tabela mensal: check-ins por semana, streak, score.
         Retorna { rows: dados por hábito, overall: média geral }.
         weekMax indica quantos dias existem em cada semana (pra escala). */
      getComputedData: (year, month) => {
        const habits = get().habits
        const daysInMonth = getDaysInMonth(year, month)
        const target = defaultMonthlyTarget

        const rows = habits.map((h) => {
          const t = h.monthlyTarget || target(h.frequency, year, month)
          let checkins = 0
          const weeks = { 1: 0, 2: 0, 3: 0, 4: 0, extras: 0 }
          const weekMax = { 1: 0, 2: 0, 3: 0, 4: 0, extras: 0 }

          for (let d = 1; d <= daysInMonth; d++) {
            const key = dateKey(new Date(year, month, d))
            const wn = getWeekNumber(key)
            const checked = h.logs.includes(key)

            if (wn <= 4) {
              if (checked) weeks[wn]++
              weekMax[wn]++
            } else {
              if (checked) weeks.extras++
              weekMax.extras++
            }
          }

          return {
            id: h.id,
            name: h.name,
            emoji: h.emoji,
            category: h.category,
            customCategory: h.customCategory,
            frequency: h.frequency,
            logs: h.logs,
            monthlyTarget: t,
            streak: calcStreak(h.logs),
            weeks,
            weekMax,
            checkins: Object.values(weeks).reduce((a, b) => a + b, 0),
            score: Math.min(100, Math.round((checkins / t) * 100)),
          }
        })

        const overall = habits.length > 0
          ? Math.round(rows.reduce((a, r) => a + r.score, 0) / rows.length)
          : 0

        return { rows, overall }
      },
    }),
    {
      name: 'nexus-habits',
      /* Migração: mapeia categorias antigas (controle → pessoal, etc.)
         e garante campos customCategory e monthlyTarget que não existiam. */
      migrate: (state) => {
        const catMap = { controle: 'pessoal', planejamento: 'estudos', longo_prazo: 'trabalho' }
        return {
          ...state,
          habits: (state.habits || []).map((h) => ({
            ...h,
            category: catMap[h.category] || h.category || 'pessoal',
            customCategory: h.customCategory || '',
            monthlyTarget: h.monthlyTarget || 0,
          })),
        }
      },
    }
  )
)

export default useHabitsStore
