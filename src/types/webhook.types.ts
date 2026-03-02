/** Real shape returned by the n8n webhook */
export interface N8nStateEntry {
  state: string
  state_name: string
  customerQuotes: number
  vendorQuotes: number
  cqs_con_vq_feasible: number
  vendors_con_cobertura: number
  locations: number
  pct_feasible: number
  status_cobertura: string
}

export interface N8nEuropeEntry {
  country: string
  customerQuotes: number
  vendorQuotes: number
  cqs_con_vq_feasible: number
  vendors_con_cobertura: number
  locations: number
  pct_feasible: number
  status_cobertura: string
}

export interface N8nRegionSummary {
  total_states?: number
  total_countries?: number
  total_cqs: number
  total_vqs_feasibles: number
  total_cqs_feasible: number
  pct_feasible: number
}

export interface N8nWebhookResponse {
  success: boolean
  timestamp: string
  summary: {
    usa: N8nRegionSummary
    europe: N8nRegionSummary
  }
  states: N8nStateEntry[]
  europe: N8nEuropeEntry[]
}

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'stale'
