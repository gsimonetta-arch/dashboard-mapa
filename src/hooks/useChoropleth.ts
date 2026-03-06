import { useEffect } from 'react'
import type maplibregl from 'maplibre-gl'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { useCoverageStore } from '../store/coverageStore'
import { useUiStore } from '../store/uiStore'
import { classifyTier } from '../utils/coverageClassifier'
import type { Region } from '../types/coverage.types'

// GeoJSON bundled at build time — no runtime fetch, no nginx dependency.
// The Vite 'geojson' plugin in vite.config.ts transforms these imports.
import usStatesGeoJson from '../data/us-states.geojson'
import europeCountriesGeoJson from '../data/europe-countries.geojson'

const GEO_DATA: Record<string, FeatureCollection> = {
  usa: usStatesGeoJson,
  europe: europeCountriesGeoJson,
}

export function useChoropleth(
  mapRef: React.RefObject<maplibregl.Map | null>,
  isLoaded: boolean,
  sourceId: string,
  region: Region,
): void {
  const recordsByState = useCoverageStore(s => s.recordsByState)
  const selectedStateCode = useUiStore(s => s.selectedStateCode)
  const hoveredStateCode = useUiStore(s => s.hoveredStateCode)

  // Update map source with tier embedded in each feature's properties.
  // Data is bundled — this runs synchronously, no async fetch needed.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return

    const base = GEO_DATA[region]
    if (!base) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const source = map.getSource(sourceId) as any
    if (!source?.setData) return

    source.setData(buildUpdatedGeoJson(base, recordsByState))
  }, [mapRef, isLoaded, recordsByState, sourceId, region])

  // Hover overlay filter
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return
    const filter: maplibregl.FilterSpecification = hoveredStateCode
      ? ['==', ['id'], hoveredStateCode]
      : ['==', ['id'], '']
    map.setFilter(`${sourceId}-hovered`, filter)
  }, [mapRef, isLoaded, hoveredStateCode, sourceId])

  // Selected outline filter
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return
    const filter: maplibregl.FilterSpecification = selectedStateCode
      ? ['==', ['id'], selectedStateCode]
      : ['==', ['id'], '']
    map.setFilter(`${sourceId}-selected`, filter)
  }, [mapRef, isLoaded, selectedStateCode, sourceId])
}

function buildUpdatedGeoJson(
  base: FeatureCollection,
  recordsByState: Record<string, { coverageRatio: number | null }>,
): FeatureCollection {
  const features: Feature<Geometry>[] = base.features.map(f => {
    const code = f.id as string
    const record = recordsByState[code]
    const tier = classifyTier(record?.coverageRatio ?? null)
    return {
      ...f,
      properties: { ...f.properties, tier },
    }
  })
  return { type: 'FeatureCollection', features }
}
