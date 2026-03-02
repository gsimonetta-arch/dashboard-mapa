import { useWebhook } from '../hooks/useWebhook'
import { useStaleCheck } from '../hooks/useStaleCheck'
import { AppHeader } from '../components/layout/AppHeader'
import { KpiRibbon } from '../components/kpi/KpiRibbon'
import { MapPanel } from '../components/map/MapPanel'
import { SidePanel } from '../components/sidebar/SidePanel'
import { ConnectionStatusBar } from '../components/layout/ConnectionStatusBar'

export function DashboardPage() {
  useWebhook()
  useStaleCheck()

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      <AppHeader />
      <KpiRibbon />
      <div className="flex flex-1 min-h-0">
        <MapPanel />
        <SidePanel />
      </div>
      <ConnectionStatusBar />
    </div>
  )
}
