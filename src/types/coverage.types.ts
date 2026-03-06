export type StateCode = string
export type Region = 'usa' | 'europe'

export interface StateCoverageRecord {
  stateCode: StateCode          // "TX" for USA; slugified country for Europe
  stateName: string
  region: Region
  customerQuotes: number        // total CQs
  vendorQuotes: number          // total VQs
  cqsWithFeasibleVQ: number     // cqs_con_vq_feasible
  vendorsWithCoverage: number   // vendors_con_cobertura
  locations: number
  pctFeasible: number           // 0–100 scale
  statusCobertura: string       // "Parcial", "Buena", "Crítico", etc.
  coverageRatio: number | null  // pctFeasible / 100 — used by classifier & choropleth
  lastUpdatedAt: string
}

export interface RegionSummary {
  totalUnits: number            // states or countries
  totalCqs: number
  totalVqsFeasibles: number
  totalCqsFeasible: number
  pctFeasible: number
}

export interface CoverageSummary {
  usa: RegionSummary
  europe: RegionSummary
}

export interface CoverageDataset {
  reportGeneratedAt: string
  periodLabel: string
  records: StateCoverageRecord[]
  summary: CoverageSummary
}

export type CoverageTier =
  | 'no-data'
  | 'critical'   // pct_feasible < 1%
  | 'low'        // 1–3%
  | 'moderate'   // 3–6%
  | 'good'       // 6–10%
  | 'surplus'    // ≥ 10%

// Stored as coverageRatio = pctFeasible / 100
export const COVERAGE_THRESHOLDS = {
  CRITICAL: 0.01,
  LOW:      0.03,
  MODERATE: 0.06,
  GOOD:     0.10,
} as const
