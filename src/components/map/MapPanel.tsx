import { useMap, USA_MAP_CONFIG } from '../../hooks/useMap'
import { useChoropleth } from '../../hooks/useChoropleth'
import { useMapInteraction } from '../../hooks/useMapInteraction'
import { useCqMarkers } from '../../hooks/useCqMarkers'
import { useUiStore } from '../../store/uiStore'
import { MapLegend } from './MapLegend'
import { MapTooltip } from './MapTooltip'
import 'maplibre-gl/dist/maplibre-gl.css'

export function MapPanel() {
  const { mapRef, containerRef, isLoaded } = useMap(USA_MAP_CONFIG)
  useChoropleth(mapRef, isLoaded, USA_MAP_CONFIG.sourceId, 'usa')
  useMapInteraction(mapRef, isLoaded, `${USA_MAP_CONFIG.sourceId}-fill`)
  useCqMarkers(mapRef, isLoaded, 'usa')

  const showCqMarkers   = useUiStore(s => s.showCqMarkers)
  const toggleCqMarkers = useUiStore(s => s.toggleCqMarkers)

  return (
    <div className="relative flex-1 bg-gray-950 min-w-0">
      <div style={{ position: 'absolute', inset: 0 }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
      {isLoaded && (
        <>
          <MapLegend />
          <MapTooltip />
          <button
            onClick={toggleCqMarkers}
            className={`absolute bottom-6 right-4 z-10 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showCqMarkers
                ? 'bg-cyan-700 border-cyan-500 text-white'
                : 'bg-gray-900/90 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            {showCqMarkers ? 'Ocultar CQs' : 'Ver CQs'}
          </button>
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
