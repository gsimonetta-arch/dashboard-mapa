import { COVERAGE_THRESHOLDS } from '../types/coverage.types'
import type { CoverageTier } from '../types/coverage.types'

export function classifyTier(ratio: number | null): CoverageTier {
  if (ratio === null || !isFinite(ratio)) return 'no-data'
  if (ratio < COVERAGE_THRESHOLDS.CRITICAL) return 'critical'
  if (ratio < COVERAGE_THRESHOLDS.LOW) return 'low'
  if (ratio < COVERAGE_THRESHOLDS.MODERATE) return 'moderate'
  if (ratio < COVERAGE_THRESHOLDS.GOOD) return 'good'
  return 'surplus'
}

export const TIER_COLORS: Record<CoverageTier, string> = {
  'no-data': '#374151',  // gray-700 (dark mode)
  'critical': '#DC2626',
  'low':      '#F97316',
  'moderate': '#EAB308',
  'good':     '#16A34A',
  'surplus':  '#0891B2',
}

export const TIER_LABELS: Record<CoverageTier, string> = {
  'no-data': 'Sin datos',
  'critical': 'Crítico < 40%',
  'low':      'Bajo 40–69%',
  'moderate': 'Moderado 70–89%',
  'good':     'Bueno 90–109%',
  'surplus':  'Excedente ≥ 110%',
}

export const TIER_BG_CLASSES: Record<CoverageTier, string> = {
  'no-data': 'bg-gray-700',
  'critical': 'bg-red-600',
  'low':      'bg-orange-500',
  'moderate': 'bg-yellow-500',
  'good':     'bg-green-600',
  'surplus':  'bg-cyan-600',
}

export const TIER_TEXT_CLASSES: Record<CoverageTier, string> = {
  'no-data': 'text-gray-400',
  'critical': 'text-red-400',
  'low':      'text-orange-400',
  'moderate': 'text-yellow-400',
  'good':     'text-green-400',
  'surplus':  'text-cyan-400',
}

export function computeRatio(customerQuotes: number, vendorQuotes: number): number | null {
  if (customerQuotes === 0) return null
  return vendorQuotes / customerQuotes
}
