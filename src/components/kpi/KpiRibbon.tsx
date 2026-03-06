import { useCoverageStore } from '../../store/coverageStore'
import { useUiStore } from '../../store/uiStore'
import { formatCount } from '../../utils/formatters'
import { KpiCard } from './KpiCard'

function pctAccent(pct: number | undefined): 'red' | 'yellow' | 'green' | 'default' {
  if (pct === undefined) return 'default'
  if (pct < 1)  return 'red'
  if (pct < 3)  return 'yellow'
  if (pct >= 6) return 'green'
  return 'yellow'
}

function fmtPct(n: number | undefined): string {
  if (n === undefined) return '—'
  return n.toFixed(1) + '%'
}

export function KpiRibbon() {
  const summary = useCoverageStore(s => s.dataset?.summary)
  const activeRegion = useUiStore(s => s.activeRegion)

  if (activeRegion === 'europe') {
    return (
      <div className="flex gap-3 px-6 py-3 bg-gray-950 border-b border-gray-800 flex-shrink-0 overflow-x-auto">
        <KpiCard
          label="Europa — Factibilidad"
          value={fmtPct(summary?.europe.pctFeasible)}
          sub={`${formatCount(summary?.europe.totalCqs ?? 0)} CQs`}
          accent={pctAccent(summary?.europe.pctFeasible)}
        />
        <KpiCard
          label="CQs Factibles Europa"
          value={formatCount(summary?.europe.totalCqsFeasible ?? 0)}
          sub="Con VQ factible"
          accent="cyan"
        />
        <KpiCard
          label="VQs Disponibles Europa"
          value={formatCount(summary?.europe.totalVqsFeasibles ?? 0)}
          sub="Oferta total vendors"
        />
      </div>
    )
  }

  return (
    <div className="flex gap-3 px-6 py-3 bg-gray-950 border-b border-gray-800 flex-shrink-0 overflow-x-auto">
      <KpiCard
        label="USA — Factibilidad"
        value={fmtPct(summary?.usa.pctFeasible)}
        sub={`${formatCount(summary?.usa.totalCqs ?? 0)} CQs`}
        accent={pctAccent(summary?.usa.pctFeasible)}
      />
      <KpiCard
        label="CQs Factibles USA"
        value={formatCount(summary?.usa.totalCqsFeasible ?? 0)}
        sub="Con VQ factible"
        accent="cyan"
      />
      <KpiCard
        label="VQs Disponibles USA"
        value={formatCount(summary?.usa.totalVqsFeasibles ?? 0)}
        sub="Oferta total vendors"
      />
    </div>
  )
}
