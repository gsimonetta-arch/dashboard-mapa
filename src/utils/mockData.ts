import type { CoverageDataset, StateCoverageRecord, CqLocation } from '../types/coverage.types'

// Sample CQ locations (lat/lng) for development — replaced by real webhook data in production
const MOCK_CQ_LOCATIONS: CqLocation[] = [
  // Texas
  { id: 'TX-001', lat: 29.76,  lng: -95.36,  state: 'TX', region: 'usa', status: 'not_feasible' },
  { id: 'TX-002', lat: 32.77,  lng: -96.79,  state: 'TX', region: 'usa', status: 'not_feasible' },
  { id: 'TX-003', lat: 29.42,  lng: -98.49,  state: 'TX', region: 'usa', status: 'feasible' },
  { id: 'TX-004', lat: 30.26,  lng: -97.74,  state: 'TX', region: 'usa', status: 'not_feasible' },
  { id: 'TX-005', lat: 31.75,  lng: -106.48, state: 'TX', region: 'usa', status: 'not_feasible' },
  // California
  { id: 'CA-001', lat: 34.05,  lng: -118.24, state: 'CA', region: 'usa', status: 'feasible' },
  { id: 'CA-002', lat: 37.77,  lng: -122.41, state: 'CA', region: 'usa', status: 'feasible' },
  { id: 'CA-003', lat: 32.71,  lng: -117.15, state: 'CA', region: 'usa', status: 'feasible' },
  { id: 'CA-004', lat: 38.57,  lng: -121.48, state: 'CA', region: 'usa', status: 'not_feasible' },
  // Florida
  { id: 'FL-001', lat: 25.77,  lng: -80.19,  state: 'FL', region: 'usa', status: 'not_feasible' },
  { id: 'FL-002', lat: 28.53,  lng: -81.37,  state: 'FL', region: 'usa', status: 'feasible' },
  { id: 'FL-003', lat: 27.94,  lng: -82.45,  state: 'FL', region: 'usa', status: 'not_feasible' },
  { id: 'FL-004', lat: 30.33,  lng: -81.65,  state: 'FL', region: 'usa', status: 'not_feasible' },
  // New York
  { id: 'NY-001', lat: 40.71,  lng: -74.00,  state: 'NY', region: 'usa', status: 'feasible' },
  { id: 'NY-002', lat: 42.88,  lng: -78.87,  state: 'NY', region: 'usa', status: 'not_feasible' },
  { id: 'NY-003', lat: 42.65,  lng: -73.75,  state: 'NY', region: 'usa', status: 'not_feasible' },
  // Illinois
  { id: 'IL-001', lat: 41.85,  lng: -87.65,  state: 'IL', region: 'usa', status: 'feasible' },
  { id: 'IL-002', lat: 39.80,  lng: -89.64,  state: 'IL', region: 'usa', status: 'not_feasible' },
  // United Kingdom
  { id: 'GB-001', lat: 51.50,  lng: -0.12,   state: 'GB', region: 'europe', status: 'feasible' },
  { id: 'GB-002', lat: 53.48,  lng: -2.24,   state: 'GB', region: 'europe', status: 'not_feasible' },
  { id: 'GB-003', lat: 52.47,  lng: -1.89,   state: 'GB', region: 'europe', status: 'not_feasible' },
  // Germany
  { id: 'DE-001', lat: 52.52,  lng: 13.40,   state: 'DE', region: 'europe', status: 'feasible' },
  { id: 'DE-002', lat: 48.13,  lng: 11.57,   state: 'DE', region: 'europe', status: 'feasible' },
  { id: 'DE-003', lat: 53.55,  lng: 9.99,    state: 'DE', region: 'europe', status: 'not_feasible' },
  // France
  { id: 'FR-001', lat: 48.85,  lng: 2.35,    state: 'FR', region: 'europe', status: 'not_feasible' },
  { id: 'FR-002', lat: 45.74,  lng: 4.83,    state: 'FR', region: 'europe', status: 'feasible' },
  { id: 'FR-003', lat: 43.29,  lng: 5.38,    state: 'FR', region: 'europe', status: 'not_feasible' },
]

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
    cqLocations: MOCK_CQ_LOCATIONS,
    serviceTypeSummary: { BIA: 0, DIA: 0, Ethernet: 0, other: 0 },
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
