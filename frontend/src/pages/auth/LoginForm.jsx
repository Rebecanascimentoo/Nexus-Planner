import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import nlogotext from '../../assets/nlogotext.png'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
    navigate('/dashboard')
  }

  return (
    <div className="w-full">
      <img src={nlogotext} alt="Nexus Planner" className="h-16 w-auto mb-10 opacity-95" draggable={false} />

      <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
        Acessar conta
      </h1>
      <p className="text-sm text-white/60 mb-8">
        Novo por aqui?{' '}
        <Link to="/register" className="font-medium text-white hover:text-white/80 transition-colors hover:underline">
          Crie sua conta
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Senha</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="glass-input w-full rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#6a4cff] focus:ring-0 cursor-pointer"
            />
            <span className="text-white/50 group-hover:text-white/70 transition-colors">Lembrar-me</span>
          </label>
          <Link to="/forgot-password" className="text-white/70 hover:text-white hover:underline transition-colors">
            Esqueceu a senha?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="gradient-btn w-full rounded-xl py-3 text-sm font-semibold cursor-pointer shadow-lg shadow-[#5a3fff]/20 mt-2"
        >
          Entrar
        </button>
      </form>

      {/* Social divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/40 font-medium">ou continue com</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.10] transition-all cursor-pointer"
          title="Google"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.832 1.24 6.926l4.026 2.839Z" />
            <path fill="#34A853" d="M16.04 18.714c-1.12.75-2.523 1.195-4.04 1.195-3.584 0-6.623-2.328-7.722-5.42L.355 15.604C2.318 19.708 6.325 22 12 22c3.204 0 5.948-1.045 7.929-2.908l-3.89-3.378Z" />
            <path fill="#FBBC05" d="M5.717 13.989c-.278-.83-.436-1.712-.436-2.624 0-.926.162-1.818.45-2.642L1.24 6.926 1.24 6.926A7.077 7.077 0 0 0 .001 12c0 2.085.455 4.066 1.24 5.842l4.476-3.853Z" />
            <path fill="#4285F4" d="M12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.832 1.24 6.926l4.026 2.839A7.077 7.077 0 0 1 12 4.909Z" />
          </svg>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.10] transition-all cursor-pointer"
          title="Microsoft"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
            <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
            <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
            <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
          </svg>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.10] transition-all cursor-pointer"
          title="Apple"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
        </button>
      </div>

      <p className="text-center text-[11px] text-white/30 mt-6">
        Ao continuar, você aceita nossos Termos de Serviço e Política de Privacidade.
      </p>
    </div>
  )
}
