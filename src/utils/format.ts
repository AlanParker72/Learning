const DATE_INPUT_PATTERN = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?)?$/i

export const formatNumber = (value: number): string =>
  value.toLocaleString('en-US')

export const formatPercent = (value: number, digits = 1): string => {
  const abs = Math.abs(value).toFixed(digits)
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${abs}%`
}

export const formatISODate = (date: Date): string => date.toISOString().slice(0, 10)

export const formatDisplayDate = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const formatChartTick = (isoDate: string): string => {
  const parsed = parseFlexibleDate(isoDate)
  if (!parsed) return isoDate
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const formatClockTime = (date: Date): string =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

export const parseFlexibleDate = (value: string): Date | null => {
  const match = DATE_INPUT_PATTERN.exec(value.trim())
  if (!match) {
    const fallback = new Date(value)
    return Number.isNaN(fallback.getTime()) ? null : fallback
  }

  const [, year, month, day, hourRaw, minuteRaw, meridiem] = match
  let hours = hourRaw ? Number(hourRaw) : 0
  const minutes = minuteRaw ? Number(minuteRaw) : 0

  if (meridiem) {
    const upper = meridiem.toUpperCase()
    if (upper === 'PM' && hours < 12) hours += 12
    if (upper === 'AM' && hours === 12) hours = 0
  }

  return new Date(Number(year), Number(month) - 1, Number(day), hours, minutes)
}

export const splitDateTime = (value: string): { date: string; time: string } => {
  const parsed = parseFlexibleDate(value)
  if (!parsed) return { date: value, time: '' }

  return {
    date: parsed.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
    time: parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
}

export const initialsFromName = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
