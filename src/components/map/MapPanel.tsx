import { useMap } from '../../hooks/useMap'
import { useChoropleth } from '../../hooks/useChoropleth'
import { useMapInteraction } from '../../hooks/useMapInteraction'
import { MapLegend } from './MapLegend'
import { MapTooltip } from './MapTooltip'
import 'maplibre-gl/dist/maplibre-gl.css'

export function MapPanel() {
  const { mapRef, containerRef, isLoaded } = useMap()
  useChoropleth(mapRef, isLoaded)
  useMapInteraction(mapRef, isLoaded)

  return (
    <div className="relative flex-1 bg-gray-950 min-w-0">
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
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
