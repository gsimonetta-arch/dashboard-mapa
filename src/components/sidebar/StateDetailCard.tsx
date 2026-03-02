import { useCoverageStore } from '../../store/coverageStore'
import { useUiStore } from '../../store/uiStore'
import { CoverageGauge } from './CoverageGauge'
import { formatCount } from '../../utils/formatters'
import { TIER_COLORS, classifyTier } from '../../utils/coverageClassifier'

export function StateDetailCard() {
  const selectedStateCode = useUiStore(s => s.selectedStateCode)
  const selectState = useUiStore(s => s.selectState)
  const getRecord = useCoverageStore(s => s.getRecord)

  if (!selectedStateCode) return null
  const record = getRecord(selectedStateCode)
  if (!record) return null

  const tier = classifyTier(record.coverageRatio)
  const tierColor = TIER_COLORS[tier]

  const maxVal = Math.max(record.customerQuotes, record.vendorQuotes)
  const cqPct = maxVal > 0 ? (record.customerQuotes / maxVal) * 100 : 0
  const vqPct = maxVal > 0 ? (record.vendorQuotes / maxVal) * 100 : 0

  return (
    <div className="flex flex-col gap-4 p-4 flex-1">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">{record.stateName}</h2>
          <span className="text-xs text-gray-500">{record.stateCode}</span>
        </div>
        <button
          onClick={() => selectState(null)}
          className="text-gray-600 hover:text-gray-400 transition-colors p-1"
          aria-label="Cerrar detalle"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center">
        <CoverageGauge ratio={record.coverageRatio} />
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Clientes</span>
            <span className="text-gray-300 tabular-nums">{formatCount(record.customerQuotes)}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${cqPct}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Vendors</span>
            <span className="text-gray-300 tabular-nums">{formatCount(record.vendorQuotes)}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${vqPct}%`, backgroundColor: tierColor }}
            />
          </div>
        </div>
      </div>

      {record.topGapCategories && record.topGapCategories.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Categorías con brecha</p>
          <div className="flex flex-wrap gap-1.5">
            {record.topGapCategories.map(cat => (
              <span
                key={cat}
                className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
