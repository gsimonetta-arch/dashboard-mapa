import type { N8nWebhookResponse } from '../types/webhook.types'
import type { CoverageDataset, StateCoverageRecord } from '../types/coverage.types'
import { computeRatio } from '../utils/coverageClassifier'

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL as string | undefined

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
}

function parseN8nResponse(raw: N8nWebhookResponse): CoverageDataset {
  const now = new Date().toISOString()
  const records: StateCoverageRecord[] = raw.states.map(s => {
    const cq = s.customerQuotes ?? 0
    const vq = s.vendorQuotes ?? 0
    return {
      stateCode: s.state.toUpperCase(),
      stateName: s.stateName ?? STATE_NAMES[s.state.toUpperCase()] ?? s.state,
      customerQuotes: cq,
      vendorQuotes: vq,
      coverageRatio: computeRatio(cq, vq),
      topGapCategories: s.categories,
      lastUpdatedAt: s.updatedAt ?? now,
    }
  })

  const totalCQ = records.reduce((a, r) => a + r.customerQuotes, 0)
  const totalVQ = records.reduce((a, r) => a + r.vendorQuotes, 0)

  return {
    reportGeneratedAt: raw.generatedAt ?? now,
    periodLabel: raw.period ?? 'En vivo',
    records,
    summary: {
      totalCustomerQuotes: totalCQ,
      totalVendorQuotes: totalVQ,
      nationalCoverageRatio: computeRatio(totalCQ, totalVQ),
      statesWithCriticalGap: records.filter(r => r.coverageRatio !== null && r.coverageRatio < 0.40).length,
      statesWithGoodCoverage: records.filter(r => r.coverageRatio !== null && r.coverageRatio >= 0.90).length,
    },
  }
}

export async function fetchCoverageData(): Promise<CoverageDataset> {
  if (!WEBHOOK_URL) throw new Error('VITE_WEBHOOK_URL not configured')
  const res = await fetch(WEBHOOK_URL)
  if (!res.ok) throw new Error(`Webhook returned ${res.status}`)
  const raw = await res.json() as N8nWebhookResponse
  return parseN8nResponse(raw)
}

export { parseN8nResponse }
