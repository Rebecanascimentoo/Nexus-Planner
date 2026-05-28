import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { CHART_COLORS } from '../../constants/colors'

// Gráfico de barras de despesas por categoria. Props: data = [{ name, value }].
// Usa Recharts com cores do CHART_COLORS. Exibe placeholder se vazio.
export default function CategoryChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-sm text-white/40">
        Nenhuma despesa no período
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#131826',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
          }}
          formatter={(value) => `R$ ${value.toFixed(2)}`}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
