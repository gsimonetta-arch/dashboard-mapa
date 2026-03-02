import type { CoverageDataset, StateCoverageRecord, CoverageSummary } from './coverage.types'

export type WebhookEventType =
  | 'coverage.full_refresh'
  | 'coverage.partial_update'
  | 'coverage.period_changed'

export interface WebhookEnvelope<T = unknown> {
  event: WebhookEventType
  payload: T
  timestamp: string
  version: string
}

export type FullRefreshPayload = CoverageDataset

export interface PartialUpdatePayload {
  records: StateCoverageRecord[]
  summary: CoverageSummary
}

export interface PeriodChangedPayload {
  previousPeriodLabel: string
  newPeriodLabel: string
  dataset: CoverageDataset
}

/** Raw shape returned directly by the n8n webhook (GET endpoint) */
export interface N8nWebhookResponse {
  states: Array<{
    state: string
    stateName?: string
    customerQuotes: number
    vendorQuotes: number
    categories?: string[]
    updatedAt?: string
  }>
  period?: string
  generatedAt?: string
}

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'stale'
