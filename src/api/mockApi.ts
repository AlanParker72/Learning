import { apiRequest } from './httpClient'
import type { DeliveryActionRequestApi, DeliveryApiItem } from './contracts'
import { mapDeliveriesResponse } from './mapper'
import { parseFlexibleDate } from '../utils/format'

export type DeliveryStatus = 'Sent / Re-Sent' | 'Queued' | 'Failed' | 'Acknowledged'
export type DeliveryActionType = 'acknowledge' | 'resend'
export type SearchField = 'customerId' | 'referenceId' | 'recipientId' | 'applicationId' | 'accountId'

export type DeliveryComment = {
  id: string
  comment: string
  action: DeliveryActionType
  commentedBy: string
  commentedDate: string
}

export type DeliveryRecipients = {
  to: string[]
  cc: string[]
  bcc: string[]
}

/** UI delivery model aligned to the deliveries API contract. */
export type Delivery = {
  id: string
  messageId: string
  tenantId: string
  trackingId: string
  referenceId: string
  recipientType: string
  recipientId: string
  applicationId: string
  accountId: string
  tenant: string
  source: string
  /** Mapped from API field `function` (not shown as a table column). */
  functionName: string
  deliveryDateTime: string
  deliveryStatus: DeliveryStatus
  deliveryChannel: string
  failureReason: string | null
  retryCount: number
  manualRetryAllowed: boolean
  inputAvailable: boolean
  comments: DeliveryComment[]
  recipients: DeliveryRecipients
}

export type FetchParams = {
  search?: string
  searchBy?: SearchField
  status?: string | string[]
  channel?: string
  page?: number
  pageSize?: number
  customerId?: string
  range?: string
  tableRange?: string
  sortField?: 'dateTime'
  sortDir?: 'asc' | 'desc'
}

export type FetchResult = {
  items: Delivery[]
  total: number
}

const recipients = ['Customer', 'Prospect', 'Employee'] as const
const tenants = ['FCB', 'CIT', 'Mosaic', 'AAO'] as const
const sources = ['Mosaic', 'OAO', 'Direct Deposit', 'Invoice'] as const
const functions = ['Prospect Management', 'Direct Deposit', 'Payment Settlement', 'Risk Review'] as const
const channels = ['Marketplace Email', 'SMTP', 'Push'] as const
const statuses: DeliveryStatus[] = ['Sent / Re-Sent', 'Queued', 'Failed', 'Acknowledged']

const TABLE_RANGE_MS: Record<string, number> = {
  'Last 1 hour': 60 * 60 * 1000,
  'Last 12 hours': 12 * 60 * 60 * 1000,
  'Last 24 hours': 24 * 60 * 60 * 1000,
  'Last 7 days': 7 * 24 * 60 * 60 * 1000
}

const searchValue = (item: Delivery, field: SearchField): string => {
  switch (field) {
    case 'referenceId':
      return item.referenceId
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

const toIsoDateTime = (date: Date): string => date.toISOString()

const buildSampleApiItems = (range: 'ONE_WEEK' | 'TWO_WEEKS' = 'TWO_WEEKS'): DeliveryApiItem[] => {
  const totalCount = range === 'ONE_WEEK' ? 180 : 412
  const spanDays = range === 'ONE_WEEK' ? 7 : 14

  return Array.from({ length: totalCount }, (_, index) => {
    const recipientType = recipients[index % recipients.length]
    const tenant = tenants[index % tenants.length]
    const source = sources[index % sources.length]
    const functionName = functions[index % functions.length]
    const status = statuses[index % statuses.length]
    const channel = channels[index % channels.length]
    const padded = String(index + 1).padStart(3, '0')
    const refId = `Item ${index + 1}`
    const messageId = `MSG-${String(index + 10000).padStart(8, '0')}`
    const trackingId = `TRK-${String(index + 10000).padStart(8, '0')}`
    const occurredAt = new Date()
    occurredAt.setDate(occurredAt.getDate() - (index % spanDays))
    occurredAt.setHours(8 + (index % 12), (index * 13) % 60, 0, 0)
    const deliveryDateTime = toIsoDateTime(occurredAt)
    const commentCount = (index % 4) + 1
    const comments = Array.from({ length: commentCount }, (_, commentIndex) => {
      const commentedAt = new Date(occurredAt)
      commentedAt.setMinutes(occurredAt.getMinutes() + commentIndex * 17)
      return {
        comment: [
          `Delivery ${commentIndex % 2 === 0 ? 'acknowledgement' : 'resend'} confirmation for ${refId}. ${source} workflow processed with ${channel.toLowerCase()} routing.`,
          `Customer override applied for ${tenant} tenant with ${recipientType.toLowerCase()} profile.`,
          `Retry logic reviewed by ${functionName} and approved for downstream processing.`,
          `Operational follow-up: queue is cleared and tracking id ${trackingId} is marked for the next cycle.`
        ][commentIndex % 4],
        action: commentIndex % 2 === 0 ? 'acknowledge' : 'resend',
        commentedBy: ['Ops Team', 'Support Queue', 'Compliance Review', 'Delivery Manager'][commentIndex % 4],
        commentedDate: toIsoDateTime(commentedAt)
      }
    })

    return {
      messageId,
      id: messageId,
      referenceId: refId,
      recipientType,
      recipientId: String(1234567890 + index),
      applicationId: String(1234567890 + (index % 9)),
      accountId: String(1234567890 + (index % 5)),
      tenant,
      tenantId: `tenant-${String(index + 1000)}`,
      trackingId,
      source,
      function: functionName,
      deliveryDateTime,
      deliveryStatus: status,
      deliveryChannel: channel,
      failureReason: status === 'Failed' ? 'Upstream provider timeout' : null,
      retryCount: status === 'Failed' ? (index % 3) + 1 : 0,
      manualRetryAllowed: status === 'Failed' || status === 'Queued',
      inputAvailable: index % 7 !== 0,
      comments,
      recipients: {
        to: [`to+${padded}@example.com`, `primary+${padded}@example.com`],
        cc: index % 3 === 0 ? [`cc+${padded}@example.com`] : [],
        bcc: index % 5 === 0 ? [`bcc+${padded}@example.com`] : []
      }
    }
  })
}

const applyTableRange = (items: Delivery[], tableRange?: string): Delivery[] => {
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

export async function fetchDeliveries(params: FetchParams = {}): Promise<FetchResult> {
  const {
    search,
    searchBy = 'customerId',
    status,
    channel,
    page = 1,
    pageSize = 10,
    customerId,
    range = 'TWO_WEEKS',
    tableRange,
    sortField = 'dateTime',
    sortDir = 'desc'
  } = params
  const selectedStatuses = Array.isArray(status) ? status : status ? [status] : []

  const rawItems = buildSampleApiItems(range === 'ONE_WEEK' ? 'ONE_WEEK' : 'TWO_WEEKS')
  let mapped = mapDeliveriesResponse({ items: rawItems, total: rawItems.length }).items
  mapped = applyTableRange(mapped, tableRange)

  if (customerId && customerId !== 'all') {
    mapped = mapped.filter((item) => item.recipientType === customerId)
  }

  if (search?.trim()) {
    const keyword = search.trim().toLowerCase()
    mapped = mapped.filter((item) => searchValue(item, searchBy).toLowerCase().includes(keyword))
  }

  if (selectedStatuses.length > 0) {
    mapped = mapped.filter((item) => selectedStatuses.includes(item.deliveryStatus))
  }

  if (channel && channel !== 'all') {
    mapped = mapped.filter((item) => item.deliveryChannel === channel)
  }

  mapped = [...mapped].sort((left, right) => {
    if (sortField !== 'dateTime') return 0
    const leftTime = parseFlexibleDate(left.deliveryDateTime)?.getTime() ?? 0
    const rightTime = parseFlexibleDate(right.deliveryDateTime)?.getTime() ?? 0
    return sortDir === 'asc' ? leftTime - rightTime : rightTime - leftTime
  })

  const total = mapped.length
  const start = (page - 1) * pageSize
  const pageItems = mapped.slice(start, start + pageSize)

  const raw = await apiRequest<{ items: DeliveryApiItem[]; total: number }>({
    method: 'GET',
    url: '/alerts-admin/v1/deliveries',
    params: {
      search: search ?? '',
      searchBy,
      status: selectedStatuses.join(','),
      channel: channel ?? '',
      customerId: customerId ?? '',
      range,
      tableRange: tableRange ?? '',
      sortField,
      sortDir,
      page,
      pageSize
    },
    mockResponse: {
      total,
      items: pageItems.map((item) => ({
        messageId: item.messageId,
        id: item.id,
        referenceId: item.referenceId,
        recipientType: item.recipientType,
        recipientId: item.recipientId,
        applicationId: item.applicationId,
        accountId: item.accountId,
        source: item.source,
        function: item.functionName,
        deliveryDateTime: item.deliveryDateTime,
        deliveryStatus: item.deliveryStatus,
        deliveryChannel: item.deliveryChannel,
        failureReason: item.failureReason,
        retryCount: item.retryCount,
        manualRetryAllowed: item.manualRetryAllowed,
        inputAvailable: item.inputAvailable,
        comments: item.comments.map(({ comment, action, commentedBy, commentedDate }) => ({
          comment,
          action,
          commentedBy,
          commentedDate
        })),
        recipients: item.recipients,
        tenant: item.tenant,
        tenantId: item.tenantId,
        trackingId: item.trackingId
      }))
    }
  })

  return mapDeliveriesResponse(raw)
}

export async function submitDeliveryAction(params: {
  messageId: string
  action: DeliveryActionType
  comment: string
}): Promise<{ success: boolean }> {
  const body: DeliveryActionRequestApi = {
    action: params.action,
    comment: params.comment
  }

  return apiRequest<{ success: boolean }>({
    method: 'POST',
    url: `/alerts-admin/v1/deliveries/${encodeURIComponent(params.messageId)}/action`,
    data: body,
    mockResponse: { success: true }
  })
}

export async function fetchDeliveryPayload(messageId: string): Promise<Record<string, unknown>> {
  const payload = {
    messageId,
    status: 'processed',
    source: 'marketplace_email',
    meta: {
      correlationId: `corr-${messageId}`,
      createdAt: new Date().toISOString(),
      tenant: 'Mosaic'
    },
    request: {
      channel: 'Marketplace Email',
      recipientType: 'Customer',
      recipientId: '1234567890'
    },
    payload: {
      message: 'Scheduled delivery confirmation',
      attempts: 1,
      retryable: false
    }
  }

  return apiRequest<Record<string, unknown>>({
    method: 'GET',
    url: `/alerts-admin/v1/deliveries/${encodeURIComponent(messageId)}/payload`,
    mockResponse: payload
  })
}
