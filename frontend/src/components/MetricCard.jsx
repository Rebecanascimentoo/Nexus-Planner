// Card de metrica para o dashboard. Exibe icone, valor numerico, rotulo
// e badge opcional. O icone e resolvido por string via iconMap.

import { CheckCircle, TrendingUp, Wallet, Calendar } from 'lucide-react'

// Mapeia o nome do icone (vindo do mockData) para o componente lucide-react
const iconMap = {
  CheckCircle,
  TrendingUp,
  Wallet,
  Calendar,
}

export default function MetricCard({ label, value, icon, iconColor, badge }) {
  const Icon = iconMap[icon]

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}1a` }} // fundo semi-transparente baseado na cor
        >
          {Icon && <Icon size={18} style={{ color: iconColor }} />}
        </div>
        {badge && (
          <span className="text-[11px] font-semibold text-white/40 tracking-wide">
            {badge}
          </span>
        )}
      </div>
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-xs text-white/50">{label}</span>
    </div>
  )
}
