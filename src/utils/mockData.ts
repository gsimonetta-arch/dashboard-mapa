import type { CoverageDataset } from '../types/coverage.types'
import { computeRatio } from './coverageClassifier'

const RAW_STATES = [
  { code: 'AL', name: 'Alabama',        cq: 320,  vq: 110 },
  { code: 'AK', name: 'Alaska',         cq: 85,   vq: 20  },
  { code: 'AZ', name: 'Arizona',        cq: 1250, vq: 980 },
  { code: 'AR', name: 'Arkansas',       cq: 280,  vq: 175 },
  { code: 'CA', name: 'California',     cq: 4800, vq: 5200 },
  { code: 'CO', name: 'Colorado',       cq: 890,  vq: 830 },
  { code: 'CT', name: 'Connecticut',    cq: 410,  vq: 360 },
  { code: 'DE', name: 'Delaware',       cq: 95,   vq: 80  },
  { code: 'FL', name: 'Florida',        cq: 3100, vq: 2950 },
  { code: 'GA', name: 'Georgia',        cq: 1450, vq: 1320 },
  { code: 'HI', name: 'Hawaii',         cq: 120,  vq: 45  },
  { code: 'ID', name: 'Idaho',          cq: 220,  vq: 180 },
  { code: 'IL', name: 'Illinois',       cq: 1780, vq: 1650 },
  { code: 'IN', name: 'Indiana',        cq: 680,  vq: 590 },
  { code: 'IA', name: 'Iowa',           cq: 310,  vq: 260 },
  { code: 'KS', name: 'Kansas',         cq: 290,  vq: 95  },
  { code: 'KY', name: 'Kentucky',       cq: 420,  vq: 150 },
  { code: 'LA', name: 'Louisiana',      cq: 440,  vq: 130 },
  { code: 'ME', name: 'Maine',          cq: 145,  vq: 120 },
  { code: 'MD', name: 'Maryland',       cq: 720,  vq: 680 },
  { code: 'MA', name: 'Massachusetts',  cq: 810,  vq: 790 },
  { code: 'MI', name: 'Michigan',       cq: 970,  vq: 860 },
  { code: 'MN', name: 'Minnesota',      cq: 620,  vq: 590 },
  { code: 'MS', name: 'Mississippi',    cq: 260,  vq: 55  },
  { code: 'MO', name: 'Missouri',       cq: 640,  vq: 420 },
  { code: 'MT', name: 'Montana',        cq: 140,  vq: 80  },
  { code: 'NE', name: 'Nebraska',       cq: 230,  vq: 195 },
  { code: 'NV', name: 'Nevada',         cq: 580,  vq: 620 },
  { code: 'NH', name: 'New Hampshire',  cq: 165,  vq: 150 },
  { code: 'NJ', name: 'New Jersey',     cq: 1050, vq: 980 },
  { code: 'NM', name: 'New Mexico',     cq: 280,  vq: 90  },
  { code: 'NY', name: 'New York',       cq: 2650, vq: 2800 },
  { code: 'NC', name: 'North Carolina', cq: 1180, vq: 1050 },
  { code: 'ND', name: 'North Dakota',   cq: 90,   vq: 65  },
  { code: 'OH', name: 'Ohio',           cq: 1240, vq: 1100 },
  { code: 'OK', name: 'Oklahoma',       cq: 380,  vq: 130 },
  { code: 'OR', name: 'Oregon',         cq: 560,  vq: 510 },
  { code: 'PA', name: 'Pennsylvania',   cq: 1480, vq: 1320 },
  { code: 'RI', name: 'Rhode Island',   cq: 115,  vq: 100 },
  { code: 'SC', name: 'South Carolina', cq: 560,  vq: 430 },
  { code: 'SD', name: 'South Dakota',   cq: 95,   vq: 70  },
  { code: 'TN', name: 'Tennessee',      cq: 720,  vq: 540 },
  { code: 'TX', name: 'Texas',          cq: 3900, vq: 4200 },
  { code: 'UT', name: 'Utah',           cq: 430,  vq: 380 },
  { code: 'VT', name: 'Vermont',        cq: 80,   vq: 70  },
  { code: 'VA', name: 'Virginia',       cq: 980,  vq: 910 },
  { code: 'WA', name: 'Washington',     cq: 950,  vq: 1020 },
  { code: 'WV', name: 'West Virginia',  cq: 195,  vq: 55  },
  { code: 'WI', name: 'Wisconsin',      cq: 620,  vq: 580 },
  { code: 'WY', name: 'Wyoming',        cq: 80,   vq: 40  },
]

export function buildMockDataset(): CoverageDataset {
  const now = new Date().toISOString()
  const records = RAW_STATES.map(s => ({
    stateCode: s.code,
    stateName: s.name,
    customerQuotes: s.cq,
    vendorQuotes: s.vq,
    coverageRatio: computeRatio(s.cq, s.vq),
    lastUpdatedAt: now,
  }))

  const totalCQ = records.reduce((a, r) => a + r.customerQuotes, 0)
  const totalVQ = records.reduce((a, r) => a + r.vendorQuotes, 0)
  const nationalRatio = computeRatio(totalCQ, totalVQ)

  const statesWithCriticalGap = records.filter(
    r => r.coverageRatio !== null && r.coverageRatio < 0.40
  ).length

  const statesWithGoodCoverage = records.filter(
    r => r.coverageRatio !== null && r.coverageRatio >= 0.90
  ).length

  return {
    reportGeneratedAt: now,
    periodLabel: 'Q1 2026',
    records,
    summary: {
      totalCustomerQuotes: totalCQ,
      totalVendorQuotes: totalVQ,
      nationalCoverageRatio: nationalRatio,
      statesWithCriticalGap,
      statesWithGoodCoverage,
    },
  }
}
