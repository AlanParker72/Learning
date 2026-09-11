import { apiRequest } from './httpClient'
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

export type Delivery = {
  id: string
  tenantId: string
  trackingId: string
  referenceId: string
  recipientType: string
  recipientId: string
  applicationId: string
  accountId: string
  tenant: string
  source: string
  functionName: string
  dateTime: string
  deliveryStatus: DeliveryStatus
  channel: string
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
const channels = ['Marketplace Email', 'Internal Email', 'SMTP Email', 'Push Notifications'] as const
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

const buildSampleData = (range: 'ONE_WEEK' | 'TWO_WEEKS' = 'TWO_WEEKS'): Delivery[] => {
  const totalCount = range === 'ONE_WEEK' ? 180 : 412

  return Array.from({ length: totalCount }, (_, index) => {
    const recipientType = recipients[index % recipients.length]
    const tenant = tenants[index % tenants.length]
    const source = sources[index % sources.length]
    const functionName = functions[index % functions.length]
    const status = statuses[index % statuses.length]
    const channel = channels[index % channels.length]
    const padded = String(index + 1).padStart(3, '0')
    const refId = `Item ${index + 1}`
    const day = String((index % 28) + 1).padStart(2, '0')
    const hour = String((index % 12) + 8).padStart(2, '0')
    const month = range === 'ONE_WEEK' ? '09' : '08'
    const trackingId = `TRK-${String(index + 10000).padStart(8, '0')}`
    const commentCount = (index % 4) + 1
    const comments: DeliveryComment[] = Array.from({ length: commentCount }, (_, commentIndex) => ({
      id: `${index + 1}-${commentIndex + 1}`,
      comment: [
        `Delivery ${commentIndex % 2 === 0 ? 'acknowledgement' : 'resend'} confirmation for ${refId}. ${source} workflow processed with ${channel.toLowerCase()} routing.`,
        `Customer override applied for ${tenant} tenant with ${recipientType.toLowerCase()} profile.`,
        `Retry logic reviewed by ${functionName} and approved for downstream processing.`,
        `Operational follow-up: queue is cleared and tracking id ${trackingId} is marked for the next cycle.`
      ][commentIndex % 4],
      action: commentIndex % 2 === 0 ? 'acknowledge' : 'resend',
      commentedBy: ['Ops Team', 'Support Queue', 'Compliance Review', 'Delivery Manager'][commentIndex % 4],
      commentedDate: `2026/${month}/${day} ${String((index + commentIndex) % 12 + 8).padStart(2, '0')}:${String((commentIndex * 11 + 5) % 60).padStart(2, '0')} ${commentIndex % 2 === 0 ? 'AM' : 'PM'}`
    }))

    return {
      id: String(index + 1),
      tenantId: `tenant-${String(index + 1000)}`,
      trackingId,
      referenceId: refId,
      recipientType,
      recipientId: String(1234567890 + index),
      applicationId: String(1234567890 + (index % 9)),
      accountId: String(1234567890 + (index % 5)),
      tenant,
      source,
      functionName,
      dateTime: `2026/${month}/${day} ${hour}:00 ${index % 2 === 0 ? 'AM' : 'PM'}`,
      deliveryStatus: status,
      channel,
      comments,
      recipients: {
        to: [`to+${padded}@example.com`, `primary+${padded}@example.com`],
        cc: index % 3 === 0 ? [`cc+${padded}@example.com`] : [],
        bcc: index % 5 === 0 ? [`bcc+${padded}@example.com`] : []
      }
    }
  })
}

export const SAMPLE = buildSampleData('TWO_WEEKS')

const applyTableRange = (items: Delivery[], tableRange?: string): Delivery[] => {
  const windowMs = tableRange ? TABLE_RANGE_MS[tableRange] : undefined
  if (!windowMs) return items

  const timestamps = items
    .map((item) => parseFlexibleDate(item.dateTime)?.getTime() ?? 0)
    .filter((value) => value > 0)

  if (timestamps.length === 0) return items

  const latest = Math.max(...timestamps)
  return items.filter((item) => {
    const time = parseFlexibleDate(item.dateTime)?.getTime()
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

  let filtered = buildSampleData(range === 'ONE_WEEK' ? 'ONE_WEEK' : 'TWO_WEEKS')
  filtered = applyTableRange(filtered, tableRange)

  if (customerId && customerId !== 'all') {
    filtered = filtered.filter((item) => item.recipientType === customerId)
  }

  if (search?.trim()) {
    const keyword = search.trim().toLowerCase()
    filtered = filtered.filter((item) => searchValue(item, searchBy).toLowerCase().includes(keyword))
  }

  if (selectedStatuses.length > 0) {
    filtered = filtered.filter((item) => selectedStatuses.includes(item.deliveryStatus))
  }

  if (channel && channel !== 'all') {
    filtered = filtered.filter((item) => item.channel === channel)
  }

  filtered = [...filtered].sort((left, right) => {
    if (sortField !== 'dateTime') return 0
    const leftTime = parseFlexibleDate(left.dateTime)?.getTime() ?? 0
    const rightTime = parseFlexibleDate(right.dateTime)?.getTime() ?? 0
    return sortDir === 'asc' ? leftTime - rightTime : rightTime - leftTime
  })

  const total = filtered.length
  const start = (page - 1) * pageSize

  return apiRequest<FetchResult>({
    method: 'GET',
    url: '/alerts-admin/v1/deliveries',
    params: {
      search: search ?? '',
      searchBy,
      status: selectedStatuses.join(','),
      channel: channel ?? '',
      customerId: customerId ?? '',
      tableRange: tableRange ?? '',
      sortField,
      sortDir,
      page,
      pageSize
    },
    mockResponse: {
      total,
      items: filtered.slice(start, start + pageSize)
    }
  })
}

export async function submitDeliveryAction(params: {
  id: string
  action: DeliveryActionType
  comment: string
}): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>({
    method: 'POST',
    url: '/alerts-admin/v1/deliveries/action',
    data: params,
    mockResponse: { success: true }
  })
}

export async function fetchInputPayload(id: string): Promise<Record<string, unknown>> {
  const payload = {
    id,
    status: 'processed',
    source: 'marketplace_email',
    meta: {
      correlationId: `corr-${id}`,
      createdAt: new Date().toISOString(),
      tenant: 'Mosaic'
    },
    request: {
      channel: 'Marketplace Email',
      recipientType: 'Customer',
      recipientId: String(1234567890 + Number(id) - 1)
    },
    payload: {
      message: 'Scheduled delivery confirmation',
      attempts: 1,
      retryable: false
    }
  }

  return apiRequest<Record<string, unknown>>({
    method: 'GET',
    url: `/alerts-admin/v1/deliveries/${id}/input`,
    params: { id },
    mockResponse: payload
  })
}
