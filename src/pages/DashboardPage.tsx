import { useWebhook } from '../hooks/useWebhook'
import { useStaleCheck } from '../hooks/useStaleCheck'
import { useUiStore } from '../store/uiStore'
import { AppHeader } from '../components/layout/AppHeader'
import { RegionTabs } from '../components/layout/RegionTabs'
import { KpiRibbon } from '../components/kpi/KpiRibbon'
import { MapPanel } from '../components/map/MapPanel'
import { EuropePanel } from '../components/map/EuropePanel'
import { SidePanel } from '../components/sidebar/SidePanel'
import { ConnectionStatusBar } from '../components/layout/ConnectionStatusBar'

export function DashboardPage() {
  useWebhook()
  useStaleCheck()

  const activeRegion = useUiStore(s => s.activeRegion)

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      <AppHeader />
      <KpiRibbon />
      <RegionTabs />
      <div className="flex flex-1 min-h-0">
        {activeRegion === 'usa' ? <MapPanel /> : <EuropePanel />}
        <SidePanel />
      </div>
      <ConnectionStatusBar />
    </div>
  )
}
