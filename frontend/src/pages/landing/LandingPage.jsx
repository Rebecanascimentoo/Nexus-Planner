import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import nexusLogo from '../../assets/nexuslogo.png'

const features = [
  { icon: Sparkles, title: 'Produtividade Integrada', desc: 'Tarefas, hábitos e finanças em um só lugar, conectados nativamente.' },
  { icon: Shield, title: 'Seu Núcleo Digital', desc: 'O Nexus age como o centro da sua organização pessoal, como um átomo.' },
  { icon: Zap, title: 'Insights Automáticos', desc: 'Dashboard inteligente com métricas em tempo real do seu progresso.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-16 h-16 border-b border-dark-border/30">
        <div className="flex items-center gap-3">
          <img src={nexusLogo} alt="" className="w-7 h-7 object-contain" />
          <span className="text-lg font-bold text-white tracking-tight">
            Nexus<span className="text-accent">.</span>
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-text-secondary hover:text-white transition-colors">
            Entrar
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
          >
            Cadastrar
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-8">
          <div className="absolute -inset-20 bg-gradient-to-r from-accent/10 via-[#2d6bff]/8 to-[#00d4bb]/10 blur-[100px] rounded-full" />
          <img
            src={nexusLogo}
            alt="Nexus Planner"
            className="w-40 h-40 lg:w-52 lg:h-52 object-contain relative drop-shadow-[0_0_60px_rgba(106,76,255,0.3)]"
          />
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
          O Núcleo da Sua{' '}
          <span className="bg-gradient-to-r from-accent via-[#2d6bff] to-[#00d4bb] bg-clip-text text-transparent">
            Produtividade
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mb-10 leading-relaxed">
          Nexus Planner conecta tarefas, hábitos, calendário e finanças em um ecossistema
          inteligente. Gerencie sua vida com propósito.
        </p>

        <div className="flex items-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-xl hover:bg-accent-hover transition-all shadow-xl shadow-accent/20"
          >
            Começar agora
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="text-text-secondary hover:text-white px-6 py-3 rounded-xl border border-dark-border hover:border-accent/30 transition-all"
          >
            Já tenho conta
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="px-6 lg:px-16 py-16 border-t border-dark-border/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-dark-card rounded-xl border border-dark-border/50 p-6 text-left hover:border-accent/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-16 py-4 border-t border-dark-border/30">
        <p className="text-xs text-text-secondary text-center">
          &copy; {new Date().getFullYear()} Nexus Planner. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
