import { useEffect, useRef, useState } from 'react'
import maplibregl, { GeoJSONSource } from 'maplibre-gl'
import type { FeatureCollection } from 'geojson'
import usStatesGeoJson from '../data/us-states.geojson'
import europeCountriesGeoJson from '../data/europe-countries.geojson'

export interface UseMapReturn {
  mapRef: React.RefObject<maplibregl.Map | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  isLoaded: boolean
}

export interface MapConfig {
  center: [number, number]
  zoom: number
  sourceId: string
  initialData: FeatureCollection
}

export function useMap(cfg: MapConfig): UseMapReturn {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const el = containerRef.current
    const { sourceId } = cfg

    // Diagnostic: log container dimensions before MapLibre init
    console.log(`[useMap:${sourceId}] container size at init:`, el.offsetWidth, 'x', el.offsetHeight)

    const map = new maplibregl.Map({
      container: el,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: { 'background-color': '#111827' },
          },
        ],
      },
      center: cfg.center,
      zoom: cfg.zoom,
      attributionControl: false,
      interactive: true,
    })

    map.on('load', () => {
      // Diagnostic: log container dimensions at load time
      console.log(`[useMap:${sourceId}] container size at load:`, el.offsetWidth, 'x', el.offsetHeight)
      console.log(`[useMap:${sourceId}] initialData features:`, cfg.initialData.features.length)

      // Force canvas to match container size in case init happened at 0×0
      map.resize()

      map.addSource(sourceId, {
        type: 'geojson',
        data: cfg.initialData,
      })

      // Fill: color from feature property `tier` (data-driven, no feature-state).
      // Fallback (#6B7280) renders when `tier` is absent (initial load) or 'no-data'.
      map.addLayer({
        id: `${sourceId}-fill`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'tier'], 'critical'],  '#DC2626',
            ['==', ['get', 'tier'], 'low'],        '#F97316',
            ['==', ['get', 'tier'], 'moderate'],   '#EAB308',
            ['==', ['get', 'tier'], 'good'],        '#16A34A',
            ['==', ['get', 'tier'], 'surplus'],     '#0891B2',
            '#6B7280', // no-data / initial: gray-500, clearly visible on dark bg
          ],
          'fill-opacity': 0.85,
        },
      })

      // Outline — visible border between regions
      map.addLayer({
        id: `${sourceId}-outline`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#374151',
          'line-width': 0.8,
        },
      })

      // Hover overlay — filter uses `code` property set by useChoropleth
      map.addLayer({
        id: `${sourceId}-hovered`,
        type: 'fill',
        source: sourceId,
        filter: ['boolean', false],
        paint: {
          'fill-color': '#FFFFFF',
          'fill-opacity': 0.12,
        },
      })

      // Selected feature outline
      map.addLayer({
        id: `${sourceId}-selected`,
        type: 'line',
        source: sourceId,
        filter: ['boolean', false],
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 2.5,
        },
      })

      console.log(`[useMap:${sourceId}] layers added, map ready`)
      setIsLoaded(true)
    })

    map.on('error', (e) => {
      console.error(`[useMap:${sourceId}] map error:`, e.error)
    })

    // ResizeObserver: notify MapLibre whenever the container changes size
    const observer = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize()
      }
    })
    observer.observe(el)

    mapRef.current = map

    return () => {
      observer.disconnect()
      map.remove()
      mapRef.current = null
      setIsLoaded(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { mapRef, containerRef, isLoaded }
}

export const USA_MAP_CONFIG: MapConfig = {
  center: [-96, 38],
  zoom: 3.8,
  sourceId: 'states',
  initialData: usStatesGeoJson,
}

export const EUROPE_MAP_CONFIG: MapConfig = {
  center: [15, 54],
  zoom: 3.5,
  sourceId: 'countries',
  initialData: europeCountriesGeoJson,
}

// Re-export GeoJSONSource for use in useChoropleth
export { GeoJSONSource }
