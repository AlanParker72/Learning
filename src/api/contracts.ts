export const RANGE_OPTIONS = ['ONE_WEEK', 'TWO_WEEKS', 'THIRTY_DAYS', 'CUSTOM'] as const
export type DashboardRangeUi = (typeof RANGE_OPTIONS)[number]
export type DashboardRangeApi = DashboardRangeUi
export type DashboardRange = DashboardRangeUi | string

export const normalizeDashboardRange = (range?: string): DashboardRangeApi => {
  const value = (range ?? 'TWO_WEEKS').trim().toUpperCase().replace(/\s+/g, '_')

  switch (value) {
    case 'ONE_WEEK':
    case 'ONEWEEK':
    case '1_WEEK':
    case '1WEEK':
      return 'ONE_WEEK'
    case 'TWO_WEEKS':
    case 'TWO_WEEK':
    case 'TWOWEEKS':
    case 'TWOWEEK':
    case '2_WEEKS':
    case '2WEEKS':
      return 'TWO_WEEKS'
    case 'THIRTY_DAYS':
    case 'THIRTYDAYS':
    case '30_DAYS':
    case '30DAYS':
    case '1M':
      return 'THIRTY_DAYS'
    case 'CUSTOM':
      return 'CUSTOM'
    default:
      return 'TWO_WEEKS'
  }
}

export const dashboardRangeLabel = (value?: DashboardRange): string => {
  switch (normalizeDashboardRange(value)) {
    case 'ONE_WEEK':
      return '1 Week'
    case 'TWO_WEEKS':
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
    case 'ONE_WEEK':
      return 'vs previous 7 days'
    case 'TWO_WEEKS':
      return 'vs previous 14 days'
    default:
      return 'vs previous period'
  }
}

/** Raw dashboard status point from GET /alerts-admin/v1/dashboard/status */
export type DashboardStatusPointApi = {
  date: string
  sent: number
  failed: number
  queued: number
  acknowledged: number
  total: number
}

/** Raw dashboard channel point from GET /alerts-admin/v1/dashboard/channel */
export type DashboardChannelPointApi = {
  date: string
  marketToEmail: number
  smtp: number
  push: number
  total: number
}

export type DashboardStatusResponseApi = {
  range: string
  fromDate: string
  toDate: string
  data: DashboardStatusPointApi[]
}

export type DashboardChannelResponseApi = {
  range: string
  fromDate: string
  toDate: string
  data: DashboardChannelPointApi[]
}

/** Raw delivery comment from deliveries list contract */
export type DeliveryCommentApi = {
  comment: string
  action: string
  commentedBy: string
  commentedDate: string
}

/**
 * Raw delivery list item from GET /alerts-admin/v1/deliveries.
 * `function` is the API field name (reserved word in JS — access via bracket or mapper).
 */
export type DeliveryApiItem = {
  messageId?: string
  id?: string
  referenceId?: string
  recipientType: string
  recipientId: string
  applicationId: string
  accountId: string
  source: string
  function?: string
  deliveryDateTime: string
  deliveryStatus: string
  deliveryChannel: string
  failureReason?: string | null
  retryCount?: number
  manualRetryAllowed?: boolean
  inputAvailable?: boolean
  comments?: DeliveryCommentApi[]
  recipients?: {
    to?: string[]
    cc?: string[]
    bcc?: string[]
  }
  tenant?: string
  tenantId?: string
  trackingId?: string
}

export type DeliveriesListResponseApi = {
  items?: DeliveryApiItem[]
  data?: DeliveryApiItem[]
  total?: number
}

export type DeliveryActionRequestApi = {
  action: string
  comment: string
}
