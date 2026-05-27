import LoginForm from './LoginForm'
import BrandShowcase from '../../components/BrandShowcase'
import loginBg from '../../assets/bglogin.png'

const motes = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: 2 + (i % 5) * 1.5,
  left: 3 + ((i * 17) % 94),
  top: 5 + ((i * 13) % 90),
  opacity: 0.08 + (i % 4) * 0.08,
  delay: (i * 0.7) % 12,
  duration: 14 + (i % 3) * 4,
}))

export default function LoginPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-[position:30%_65%] bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />

      {/* Aurora blobs — atmosfera etérea */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6a4cff]/10 via-[#00d4bb]/5 to-transparent blur-[100px] animate-aurora-drift pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#e040fb]/8 via-[#2d6bff]/5 to-transparent blur-[80px] animate-aurora-drift pointer-events-none" style={{ animationDelay: '-7s' }} />

      {/* Gradiente escuro da esquerda p/ direita */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

      {/* Raios de luz — feixes sutis diagonais */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-bl from-white/3 via-transparent to-transparent pointer-events-none" />

      {/* Glow ambiente atrás do card */}
      <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-r from-[#6a4cff]/15 via-[#00d4bb]/5 to-transparent blur-[80px] animate-card-glow pointer-events-none" />

      {/* Light motes — partículas de luz flutuantes */}
      {motes.map((m) => (
        <div
          key={m.id}
          className="absolute rounded-full bg-white pointer-events-none animate-mote-float"
          style={{
            width: m.size,
            height: m.size,
            left: `${m.left}%`,
            top: `${m.top}%`,
            opacity: 0,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            '--mote-opacity': m.opacity,
          }}
        />
      ))}

      {/* Glass card — esquerda */}
      <div className="relative z-10 h-full flex items-center px-6 lg:px-16">
        <div className="w-full max-w-md auth-glass rounded-[32px] p-8 lg:p-10 animate-fade-in">
          <LoginForm />
        </div>
      </div>

      {/* BrandShowcase */}
      <BrandShowcase />
    </div>
  )
}
