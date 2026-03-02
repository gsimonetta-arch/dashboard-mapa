export function formatPercent(ratio: number | null, decimals = 1): string {
  if (ratio === null) return '—'
  return (ratio * 100).toFixed(decimals) + '%'
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-US')
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}
