import { classifyTier, TIER_COLORS } from '../../utils/coverageClassifier'
import { formatPercent } from '../../utils/formatters'

interface Props {
  ratio: number | null
}

const RADIUS = 40
const STROKE = 8
const CIRCUMFERENCE = Math.PI * RADIUS // half circle

export function CoverageGauge({ ratio }: Props) {
  const tier = classifyTier(ratio)
  const color = TIER_COLORS[tier]
  const pct = ratio === null ? 0 : Math.min(ratio, 1.5) / 1.5
  const dashOffset = CIRCUMFERENCE * (1 - pct)

  const cx = 52
  const cy = 52

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="104" height="60" viewBox="0 0 104 60">
        {/* Track */}
        <path
          d={`M ${cx - RADIUS} ${cy} A ${RADIUS} ${RADIUS} 0 0 1 ${cx + RADIUS} ${cy}`}
          fill="none"
          stroke="#374151"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={`M ${cx - RADIUS} ${cy} A ${RADIUS} ${RADIUS} 0 0 1 ${cx + RADIUS} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="15" fontWeight="600">
          {formatPercent(ratio)}
        </text>
      </svg>
      <span className="text-xs" style={{ color }}>
        {tier === 'no-data' ? 'Sin datos' : tier.charAt(0).toUpperCase() + tier.slice(1)}
      </span>
    </div>
  )
}
