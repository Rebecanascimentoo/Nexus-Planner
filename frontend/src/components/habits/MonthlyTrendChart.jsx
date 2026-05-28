import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Linha do tempo mensal do score geral de hábitos
// Props: { data: [{ label: string, value: number }] } — ex: [{ label: 'Jan', value: 72 }]
// Usa Recharts LineChart com gradiente roxo. Vazio → "Sem dados históricos"
export default function MonthlyTrendChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="glass-card rounded-xl p-5">
        <p className="text-sm font-semibold text-white mb-3">Histórico Mensal</p>
        <div className="flex items-center justify-center h-[150px] text-xs text-white/40">
          Sem dados históricos
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-sm font-semibold text-white mb-3">Histórico Mensal</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#131826', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            formatter={(value) => [`${value}%`, 'Score']}
          />
          <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} activeDot={{ fill: '#8b5cf6', r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
