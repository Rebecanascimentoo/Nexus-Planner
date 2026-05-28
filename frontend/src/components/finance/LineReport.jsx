import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { MONTH_NAMES } from '../../constants'

// Relatório financeiro anual: gráfico de área (receitas vs despesas) + indicadores (totais, saldo médio, crescimento, melhor/pior mês)
// Props: data = array de 12 meses com { income, expense, balance }
export default function LineReport({ data }) {
  // Mapeia dados mensais para o formato do gráfico (mês nomeado + income/expense/balance)
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((m, i) => ({
      month: MONTH_NAMES[i],
      income: m.income,
      expense: m.expense,
      balance: m.balance,
    }))
  }, [data])

  // Calcula indicadores financeiros do período: totais, saldo médio, crescimento percentual, melhor/pior mês
  const indicators = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalIncome: 0, totalExpense: 0, avgBalance: 0, growth: 0, bestMonth: '', worstMonth: '' }
    }
    const totalIncome = data.reduce((s, m) => s + m.income, 0)
    const totalExpense = data.reduce((s, m) => s + m.expense, 0)
    const avgBalance = data.reduce((s, m) => s + m.balance, 0) / 12
    const months = data.filter((m) => m.income > 0 || m.expense > 0)
    const first = months.find((m) => m.income > 0 || m.expense > 0) || months[0]
    const last = [...months].reverse().find((m) => m.income > 0 || m.expense > 0) || months[months.length - 1]
    const growth = first && first.income > 0 ? ((last.balance - first.balance) / Math.abs(first.balance || 1)) * 100 : 0
    const minBal = Math.min(...data.map((m) => m.balance))
    const maxBal = Math.max(...data.map((m) => m.balance))
    const worstMonth = MONTH_NAMES[data.findIndex((m) => m.balance === minBal)]
    const bestMonth = MONTH_NAMES[data.findIndex((m) => m.balance === maxBal)]
    return { totalIncome, totalExpense, avgBalance, growth, bestMonth, worstMonth }
  }, [data])

  function fmt(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (chartData.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <p className="text-sm text-white/40">Nenhum dado financeiro no período</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-accent" />
          <h2 className="text-base font-semibold text-white">Relatório Financeiro</h2>
        </div>
        <span className={`inline-flex items-center gap-1 text-sm font-medium ${indicators.growth >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
          {indicators.growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(indicators.growth).toFixed(1)}% em relação ao início do ano
        </span>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#131826', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value) => fmt(value)}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            <Area type="monotone" dataKey="income" name="Receitas" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" dot={{ fill: '#10b981', r: 3 }} />
            <Area type="monotone" dataKey="expense" name="Despesas" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" dot={{ fill: '#ef4444', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white/[0.05] rounded-lg p-3 text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Receita Total</p>
          <p className="text-sm font-bold text-[#10b981]">{fmt(indicators.totalIncome)}</p>
        </div>
        <div className="bg-white/[0.05] rounded-lg p-3 text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Despesa Total</p>
          <p className="text-sm font-bold text-[#ef4444]">{fmt(indicators.totalExpense)}</p>
        </div>
        <div className="bg-white/[0.05] rounded-lg p-3 text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Saldo Médio</p>
          <p className={`text-sm font-bold ${indicators.avgBalance >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{fmt(indicators.avgBalance)}</p>
        </div>
        <div className="bg-white/[0.05] rounded-lg p-3 text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Melhor / Pior Mês</p>
          <p className="text-sm font-bold text-white">
            <span className="text-[#10b981]">{indicators.bestMonth}</span>
            <span className="text-white/40 mx-1">/</span>
            <span className="text-[#ef4444]">{indicators.worstMonth}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
