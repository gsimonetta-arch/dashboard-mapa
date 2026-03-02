import { useCoverageStore } from '../../store/coverageStore'
import { formatPercent, formatCount } from '../../utils/formatters'
import { KpiCard } from './KpiCard'

export function KpiRibbon() {
  const summary = useCoverageStore(s => s.dataset?.summary)

  const nationalRatioStr = summary ? formatPercent(summary.nationalCoverageRatio) : '—'
  const nationalAccent = (() => {
    if (!summary?.nationalCoverageRatio) return 'default' as const
    const r = summary.nationalCoverageRatio
    if (r < 0.40) return 'red' as const
    if (r < 0.70) return 'yellow' as const
    if (r >= 0.90) return 'green' as const
    return 'yellow' as const
  })()

  return (
    <div className="flex gap-3 px-6 py-3 bg-gray-950 border-b border-gray-800 flex-shrink-0">
      <KpiCard
        label="Cobertura Nacional"
        value={nationalRatioStr}
        sub="Vendors / Clientes"
        accent={nationalAccent}
      />
      <KpiCard
        label="Quotes de Clientes"
        value={summary ? formatCount(summary.totalCustomerQuotes) : '—'}
        sub="Demanda total"
      />
      <KpiCard
        label="Quotes de Vendors"
        value={summary ? formatCount(summary.totalVendorQuotes) : '—'}
        sub="Oferta total"
      />
      <KpiCard
        label="Estados Críticos"
        value={summary ? String(summary.statesWithCriticalGap) : '—'}
        sub="Cobertura < 40%"
        accent={summary && summary.statesWithCriticalGap > 0 ? 'red' : 'default'}
      />
      <KpiCard
        label="Buena Cobertura"
        value={summary ? String(summary.statesWithGoodCoverage) : '—'}
        sub="Cobertura ≥ 90%"
        accent={summary && summary.statesWithGoodCoverage > 0 ? 'green' : 'default'}
      />
    </div>
  )
}
