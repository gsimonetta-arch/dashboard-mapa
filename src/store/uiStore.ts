import { create } from 'zustand'
import type { StateCode } from '../types/coverage.types'
import type { TooltipState } from '../types/ui.types'
import type { ConnectionStatus } from '../types/webhook.types'

interface UiState {
  selectedStateCode: StateCode | null
  hoveredStateCode: StateCode | null
  tooltip: TooltipState
  connectionStatus: ConnectionStatus
  lastReceivedAt: string | null

  selectState: (code: StateCode | null) => void
  hoverState: (code: StateCode | null, x?: number, y?: number) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setLastReceivedAt: (ts: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  selectedStateCode: null,
  hoveredStateCode: null,
  tooltip: { visible: false, stateCode: null, anchorX: 0, anchorY: 0 },
  connectionStatus: 'idle',
  lastReceivedAt: null,

  selectState: (code) => set({ selectedStateCode: code }),

  hoverState: (code, x = 0, y = 0) =>
    set({
      hoveredStateCode: code,
      tooltip: {
        visible: code !== null,
        stateCode: code,
        anchorX: x,
        anchorY: y,
      },
    }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setLastReceivedAt: (ts) => set({ lastReceivedAt: ts }),
}))
