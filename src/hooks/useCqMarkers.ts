import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import type { GeoJSONSource } from 'maplibre-gl'
import type { FeatureCollection, Point } from 'geojson'
import { useCoverageStore } from '../store/coverageStore'
import { useUiStore } from '../store/uiStore'
import type { Region } from '../types/coverage.types'

const SOURCE_ID = 'cq-locations'
const LAYER_ID  = 'cq-circles'

/**
 * Adds a circle layer on top of the choropleth showing individual CQ locations.
 * - Teal  (#0891B2) = feasible
 * - Orange (#F97316) = not_feasible
 *
 * Coordinate order: [lng, lat] — GeoJSON standard.
 */
export function useCqMarkers(
  mapRef: React.RefObject<maplibregl.Map | null>,
  isLoaded: boolean,
  region: Region,
): void {
  const cqLocations  = useCoverageStore(s => s.cqLocations)
  const showCqMarkers = useUiStore(s => s.showCqMarkers)
  const initializedRef    = useRef(false)
  const popupRef          = useRef<maplibregl.Popup | null>(null)
  const showCqMarkersRef  = useRef(showCqMarkers)

  // Keep the ref in sync so the init effect can read the latest value without re-running
  showCqMarkersRef.current = showCqMarkers

  // Add source + layer once after the map is ready
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded || initializedRef.current) return

    const empty: FeatureCollection<Point> = { type: 'FeatureCollection', features: [] }

    map.addSource(SOURCE_ID, { type: 'geojson', data: empty })

    map.addLayer({
      id: LAYER_ID,
      type: 'circle',
      source: SOURCE_ID,
      layout: { visibility: showCqMarkersRef.current ? 'visible' : 'none' },
      paint: {
        'circle-radius': 5,
        'circle-color': [
          'case',
          ['==', ['get', 'status'], 'feasible'], '#0891B2',
          '#F97316',
        ],
        'circle-opacity': 0.9,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#111827',
      },
    })

    // Hover popup
    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'cq-popup',
      offset: 10,
    })
    popupRef.current = popup

    map.on('mouseenter', LAYER_ID, (e) => {
      if (!e.features?.length) return
      map.getCanvas().style.cursor = 'pointer'
      const f = e.features[0]
      const coords = (f.geometry as Point).coordinates as [number, number]
      const { id, state, status, city, totalCqs, cqsWithVq } = f.properties as {
        id: string; state: string; status: string
        city?: string; totalCqs?: number; cqsWithVq?: number
      }
      const label = status === 'feasible' ? '✓ Factible' : '✗ Sin cobertura'
      const cityLine = city ? `<br/>${city}, ${state}` : `<br/>${state}`
      const cqLine = totalCqs != null
        ? `<br/><span style="font-size:0.85em">CQs: ${totalCqs} &nbsp;|&nbsp; Con VQ: ${cqsWithVq ?? 0}</span>`
        : ''
      popup
        .setLngLat(coords)
        .setHTML(`<b>${id}</b>${cityLine} &middot; ${label}${cqLine}`)
        .addTo(map)
    })

    map.on('mouseleave', LAYER_ID, () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    initializedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  // Keep source data in sync with store
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded || !initializedRef.current) return

    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined
    if (!source) return

    const filtered = cqLocations.filter(loc => loc.region === region)

    const fc: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: filtered.map(loc => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [loc.lng, loc.lat] },
        properties: {
          id: loc.id,
          state: loc.state,
          status: loc.status,
          city: loc.city,
          totalCqs: loc.totalCqs,
          cqsWithVq: loc.cqsWithVq,
        },
      })),
    }

    try { source.setData(fc) } catch { /* layer not yet ready */ }
  }, [mapRef, isLoaded, cqLocations, region])

  // Toggle layer visibility
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded || !initializedRef.current) return
    try {
      map.setLayoutProperty(LAYER_ID, 'visibility', showCqMarkers ? 'visible' : 'none')
    } catch { /* layer not yet ready */ }
  }, [mapRef, isLoaded, showCqMarkers])
}
