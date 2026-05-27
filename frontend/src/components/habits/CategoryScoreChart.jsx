import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CATEGORY_COLORS = {
  saude: '#10b981',
  estudos: '#3b82f6',
  trabalho: '#8b5cf6',
  pessoal: '#f59e0b',
  social: '#ec4899',
  criatividade: '#06b6d4',
}

export default function CategoryScoreChart({ data = [] }) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      ...d,
      fill: CATEGORY_COLORS[d.category] || '#64748b',
    }))

  if (chartData.length === 0) {
    return (
      <div className="glass-card rounded-xl p-5">
        <p className="text-sm font-semibold text-white mb-3">Score por Categoria</p>
        <div className="flex items-center justify-center h-[150px] text-xs text-white/40">
          Sem dados
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-sm font-semibold text-white mb-3">Score por Categoria</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }} barSize={20}>
          <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
          <YAxis type="category" dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} width={60} />
          <Tooltip
            contentStyle={{ backgroundColor: '#131826', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            formatter={(value) => [`${value}%`, 'Score']}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, i) => (
              <rect key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
