import { useCoverageStore } from '../../store/coverageStore'
import { useUiStore } from '../../store/uiStore'

export function AppHeader() {
  const dataset = useCoverageStore(s => s.dataset)
  const connectionStatus = useUiStore(s => s.connectionStatus)

  const statusDot = () => {
    switch (connectionStatus) {
      case 'connected': return <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
      case 'connecting': return <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block animate-pulse" />
      case 'stale': return <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
      case 'error': return <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
      default: return <span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />
    }
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-gray-900 border-b border-gray-800 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-cyan-500 rounded-md flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-900">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">Coverage Dashboard</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        {statusDot()}
        <span className="font-medium text-gray-300">
          {dataset?.periodLabel ?? '—'}
        </span>
        <span className="text-gray-600">·</span>
        <span>
          {connectionStatus === 'connected' && 'En vivo'}
          {connectionStatus === 'connecting' && 'Conectando…'}
          {connectionStatus === 'stale' && 'Datos desactualizados'}
          {connectionStatus === 'error' && 'Error de conexión'}
          {connectionStatus === 'idle' && 'Sin conexión'}
        </span>
      </div>
    </header>
  )
}
