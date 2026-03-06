import { classifyTier, TIER_COLORS, TIER_LABELS } from '../../utils/coverageClassifier'

interface Props {
  ratio: number | null  // coverageRatio = pctFeasible / 100
}

const RADIUS = 40
const STROKE = 8
const CIRCUMFERENCE = Math.PI * RADIUS

// Scale: 0–15% pctFeasible fills the gauge (15% = full arc)
const MAX_PCT = 15

export function CoverageGauge({ ratio }: Props) {
  const tier = classifyTier(ratio)
  const color = TIER_COLORS[tier]
  const pctFeasible = ratio === null ? null : ratio * 100
  const fill = pctFeasible === null ? 0 : Math.min(pctFeasible / MAX_PCT, 1)
  const dashOffset = CIRCUMFERENCE * (1 - fill)

  const cx = 52
  const cy = 52

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="104" height="60" viewBox="0 0 104 60">
        <path
          d={`M ${cx - RADIUS} ${cy} A ${RADIUS} ${RADIUS} 0 0 1 ${cx + RADIUS} ${cy}`}
          fill="none"
          stroke="#374151"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
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
          {pctFeasible === null ? '—' : pctFeasible.toFixed(1) + '%'}
        </text>
      </svg>
      <span className="text-xs text-center" style={{ color }}>
        {TIER_LABELS[tier]}
      </span>
    </div>
  )
}
