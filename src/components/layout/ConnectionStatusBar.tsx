import { useUiStore } from '../../store/uiStore'
import { formatTimestamp } from '../../utils/formatters'

export function ConnectionStatusBar() {
  const connectionStatus = useUiStore(s => s.connectionStatus)
  const lastReceivedAt = useUiStore(s => s.lastReceivedAt)

  const label = {
    idle: 'Sin conexión',
    connecting: 'Conectando…',
    connected: 'Conectado',
    stale: 'Datos desactualizados',
    error: 'Error de conexión',
  }[connectionStatus]

  const barColor = {
    idle: 'bg-gray-800',
    connecting: 'bg-gray-800',
    connected: 'bg-gray-900',
    stale: 'bg-orange-950/60',
    error: 'bg-red-950/60',
  }[connectionStatus]

  const dotColor = {
    idle: 'bg-gray-600',
    connecting: 'bg-yellow-500 animate-pulse',
    connected: 'bg-green-500',
    stale: 'bg-orange-500',
    error: 'bg-red-500',
  }[connectionStatus]

  return (
    <div className={`h-8 flex items-center justify-between px-6 ${barColor} border-t border-gray-800 flex-shrink-0`}>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span>{label}</span>
        {lastReceivedAt && (
          <>
            <span className="text-gray-700">·</span>
            <span>Última actualización: {formatTimestamp(lastReceivedAt)}</span>
          </>
        )}
      </div>
      <div className="text-xs text-gray-600">
        {import.meta.env.VITE_WEBHOOK_URL ? 'Webhook activo' : 'Modo demo'}
      </div>
    </div>
  )
}
