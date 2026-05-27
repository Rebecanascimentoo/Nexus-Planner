import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function createTransaction(data) {
  return {
    id: crypto.randomUUID(),
    description: data.description,
    amount: parseFloat(data.amount),
    type: data.type || 'expense',
    category: data.category || 'Outros',
    date: data.date || new Date().toISOString().split('T')[0],
    paymentMethod: data.paymentMethod || 'debito',
    essential: data.essential ?? true,
    status: data.status || 'pago',
    recurring: data.recurring || null,
    createdAt: new Date().toISOString(),
  }
}

function createGoal(data) {
  return {
    id: crypto.randomUUID(),
    name: data.name,
    targetAmount: parseFloat(data.targetAmount),
    currentAmount: parseFloat(data.currentAmount || 0),
    type: data.type || 'reserva',
    deadline: data.deadline || '',
    createdAt: new Date().toISOString(),
  }
}

export const transactionCategories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Salário',
  'Freelance',
  'Investimentos',
  'Outros',
]

export const transactionTypes = [
  { value: 'income', label: 'Receita' },
  { value: 'expense', label: 'Despesa' },
]

export const paymentMethods = [
  { value: 'debito', label: 'Débito' },
  { value: 'credito', label: 'Crédito' },
  { value: 'dinheiro', label: 'Dinheiro' },
]

export const transactionStatuses = [
  { value: 'pago', label: 'Pago' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'agendado', label: 'Agendado' },
]

export const goalTypes = [
  { value: 'reserva', label: 'Reserva de Emergência' },
  { value: 'caixinha', label: 'Caixinha (Meta)' },
  { value: 'investimento', label: 'Investimento' },
]

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

const defaultTransactions = [
  { id: 't1', description: 'Salário Maio', amount: 8450, type: 'income', category: 'Salário', date: daysAgo(2), paymentMethod: 'debito', essential: true, status: 'pago', createdAt: new Date().toISOString() },
  { id: 't2', description: 'Aluguel', amount: 1800, type: 'expense', category: 'Moradia', date: daysAgo(1), paymentMethod: 'debito', essential: true, status: 'pago', recurring: 'monthly', createdAt: new Date().toISOString() },
  { id: 't3', description: 'Supermercado', amount: 520, type: 'expense', category: 'Alimentação', date: daysAgo(3), paymentMethod: 'debito', essential: true, status: 'pago', createdAt: new Date().toISOString() },
  { id: 't4', description: 'Uber', amount: 34, type: 'expense', category: 'Transporte', date: daysAgo(1), paymentMethod: 'credito', essential: false, status: 'pago', createdAt: new Date().toISOString() },
  { id: 't5', description: 'Freela Web', amount: 2500, type: 'income', category: 'Freelance', date: daysAgo(4), paymentMethod: 'debito', essential: true, status: 'pago', createdAt: new Date().toISOString() },
  { id: 't6', description: 'Academia', amount: 99, type: 'expense', category: 'Saúde', date: daysAgo(0), paymentMethod: 'credito', essential: false, status: 'pago', createdAt: new Date().toISOString() },
  { id: 't7', description: 'Curso React', amount: 450, type: 'expense', category: 'Educação', date: daysAgo(5), paymentMethod: 'credito', essential: false, status: 'pago', createdAt: new Date().toISOString() },
  { id: 't8', description: 'Cinema', amount: 48, type: 'expense', category: 'Lazer', date: daysAgo(2), paymentMethod: 'dinheiro', essential: false, status: 'pago', createdAt: new Date().toISOString() },
  { id: 't9', description: 'Dividendos', amount: 320, type: 'income', category: 'Investimentos', date: daysAgo(0), paymentMethod: 'debito', essential: true, status: 'pago', createdAt: new Date().toISOString() },
  { id: 't10', description: 'Conta Luz', amount: 187, type: 'expense', category: 'Moradia', date: daysAgo(6), paymentMethod: 'debito', essential: true, status: 'pendente', recurring: 'monthly', createdAt: new Date().toISOString() },
  { id: 't11', description: 'Plano Saúde', amount: 390, type: 'expense', category: 'Saúde', date: daysAgo(0), paymentMethod: 'credito', essential: true, status: 'agendado', recurring: 'monthly', createdAt: new Date().toISOString() },
  { id: 't12', description: 'Internet', amount: 129, type: 'expense', category: 'Moradia', date: daysAgo(1), paymentMethod: 'debito', essential: true, status: 'pago', recurring: 'monthly', createdAt: new Date().toISOString() },
]

const defaultBudgets = [
  { category: 'Alimentação', planned: 1200 },
  { category: 'Transporte', planned: 400 },
  { category: 'Moradia', planned: 2500 },
  { category: 'Saúde', planned: 600 },
  { category: 'Educação', planned: 500 },
  { category: 'Lazer', planned: 300 },
  { category: 'Outros', planned: 200 },
]

const defaultGoals = [
  { id: 'g1', name: 'Reserva de Emergência', targetAmount: 20000, currentAmount: 8450, type: 'reserva', deadline: '', createdAt: new Date().toISOString() },
  { id: 'g2', name: 'Viagem de Férias', targetAmount: 8000, currentAmount: 2300, type: 'caixinha', deadline: '2026-12-31', createdAt: new Date().toISOString() },
  { id: 'g3', name: 'Carteira de Ações', targetAmount: 50000, currentAmount: 12500, type: 'investimento', deadline: '', createdAt: new Date().toISOString() },
]

const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: defaultTransactions,
      budgets: defaultBudgets,
      goals: defaultGoals,
      filter: { month: new Date().getMonth(), year: new Date().getFullYear(), type: 'all', category: 'all', paymentMethod: 'all', status: 'all', essential: 'all', search: '' },

      addTransaction: (data) =>
        set((state) => ({
          transactions: [...state.transactions, createTransaction(data)],
        })),

      updateTransaction: (id, data) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setFilter: (partial) =>
        set((state) => ({ filter: { ...state.filter, ...partial } })),

      /* Retorna transações filtradas por mês/ano, tipo, categoria,
         método de pagamento, status, essencialidade e busca textual. */
      getFiltered: () => {
        const { transactions, filter } = get()
        return transactions.filter((t) => {
          const d = new Date(t.date)
          if (d.getMonth() !== filter.month || d.getFullYear() !== filter.year) return false
          if (filter.type !== 'all' && t.type !== filter.type) return false
          if (filter.category !== 'all' && t.category !== filter.category) return false
          if (filter.paymentMethod !== 'all' && t.paymentMethod !== filter.paymentMethod) return false
          if (filter.status !== 'all' && t.status !== filter.status) return false
          if (filter.essential !== 'all' && String(t.essential) !== filter.essential) return false
          if (filter.search && !t.description.toLowerCase().includes(filter.search.toLowerCase())) return false
          return true
        })
      },

      getFilteredByMonth: (month, year) => {
        return get().transactions.filter((t) => {
          const d = new Date(t.date)
          return d.getMonth() === month && d.getFullYear() === year
        })
      },

      getSummary: (filtered) => {
        const list = filtered || get().getFiltered()
        const income = list.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
        const expenses = list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
        return { income, expenses, balance: income - expenses }
      },

      getCategoryTotals: (filtered) => {
        const list = filtered || get().getFiltered()
        const expenses = list.filter((t) => t.type === 'expense')
        const map = {}
        expenses.forEach((t) => {
          map[t.category] = (map[t.category] || 0) + t.amount
        })
        return Object.entries(map).map(([name, value]) => ({ name, value }))
      },

      getCreditCardBill: (filtered) => {
        const list = filtered || get().getFiltered()
        const pending = list.filter((t) => t.paymentMethod === 'credito' && t.type === 'expense' && t.status === 'pendente')
        const totalPending = pending.reduce((s, t) => s + t.amount, 0)
        const totalCredit = list.filter((t) => t.paymentMethod === 'credito' && t.type === 'expense').reduce((s, t) => s + t.amount, 0)
        return { totalPending, totalCredit, pendingCount: pending.length }
      },

      getPaymentMethodSummary: (filtered) => {
        const list = filtered || get().getFiltered()
        const expenses = list.filter((t) => t.type === 'expense')
        const totals = { credito: 0, debito: 0, dinheiro: 0 }
        expenses.forEach((t) => {
          totals[t.paymentMethod] = (totals[t.paymentMethod] || 0) + t.amount
        })
        return totals
      },

      getPreviousMonthComparison: () => {
        const { filter } = get()
        let prevMonth = filter.month - 1
        let prevYear = filter.year
        if (prevMonth < 0) { prevMonth = 11; prevYear-- }
        const current = get().getFiltered()
        const previous = get().getFilteredByMonth(prevMonth, prevYear)
        const curSummary = get().getSummary(current)
        const prevSummary = get().getSummary(previous)
        return {
          income: { current: curSummary.income, previous: prevSummary.income, change: prevSummary.income ? ((curSummary.income - prevSummary.income) / prevSummary.income) * 100 : 0 },
          expenses: { current: curSummary.expenses, previous: prevSummary.expenses, change: prevSummary.expenses ? ((curSummary.expenses - prevSummary.expenses) / prevSummary.expenses) * 100 : 0 },
          balance: { current: curSummary.balance, previous: prevSummary.balance },
        }
      },

      getBudgetComparison: (filtered) => {
        const { budgets, filter } = get()
        const list = filtered || get().getFiltered()
        const expenseMap = {}
        list.filter((t) => t.type === 'expense').forEach((t) => {
          expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount
        })
        const activeBudgets = budgets.filter(() => true)
        const totalPlanned = activeBudgets.reduce((s, b) => s + b.planned, 0)
        const totalActual = activeBudgets.reduce((s, b) => s + (expenseMap[b.category] || 0), 0)
        return {
          items: activeBudgets.map((b) => ({
            category: b.category,
            planned: b.planned,
            actual: expenseMap[b.category] || 0,
            remaining: b.planned - (expenseMap[b.category] || 0),
          })),
          totalPlanned,
          totalActual,
          remainingToSpend: totalPlanned - totalActual,
        }
      },

      updateBudget: (category, planned) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.category === category ? { ...b, planned } : b
          ),
        })),

      addGoal: (data) =>
        set((state) => ({
          goals: [...state.goals, createGoal(data)],
        })),

      updateGoal: (id, data) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...data } : g
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      contributeToGoal: (id, amount) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, currentAmount: g.currentAmount + parseFloat(amount) } : g
          ),
        })),

      /* Duplica transações recorrentes ao navegar para um novo mês/ano.
         Evita duplicação checando se já existe transação idêntica no mês destino. */
      duplicateRecurringTransactions: (month, year) =>
        set((state) => {
          const newTxns = []
          state.transactions.forEach((t) => {
            if (!t.recurring) return
            const d = new Date(t.date)
            if (d.getMonth() === month && d.getFullYear() === year) return
            const alreadyExists = state.transactions.some(
              (et) =>
                et.description === t.description &&
                et.amount === t.amount &&
                et.category === t.category &&
                new Date(et.date).getMonth() === month &&
                new Date(et.date).getFullYear() === year
            )
            if (alreadyExists) return
            const newDate = new Date(t.date)
            newDate.setFullYear(year)
            newDate.setMonth(month)
            if (d.getDate() > 28) newDate.setDate(28)
            newTxns.push({
              ...t,
              id: crypto.randomUUID(),
              date: newDate.toISOString().split('T')[0],
              status: 'pendente',
              createdAt: new Date().toISOString(),
            })
          })
          return newTxns.length ? { transactions: [...state.transactions, ...newTxns] } : state
        }),
    }),
    { name: 'nexus-finance' }
  )
)

export default useFinanceStore
