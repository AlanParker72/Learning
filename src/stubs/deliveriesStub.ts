import type { DeliveryApiItem, DeliveriesListResponseApi } from '../api/contracts'
import { toDashboardRange, type DashboardRangeApi } from '../api/contracts'
import { parseFlexibleDate } from '../utils/format'

export type DeliveriesStubSearchField =
  | 'customerId'
  | 'referenceId'
  | 'recipientId'
  | 'applicationId'
  | 'accountId'

export type DeliveriesStubParams = {
  search?: string
  searchBy?: DeliveriesStubSearchField
  status?: string | string[]
  channel?: string
  page?: number
  pageSize?: number
  range?: string
  tableRange?: string
  sortField?: 'dateTime'
  sortDir?: 'asc' | 'desc'
}

const TABLE_RANGE_MS: Record<string, number> = {
  'Last 1 hour': 60 * 60 * 1000,
  'Last 12 hours': 12 * 60 * 60 * 1000,
  'Last 24 hours': 24 * 60 * 60 * 1000,
  'Last 7 days': 7 * 24 * 60 * 60 * 1000
}

const comment = (
  text: string,
  action: 'acknowledge' | 'resend',
  by: string,
  at: string
) => ({ comment: text, action, commentedBy: by, commentedDate: at })

/**
 * Curated delivery rows matching the list contract.
 * Several rows set `inputAvailable: true` so the Doc link shows "Input".
 */
const DELIVERIES: DeliveryApiItem[] = [
  {
    messageId: 'MSG-00010001',
    id: 'MSG-00010001',
    referenceId: 'Item 1',
    recipientType: 'Customer',
    recipientId: '1234567890',
    applicationId: '1234567890',
    accountId: '1234567890',
    tenant: 'Mosaic',
    tenantId: 'tenant-1001',
    trackingId: 'TRK-00010001',
    source: 'Mosaic',
    function: 'Prospect Management',
    deliveryDateTime: '2026-09-09T14:22:00.000Z',
    deliveryStatus: 'Sent / Re-Sent',
    deliveryChannel: 'Marketplace Email',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      comment('Delivery acknowledgement confirmation for Item 1.', 'acknowledge', 'Ops Team', '2026-09-09T14:40:00.000Z')
    ],
    recipients: { to: ['to+001@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010002',
    id: 'MSG-00010002',
    referenceId: 'Item 2',
    recipientType: 'Prospect',
    recipientId: '1234567891',
    applicationId: '1234567891',
    accountId: '1234567891',
    tenant: 'FCB',
    tenantId: 'tenant-1002',
    trackingId: 'TRK-00010002',
    source: 'OAO',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-09-09T12:05:00.000Z',
    deliveryStatus: 'Queued',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      comment('Queued for SMTP handoff.', 'resend', 'Support Queue', '2026-09-09T12:20:00.000Z')
    ],
    recipients: { to: ['to+002@example.com'], cc: ['cc+002@example.com'], bcc: [] }
  },
  {
    messageId: 'MSG-00010003',
    id: 'MSG-00010003',
    referenceId: 'Item 3',
    recipientType: 'Employee',
    recipientId: '1234567892',
    applicationId: '1234567892',
    accountId: '1234567892',
    tenant: 'CIT',
    tenantId: 'tenant-1003',
    trackingId: 'TRK-00010003',
    source: 'Direct Deposit',
    function: 'Payment Settlement',
    deliveryDateTime: '2026-09-09T09:18:00.000Z',
    deliveryStatus: 'Failed',
    deliveryChannel: 'Push',
    failureReason: 'Upstream provider timeout',
    retryCount: 2,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      comment('Provider timeout — retry scheduled.', 'resend', 'Delivery Manager', '2026-09-09T09:35:00.000Z'),
      comment('Acknowledged after second failure.', 'acknowledge', 'Ops Team', '2026-09-09T10:02:00.000Z')
    ],
    recipients: { to: ['to+003@example.com'], cc: [], bcc: ['bcc+003@example.com'] }
  },
  {
    messageId: 'MSG-00010004',
    id: 'MSG-00010004',
    referenceId: 'Item 4',
    recipientType: 'Customer',
    recipientId: '1234567893',
    applicationId: '1234567890',
    accountId: '1234567890',
    tenant: 'AAO',
    tenantId: 'tenant-1004',
    trackingId: 'TRK-00010004',
    source: 'Invoice',
    function: 'Risk Review',
    deliveryDateTime: '2026-09-08T20:44:00.000Z',
    deliveryStatus: 'Acknowledged',
    deliveryChannel: 'Marketplace Email',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      comment('Customer acknowledged receipt.', 'acknowledge', 'Compliance Review', '2026-09-08T21:00:00.000Z')
    ],
    recipients: { to: ['to+004@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010005',
    id: 'MSG-00010005',
    referenceId: 'Item 5',
    recipientType: 'Prospect',
    recipientId: '1234567894',
    applicationId: '1234567891',
    accountId: '1234567891',
    tenant: 'Mosaic',
    tenantId: 'tenant-1005',
    trackingId: 'TRK-00010005',
    source: 'Mosaic',
    function: 'Prospect Management',
    deliveryDateTime: '2026-09-08T16:10:00.000Z',
    deliveryStatus: 'Sent / Re-Sent',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 1,
    manualRetryAllowed: false,
    inputAvailable: false,
    comments: [],
    recipients: { to: ['to+005@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010006',
    id: 'MSG-00010006',
    referenceId: 'Item 6',
    recipientType: 'Customer',
    recipientId: '1234567895',
    applicationId: '1234567892',
    accountId: '1234567892',
    tenant: 'FCB',
    tenantId: 'tenant-1006',
    trackingId: 'TRK-00010006',
    source: 'OAO',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-09-08T11:30:00.000Z',
    deliveryStatus: 'Queued',
    deliveryChannel: 'Push',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      comment('Waiting on push gateway.', 'acknowledge', 'Support Queue', '2026-09-08T11:45:00.000Z')
    ],
    recipients: { to: ['to+006@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010007',
    id: 'MSG-00010007',
    referenceId: 'Item 7',
    recipientType: 'Employee',
    recipientId: '1234567896',
    applicationId: '1234567890',
    accountId: '1234567893',
    tenant: 'CIT',
    tenantId: 'tenant-1007',
    trackingId: 'TRK-00010007',
    source: 'Direct Deposit',
    function: 'Payment Settlement',
    deliveryDateTime: '2026-09-07T18:55:00.000Z',
    deliveryStatus: 'Failed',
    deliveryChannel: 'Marketplace Email',
    failureReason: 'Mailbox full',
    retryCount: 3,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      comment('Mailbox full — manual retry allowed.', 'resend', 'Ops Team', '2026-09-07T19:10:00.000Z')
    ],
    recipients: { to: ['to+007@example.com'], cc: ['cc+007@example.com'], bcc: [] }
  },
  {
    messageId: 'MSG-00010008',
    id: 'MSG-00010008',
    referenceId: 'Item 8',
    recipientType: 'Customer',
    recipientId: '1234567897',
    applicationId: '1234567891',
    accountId: '1234567890',
    tenant: 'AAO',
    tenantId: 'tenant-1008',
    trackingId: 'TRK-00010008',
    source: 'Invoice',
    function: 'Risk Review',
    deliveryDateTime: '2026-09-07T08:12:00.000Z',
    deliveryStatus: 'Acknowledged',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      comment('Risk review acknowledged.', 'acknowledge', 'Compliance Review', '2026-09-07T08:30:00.000Z')
    ],
    recipients: { to: ['to+008@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010009',
    id: 'MSG-00010009',
    referenceId: 'Item 9',
    recipientType: 'Prospect',
    recipientId: '1234567898',
    applicationId: '1234567892',
    accountId: '1234567891',
    tenant: 'Mosaic',
    tenantId: 'tenant-1009',
    trackingId: 'TRK-00010009',
    source: 'Mosaic',
    function: 'Prospect Management',
    deliveryDateTime: '2026-09-06T22:40:00.000Z',
    deliveryStatus: 'Sent / Re-Sent',
    deliveryChannel: 'Push',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [],
    recipients: { to: ['to+009@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010010',
    id: 'MSG-00010010',
    referenceId: 'Item 10',
    recipientType: 'Customer',
    recipientId: '1234567899',
    applicationId: '1234567890',
    accountId: '1234567892',
    tenant: 'FCB',
    tenantId: 'tenant-1010',
    trackingId: 'TRK-00010010',
    source: 'OAO',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-09-06T15:05:00.000Z',
    deliveryStatus: 'Queued',
    deliveryChannel: 'Marketplace Email',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: [
      comment('Held in marketplace queue.', 'acknowledge', 'Support Queue', '2026-09-06T15:20:00.000Z')
    ],
    recipients: { to: ['to+010@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010011',
    id: 'MSG-00010011',
    referenceId: 'Item 11',
    recipientType: 'Employee',
    recipientId: '1234567900',
    applicationId: '1234567891',
    accountId: '1234567893',
    tenant: 'CIT',
    tenantId: 'tenant-1011',
    trackingId: 'TRK-00010011',
    source: 'Direct Deposit',
    function: 'Payment Settlement',
    deliveryDateTime: '2026-09-05T13:28:00.000Z',
    deliveryStatus: 'Failed',
    deliveryChannel: 'SMTP',
    failureReason: 'Invalid recipient',
    retryCount: 1,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      comment('Invalid recipient address flagged.', 'resend', 'Delivery Manager', '2026-09-05T13:40:00.000Z')
    ],
    recipients: { to: ['to+011@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010012',
    id: 'MSG-00010012',
    referenceId: 'Item 12',
    recipientType: 'Customer',
    recipientId: '1234567901',
    applicationId: '1234567892',
    accountId: '1234567890',
    tenant: 'AAO',
    tenantId: 'tenant-1012',
    trackingId: 'TRK-00010012',
    source: 'Invoice',
    function: 'Risk Review',
    deliveryDateTime: '2026-09-05T07:50:00.000Z',
    deliveryStatus: 'Acknowledged',
    deliveryChannel: 'Push',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      comment('Push delivery acknowledged.', 'acknowledge', 'Ops Team', '2026-09-05T08:05:00.000Z')
    ],
    recipients: { to: ['to+012@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010013',
    id: 'MSG-00010013',
    referenceId: 'Item 13',
    recipientType: 'Prospect',
    recipientId: '1234567902',
    applicationId: '1234567890',
    accountId: '1234567891',
    tenant: 'Mosaic',
    tenantId: 'tenant-1013',
    trackingId: 'TRK-00010013',
    source: 'Mosaic',
    function: 'Prospect Management',
    deliveryDateTime: '2026-09-04T19:15:00.000Z',
    deliveryStatus: 'Sent / Re-Sent',
    deliveryChannel: 'Marketplace Email',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [],
    recipients: { to: ['to+013@example.com'], cc: ['cc+013@example.com'], bcc: [] }
  },
  {
    messageId: 'MSG-00010014',
    id: 'MSG-00010014',
    referenceId: 'Item 14',
    recipientType: 'Customer',
    recipientId: '1234567903',
    applicationId: '1234567891',
    accountId: '1234567892',
    tenant: 'FCB',
    tenantId: 'tenant-1014',
    trackingId: 'TRK-00010014',
    source: 'OAO',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-09-03T10:00:00.000Z',
    deliveryStatus: 'Queued',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      comment('Awaiting SMTP window.', 'acknowledge', 'Support Queue', '2026-09-03T10:15:00.000Z')
    ],
    recipients: { to: ['to+014@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010015',
    id: 'MSG-00010015',
    referenceId: 'Item 15',
    recipientType: 'Employee',
    recipientId: '1234567904',
    applicationId: '1234567892',
    accountId: '1234567893',
    tenant: 'CIT',
    tenantId: 'tenant-1015',
    trackingId: 'TRK-00010015',
    source: 'Direct Deposit',
    function: 'Payment Settlement',
    deliveryDateTime: '2026-09-02T16:42:00.000Z',
    deliveryStatus: 'Failed',
    deliveryChannel: 'Push',
    failureReason: 'Device unreachable',
    retryCount: 2,
    manualRetryAllowed: true,
    inputAvailable: false,
    comments: [
      comment('Device unreachable for push.', 'resend', 'Delivery Manager', '2026-09-02T17:00:00.000Z')
    ],
    recipients: { to: ['to+015@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010016',
    id: 'MSG-00010016',
    referenceId: 'Item 16',
    recipientType: 'Customer',
    recipientId: '1234567905',
    applicationId: '1234567890',
    accountId: '1234567890',
    tenant: 'AAO',
    tenantId: 'tenant-1016',
    trackingId: 'TRK-00010016',
    source: 'Invoice',
    function: 'Risk Review',
    deliveryDateTime: '2026-09-01T12:25:00.000Z',
    deliveryStatus: 'Acknowledged',
    deliveryChannel: 'Marketplace Email',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      comment('Invoice delivery acknowledged.', 'acknowledge', 'Compliance Review', '2026-09-01T12:40:00.000Z')
    ],
    recipients: { to: ['to+016@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010017',
    id: 'MSG-00010017',
    referenceId: 'Item 17',
    recipientType: 'Prospect',
    recipientId: '1234567906',
    applicationId: '1234567891',
    accountId: '1234567891',
    tenant: 'Mosaic',
    tenantId: 'tenant-1017',
    trackingId: 'TRK-00010017',
    source: 'Mosaic',
    function: 'Prospect Management',
    deliveryDateTime: '2026-08-31T09:05:00.000Z',
    deliveryStatus: 'Sent / Re-Sent',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [],
    recipients: { to: ['to+017@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010018',
    id: 'MSG-00010018',
    referenceId: 'Item 18',
    recipientType: 'Customer',
    recipientId: '1234567907',
    applicationId: '1234567892',
    accountId: '1234567892',
    tenant: 'FCB',
    tenantId: 'tenant-1018',
    trackingId: 'TRK-00010018',
    source: 'OAO',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-08-30T21:18:00.000Z',
    deliveryStatus: 'Queued',
    deliveryChannel: 'Push',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      comment('Queued overnight for push.', 'acknowledge', 'Support Queue', '2026-08-30T21:30:00.000Z')
    ],
    recipients: { to: ['to+018@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010019',
    id: 'MSG-00010019',
    referenceId: 'Item 19',
    recipientType: 'Employee',
    recipientId: '1234567908',
    applicationId: '1234567890',
    accountId: '1234567893',
    tenant: 'CIT',
    tenantId: 'tenant-1019',
    trackingId: 'TRK-00010019',
    source: 'Direct Deposit',
    function: 'Payment Settlement',
    deliveryDateTime: '2026-08-29T14:33:00.000Z',
    deliveryStatus: 'Failed',
    deliveryChannel: 'Marketplace Email',
    failureReason: 'Template render error',
    retryCount: 1,
    manualRetryAllowed: true,
    inputAvailable: true,
    comments: [
      comment('Template render error — resend after fix.', 'resend', 'Ops Team', '2026-08-29T14:50:00.000Z')
    ],
    recipients: { to: ['to+019@example.com'], cc: [], bcc: ['bcc+019@example.com'] }
  },
  {
    messageId: 'MSG-00010020',
    id: 'MSG-00010020',
    referenceId: 'Item 20',
    recipientType: 'Customer',
    recipientId: '1234567909',
    applicationId: '1234567891',
    accountId: '1234567890',
    tenant: 'AAO',
    tenantId: 'tenant-1020',
    trackingId: 'TRK-00010020',
    source: 'Invoice',
    function: 'Risk Review',
    deliveryDateTime: '2026-08-28T06:48:00.000Z',
    deliveryStatus: 'Acknowledged',
    deliveryChannel: 'SMTP',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      comment('SMTP delivery acknowledged.', 'acknowledge', 'Compliance Review', '2026-08-28T07:05:00.000Z')
    ],
    recipients: { to: ['to+020@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010021',
    id: 'MSG-00010021',
    referenceId: 'Item 21',
    recipientType: 'Prospect',
    recipientId: '1234567910',
    applicationId: '1234567892',
    accountId: '1234567891',
    tenant: 'Mosaic',
    tenantId: 'tenant-1021',
    trackingId: 'TRK-00010021',
    source: 'Mosaic',
    function: 'Prospect Management',
    deliveryDateTime: '2026-08-27T17:20:00.000Z',
    deliveryStatus: 'Sent / Re-Sent',
    deliveryChannel: 'Push',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [],
    recipients: { to: ['to+021@example.com'], cc: [], bcc: [] }
  },
  {
    messageId: 'MSG-00010022',
    id: 'MSG-00010022',
    referenceId: 'Item 22',
    recipientType: 'Customer',
    recipientId: '1234567911',
    applicationId: '1234567890',
    accountId: '1234567892',
    tenant: 'FCB',
    tenantId: 'tenant-1022',
    trackingId: 'TRK-00010022',
    source: 'OAO',
    function: 'Direct Deposit',
    deliveryDateTime: '2026-09-09T01:05:00.000Z',
    deliveryStatus: 'Sent / Re-Sent',
    deliveryChannel: 'Marketplace Email',
    failureReason: null,
    retryCount: 0,
    manualRetryAllowed: false,
    inputAvailable: true,
    comments: [
      comment('Early-morning marketplace send.', 'acknowledge', 'Ops Team', '2026-09-09T01:20:00.000Z')
    ],
    recipients: { to: ['to+022@example.com'], cc: [], bcc: [] }
  }
]

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

const searchValue = (item: DeliveryApiItem, field: DeliveriesStubSearchField): string => {
  switch (field) {
    case 'referenceId':
      return item.referenceId ?? ''
    case 'recipientId':
      return item.recipientId
    case 'applicationId':
      return item.applicationId
    case 'accountId':
      return item.accountId
    case 'customerId':
    default:
      return item.recipientId
  }
}

const applyTableRange = (items: DeliveryApiItem[], tableRange?: string): DeliveryApiItem[] => {
  const windowMs = tableRange ? TABLE_RANGE_MS[tableRange] : undefined
  if (!windowMs) return items

  const timestamps = items
    .map((item) => parseFlexibleDate(item.deliveryDateTime)?.getTime() ?? 0)
    .filter((value) => value > 0)

  if (timestamps.length === 0) return items

  const latest = Math.max(...timestamps)
  return items.filter((item) => {
    const time = parseFlexibleDate(item.deliveryDateTime)?.getTime()
    return time !== undefined && latest - time <= windowMs
  })
}

/** GET /alerts-admin/v1/deliveries stub — filters the curated object list by request params. */
export function getDeliveriesStub(params: DeliveriesStubParams = {}): DeliveriesListResponseApi {
  const {
    search,
    searchBy = 'customerId',
    status,
    channel,
    page = 1,
    pageSize = 10,
    range = 'TWO_WEEKS',
    tableRange,
    sortField = 'dateTime',
    sortDir = 'desc'
  } = params

  const selectedStatuses = Array.isArray(status) ? status : status ? [status] : []
  const dashboardRange = toDashboardRange(range)

  let items = byDashboardRange(dashboardRange)
  items = applyTableRange(items, tableRange)

  if (search?.trim()) {
    const keyword = search.trim().toLowerCase()
    items = items.filter((item) => searchValue(item, searchBy).toLowerCase().includes(keyword))
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

  const total = items.length
  const start = (page - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return { items: pageItems, total }
}
