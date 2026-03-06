interface KpiCardProps {
  label: string
  value: string
  sub?: string
  accent?: 'red' | 'green' | 'cyan' | 'yellow' | 'default'
}

const accentClasses = {
  red: 'text-red-400',
  green: 'text-green-400',
  cyan: 'text-cyan-400',
  yellow: 'text-yellow-400',
  default: 'text-white',
}

export function KpiCard({ label, value, sub, accent = 'default' }: KpiCardProps) {
  return (
    <div className="flex flex-col justify-center px-6 py-3 bg-gray-900 border border-gray-800 rounded-lg min-w-0">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider truncate">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums leading-tight mt-1 ${accentClasses[accent]}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  )
}
