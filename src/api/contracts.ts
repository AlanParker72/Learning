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
  switch (normalizeDashboardRange(value)) {
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

export const previousPeriodLabel = (value?: DashboardRange): string => {
  switch (normalizeDashboardRange(value)) {
    case 'one_week':
      return 'vs previous 7 days'
    case 'two_week':
      return 'vs previous 14 days'
    default:
      return 'vs previous period'
  }
}
