import { useEffect } from 'react'
import type maplibregl from 'maplibre-gl'
import { useUiStore } from '../store/uiStore'

export function useMapInteraction(
  mapRef: React.RefObject<maplibregl.Map | null>,
  isLoaded: boolean,
  fillLayerId: string,
): void {
  const selectState = useUiStore(s => s.selectState)
  const hoverState = useUiStore(s => s.hoverState)

  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return

    const onMouseMove = (e: maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [fillLayerId] })
      if (features.length > 0) {
        // `code` is embedded as a property by useChoropleth (reliable vs feature.id in v5)
        const code = features[0].properties?.code as string | undefined
        if (code) {
          map.getCanvas().style.cursor = 'pointer'
          hoverState(code, e.point.x, e.point.y)
        }
      } else {
        map.getCanvas().style.cursor = ''
        hoverState(null)
      }
    }

    const onMouseLeave = () => {
      map.getCanvas().style.cursor = ''
      hoverState(null)
    }

    const onClick = (e: maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [fillLayerId] })
      if (features.length > 0) {
        const code = features[0].properties?.code as string | undefined
        if (code) selectState(code)
      } else {
        selectState(null)
      }
    }

    map.on('mousemove', onMouseMove)
    map.on('mouseleave', onMouseLeave)
    map.on('click', onClick)

    return () => {
      map.off('mousemove', onMouseMove)
      map.off('mouseleave', onMouseLeave)
      map.off('click', onClick)
    }
  }, [mapRef, isLoaded, fillLayerId, selectState, hoverState])
}
