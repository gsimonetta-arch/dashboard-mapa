import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'

interface UseMapReturn {
  mapRef: React.RefObject<maplibregl.Map | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  isLoaded: boolean
}

export function useMap(): UseMapReturn {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

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
      center: [-96, 38],
      zoom: 3.8,
      attributionControl: false,
      interactive: true,
    })

    map.on('load', () => {
      map.addSource('states', {
        type: 'geojson',
        data: '/geodata/us-states.geojson',
        promoteId: 'stateCode',
      })

      map.addLayer({
        id: 'states-fill',
        type: 'fill',
        source: 'states',
        paint: {
          'fill-color': [
            'case',
            ['==', ['feature-state', 'tier'], 'critical'],  '#DC2626',
            ['==', ['feature-state', 'tier'], 'low'],        '#F97316',
            ['==', ['feature-state', 'tier'], 'moderate'],   '#EAB308',
            ['==', ['feature-state', 'tier'], 'good'],       '#16A34A',
            ['==', ['feature-state', 'tier'], 'surplus'],    '#0891B2',
            '#374151',
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 1,
            ['boolean', ['feature-state', 'dimmed'], false],   0.25,
            ['boolean', ['feature-state', 'hovered'], false],  1,
            0.75,
          ],
        },
      })

      map.addLayer({
        id: 'states-outline',
        type: 'line',
        source: 'states',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], '#FFFFFF',
            '#1F2937',
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 2.5,
            0.5,
          ],
        },
      })

      map.addLayer({
        id: 'states-hovered-outline',
        type: 'line',
        source: 'states',
        paint: {
          'line-color': '#E5E7EB',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hovered'], false], 1.5,
            0,
          ],
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
  }, [])

  return { mapRef, containerRef, isLoaded }
}
