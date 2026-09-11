export const RANGE_OPTIONS = ['ONE_WEEK', 'TWO_WEEKS', 'THIRTY_DAYS', 'CUSTOM'] as const
export type DashboardRangeUi = (typeof RANGE_OPTIONS)[number]
export type DashboardRangeApi = 'one_week' | 'two_week' | 'THIRTY_DAYS' | 'CUSTOM'
export type DashboardRange = DashboardRangeUi | DashboardRangeApi

export const normalizeDashboardRange = (range?: string): DashboardRangeApi => {
  const value = (range ?? 'two_week').trim().toLowerCase().replace(/\s+/g, '_')

  switch (value) {
    case 'one_week':
    case 'oneweek':
      return 'one_week'
    case 'two_week':
    case 'twoweeks':
    case 'two_weeks':
    case 'twoweek':
      return 'two_week'
    case 'thirty_days':
    case 'thirtydays':
    case '30_days':
    case '30days':
      return 'THIRTY_DAYS'
    case 'custom':
      return 'CUSTOM'
    default:
      return 'two_week'
  }
}

export const dashboardRangeLabel = (value?: DashboardRange): string => {
  const normalized = normalizeDashboardRange(value as string)

  switch (normalized) {
    case 'one_week':
      return '1 Week'
    case 'two_week':
      return '2 Weeks'
    case 'THIRTY_DAYS':
      return '30 Days'
    case 'CUSTOM':
      return 'Custom'
    default:
      return '2 Weeks'
  }
}

export const getRangeDateWindow = (value?: DashboardRange, baseDate = new Date()) => {
  const date = new Date(baseDate)
  const to = new Date(baseDate)
  const from = new Date(baseDate)

  const range = normalizeDashboardRange(value as string)

  switch (range) {
    case 'one_week':
      from.setDate(to.getDate() - 6)
      break
    case 'two_week':
      from.setDate(to.getDate() - 13)
      break
    case 'THIRTY_DAYS':
      from.setDate(to.getDate() - 29)
      break
    case 'CUSTOM':
    default:
      from.setDate(to.getDate() - 29)
      break
  }

  return {
    from,
    to,
    fromIso: dateToISO(from),
    toIso: dateToISO(to),
    label: `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`
  }
}

const dateToISO = (date: Date) => date.toISOString().slice(0, 10)
const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
