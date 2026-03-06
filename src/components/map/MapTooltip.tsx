import { useCoverageStore } from '../../store/coverageStore'
import { useUiStore } from '../../store/uiStore'
import { formatCount } from '../../utils/formatters'
import { TIER_COLORS, TIER_LABELS, classifyTier } from '../../utils/coverageClassifier'

export function MapTooltip() {
  const tooltip = useUiStore(s => s.tooltip)
  const getRecord = useCoverageStore(s => s.getRecord)

  if (!tooltip.visible || !tooltip.stateCode) return null

  const record = getRecord(tooltip.stateCode)
  if (!record) return null

  const tier = classifyTier(record.coverageRatio)
  const tierColor = TIER_COLORS[tier]
  const tierLabel = TIER_LABELS[tier]

  return (
    <div
      className="absolute z-50 pointer-events-none bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-3 min-w-52"
      style={{
        left: tooltip.anchorX + 16,
        top: tooltip.anchorY - 10,
        transform: 'translateY(-50%)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: tierColor }} />
        <span className="text-white font-semibold text-sm">{record.stateName}</span>
        <span className="text-xs text-gray-600 ml-auto">{record.statusCobertura}</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between gap-8 text-xs">
          <span className="text-gray-500">Factibilidad</span>
          <span className="text-white font-semibold tabular-nums">
            {record.pctFeasible.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between gap-8 text-xs">
          <span className="text-gray-500">CQs factibles</span>
          <span className="text-gray-300 tabular-nums">{formatCount(record.cqsWithFeasibleVQ)}</span>
        </div>
        <div className="flex justify-between gap-8 text-xs">
          <span className="text-gray-500">Total CQs</span>
          <span className="text-gray-300 tabular-nums">{formatCount(record.customerQuotes)}</span>
        </div>
        <div className="flex justify-between gap-8 text-xs">
          <span className="text-gray-500">VQs disponibles</span>
          <span className="text-gray-300 tabular-nums">{formatCount(record.vendorQuotes)}</span>
        </div>
        <div className="flex justify-between gap-8 text-xs">
          <span className="text-gray-500">Vendors</span>
          <span className="text-gray-300 tabular-nums">{formatCount(record.vendorsWithCoverage)}</span>
        </div>
        <div className="pt-1 border-t border-gray-800">
          <span className="text-xs" style={{ color: tierColor }}>{tierLabel}</span>
        </div>
      </div>
    </div>
  )
}
