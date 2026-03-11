import { useEffect } from 'react'
import { useUiStore } from '../store/uiStore'

const STALE_THRESHOLD_MS = parseInt(import.meta.env.VITE_STALE_THRESHOLD_MS ?? '300000', 10)
const CHECK_INTERVAL_MS = 60_000

export function useStaleCheck(): void {
  const lastReceivedAt = useUiStore(s => s.lastReceivedAt)
  const connectionStatus = useUiStore(s => s.connectionStatus)
  const setConnectionStatus = useUiStore(s => s.setConnectionStatus)

  useEffect(() => {
    if (connectionStatus !== 'connected' && connectionStatus !== 'stale') return

    const id = setInterval(() => {
      if (!lastReceivedAt) return
      const age = Date.now() - new Date(lastReceivedAt).getTime()
      if (age > STALE_THRESHOLD_MS) {
        setConnectionStatus('stale')
      }
    }, CHECK_INTERVAL_MS)

    return () => clearInterval(id)
  }, [lastReceivedAt, connectionStatus, setConnectionStatus])
}
