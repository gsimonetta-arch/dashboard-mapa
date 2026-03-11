import type { StateCode, CoverageTier } from './coverage.types'

export interface TooltipState {
  visible: boolean
  stateCode: StateCode | null
  anchorX: number
  anchorY: number
}

export interface FilterState {
  highlightTiers: CoverageTier[]
  selectedStateCode: StateCode | null
}
