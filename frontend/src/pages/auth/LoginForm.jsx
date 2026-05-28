import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../../services/api'
import nlogotext from '../../assets/nlogotext.png'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = await loginApi(email, password)

      if (data.error) {
        alert(data.error)
        return
      }

      localStorage.setItem('token', data.token)

      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      alert('Erro ao fazer login')
    }
  }

  return (
    <div className="w-full">
      <img
        src={nlogotext}
        alt="Nexus Planner"
        className="h-16 w-auto mb-10 opacity-95"
        draggable={false}
      />

      <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
        Acessar conta
      </h1>

      <p className="text-sm text-white/60 mb-8">
        Novo por aqui?{' '}
        <Link
          to="/register"
          className="font-medium text-white hover:text-white/80 transition-colors hover:underline"
        >
          Crie sua conta
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Email
          </label>

          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />

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
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Senha
          </label>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />

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

        {/* Remember */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#6a4cff] focus:ring-0 cursor-pointer"
            />

            <span className="text-white/50 group-hover:text-white/70 transition-colors">
              Lembrar-me
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-white/70 hover:text-white hover:underline transition-colors"
          >
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
    </div>
  )
}