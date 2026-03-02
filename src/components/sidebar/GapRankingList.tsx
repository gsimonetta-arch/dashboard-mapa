import { useCoverageStore } from '../../store/coverageStore'
import { GapRankingRow } from './GapRankingRow'

export function GapRankingList() {
  const getSortedByGap = useCoverageStore(s => s.getSortedByGap)
  const sorted = getSortedByGap()

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 text-gray-600 text-sm">
        Sin datos disponibles
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pb-2 flex-shrink-0 space-y-0.5">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Ranking — mayor brecha
        </p>
        <p className="text-xs text-gray-600">Estados y países con menor factibilidad</p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {sorted.map((record, i) => (
          <GapRankingRow key={record.stateCode} record={record} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}
