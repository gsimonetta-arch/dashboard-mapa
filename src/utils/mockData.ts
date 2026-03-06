import type { CoverageDataset, StateCoverageRecord } from '../types/coverage.types'

// pct_feasible values are intentionally low (1–8%) to match real webhook scale
const RAW_USA = [
  { code: 'AL', name: 'Alabama',        cq: 420,  vq: 2800,  pct: 1.2 },
  { code: 'AK', name: 'Alaska',         cq: 85,   vq: 310,   pct: 0.8 },
  { code: 'AZ', name: 'Arizona',        cq: 1250, vq: 9800,  pct: 3.1 },
  { code: 'AR', name: 'Arkansas',       cq: 280,  vq: 1750,  pct: 1.5 },
  { code: 'CA', name: 'California',     cq: 4800, vq: 52000, pct: 4.8 },
  { code: 'CO', name: 'Colorado',       cq: 890,  vq: 8300,  pct: 3.6 },
  { code: 'CT', name: 'Connecticut',    cq: 410,  vq: 3600,  pct: 5.2 },
  { code: 'DE', name: 'Delaware',       cq: 95,   vq: 800,   pct: 6.3 },
  { code: 'FL', name: 'Florida',        cq: 3100, vq: 29500, pct: 3.8 },
  { code: 'GA', name: 'Georgia',        cq: 1450, vq: 13200, pct: 3.4 },
  { code: 'HI', name: 'Hawaii',         cq: 120,  vq: 450,   pct: 0.6 },
  { code: 'ID', name: 'Idaho',          cq: 220,  vq: 1800,  pct: 2.2 },
  { code: 'IL', name: 'Illinois',       cq: 1780, vq: 16500, pct: 4.1 },
  { code: 'IN', name: 'Indiana',        cq: 680,  vq: 5900,  pct: 2.9 },
  { code: 'IA', name: 'Iowa',           cq: 310,  vq: 2600,  pct: 2.4 },
  { code: 'KS', name: 'Kansas',         cq: 290,  vq: 950,   pct: 0.9 },
  { code: 'KY', name: 'Kentucky',       cq: 420,  vq: 1500,  pct: 1.1 },
  { code: 'LA', name: 'Louisiana',      cq: 440,  vq: 1300,  pct: 0.7 },
  { code: 'ME', name: 'Maine',          cq: 145,  vq: 1200,  pct: 7.4 },
  { code: 'MD', name: 'Maryland',       cq: 720,  vq: 6800,  pct: 5.8 },
  { code: 'MA', name: 'Massachusetts',  cq: 810,  vq: 7900,  pct: 6.7 },
  { code: 'MI', name: 'Michigan',       cq: 970,  vq: 8600,  pct: 3.3 },
  { code: 'MN', name: 'Minnesota',      cq: 620,  vq: 5900,  pct: 4.4 },
  { code: 'MS', name: 'Mississippi',    cq: 260,  vq: 550,   pct: 0.5 },
  { code: 'MO', name: 'Missouri',       cq: 640,  vq: 4200,  pct: 2.7 },
  { code: 'MT', name: 'Montana',        cq: 140,  vq: 800,   pct: 1.8 },
  { code: 'NE', name: 'Nebraska',       cq: 230,  vq: 1950,  pct: 3.0 },
  { code: 'NV', name: 'Nevada',         cq: 580,  vq: 6200,  pct: 5.5 },
  { code: 'NH', name: 'New Hampshire',  cq: 165,  vq: 1500,  pct: 8.1 },
  { code: 'NJ', name: 'New Jersey',     cq: 1050, vq: 9800,  pct: 5.9 },
  { code: 'NM', name: 'New Mexico',     cq: 280,  vq: 900,   pct: 0.8 },
  { code: 'NY', name: 'New York',       cq: 2650, vq: 28000, pct: 6.1 },
  { code: 'NC', name: 'North Carolina', cq: 1180, vq: 10500, pct: 3.7 },
  { code: 'ND', name: 'North Dakota',   cq: 90,   vq: 650,   pct: 2.1 },
  { code: 'OH', name: 'Ohio',           cq: 1240, vq: 11000, pct: 3.5 },
  { code: 'OK', name: 'Oklahoma',       cq: 380,  vq: 1300,  pct: 1.0 },
  { code: 'OR', name: 'Oregon',         cq: 560,  vq: 5100,  pct: 4.9 },
  { code: 'PA', name: 'Pennsylvania',   cq: 1480, vq: 13200, pct: 4.2 },
  { code: 'RI', name: 'Rhode Island',   cq: 115,  vq: 1000,  pct: 9.2 },
  { code: 'SC', name: 'South Carolina', cq: 560,  vq: 4300,  pct: 2.6 },
  { code: 'SD', name: 'South Dakota',   cq: 95,   vq: 700,   pct: 2.0 },
  { code: 'TN', name: 'Tennessee',      cq: 720,  vq: 5400,  pct: 2.5 },
  { code: 'TX', name: 'Texas',          cq: 4598, vq: 23680, pct: 2.5 },
  { code: 'UT', name: 'Utah',           cq: 430,  vq: 3800,  pct: 4.0 },
  { code: 'VT', name: 'Vermont',        cq: 80,   vq: 700,   pct: 10.5},
  { code: 'VA', name: 'Virginia',       cq: 980,  vq: 9100,  pct: 4.8 },
  { code: 'WA', name: 'Washington',     cq: 950,  vq: 10200, pct: 5.6 },
  { code: 'WV', name: 'West Virginia',  cq: 195,  vq: 550,   pct: 0.6 },
  { code: 'WI', name: 'Wisconsin',      cq: 620,  vq: 5800,  pct: 3.2 },
  { code: 'WY', name: 'Wyoming',        cq: 80,   vq: 400,   pct: 1.4 },
]

const RAW_EUROPE = [
  { code: 'GB', name: 'United Kingdom', cq: 1200, vq: 8500,  pct: 5.0 },
  { code: 'DE', name: 'Germany',        cq: 980,  vq: 7200,  pct: 6.2 },
  { code: 'FR', name: 'France',         cq: 850,  vq: 5900,  pct: 4.7 },
  { code: 'ES', name: 'Spain',          cq: 620,  vq: 3800,  pct: 3.9 },
  { code: 'IT', name: 'Italy',          cq: 540,  vq: 2900,  pct: 3.1 },
  { code: 'NL', name: 'Netherlands',    cq: 410,  vq: 4100,  pct: 8.3 },
  { code: 'PL', name: 'Poland',         cq: 380,  vq: 1900,  pct: 2.4 },
  { code: 'BE', name: 'Belgium',        cq: 290,  vq: 2600,  pct: 7.1 },
  { code: 'PT', name: 'Portugal',       cq: 220,  vq: 1100,  pct: 2.8 },
  { code: 'SE', name: 'Sweden',         cq: 310,  vq: 3100,  pct: 9.4 },
]

function statusFromPct(pct: number): string {
  if (pct < 1) return 'Crítico'
  if (pct < 3) return 'Bajo'
  if (pct < 6) return 'Parcial'
  if (pct < 10) return 'Bueno'
  return 'Excelente'
}

export function buildMockDataset(): CoverageDataset {
  const now = new Date().toISOString()

  const usaRecords: StateCoverageRecord[] = RAW_USA.map(s => {
    const feasibleCqs = Math.round(s.cq * s.pct / 100)
    return {
      stateCode: s.code,
      stateName: s.name,
      region: 'usa',
      customerQuotes: s.cq,
      vendorQuotes: s.vq,
      cqsWithFeasibleVQ: feasibleCqs,
      vendorsWithCoverage: Math.max(1, Math.round(feasibleCqs * 0.04)),
      locations: Math.round(s.cq * 0.2),
      pctFeasible: s.pct,
      statusCobertura: statusFromPct(s.pct),
      coverageRatio: s.pct / 100,
      lastUpdatedAt: now,
    }
  })

  const europeRecords: StateCoverageRecord[] = RAW_EUROPE.map(c => {
    const feasibleCqs = Math.round(c.cq * c.pct / 100)
    return {
      stateCode: c.code,
      stateName: c.name,
      region: 'europe',
      customerQuotes: c.cq,
      vendorQuotes: c.vq,
      cqsWithFeasibleVQ: feasibleCqs,
      vendorsWithCoverage: Math.max(1, Math.round(feasibleCqs * 0.05)),
      locations: Math.round(c.cq * 0.35),
      pctFeasible: c.pct,
      statusCobertura: statusFromPct(c.pct),
      coverageRatio: c.pct / 100,
      lastUpdatedAt: now,
    }
  })

  const allRecords = [...usaRecords, ...europeRecords]

  const usaTotalCqs = usaRecords.reduce((a, r) => a + r.customerQuotes, 0)
  const usaTotalVqs = usaRecords.reduce((a, r) => a + r.vendorQuotes, 0)
  const usaTotalFeasible = usaRecords.reduce((a, r) => a + r.cqsWithFeasibleVQ, 0)
  const euTotalCqs = europeRecords.reduce((a, r) => a + r.customerQuotes, 0)
  const euTotalVqs = europeRecords.reduce((a, r) => a + r.vendorQuotes, 0)
  const euTotalFeasible = europeRecords.reduce((a, r) => a + r.cqsWithFeasibleVQ, 0)

  return {
    reportGeneratedAt: now,
    periodLabel: 'Q1 2026',
    records: allRecords,
    summary: {
      usa: {
        totalUnits: usaRecords.length,
        totalCqs: usaTotalCqs,
        totalVqsFeasibles: usaTotalVqs,
        totalCqsFeasible: usaTotalFeasible,
        pctFeasible: usaTotalCqs > 0 ? (usaTotalFeasible / usaTotalCqs) * 100 : 0,
      },
      europe: {
        totalUnits: europeRecords.length,
        totalCqs: euTotalCqs,
        totalVqsFeasibles: euTotalVqs,
        totalCqsFeasible: euTotalFeasible,
        pctFeasible: euTotalCqs > 0 ? (euTotalFeasible / euTotalCqs) * 100 : 0,
      },
    },
  }
}
