import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6']
const LABELS = { daily: 'Diário', weekly: 'Semanal', monthly: 'Mensal' }

// Gráfico de pizza (donut) mostrando distribuição de hábitos por frequência
// Props: { data: [{ frequency: 'daily'|'weekly'|'monthly', count: number }] }
// Exibe legenda com nome, quantidade e percentual ao lado do gráfico
export default function FrequencyPieChart({ data = [] }) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({ name: LABELS[d.frequency] || d.frequency, value: d.count }))

  if (chartData.length === 0) {
    return (
      <div className="glass-card rounded-xl p-5">
        <p className="text-sm font-semibold text-white mb-3">Por Frequência</p>
        <div className="flex items-center justify-center h-[180px] text-xs text-white/40">
          Sem dados
        </div>
      </div>
    )
  }

  const total = chartData.reduce((a, b) => a + b.value, 0)

  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-sm font-semibold text-white mb-3">Por Frequência</p>
      <div className="flex items-center gap-6 h-[180px]">
        <div className="w-28 h-28 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={44}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5">
          {chartData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-white/60">{d.name}</span>
              <span className="text-white font-medium">{d.value}</span>
              <span className="text-white/30">({Math.round((d.value / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
