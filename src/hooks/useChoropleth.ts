import { useEffect } from 'react'
import type maplibregl from 'maplibre-gl'
import { GeoJSONSource } from 'maplibre-gl'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { useCoverageStore } from '../store/coverageStore'
import { useUiStore } from '../store/uiStore'
import { classifyTier } from '../utils/coverageClassifier'
import type { Region } from '../types/coverage.types'
import usStatesGeoJson from '../data/us-states.geojson'
import europeCountriesGeoJson from '../data/europe-countries.geojson'

// Base GeoJSON per region (bundled at build time, no runtime fetch needed)
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

  // Update map source with tier + code in feature properties.
  // The source already has base geometry from useMap (initialData).
  // This effect overlays coverage tier so features get their color.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return

    const base = GEO_DATA[region]
    if (!base) return

    const source = map.getSource(sourceId) as GeoJSONSource | undefined
    if (!source) return

    try {
      source.setData(buildUpdatedGeoJson(base, recordsByState))
    } catch (err) {
      console.error('[choropleth] source.setData failed:', err)
    }
  }, [mapRef, isLoaded, recordsByState, sourceId, region])

  // Hover overlay filter
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return
    const filter: maplibregl.FilterSpecification = hoveredStateCode
      ? ['==', ['get', 'code'], hoveredStateCode]
      : ['boolean', false]
    try { map.setFilter(`${sourceId}-hovered`, filter) } catch { /* layer not yet ready */ }
  }, [mapRef, isLoaded, hoveredStateCode, sourceId])

  // Selected outline filter
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return
    const filter: maplibregl.FilterSpecification = selectedStateCode
      ? ['==', ['get', 'code'], selectedStateCode]
      : ['boolean', false]
    try { map.setFilter(`${sourceId}-selected`, filter) } catch { /* layer not yet ready */ }
  }, [mapRef, isLoaded, selectedStateCode, sourceId])
}

function buildUpdatedGeoJson(
  base: FeatureCollection,
  recordsByState: Record<string, { coverageRatio: number | null }>,
): FeatureCollection {
  const features: Feature<Geometry>[] = base.features.map(f => {
    const code = String(f.id ?? '')
    const record = recordsByState[code]
    const tier = classifyTier(record?.coverageRatio ?? null)
    return {
      ...f,
      properties: { ...f.properties, code, tier },
    }
  })
  return { type: 'FeatureCollection', features }
}
