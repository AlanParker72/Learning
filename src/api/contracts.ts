export const RANGE_OPTIONS = ['ONE_WEEK', 'TWO_WEEKS', 'THIRTY_DAYS', 'CUSTOM'] as const
export type DashboardRangeApi = (typeof RANGE_OPTIONS)[number]
export type DashboardRangeUi = DashboardRangeApi
export type DashboardRange = DashboardRangeApi

/** Accept only contract enum values — no alias mapping. */
export const isDashboardRange = (value?: string): value is DashboardRangeApi =>
  !!value && (RANGE_OPTIONS as readonly string[]).includes(value)

export const toDashboardRange = (value?: string): DashboardRangeApi =>
  isDashboardRange(value) ? value : 'TWO_WEEKS'

export const dashboardRangeLabel = (value?: DashboardRange): string => {
  switch (toDashboardRange(value)) {
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

export type DeliveryActionResponseApi = {
  success: boolean
}
