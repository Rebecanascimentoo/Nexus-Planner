// Ilustracao animada com o icone Nexus ao centro, glows e particulas decorativas.
// Renderizado apenas em lg+ (hidden lg:block).

import nexusIcon from '../assets/icons/nexus.png'

const CONTAINER = 480

export default function BrandShowcase() {
  return (
    <div className="hidden lg:block absolute right-[25%] top-1/2 -translate-y-1/2 pointer-events-none select-none">
      <div className="relative flex items-center justify-center" style={{ width: CONTAINER, height: CONTAINER }}>
        {/* 1. Aurora solar — glow principal quente */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#ff8c42]/10 via-[#ffd700]/5 to-transparent blur-[120px] mix-blend-screen animate-glow-pulse" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#ff6b35]/15 via-[#ffa500]/8 to-transparent blur-[100px] mix-blend-screen animate-glow-pulse" style={{ animationDelay: '-2s' }} />

        {/* 2. Raios solares — starburst girando lentamente */}
        <div className="absolute w-[380px] h-[380px] animate-spin-slowest mix-blend-screen opacity-30 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2"
              style={{
                width: '1px',
                height: '190px',
                background: 'linear-gradient(to top, transparent, rgba(255,200,100,0.6), transparent)',
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                transformOrigin: 'bottom center',
              }}
            />
          ))}
        </div>

        {/* 3. Glow intenso no centro */}
        <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-white/30 via-[#ffd700]/20 to-transparent blur-[60px] animate-glow-pulse mix-blend-screen" />

        {/* 4. Nexus — o Sol */}
        <div className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#ff8c42]/20 to-[#ffd700]/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-[0_0_100px_rgba(255,200,100,0.6)]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/25 via-transparent to-white/5 animate-spin-slow pointer-events-none" style={{ animationDuration: '8s' }} />
          <img
            src={nexusIcon}
            alt="Nexus"
            className="relative w-[108px] h-[108px] object-contain opacity-95 drop-shadow-[0_0_40px_rgba(255,200,100,0.5)]"
            draggable={false}
          />
        </div>

        {/* 5. Particulas flutuantes — decoracao com formas geometricas */}
        <div className="absolute -top-8 left-16 text-white/30 animate-particle-drift" style={{ animationDelay: '0s' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,22 2,22" /></svg>
        </div>
        <div className="absolute -bottom-6 -right-8 text-white/25 animate-particle-drift" style={{ animationDelay: '-3s' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12,2 22,12 12,22 2,12" /></svg>
        </div>
        <div className="absolute top-24 -right-10 text-white/30 animate-particle-drift" style={{ animationDelay: '-6s' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /></svg>
        </div>
        <div className="absolute bottom-20 -left-6 text-white/20 animate-particle-drift" style={{ animationDelay: '-2s' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" /></svg>
        </div>
      </div>
    </div>
  )
}
