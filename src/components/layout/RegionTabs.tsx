import { useUiStore } from '../../store/uiStore'
import type { Region } from '../../types/coverage.types'

const TABS: { region: Region; label: string }[] = [
  { region: 'usa',    label: 'USA' },
  { region: 'europe', label: 'Europe' },
]

export function RegionTabs() {
  const activeRegion = useUiStore(s => s.activeRegion)
  const setActiveRegion = useUiStore(s => s.setActiveRegion)

  return (
    <div className="flex items-center gap-1 px-6 py-2 bg-gray-950 border-b border-gray-800 flex-shrink-0">
      {TABS.map(({ region, label }) => {
        const active = activeRegion === region
        return (
          <button
            key={region}
            onClick={() => setActiveRegion(region)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              active
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
