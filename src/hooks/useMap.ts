import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'

export interface UseMapReturn {
  mapRef: React.RefObject<maplibregl.Map | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  isLoaded: boolean
}

export interface MapConfig {
  center: [number, number]
  zoom: number
  sourceId: string
}

export function useMap(cfg: MapConfig): UseMapReturn {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const { sourceId } = cfg

    const map = new maplibregl.Map({
      container: containerRef.current,
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
      // Source starts empty — useChoropleth fills it via setData()
      // with `tier` embedded in feature properties, so no promoteId needed.
      map.addSource(sourceId, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })

      // Fill: color from feature property `tier` (data-driven, no feature-state)
      map.addLayer({
        id: `${sourceId}-fill`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'tier'], 'critical'],  '#DC2626',
            ['==', ['get', 'tier'], 'low'],         '#F97316',
            ['==', ['get', 'tier'], 'moderate'],    '#EAB308',
            ['==', ['get', 'tier'], 'good'],         '#16A34A',
            ['==', ['get', 'tier'], 'surplus'],      '#0891B2',
            '#374151',
          ],
          'fill-opacity': 0.8,
        },
      })

      // Outline for all features
      map.addLayer({
        id: `${sourceId}-outline`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#1F2937',
          'line-width': 0.5,
        },
      })

      // Hover overlay (filter updated dynamically by useMapInteraction)
      map.addLayer({
        id: `${sourceId}-hovered`,
        type: 'fill',
        source: sourceId,
        filter: ['==', ['id'], ''],
        paint: {
          'fill-color': '#FFFFFF',
          'fill-opacity': 0.12,
        },
      })

      // Selected feature bold outline (filter updated dynamically)
      map.addLayer({
        id: `${sourceId}-selected`,
        type: 'line',
        source: sourceId,
        filter: ['==', ['id'], ''],
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 2.5,
        },
      })

      setIsLoaded(true)
    })

    mapRef.current = map

    return () => {
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
}

export const EUROPE_MAP_CONFIG: MapConfig = {
  center: [15, 54],
  zoom: 3.5,
  sourceId: 'countries',
}
