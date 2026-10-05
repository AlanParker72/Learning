/** Shared helpers for date-range presets / pills (UI + store hydrate). */

export function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function formatDisplayDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${mm}/${dd}/${yyyy}`
}

export function rangeForPreset(
  preset: string,
  now = new Date()
): { start: string; end: string } | null {
  const end = new Date(now)
  end.setHours(0, 0, 0, 0)

  if (preset === 'last_7') {
    const start = new Date(end)
    start.setDate(start.getDate() - 6)
    return { start: toIsoDate(start), end: toIsoDate(end) }
  }
  if (preset === 'last_30') {
    const start = new Date(end)
    start.setDate(start.getDate() - 29)
    return { start: toIsoDate(start), end: toIsoDate(end) }
  }
  if (preset === 'this_month') {
    const start = new Date(end.getFullYear(), end.getMonth(), 1)
    const monthEnd = new Date(end.getFullYear(), end.getMonth() + 1, 0)
    return { start: toIsoDate(start), end: toIsoDate(monthEnd) }
  }
  return null
}

/** Parse pill defaultValue `YYYY-MM-DD|YYYY-MM-DD` into start/end. */
export function parseRangeDefault(
  value: string | undefined
): { start: string; end: string } | null {
  if (!value || !value.includes('|')) return null
  const [start, end] = value.split('|')
  if (!start || !end) return null
  return { start, end }
}
