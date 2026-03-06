import { useEffect, useRef } from 'react'
import type maplibregl from 'maplibre-gl'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { useCoverageStore } from '../store/coverageStore'
import { useUiStore } from '../store/uiStore'
import { classifyTier } from '../utils/coverageClassifier'
import type { Region } from '../types/coverage.types'

// Module-level cache so we only fetch each GeoJSON once per page load
const geoJsonCache: Record<string, FeatureCollection> = {}

async function fetchGeoJson(url: string): Promise<FeatureCollection> {
  if (geoJsonCache[url]) return geoJsonCache[url]
  const res = await fetch(url)
  const data = await res.json() as FeatureCollection
  geoJsonCache[url] = data
  return data
}

export function useChoropleth(
  mapRef: React.RefObject<maplibregl.Map | null>,
  isLoaded: boolean,
  sourceId: string,
  geoJsonUrl: string,
  region: Region,
): void {
  const recordsByState = useCoverageStore(s => s.recordsByState)
  const selectedStateCode = useUiStore(s => s.selectedStateCode)
  const hoveredStateCode = useUiStore(s => s.hoveredStateCode)

  // Cache for the raw GeoJSON (loaded once)
  const baseGeoJsonRef = useRef<FeatureCollection | null>(null)

  // Load base GeoJSON on mount
  useEffect(() => {
    fetchGeoJson(geoJsonUrl).then(data => {
      baseGeoJsonRef.current = data
    })
  }, [geoJsonUrl])

  // Update source data with tier embedded in feature properties.
  // Using setData() instead of setFeatureState() is more reliable
  // across MapLibre versions and avoids promoteId timing issues.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return

    const base = baseGeoJsonRef.current
    if (!base) {
      // Base GeoJSON not fetched yet — retry once it arrives
      fetchGeoJson(geoJsonUrl).then(data => {
        baseGeoJsonRef.current = data
        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined
        if (!source) return
        const updated = buildUpdatedGeoJson(data, recordsByState, region)
        source.setData(updated)
      })
      return
    }

    const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined
    if (!source) return
    const updated = buildUpdatedGeoJson(base, recordsByState, region)
    source.setData(updated)
  }, [mapRef, isLoaded, recordsByState, sourceId, geoJsonUrl, region])

  // Hover: update filter on the hovered overlay layer
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return
    const filter: maplibregl.FilterSpecification = hoveredStateCode
      ? ['==', ['id'], hoveredStateCode]
      : ['==', ['id'], '']
    map.setFilter(`${sourceId}-hovered`, filter)
  }, [mapRef, isLoaded, hoveredStateCode, sourceId])

  // Selected: update filter on the selected outline layer
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
  _region: Region,
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
