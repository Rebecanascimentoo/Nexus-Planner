// Página de recuperação de senha. Renderiza formulário de email e estado de confirmação.
// States: email (input), sent (alterna entre formulário e mensagem de sucesso).
// handleSubmit: valida email não vazio e troca para estado "sent".
// motes: partículas decorativas flutuantes no fundo (20 elementos com posição/tamanho/opacidade pseudo-aleatórios).

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandShowcase from '../../components/BrandShowcase'
import loginBg from '../../assets/bglogin.png'
import nlogotext from '../../assets/nlogotext.png'

const motes = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: 2 + (i % 5) * 1.5,
  left: 3 + ((i * 17) % 94),
  top: 5 + ((i * 13) % 90),
  opacity: 0.08 + (i % 4) * 0.08,
  delay: (i * 0.7) % 12,
  duration: 14 + (i % 3) * 4,
}))

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      <div
        className="absolute inset-0 bg-cover bg-[position:30%_65%] bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-bl from-white/3 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6a4cff]/10 via-[#00d4bb]/5 to-transparent blur-[100px] animate-aurora-drift pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#e040fb]/8 via-[#2d6bff]/5 to-transparent blur-[80px] animate-aurora-drift pointer-events-none" style={{ animationDelay: '-7s' }} />
      <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-r from-[#6a4cff]/15 via-[#00d4bb]/5 to-transparent blur-[80px] animate-card-glow pointer-events-none" />
      {motes.map((m) => (
        <div key={m.id} className="absolute rounded-full bg-white pointer-events-none animate-mote-float"
          style={{ width: m.size, height: m.size, left: `${m.left}%`, top: `${m.top}%`, opacity: 0, animationDelay: `${m.delay}s`, animationDuration: `${m.duration}s`, '--mote-opacity': m.opacity }}
        />
      ))}
      <div className="relative z-10 h-full flex items-center px-6 lg:px-16">
        <div className="w-full max-w-md auth-glass rounded-[32px] p-8 lg:p-10 animate-fade-in">
          <img src={nlogotext} alt="Nexus Planner" className="h-16 w-auto mb-10 opacity-95" draggable={false} />
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Recuperar senha</h1>
          <p className="text-sm text-white/60 mb-8">
            {sent
              ? 'Se o email existir, você receberá um link de redefinição em instantes.'
              : 'Digite seu email para receber um link de redefinição.'
            }{' '}
            <Link to="/login" className="font-medium text-white hover:text-white/80 transition-colors hover:underline">
              Voltar ao login
            </Link>
          </p>
          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" required
                  className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all"
                />
              </div>
              <button type="submit" className="gradient-btn w-full rounded-xl py-3 text-sm font-semibold cursor-pointer shadow-lg shadow-[#5a3fff]/20">
                Enviar link
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#10b981]/15 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </div>
              <p className="text-sm text-white">Email enviado com sucesso!</p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 text-sm font-medium text-accent hover:underline"
              >
                Voltar ao login
              </button>
            </div>
          )}
        </div>
      </div>
      <BrandShowcase />
    </div>
  )
}
