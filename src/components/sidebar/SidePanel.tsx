import { useUiStore } from '../../store/uiStore'
import { GapRankingList } from './GapRankingList'
import { StateDetailCard } from './StateDetailCard'

export function SidePanel() {
  const selectedStateCode = useUiStore(s => s.selectedStateCode)

  return (
    <aside className="w-80 flex-shrink-0 flex flex-col bg-gray-900 border-l border-gray-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {selectedStateCode ? 'Detalle de estado' : 'Análisis de brechas'}
        </h3>
      </div>

      {selectedStateCode ? (
        <StateDetailCard />
      ) : (
        <div className="flex flex-col flex-1 py-2 min-h-0">
          <GapRankingList />
        </div>
      )}
    </aside>
  )
}
