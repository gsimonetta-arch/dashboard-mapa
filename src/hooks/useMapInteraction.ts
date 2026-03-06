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
        // Feature ID is the alpha-2 / state code set as top-level `id` in the GeoJSON
        const code = features[0].id as string
        map.getCanvas().style.cursor = 'pointer'
        hoverState(code, e.point.x, e.point.y)
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
        const code = features[0].id as string
        selectState(code)
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
