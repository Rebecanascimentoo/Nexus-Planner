// Botão reutilizável com 3 variantes visuais: primary (gradiente), ghost (vidrado), outline (borda)
// Props: { variant?: 'primary' | 'ghost' | 'outline', className?: string, children, ...props }
// Props excedentes (onClick, disabled, type, etc.) são spreadadas no <button>
export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer text-sm px-5 py-2.5'

  const variants = {
    primary: 'gradient-btn shadow-lg shadow-[#5a3fff]/20',
    ghost: 'glass-btn-ghost',
    outline: 'bg-transparent text-white/60 border border-white/10 hover:border-white/30 hover:text-white',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
