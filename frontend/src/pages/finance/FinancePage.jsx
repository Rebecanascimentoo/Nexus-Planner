import { useState, useMemo, useCallback } from 'react'
import { Plus, Wallet, CreditCard, Landmark, Banknote, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import useFinanceStore from '../../store/financeStore'
import useNotificationStore from '../../store/notificationStore'
import TransactionItem from '../../components/finance/TransactionItem'
import TransactionForm from '../../components/finance/TransactionForm'
import TransactionFilters from '../../components/finance/TransactionFilters'
import CategoryChart from '../../components/finance/CategoryChart'
import BudgetCard from '../../components/finance/BudgetCard'
import GoalCard, { GoalForm } from '../../components/finance/GoalCard'
import ChangeBadge from '../../components/finance/ChangeBadge'
import ConfirmDialog from '../../components/ConfirmDialog'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../utils/date'
import { MONTH_NAMES } from '../../constants'

export default function FinancePage() {
  const transactions = useFinanceStore((s) => s.transactions)
  const goals = useFinanceStore((s) => s.goals)
  const filter = useFinanceStore((s) => s.filter)
  const setFilter = useFinanceStore((s) => s.setFilter)
  const getFiltered = useFinanceStore((s) => s.getFiltered)
  const getSummary = useFinanceStore((s) => s.getSummary)
  const getCategoryTotals = useFinanceStore((s) => s.getCategoryTotals)
  const getPaymentMethodSummary = useFinanceStore((s) => s.getPaymentMethodSummary)
  const getCreditCardBill = useFinanceStore((s) => s.getCreditCardBill)
  const getPreviousMonthComparison = useFinanceStore((s) => s.getPreviousMonthComparison)
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction)
  const duplicateRecurringTransactions = useFinanceStore((s) => s.duplicateRecurringTransactions)
  const notifySuccess = useNotificationStore((s) => s.success)

  const [showForm, setShowForm] = useState(false)
  const [editingTxn, setEditingTxn] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showGoalForm, setShowGoalForm] = useState(false)

  const filtered = useMemo(() => getFiltered(), [transactions, getFiltered])
  const summary = useMemo(() => getSummary(filtered), [filtered, getSummary])
  const categoryData = useMemo(() => getCategoryTotals(filtered), [filtered, getCategoryTotals])
  const paymentSummary = useMemo(() => getPaymentMethodSummary(filtered), [filtered, getPaymentMethodSummary])
  const creditCardBill = useMemo(() => getCreditCardBill(filtered), [filtered, getCreditCardBill])
  const comparison = useMemo(() => getPreviousMonthComparison(), [transactions, getPreviousMonthComparison])

  const savingsRate = summary.income > 0 ? (summary.balance / summary.income) * 100 : 0

  const handleDelete = useCallback((id) => {
    const txn = transactions.find((t) => t.id === id)
    setConfirmDelete(txn || { id, description: 'esta transação' })
  }, [transactions])

  const confirmDeleteTxn = useCallback(() => {
    if (confirmDelete) {
      deleteTransaction(confirmDelete.id)
      notifySuccess('Transação excluída')
      setConfirmDelete(null)
    }
  }, [confirmDelete, deleteTransaction, notifySuccess])

  function handleSetFilter(partial) {
    if (partial.month !== undefined || partial.year !== undefined) {
      const newMonth = partial.month ?? filter.month
      const newYear = partial.year ?? filter.year
      duplicateRecurringTransactions(newMonth, newYear)
    }
    setFilter(partial)
  }

  function exportCSV() {
    const headers = ['Data', 'Descrição', 'Valor', 'Tipo', 'Categoria', 'Forma Pagamento', 'Essencial', 'Status', 'Recorrência']
    const rows = filtered.map((t) => [
      t.date,
      `"${t.description}"`,
      t.amount.toFixed(2),
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.category,
      { credito: 'Crédito', debito: 'Débito', dinheiro: 'Dinheiro' }[t.paymentMethod] || t.paymentMethod,
      t.essential ? 'Sim' : 'Não',
      { pago: 'Pago', pendente: 'Pendente', agendado: 'Agendado' }[t.status] || t.status,
      { monthly: 'Mensal', yearly: 'Anual' }[t.recurring] || '',
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financas-${MONTH_NAMES[filter.month]}-${filter.year}.csv`
    a.click()
    URL.revokeObjectURL(url)
    notifySuccess('CSV exportado')
  }

  return (
    <div className="min-h-screen bg-dark-bg p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet size={20} className="text-accent" />
          <div>
            <h1 className="text-xl font-bold text-white">Finanças</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              {filtered.length} transações no período
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={exportCSV} className="gap-1">
            <Download size={14} />
            CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowGoalForm(true)} className="gap-1">
            <Plus size={14} />
            Nova Meta
          </Button>
          <Button onClick={() => { setEditingTxn(null); setShowForm(true) }} className="gap-1.5">
            <Plus size={16} />
            Nova Transação
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        <button
          onClick={() => handleSetFilter({ year: filter.year - 1 })}
          className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: 12 }, (_, i) => {
          const current = i === filter.month
          return (
            <button
              key={i}
              onClick={() => handleSetFilter({ month: i })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                current ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05]'
              }`}
            >
              {MONTH_NAMES[i]}
            </button>
          )
        })}
        <button
          onClick={() => handleSetFilter({ year: filter.year + 1 })}
          className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <ChevronRight size={16} />
        </button>
        <span className="text-xs text-white/40 font-medium ml-2 min-w-[44px]">{filter.year}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-white/50 mb-1">Receitas</p>
          <p className="text-lg font-bold text-[#10b981]">{formatCurrency(summary.income)}</p>
          <ChangeBadge value={comparison.income.change} />
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-white/50 mb-1">Despesas</p>
          <p className="text-lg font-bold text-[#ef4444]">{formatCurrency(summary.expenses)}</p>
          <ChangeBadge value={comparison.expenses.change} />
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-white/50 mb-1">Saldo</p>
          <p className={`text-lg font-bold ${summary.balance >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {formatCurrency(summary.balance)}
          </p>
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${savingsRate >= 20 ? 'text-[#10b981]' : savingsRate >= 10 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>
            {savingsRate.toFixed(1)}% economia
          </span>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-white/50 mb-1 flex items-center justify-center gap-1"><CreditCard size={12} /> Fatura</p>
          <p className="text-lg font-bold text-[#f59e0b]">{formatCurrency(creditCardBill.totalPending)}</p>
          {creditCardBill.totalPending > 0 && (
            <p className="text-[10px] text-white/40">{creditCardBill.pendingCount} pendente(s)</p>
          )}
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-white/50 mb-1 flex items-center justify-center gap-1"><CreditCard size={12} /> Crédito</p>
          <p className="text-lg font-bold text-[#f59e0b]">{formatCurrency(paymentSummary.credito)}</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-white/50 mb-1 flex items-center justify-center gap-1"><Landmark size={12} /> Débito</p>
          <p className="text-lg font-bold text-[#3b82f6]">{formatCurrency(paymentSummary.debito)}</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-white/50 mb-1 flex items-center justify-center gap-1"><Banknote size={12} /> Dinheiro</p>
          <p className="text-lg font-bold text-[#10b981]">{formatCurrency(paymentSummary.dinheiro)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-base font-semibold text-white">Metas e Reservas</h2>
          {goals.length === 0 ? (
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-sm text-white/40">Nenhuma meta cadastrada</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setShowGoalForm(true)}>
                <Plus size={14} /> Criar Meta
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <BudgetCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Distribuição de Despesas</h2>
          <CategoryChart data={categoryData} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Transações</h2>
          </div>
          <TransactionFilters />
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-dark-card border border-dark-border/50 flex items-center justify-center mb-3">
                  <Wallet size={22} className="text-text-muted" />
                </div>
                <p className="text-sm text-text-secondary">
                  Nenhuma transação encontrada
                </p>
                <Button
                  variant="ghost"
                  className="mt-3 text-xs"
                  onClick={() => { setEditingTxn(null); setShowForm(true) }}
                >
                  <Plus size={14} />
                  Adicionar
                </Button>
              </div>
            ) : (
              filtered.slice().reverse().map((txn) => (
                <TransactionItem
                  key={txn.id}
                  transaction={txn}
                  onEdit={(t) => { setEditingTxn(t); setShowForm(true) }}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <TransactionForm
          transaction={editingTxn}
          onClose={() => { setShowForm(false); setEditingTxn(null) }}
        />
      )}

      {showGoalForm && (
        <GoalForm onClose={() => setShowGoalForm(false)} />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Excluir transação"
        message={`Tem certeza que deseja excluir "${confirmDelete?.description}"?`}
        onConfirm={confirmDeleteTxn}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
