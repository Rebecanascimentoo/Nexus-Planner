// Paleta de cores do Nexus Planner.
// Usar classes Tailwind via @theme em index.css sempre que possivel.
// Hex values sao fallback para casos onde Tailwind nao cobre.

export const COLORS = {
  // Primarias
  accent: '#6a4cff',
  accentLight: '#00d4bb',

  // Feedback — sucesso, erro, alerta, informacao
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Categorias — cores tematicas para rotulos e badges
  purple: '#8b5cf6',
  teal: '#14b8a6',
  pink: '#ec4899',
  cyan: '#00d4bb',
  indigo: '#6366f1',
  violet: '#5842f4',
  blue: '#3b82f6',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
}

// Mapa de status financeiro com cor + classes Tailwind
export const STATUS = {
  pago: { color: COLORS.success, bg: 'bg-[#10b981]/10', text: 'text-[#10b981]' },
  pendente: { color: COLORS.warning, bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]' },
  agendado: { color: COLORS.purple, bg: 'bg-[#8b5cf6]/10', text: 'text-[#8b5cf6]' },
}

// Estilos visuais por metodo de pagamento
export const PAYMENT_METHODS = {
  credito: { color: COLORS.warning, bg: 'bg-[#f59e0b]/15' },
  debito: { color: COLORS.info, bg: 'bg-[#3b82f6]/15' },
  dinheiro: { color: COLORS.success, bg: 'bg-[#10b981]/15' },
}

// Estilos visuais por tipo de objetivo financeiro
export const GOAL_TYPES = {
  reserva: { color: COLORS.info, bg: 'bg-[#3b82f6]/15' },
  caixinha: { color: COLORS.success, bg: 'bg-[#10b981]/15' },
  investimento: { color: COLORS.purple, bg: 'bg-[#8b5cf6]/15' },
}

// Paleta rotativa para graficos (Chart.js, Recharts etc.)
export const CHART_COLORS = [
  COLORS.accent,
  COLORS.cyan,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.success,
  COLORS.pink,
  COLORS.purple,
  COLORS.teal,
  '#f97316',
]
