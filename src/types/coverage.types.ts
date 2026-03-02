export type StateCode = string

export interface StateCoverageRecord {
  stateCode: StateCode
  stateName: string
  customerQuotes: number
  vendorQuotes: number
  coverageRatio: number | null
  topGapCategories?: string[]
  lastUpdatedAt: string
}

export interface CoverageSummary {
  totalCustomerQuotes: number
  totalVendorQuotes: number
  nationalCoverageRatio: number | null
  statesWithCriticalGap: number
  statesWithGoodCoverage: number
}

export interface CoverageDataset {
  reportGeneratedAt: string
  periodLabel: string
  records: StateCoverageRecord[]
  summary: CoverageSummary
}

export type CoverageTier =
  | 'no-data'
  | 'critical'
  | 'low'
  | 'moderate'
  | 'good'
  | 'surplus'

export const COVERAGE_THRESHOLDS = {
  CRITICAL: 0.40,
  LOW: 0.70,
  MODERATE: 0.90,
  GOOD: 1.10,
} as const
