import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function ChangeBadge({ value }) {
  if (value === 0 || value === undefined) return <Minus size={14} className="text-white/30" />
  const isUp = value > 0
  const Icon = isUp ? TrendingUp : TrendingDown
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isUp ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
      <Icon size={12} />
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}
