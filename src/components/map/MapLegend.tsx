import { TIER_COLORS, TIER_LABELS } from '../../utils/coverageClassifier'
import type { CoverageTier } from '../../types/coverage.types'

const TIERS: CoverageTier[] = ['critical', 'low', 'moderate', 'good', 'surplus', 'no-data']

export function MapLegend() {
  return (
    <div className="absolute bottom-6 left-4 z-10 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Cobertura</p>
      <div className="space-y-1.5">
        {TIERS.map(tier => (
          <div key={tier} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: TIER_COLORS[tier] }}
            />
            <span className="text-xs text-gray-400">{TIER_LABELS[tier]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
