import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import useNotificationStore from '../store/notificationStore'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'border-[#10b981] bg-[#10b981]/10',
  error: 'border-[#ef4444] bg-[#ef4444]/10',
  info: 'border-[#3b82f6] bg-[#3b82f6]/10',
}

const iconColors = {
  success: 'text-[#10b981]',
  error: 'text-[#ef4444]',
  info: 'text-[#3b82f6]',
}

export default function ToastContainer() {
  const toasts = useNotificationStore((s) => s.toasts)
  const removeToast = useNotificationStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[toast.type]} backdrop-blur-xl shadow-2xl animate-fade-in`}
            style={{ background: 'rgba(11, 16, 38, 0.9)' }}
          >
            <Icon size={18} className={`flex-shrink-0 ${iconColors[toast.type]}`} />
            <p className="flex-1 text-sm text-white">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
