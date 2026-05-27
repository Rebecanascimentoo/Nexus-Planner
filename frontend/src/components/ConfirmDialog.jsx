import { AlertTriangle, X } from 'lucide-react'
import Button from './ui/Button'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Excluir', danger = true }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm glass-card rounded-2xl shadow-2xl p-6" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(32px)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#ef4444]/15 flex items-center justify-center">
            <AlertTriangle size={20} className="text-[#ef4444]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{title || 'Confirmar'}</h3>
            <p className="text-sm text-text-secondary mt-0.5">{message || 'Tem certeza?'}</p>
          </div>
          <button onClick={onCancel} className="ml-auto text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <button
            onClick={onConfirm}
            className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer text-sm px-5 py-2.5 ${
              danger
                ? 'bg-[#ef4444] text-white hover:bg-[#dc2626] shadow-lg shadow-[#ef4444]/20'
                : 'gradient-btn shadow-lg shadow-[#5a3fff]/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
