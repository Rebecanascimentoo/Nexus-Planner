// Página de configurações de tema. States do themeStore: mode (dark/light/system/custom), customAccent.
// setMode alterna entre 4 modos de tema. customAccent só aparece quando mode === 'custom'.
// resetTheme restaura tema padrão. Seção de preview mostra botões e card com o tema atual.

import { Settings, RotateCcw, Monitor, Moon, Sun, Palette } from 'lucide-react'
import useThemeStore from '../../store/themeStore'
import Button from '../../components/ui/Button'

const modes = [
  { id: 'dark', label: 'Escuro', icon: Moon, desc: 'Fundo escuro para reduzir cansaço visual' },
  { id: 'light', label: 'Claro', icon: Sun, desc: 'Fundo claro para ambientes bem iluminados' },
  { id: 'system', label: 'Sistema', icon: Monitor, desc: 'Segue a preferência do seu dispositivo' },
  { id: 'custom', label: 'Personalizado', icon: Palette, desc: 'Escolha sua própria cor de destaque' },
]

export default function SettingsPage() {
  const mode = useThemeStore((s) => s.mode)
  const customAccent = useThemeStore((s) => s.customAccent)
  const setMode = useThemeStore((s) => s.setMode)
  const setCustomAccent = useThemeStore((s) => s.setCustomAccent)
  const resetTheme = useThemeStore((s) => s.resetTheme)


  return (
    <div className="min-h-screen bg-dark-bg p-4 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Settings size={20} className="text-accent" />
        <div>
          <h1 className="text-xl font-bold text-white">Configurações</h1>
          <p className="text-xs text-text-secondary mt-0.5">Personalize sua experiência</p>
        </div>
      </div>

      {/* Theme Mode */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Tema</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {modes.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`rounded-xl p-5 text-left transition-all border-2 ${
                mode === id
                  ? 'border-accent bg-accent/10'
                  : 'border-white/10 hover:border-white/30 bg-white/[0.03]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  mode === id ? 'bg-accent/20' : 'bg-white/[0.06]'
                }`}
              >
                <Icon size={20} className={mode === id ? 'text-accent' : 'text-white/60'} />
              </div>
              <p className="text-sm font-semibold text-white mb-0.5">{label}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Accent Color */}
      {mode === 'custom' && (
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Cor de Destaque</h2>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={customAccent || '#6a4cff'}
              onChange={(e) => setCustomAccent(e.target.value)}
              className="w-14 h-14 rounded-xl cursor-pointer bg-transparent border border-white/10"
            />
            <div className="flex-1">
              <p className="text-sm text-white font-medium">
                {customAccent || '#6a4cff'}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Escolha a cor principal que será usada em botões, links e destques
              </p>
            </div>
            <div
              className="w-20 h-14 rounded-xl"
              style={{
                background: `linear-gradient(to right, ${customAccent || '#5a3fff'}, ${customAccent || '#00d4bb'})`,
              }}
            />
          </div>
        </div>
      )}

      {/* Preview Card */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Pré-visualização</h2>
        <div className="flex flex-wrap gap-3">
          <button className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-[#5a3fff]/20">
            Botão Primário
          </button>
          <button className="bg-white/[0.05] text-text-secondary px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10">
            Botão Secundário
          </button>
          <button className="bg-accent/15 text-accent px-4 py-2 rounded-lg text-xs font-semibold border border-accent/20">
            Tag Destaque
          </button>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-dark-card border border-dark-border/50">
          <p className="text-sm text-text-primary font-medium mb-1">Card de Exemplo</p>
          <p className="text-xs text-text-secondary">
            Este card mostra como os componentes aparecerão com o tema selecionado.
          </p>
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-end">
        <Button variant="ghost" onClick={resetTheme} className="gap-1.5">
          <RotateCcw size={14} />
          Resetar para Padrão
        </Button>
      </div>
    </div>
  )
}
