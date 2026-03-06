import { useMap, EUROPE_MAP_CONFIG } from '../../hooks/useMap'
import { useChoropleth } from '../../hooks/useChoropleth'
import { useMapInteraction } from '../../hooks/useMapInteraction'
import { MapLegend } from './MapLegend'
import { MapTooltip } from './MapTooltip'
import 'maplibre-gl/dist/maplibre-gl.css'

export function EuropePanel() {
  const { mapRef, containerRef, isLoaded } = useMap(EUROPE_MAP_CONFIG)
  useChoropleth(mapRef, isLoaded, EUROPE_MAP_CONFIG.sourceId, 'europe')
  useMapInteraction(mapRef, isLoaded, `${EUROPE_MAP_CONFIG.sourceId}-fill`)

  return (
    <div className="relative flex-1 bg-gray-950 min-w-0">
      <div style={{ position: 'absolute', inset: 0 }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
      {isLoaded && (
        <>
          <MapLegend />
          <MapTooltip />
        </>
      )}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-600 text-sm">Cargando mapa…</span>
        </div>
      )}
    </div>
  )
}
