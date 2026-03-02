import { useEffect, useRef } from 'react'
import type maplibregl from 'maplibre-gl'
import { useCoverageStore } from '../store/coverageStore'
import { useUiStore } from '../store/uiStore'
import { classifyTier } from '../utils/coverageClassifier'

const US_STATE_CODES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

export function useChoropleth(
  mapRef: React.RefObject<maplibregl.Map | null>,
  isLoaded: boolean
): void {
  const recordsByState = useCoverageStore(s => s.recordsByState)
  const selectedStateCode = useUiStore(s => s.selectedStateCode)
  const hoveredStateCode = useUiStore(s => s.hoveredStateCode)

  const prevHoveredRef = useRef<string | null>(null)
  const prevSelectedRef = useRef<string | null>(null)

  // Sync data tiers
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return

    for (const code of US_STATE_CODES) {
      const record = recordsByState[code]
      const tier = classifyTier(record?.coverageRatio ?? null)
      map.setFeatureState({ source: 'states', id: code }, { tier })
    }
  }, [mapRef, isLoaded, recordsByState])

  // Sync dimming based on selection
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return

    const hasSelection = selectedStateCode !== null
    for (const code of US_STATE_CODES) {
      map.setFeatureState(
        { source: 'states', id: code },
        {
          selected: code === selectedStateCode,
          dimmed: hasSelection && code !== selectedStateCode,
        }
      )
    }
    prevSelectedRef.current = selectedStateCode
  }, [mapRef, isLoaded, selectedStateCode])

  // Sync hover
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return

    if (prevHoveredRef.current && prevHoveredRef.current !== hoveredStateCode) {
      map.setFeatureState(
        { source: 'states', id: prevHoveredRef.current },
        { hovered: false }
      )
    }
    if (hoveredStateCode) {
      map.setFeatureState(
        { source: 'states', id: hoveredStateCode },
        { hovered: true }
      )
    }
    prevHoveredRef.current = hoveredStateCode
  }, [mapRef, isLoaded, hoveredStateCode])
}
