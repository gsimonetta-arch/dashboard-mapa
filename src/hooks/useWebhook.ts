import { useEffect, useRef } from 'react'
import { useCoverageStore } from '../store/coverageStore'
import { useUiStore } from '../store/uiStore'
import { fetchCoverageData } from '../services/webhookService'
import { buildMockDataset } from '../utils/mockData'

const POLL_INTERVAL_MS = parseInt(import.meta.env.VITE_POLL_INTERVAL_MS ?? '60000', 10)
const USE_MOCK = !import.meta.env.VITE_WEBHOOK_URL

export function useWebhook(): void {
  const ingestFullRefresh = useCoverageStore(s => s.ingestFullRefresh)
  const setConnectionStatus = useUiStore(s => s.setConnectionStatus)
  const setLastReceivedAt = useUiStore(s => s.setLastReceivedAt)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      if (cancelled) return

      setConnectionStatus('connecting')
      try {
        const dataset = USE_MOCK ? buildMockDataset() : await fetchCoverageData()
        if (!cancelled) {
          ingestFullRefresh(dataset)
          setConnectionStatus('connected')
          setLastReceivedAt(new Date().toISOString())
        }
      } catch (err) {
        console.error('[webhook] fetch error:', err)
        if (!cancelled) setConnectionStatus('error')
      }

      if (!cancelled) {
        timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
      }
    }

    void poll()

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [ingestFullRefresh, setConnectionStatus, setLastReceivedAt])
}
