import type { DeliveryApiItem, DeliveriesListResponseApi, DeliveryCommentApi } from '../api/contracts'
import { toDashboardRange, type DashboardRangeApi } from '../api/contracts'
import { parseFlexibleDate } from '../utils/format'
import { DELIVERY_STATUSES } from '../theme/statusConfig'

/**
 * Search fields for stub filtering.
 * ProspectId: no dedicated API field — filter where recipientType is PROSPECT
 * and match against customerId / recipientId.
 */
export type DeliveriesStubSearchField = 'customerId' | 'prospectId' | 'source'

export type DeliveriesStubParams = {
  search?: string
  searchBy?: DeliveriesStubSearchField
  status?: string | string[]
  channel?: string
  page?: number
  pageSize?: number
  range?: string
  sortField?: 'dateTime'
  sortDir?: 'asc' | 'desc'
}

const TENANTS = ['FCB', 'Mosaic', 'CIT', 'AAO', 'OAO'] as const
const SOURCES = ['DIRECT DEPOSIT1', 'Mosaic', 'OAO', 'Invoice', 'Direct Deposit', 'Prospect Management'] as const
const CHANNELS = ['MARKETO EMAIL', 'SMTP', 'PUSH'] as const
const RECIPIENT_TYPES = ['CUSTOMER', 'PROSPECT', 'EMPLOYEE'] as const
const FAILURE_REASONS = [
  'Unexpected error in REST call',
  'Upstream provider timeout',
  'Mailbox full',
  'Invalid recipient',
  'Device unreachable',
  'Template render error',
  null
] as const

const uuid = (n: number): string => {
  const hex = n.toString(16).padStart(8, '0')
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-8${hex.slice(1, 4)}-${hex.padStart(12, '0').slice(0, 12)}`
}

const daysAgoIso = (daysAgo: number, hour = 12, minute = 0): string => {
  // Anchor near sample API as-of so range windows are stable in stubs.
  const base = new Date('2026-09-11T21:00:00.000Z')
  base.setUTCDate(base.getUTCDate() - daysAgo)
  base.setUTCHours(hour, minute, (daysAgo * 7) % 60, 0)
  return base.toISOString().replace('Z', '').slice(0, 23)
}

const makeComment = (
  text: string,
  actionOrActtion: { action?: string; acttion?: string },
  by: string,
  at: string
): DeliveryCommentApi => ({
  comment: text,
  ...actionOrActtion,
  commentedBy: by,
  commentedDate: at
})

/**
 * Build 96 curated rows matching the paginated deliveries contract.
 * Varied statuses, channels, sources, recipientTypes, comments, flags.
 */
function buildDeliveries(): DeliveryApiItem[] {
  const rows: DeliveryApiItem[] = []

  for (let i = 1; i <= 96; i += 1) {
    // Skip 463 — reserved for the explicit API sample row below.
    const referenceId = 400 + i === 463 ? 499 : 400 + i
    const recipientType = RECIPIENT_TYPES[(i - 1) % RECIPIENT_TYPES.length]
    const status = DELIVERY_STATUSES[(i - 1) % DELIVERY_STATUSES.length]
    const channel = CHANNELS[(i - 1) % CHANNELS.length]
    const source = SOURCES[(i - 1) % SOURCES.length]
    const tenantId = TENANTS[(i - 1) % TENANTS.length]
    const daysAgo = (i - 1) % 32 // spreads across ~1 month for range slices
    const customerId = recipientType === 'EMPLOYEE' && i % 5 === 0 ? null : String(1000 + (i % 40))
    const recipientId =
      i % 7 === 0 ? null : recipientType === 'PROSPECT' ? `P-${2000 + i}` : `R-${3000 + i}`
    const applicationId = i % 4 === 0 ? null : `APP-${5000 + (i % 12)}`
    const accountId = i % 5 === 0 ? null : `ACCT-${6000 + (i % 15)}`
    const inputAvailable = i % 3 !== 0
    const manualRetryAllowed = status === 'ERROR_STOP' || status === 'ERROR_RETRY' || status === 'FAILED_RETRY' || i % 2 === 0
    const failureReason =
      status === 'ERROR_STOP' || status === 'ERROR_RETRY' || status === 'FAILED_RETRY'
        ? FAILURE_REASONS[(i - 1) % FAILURE_REASONS.length]
        : null
    const functionName = i % 6 === 0 ? null : source.includes('Deposit') ? 'Direct Deposit' : 'Alert Dispatch'

    let comments: DeliveryCommentApi[] | null | undefined
    if (i % 11 === 0) {
      comments = undefined // missing
    } else if (i % 9 === 0) {
      comments = null
    } else if (i % 5 === 0) {
      comments = []
    } else if (i % 4 === 0) {
      // API typo path — acttion only
      comments = [
        makeComment('TEST COMMENTS', { acttion: 'RETRY' }, 'TEST', daysAgoIso(Math.max(0, daysAgo - 1), 17, 43))
      ]
    } else if (i % 3 === 0) {
      comments = [
        makeComment('Queued for handoff.', { action: 'resend' }, 'Support Queue', daysAgoIso(Math.max(0, daysAgo - 1), 12, 20)),
        makeComment('Follow-up note.', { action: 'acknowledge' }, 'Ops Team', daysAgoIso(Math.max(0, daysAgo - 1), 14, 5))
      ]
    } else {
      comments = [
        makeComment(
          `Delivery note for reference ${referenceId}.`,
          { action: i % 2 === 0 ? 'acknowledge' : 'resend' },
          i % 2 === 0 ? 'Ops Team' : 'Delivery Manager',
          daysAgoIso(Math.max(0, daysAgo - 1), 10, 15)
        )
      ]
    }

    rows.push({
      referenceId,
      recipients: {
        to: [`to+${String(i).padStart(3, '0')}@test.com`, ...(i % 2 === 0 ? [`to2+${i}@test.com`] : [])],
        cc: i % 3 === 0 ? [`cc+${i}@test.com`] : [],
        bcc: i % 4 === 0 ? [`bcc+${i}@test.com`] : []
      },
      tenantId,
      correlationId: uuid(referenceId),
      customerId,
      recipientType,
      recipientId,
      applicationId,
      accountId,
      source,
      function: functionName,
      deliveryDateTime: daysAgoIso(daysAgo, 8 + (i % 12), (i * 3) % 60),
      deliveryStatus: status,
      deliveryChannel: channel,
      failureReason,
      retryCount: status.includes('RETRY') || status === 'ERROR_STOP' ? (i % 4) : 0,
      manualRetryAllowed,
      inputAvailable,
      comments
    })
  }

  // Explicit sample matching the provided API example shape (near top of list by date).
  rows.unshift({
    referenceId: 463,
    recipients: {
      to: ['sam.prad@test.com', 'sam.prad2@test.com'],
      cc: ['sam.prad@test.com', 'sam.prad2@test.com'],
      bcc: ['sam.prad@test.com', 'sam.prad2@test.com']
    },
    tenantId: 'FCB',
    correlationId: '24ba5d35-7bb1-48be-8a48-1c6c875b995a',
    customerId: '123',
    recipientType: 'CUSTOMER',
    recipientId: null,
    applicationId: null,
    accountId: null,
    source: 'DIRECT DEPOSIT1',
    function: null,
    deliveryDateTime: '2026-09-10T15:56:02.497',
    deliveryStatus: 'ERROR_STOP',
    deliveryChannel: 'MARKETO EMAIL',
    failureReason: 'Unexpected error in REST call',
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      {
        comment: 'TEST COMMENTS',
        acttion: 'RETRY',
        commentedBy: 'TEST',
        commentedDate: '2026-09-11T17:43:58.682'
      }
    ]
  })

  return rows
}

const DELIVERIES: DeliveryApiItem[] = buildDeliveries()

/** Slice the curated list by dashboard range window (by deliveryDateTime). */
const byDashboardRange = (range: DashboardRangeApi): DeliveryApiItem[] => {
  const cutoffDays = range === 'ONE_WEEK' ? 7 : range === 'THIRTY_DAYS' ? 30 : 14
  const newest = Math.max(
    ...DELIVERIES.map((item) => parseFlexibleDate(item.deliveryDateTime)?.getTime() ?? 0)
  )
  const windowMs = cutoffDays * 24 * 60 * 60 * 1000
  return DELIVERIES.filter((item) => {
    const time = parseFlexibleDate(item.deliveryDateTime)?.getTime() ?? 0
    return newest - time <= windowMs
  })
}

const isProspect = (item: DeliveryApiItem): boolean =>
  item.recipientType.trim().toUpperCase() === 'PROSPECT'

/**
 * Resolve the searchable string for a given searchBy field.
 * ProspectId: only PROSPECT rows; match customerId then recipientId.
 */
const matchesSearch = (item: DeliveryApiItem, field: DeliveriesStubSearchField, keyword: string): boolean => {
  switch (field) {
    case 'source':
      return item.source.toLowerCase().includes(keyword)
    case 'prospectId': {
      if (!isProspect(item)) return false
      const prospectKey = (item.recipientId ?? item.customerId ?? '').toLowerCase()
      return prospectKey.includes(keyword)
    }
    case 'customerId':
    default: {
      const customerKey = (item.customerId ?? item.recipientId ?? '').toLowerCase()
      return customerKey.includes(keyword)
    }
  }
}

/** GET /alerts-admin/v1/deliveries stub — filters then returns paginated `records` shape. */
export function getDeliveriesStub(params: DeliveriesStubParams = {}): DeliveriesListResponseApi {
  const {
    search,
    searchBy = 'customerId',
    status,
    channel,
    page = 1,
    pageSize = 10,
    range = 'TWO_WEEKS',
    sortField = 'dateTime',
    sortDir = 'desc'
  } = params

  const selectedStatuses = Array.isArray(status) ? status : status ? [status] : []
  const dashboardRange = toDashboardRange(range)

  let items = byDashboardRange(dashboardRange)

  if (search?.trim()) {
    const keyword = search.trim().toLowerCase()
    items = items.filter((item) => matchesSearch(item, searchBy, keyword))
  }

  if (selectedStatuses.length > 0) {
    items = items.filter((item) => selectedStatuses.includes(item.deliveryStatus))
  }

  if (channel && channel !== 'all') {
    items = items.filter((item) => item.deliveryChannel === channel)
  }

  items = [...items].sort((left, right) => {
    if (sortField !== 'dateTime') return 0
    const leftTime = parseFlexibleDate(left.deliveryDateTime)?.getTime() ?? 0
    const rightTime = parseFlexibleDate(right.deliveryDateTime)?.getTime() ?? 0
    return sortDir === 'asc' ? leftTime - rightTime : rightTime - leftTime
  })

  const totalRecords = items.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return {
    page: safePage,
    pageSize,
    totalPages,
    asofDateTime: '2026-09-11T21:00:24.642264381',
    totalRecords,
    records: pageItems
  }
}
