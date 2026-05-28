// Página de hábitos com visão mensal. States: year, month, tab (filtro categoria), showForm, editingHabit, confirmDelete.
// calcHabitScore: calcula % de cumprimento (check-ins / target mensal). targetDefault: daily=mês, weekly=4, monthly=1.
// filteredHabits: filtra por categoria ativa (tab). allTabs: CATEGORIES + categorias custom detectadas.
// weeklyScores: divide mês em 4 semanas e calcula média diária de hábitos diários concluídos.
// categoryScores: agrupa score por categoria. monthlyTrend: score médio dos últimos 6 meses.
// frequencyDist: contagem de hábitos por frequência (daily/weekly/monthly). totalCompleted: check-ins vs target.
// handleCellClick: alterna check-in de um hábito em uma data específica na HabitTable.

import { useState, useMemo } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import useHabitsStore from '../../store/habitsStore'
import HabitTable from '../../components/habits/HabitTable'
import WeekCircles from '../../components/habits/WeekCircles'
import CategoryScoreChart from '../../components/habits/CategoryScoreChart'
import MonthlyTrendChart from '../../components/habits/MonthlyTrendChart'
import FrequencyPieChart from '../../components/habits/FrequencyPieChart'
import HabitForm from '../../components/habits/HabitForm'
import ConfirmDialog from '../../components/ConfirmDialog'
import Button from '../../components/ui/Button'

const CATEGORIES = [
  { value: 'all', label: 'Todos' },
  { value: 'saude', label: 'Saúde' },
  { value: 'estudos', label: 'Estudos' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'pessoal', label: 'Pessoal' },
  { value: 'social', label: 'Social' },
  { value: 'criatividade', label: 'Criatividade' },
]

const CATEGORY_LABELS = {
  saude: 'Saúde', estudos: 'Estudos', trabalho: 'Trabalho',
  pessoal: 'Pessoal', social: 'Social', criatividade: 'Criatividade',
}

const DATE_KEY = (y, m, d) => new Date(y, m, d).toISOString().split('T')[0]

function targetDefault(freq, daysInMonth) {
  if (freq === 'daily') return daysInMonth
  if (freq === 'weekly') return 4
  return 1
}

function calcTarget(h, daysInMonth) {
  return h.monthlyTarget || targetDefault(h.frequency, daysInMonth)
}

function calcHabitScore(h, year, month, daysInMonth) {
  const target = calcTarget(h, daysInMonth)
  let checkins = 0
  for (let d = 1; d <= daysInMonth; d++) {
    if (h.logs.includes(DATE_KEY(year, month, d))) checkins++
  }
  return Math.min(100, Math.round((checkins / (target || 1)) * 100))
}

export default function HabitsPage() {
  const habits = useHabitsStore((s) => s.habits)
  const deleteHabit = useHabitsStore((s) => s.deleteHabit)
  const toggleCheckIn = useHabitsStore((s) => s.toggleCheckIn)

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [tab, setTab] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const uniqueCategories = useMemo(() => {
    const cats = new Set(habits.map((h) => h.category === 'custom' ? h.customCategory : h.category))
    return [...cats].filter(Boolean)
  }, [habits])

  const allTabs = useMemo(() => {
    const base = [...CATEGORIES]
    uniqueCategories.forEach((c) => {
      if (!base.find((b) => b.value === c)) base.push({ value: c, label: c })
    })
    return base
  }, [uniqueCategories])

  const filteredHabits = useMemo(() => {
    if (tab === 'all') return habits
    return habits.filter((h) => {
      const cat = h.category === 'custom' ? h.customCategory : h.category
      return cat === tab
    })
  }, [habits, tab])

  const score = useMemo(() => {
    if (filteredHabits.length === 0) return 0
    let total = 0
    filteredHabits.forEach((h) => {
      total += calcHabitScore(h, year, month, daysInMonth)
    })
    return Math.round(total / filteredHabits.length)
  }, [filteredHabits, year, month, daysInMonth])

  const weeklyScores = useMemo(() => {
    const weekRanges = [
      { label: 'S1', days: [1, 2, 3, 4, 5, 6, 7] },
      { label: 'S2', days: [8, 9, 10, 11, 12, 13, 14] },
      { label: 'S3', days: [15, 16, 17, 18, 19, 20, 21] },
      { label: 'S4', days: [22, 23, 24, 25, 26, 27, 28] },
    ]
    return weekRanges.map((wr) => {
      let totalScore = 0
      let dayCount = 0
      wr.days.forEach((d) => {
        const key = DATE_KEY(year, month, d)
        const dailyHabits = filteredHabits.filter((h) => h.frequency === 'daily')
        if (dailyHabits.length === 0) return
        const done = dailyHabits.filter((h) => h.logs.includes(key)).length
        totalScore += (done / dailyHabits.length) * 100
        dayCount++
      })
      return {
        label: wr.label,
        value: dayCount > 0 ? Math.round(totalScore / dayCount) : 0,
      }
    })
  }, [filteredHabits, year, month])

  const categoryScores = useMemo(() => {
    const groups = {}
    habits.forEach((h) => {
      const cat = h.category === 'custom' ? h.customCategory : h.category
      if (!groups[cat]) groups[cat] = { habits: [], category: cat }
      groups[cat].habits.push(h)
    })
    return Object.values(groups).map((g) => {
      if (g.habits.length === 0) return { category: g.category, label: CATEGORY_LABELS[g.category] || g.category, score: 0, count: 0 }
      let total = 0
      g.habits.forEach((h) => { total += calcHabitScore(h, year, month, daysInMonth) })
      return {
        category: g.category,
        label: CATEGORY_LABELS[g.category] || g.category,
        score: Math.round(total / g.habits.length),
        count: g.habits.length,
      }
    })
  }, [habits, year, month, daysInMonth])

  const monthlyTrend = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const m = month - i
      const y = year + Math.floor(m / 12)
      const mo = ((m % 12) + 12) % 12
      const dim = new Date(y, mo + 1, 0).getDate()
      let totalScore = 0
      habits.forEach((h) => {
        totalScore += calcHabitScore(h, y, mo, dim)
      })
      const avg = habits.length > 0 ? Math.round(totalScore / habits.length) : 0
      const label = new Date(y, mo).toLocaleDateString('pt-BR', { month: 'short' })
      months.push({ label, value: avg, month: mo, year: y })
    }
    return months
  }, [habits, year, month])

  const frequencyDist = useMemo(() => {
    const counts = { daily: 0, weekly: 0, monthly: 0 }
    filteredHabits.forEach((h) => {
      if (counts[h.frequency] !== undefined) counts[h.frequency]++
    })
    return Object.entries(counts).map(([frequency, count]) => ({ frequency, count }))
  }, [filteredHabits])

  const totalCompleted = useMemo(() => {
    let total = 0
    let checked = 0
    filteredHabits.forEach((h) => {
      const target = calcTarget(h, daysInMonth)
      total += target
      for (let d = 1; d <= daysInMonth; d++) {
        if (h.logs.includes(DATE_KEY(year, month, d))) checked++
      }
    })
    return { checked, total, remaining: total - checked }
  }, [filteredHabits, year, month, daysInMonth])

  function handleCellClick(habitId, dateKey) {
    toggleCheckIn(habitId, dateKey)
  }

  const monthName = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long' })

  return (
    <div className="min-h-screen bg-dark-bg p-4 lg:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-1 rounded text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="text-center min-w-[140px]">
              <p className="text-lg font-bold text-white capitalize">{monthName}</p>
              <button
                onClick={() => setYear(new Date().getFullYear())}
                className="text-[11px] text-white/40 hover:text-white/60 transition-colors"
              >
                {year}
              </button>
            </div>
            <button onClick={nextMonth} className="p-1 rounded text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-white/50">Score</span>
            <span className={`font-bold text-base ${score >= 80 ? 'text-[#10b981]' : score >= 50 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>
              {score}%
            </span>
            <span className="text-white/20">|</span>
            <span className="text-white/50">Check-ins</span>
            <span className="font-semibold text-white/80">{totalCompleted.checked}</span>
            <span className="text-white/20">/</span>
            <span className="text-white/40">{totalCompleted.total}</span>
          </div>
          <Button onClick={() => { setEditingHabit(null); setShowForm(true) }} className="gap-1.5">
            <Plus size={16} />
            Novo
          </Button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto border-b border-white/[0.06] pb-0">
        {allTabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition-all whitespace-nowrap ${
              tab === t.value
                ? 'text-[#10b981] bg-white/[0.04] border-b-2 border-[#10b981]'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <HabitTable
          habits={filteredHabits}
          year={year}
          month={month}
          onCellClick={handleCellClick}
          onEdit={(h) => { setEditingHabit(h); setShowForm(true) }}
          onDelete={(id) => setConfirmDelete(habits.find((h) => h.id === id) || { id, name: 'hábito' })}
          showCategorySep={tab === 'all'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeekCircles weeks={weeklyScores} />
        <CategoryScoreChart data={categoryScores} />
        <MonthlyTrendChart data={monthlyTrend} />
        <FrequencyPieChart data={frequencyDist} />
      </div>

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onClose={() => { setShowForm(false); setEditingHabit(null) }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Excluir hábito"
        message={`Tem certeza que deseja excluir "${confirmDelete?.emoji} ${confirmDelete?.name}"?`}
        onConfirm={() => { if (confirmDelete) { deleteHabit(confirmDelete.id); setConfirmDelete(null) } }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
