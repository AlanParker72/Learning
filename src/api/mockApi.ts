import { apiRequest } from './httpClient'

export type DeliveryStatus = 'Sent / Re-Sent' | 'Queued' | 'Failed' | 'Acknowledged'

export type DeliveryComment = {
  comment: string
  action: DeliveryActionType
  commentedBy: string
  commentedDate: string
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
  inputLink: string
  comments: DeliveryComment[]
  recipients?: {
    to: string[]
    cc: string[]
    bcc: string[]
  }
}

export type FetchParams = {
  search?: string
  status?: string | string[]
  channel?: string
  page?: number
  pageSize?: number
  customerId?: string
  range?: string
}

export type FetchResult = {
  items: Delivery[]
  total: number
}

const recipients = ['Customer', 'Prospect', 'Employee']
const tenants = ['Mosaic', 'AAO', 'Nova', 'Helio']
const sources = ['Direct Deposit', 'Invoice', 'Customer Update', 'Policy Notice']
const functions = ['Prospect Management', 'Payment Settlement', 'Risk Review', 'Delivery Sync']
const channels = ['Marketplace Email', 'Internal Email', 'SMTP Email', 'Push Notifications']
const statuses: DeliveryStatus[] = ['Sent / Re-Sent', 'Queued', 'Failed', 'Acknowledged']

const buildSampleData = (range: 'ONE_WEEK' | 'TWO_WEEKS' = 'TWO_WEEKS'): Delivery[] => {
  const totalCount = range === 'ONE_WEEK' ? 180 : 360

  return Array.from({ length: totalCount }, (_, index) => {
    const recipientType = recipients[index % recipients.length]
    const tenant = tenants[index % tenants.length]
    const source = sources[index % sources.length]
    const functionName = functions[index % functions.length]
    const status = index % 5 === 0 ? 'Failed' : statuses[index % statuses.length]
    const channel = index % 6 === 0 ? 'Marketplace Email' : channels[index % channels.length]
    const padded = String(index + 1).padStart(3, '0')
    const refId = `REF-${padded}`
    const day = String((index % 28) + 1).padStart(2, '0')
    const hour = String((index % 12) + 8).padStart(2, '0')
    const trackingId = `TRK-${String(index + 10000).padStart(8, '0')}`
    const commentCount = (index % 4) + 2
    const comments = Array.from({ length: commentCount }, (_, commentIndex) => ({
      comment: [
        `Delivery ${commentIndex % 2 === 0 ? 'acknowledgement' : 'resend'} confirmation for ${refId}. ${source} workflow processed with ${channel.toLowerCase()} routing.`,
        `Customer override applied for ${tenant} tenant with ${recipientType.toLowerCase()} profile.`,
        `Retry logic reviewed by ${functionName} and approved for downstream processing.`,
        `Operational follow-up: queue is cleared and the tracking id ${trackingId} is marked for the next cycle.`
      ][commentIndex % 4],
      action: commentIndex % 2 === 0 ? 'acknowledge' : 'resend',
      commentedBy: ['Ops Team', 'Support Queue', 'Compliance Review', 'Delivery Manager'][commentIndex % 4],
      commentedDate: `2026/${range === 'ONE_WEEK' ? '09' : '08'}/${day} ${String((index + commentIndex) % 12 + 8).padStart(2, '0')}:${String((commentIndex * 11 + 5) % 60).padStart(2, '0')} ${commentIndex % 2 === 0 ? 'AM' : 'PM'}`
    }))

    const recipientsObj = {
       to: [`to+${padded}@example.com`, `primary+${padded}@example.com`],
       cc: index % 3 === 0 ? [`cc+${padded}@example.com`] : [],
       bcc: index % 5 === 0 ? [`bcc+${padded}@example.com`] : []
    }

    return {
       id: String(index + 1),
       tenantId: `tenant-${String(index + 1000)}`,
       trackingId: `TRK-${String(index + 10000).padStart(8, '0')}`,
       referenceId: refId,
       recipientType,
       recipientId: `REC-${String(index + 20000).padStart(8, '0')}`,
       applicationId: `APP-${String(index + 30000).padStart(8, '0')}`,
       accountId: `ACC-${String(index + 40000).padStart(8, '0')}`,
       tenant,
       source,
       functionName,
       dateTime: `2026/${range === 'ONE_WEEK' ? '09' : '08'}/${day} ${hour}:00 ${index % 2 === 0 ? 'AM' : 'PM'}`,
       deliveryStatus: status,
       channel,
       inputLink: `https://delivery.example.com/input/${refId}`,
       comments,
       recipients: recipientsObj
    }
  })
}

export const SAMPLE = buildSampleData('TWO_WEEKS')

export async function fetchDeliveries(params: FetchParams = {}): Promise<FetchResult> {
  const { search, status, channel, page = 1, pageSize = 10, customerId, range = 'TWO_WEEKS' } = params
  const selectedStatuses = Array.isArray(status) ? status : status ? [status] : []

  let filtered = buildSampleData(range === 'ONE_WEEK' ? 'ONE_WEEK' : 'TWO_WEEKS').slice()

  if (customerId && customerId !== 'Customer ID') {
    filtered = filtered.filter((item) => item.recipientType === customerId)
  }

  if (search && search.trim() !== '') {
    const keyword = search.trim().toLowerCase()
    filtered = filtered.filter((item) => {
      return [
        item.trackingId,
        item.referenceId,
        item.recipientId,
        item.applicationId,
        item.accountId,
        item.tenant,
        item.source,
        item.functionName,
        item.deliveryStatus,
        item.channel,
        item.inputLink
      ].some((value) => value.toLowerCase().includes(keyword))
    })
  }

  if (selectedStatuses.length > 0) {
    filtered = filtered.filter((item) => selectedStatuses.includes(item.deliveryStatus))
  }

  if (channel) {
    filtered = filtered.filter((item) => item.channel === channel)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize

  const mockResponse: FetchResult = {
    total,
    items: filtered.slice(start, end)
  }

  return apiRequest<FetchResult>({
    method: 'GET',
    url: '/alerts-admin/v1/deliveries',
    params: {
      search: search ?? '',
      status: selectedStatuses.length ? selectedStatuses.join(',') : '',
      channel: channel ?? '',
      customerId: customerId ?? '',
      page,
      pageSize
    },
    mockResponse
  })
}

export type DeliveryActionType = 'acknowledge' | 'resend'

export async function submitDeliveryAction(params: {
  id: string
  action: DeliveryActionType
  comment: string
}): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>({
    method: 'POST',
    url: '/alerts-admin/v1/deliveries/action',
    params: {
      id: params.id,
      action: params.action,
      comment: params.comment
    },
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
      recipientId: `REC-${String(Number(id) + 20000).padStart(8, '0')}`
    },
    payload: {
      message: 'delivery payload',
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
