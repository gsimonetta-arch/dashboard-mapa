import type { StateCoverageRecord } from '../../types/coverage.types'
import { classifyTier, TIER_COLORS } from '../../utils/coverageClassifier'
import { formatCount } from '../../utils/formatters'
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
        isSelected ? 'bg-gray-700' : 'hover:bg-gray-800/60'
      }`}
    >
      <span className="text-xs text-gray-600 w-5 flex-shrink-0 tabular-nums text-right">{rank}</span>
      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: tierColor }} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-2">
          <span className="text-sm text-gray-200 truncate">{record.stateName}</span>
          <span className="text-sm font-semibold tabular-nums flex-shrink-0" style={{ color: tierColor }}>
            {record.pctFeasible.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-0.5">
          <span>{formatCount(record.customerQuotes)} CQs · {formatCount(record.cqsWithFeasibleVQ)} factibles</span>
          <span className="text-gray-700 ml-1">{record.region === 'europe' ? '🇪🇺' : '🇺🇸'}</span>
        </div>
      </div>
    </button>
  )
}
