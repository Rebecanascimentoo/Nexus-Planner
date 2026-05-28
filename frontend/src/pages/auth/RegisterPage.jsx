// Página de cadastro de nova conta. States: name, email, password.
// handleSubmit: valida campos não vazios, chama login() para registrar e redireciona.
// Reusa o mesmo fundo decorativo (bglogin, gradientes, motes) das páginas de auth.

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandShowcase from '../../components/BrandShowcase'
import useAuthStore from '../../store/authStore'
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

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) return
    login(email, password)
    navigate('/dashboard')
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
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Criar conta</h1>
          <p className="text-sm text-white/60 mb-8">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-white hover:text-white/80 transition-colors hover:underline">
              Faça login
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Nome</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome" required
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" required
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Senha</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all"
              />
            </div>
            <button type="submit" className="gradient-btn w-full rounded-xl py-3 text-sm font-semibold cursor-pointer shadow-lg shadow-[#5a3fff]/20 mt-2">
              Cadastrar
            </button>
          </form>
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/40 font-medium">ou continue com</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button type="button" className="flex items-center justify-center py-2.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.10] transition-all cursor-pointer" title="Google">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.832 1.24 6.926l4.026 2.839Z"/><path fill="#34A853" d="M16.04 18.714c-1.12.75-2.523 1.195-4.04 1.195-3.584 0-6.623-2.328-7.722-5.42L.355 15.604C2.318 19.708 6.325 22 12 22c3.204 0 5.948-1.045 7.929-2.908l-3.89-3.378Z"/><path fill="#FBBC05" d="M5.717 13.989c-.278-.83-.436-1.712-.436-2.624 0-.926.162-1.818.45-2.642L1.24 6.926A7.077 7.077 0 0 0 .001 12c0 2.085.455 4.066 1.24 5.842l4.476-3.853Z"/><path fill="#4285F4" d="M12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.832 1.24 6.926l4.026 2.839A7.077 7.077 0 0 1 12 4.909Z"/></svg>
            </button>
            <button type="button" className="flex items-center justify-center py-2.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.10] transition-all cursor-pointer" title="Microsoft">
              <svg width="18" height="18" viewBox="0 0 24 24"><rect x="2" y="2" width="9.5" height="9.5" fill="#F25022"/><rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00"/><rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF"/><rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900"/></svg>
            </button>
            <button type="button" className="flex items-center justify-center py-2.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.10] transition-all cursor-pointer" title="Apple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            </button>
          </div>
        </div>
      </div>
      <BrandShowcase />
    </div>
  )
}
