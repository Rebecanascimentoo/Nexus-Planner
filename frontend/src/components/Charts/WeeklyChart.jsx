import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Gráfico de área semanal (dashboard) com gradiente roxo
// Props: { data: [{ day: string, value: number }] } — ex: [{ day: 'Seg', value: 5 }]
// Usa Recharts AreaChart com gradiente linear personalizado
export default function WeeklyChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5842f4" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#5842f4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
          domain={[0, 'auto']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#131826',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
          }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#5842f4"
          strokeWidth={2}
          fill="url(#colorValue)"
          dot={{ fill: '#5842f4', r: 3, strokeWidth: 0 }}
          activeDot={{ fill: '#5842f4', r: 5, strokeWidth: 2, stroke: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
