import type { StateCoverageRecord } from '../../types/coverage.types'
import { classifyTier, TIER_COLORS } from '../../utils/coverageClassifier'
import { formatPercent, formatCount } from '../../utils/formatters'
import { useUiStore } from '../../store/uiStore'

interface Props {
  record: StateCoverageRecord
  rank: number
}

export function GapRankingRow({ record, rank }: Props) {
  const selectState = useUiStore(s => s.selectState)
  const selectedStateCode = useUiStore(s => s.selectedStateCode)
  const isSelected = selectedStateCode === record.stateCode

  const tier = classifyTier(record.coverageRatio)
  const tierColor = TIER_COLORS[tier]

  return (
    <button
      onClick={() => selectState(isSelected ? null : record.stateCode)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
        isSelected
          ? 'bg-gray-700'
          : 'hover:bg-gray-800/60'
      }`}
    >
      <span className="text-xs text-gray-600 w-4 flex-shrink-0 tabular-nums">{rank}</span>
      <span
        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
        style={{ backgroundColor: tierColor }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-200 truncate">{record.stateName}</span>
          <span className="text-sm font-medium tabular-nums text-white ml-2 flex-shrink-0">
            {formatPercent(record.coverageRatio)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-0.5">
          <span>{formatCount(record.customerQuotes)} clientes</span>
          <span>{formatCount(record.vendorQuotes)} vendors</span>
        </div>
      </div>
    </button>
  )
}
