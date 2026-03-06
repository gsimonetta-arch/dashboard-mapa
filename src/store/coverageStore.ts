import { create } from 'zustand'
import type { CoverageDataset, StateCoverageRecord, StateCode, CoverageTier } from '../types/coverage.types'
import { classifyTier } from '../utils/coverageClassifier'

interface CoverageState {
  dataset: CoverageDataset | null
  recordsByState: Record<StateCode, StateCoverageRecord>

  ingestFullRefresh: (dataset: CoverageDataset) => void
  clearData: () => void

  getRecord: (stateCode: StateCode) => StateCoverageRecord | undefined
  getCoverageTier: (stateCode: StateCode) => CoverageTier
  getSortedByGap: () => StateCoverageRecord[]
}

function buildIndex(records: StateCoverageRecord[]): Record<StateCode, StateCoverageRecord> {
  const idx: Record<StateCode, StateCoverageRecord> = {}
  for (const r of records) idx[r.stateCode] = r
  return idx
}

export const useCoverageStore = create<CoverageState>((set, get) => ({
  dataset: null,
  recordsByState: {},

  ingestFullRefresh: (dataset) => {
    set({
      dataset,
      recordsByState: buildIndex(dataset.records),
    })
  },

  clearData: () => set({ dataset: null, recordsByState: {} }),

  getRecord: (stateCode) => get().recordsByState[stateCode],

  getCoverageTier: (stateCode) => {
    const r = get().recordsByState[stateCode]
    return classifyTier(r?.coverageRatio ?? null)
  },

  // Sorted ascending by pctFeasible (worst gap first)
  getSortedByGap: () => {
    const records = Object.values(get().recordsByState)
    return [...records].sort((a, b) => {
      const ra = a.coverageRatio ?? Infinity
      const rb = b.coverageRatio ?? Infinity
      return ra - rb
    })
  },
}))
