import { useCoverageStore } from '../../store/coverageStore'
import { useUiStore } from '../../store/uiStore'
import { classifyTier, TIER_COLORS, TIER_LABELS } from '../../utils/coverageClassifier'
import { formatCount } from '../../utils/formatters'

export function EuropePanel() {
  const getSortedByGap = useCoverageStore(s => s.getSortedByGap)
  const selectState = useUiStore(s => s.selectState)
  const selectedStateCode = useUiStore(s => s.selectedStateCode)

  const countries = getSortedByGap().filter(r => r.region === 'europe')

  if (countries.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
        Sin datos de Europa disponibles
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 min-w-0">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
      >
        {countries.map(record => {
          const tier = classifyTier(record.coverageRatio)
          const color = TIER_COLORS[tier]
          const isSelected = selectedStateCode === record.stateCode

          return (
            <button
              key={record.stateCode}
              onClick={() => selectState(isSelected ? null : record.stateCode)}
              className={`text-left rounded-lg overflow-hidden border transition-colors ${
                isSelected
                  ? 'border-white/30 bg-gray-800'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700 hover:bg-gray-800/70'
              }`}
            >
              {/* tier color strip */}
              <div className="h-1 w-full" style={{ backgroundColor: color }} />

              <div className="p-3 space-y-2">
                <p className="text-sm font-medium text-gray-100 truncate leading-snug">
                  {record.stateName}
                </p>

                <p
                  className="text-2xl font-bold tabular-nums leading-none"
                  style={{ color }}
                >
                  {record.pctFeasible.toFixed(1)}%
                </p>

                <p className="text-xs" style={{ color }}>
                  {TIER_LABELS[tier]}
                </p>

                <div className="pt-1 border-t border-gray-800 text-xs text-gray-500 space-y-0.5">
                  <div className="flex justify-between">
                    <span>CQs</span>
                    <span className="text-gray-400 tabular-nums">{formatCount(record.customerQuotes)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Factibles</span>
                    <span className="tabular-nums" style={{ color }}>
                      {formatCount(record.cqsWithFeasibleVQ)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
