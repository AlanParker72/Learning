import { apiGet, apiPost, stubDelay, USE_STUBS } from './httpClient'
import type {
  DeliveriesListResponseApi,
  DeliveryActionRequestApi,
  DeliveryActionResponseApi,
  DeliveryApiItem
} from './contracts'
import { mapDeliveriesResponse } from './mapper'
import { getDeliveriesStub } from '../stubs/deliveriesStub'
import { getDeliveryPayloadStub } from '../stubs/deliveryPayloadStub'
import { postDeliveryActionStub } from '../stubs/deliveryActionStub'
import type { StatusCode } from '../theme/statusConfig'

/** Delivery row status — matches the delivery list enum. */
export type DeliveryStatus = StatusCode

export type DeliveryActionType = 'acknowledge' | 'resend'

/**
 * Filter-bar search fields only:
 * - customerId — match `customerId` (fallback recipientId)
 * - prospectId — recipientType PROSPECT, match customerId/recipientId
 * - source — match `source`
 */
export type SearchField = 'customerId' | 'prospectId' | 'source'

export type DeliveryComment = {
  id: string
  comment: string
  /** Clean UI field mapped from API wire `acttion` (or corrected `action`). */
  action: string
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
  /** String(referenceId) — used as path id for action/payload endpoints. */
  id: string
  /**
   * Same as `id`. Existing endpoints are `/deliveries/{messageId}/…`;
   * we pass `String(referenceId)` for that path segment.
   */
  messageId: string
  referenceId: number
  correlationId: string
  customerId: string | null
  tenantId: string
  recipientType: string
  recipientId: string | null
  applicationId: string | null
  accountId: string | null
  source: string
  /** Mapped from API field `function` (not shown as a table column). */
  functionName: string | null
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
  sortField?: 'dateTime'
  sortDir?: 'asc' | 'desc'
}

export type FetchResult = {
  items: Delivery[]
  total: number
  page?: number
  pageSize?: number
  totalPages?: number
  asofDateTime?: string
}

/** GET /alerts-admin/v1/deliveries */
export async function fetchDeliveries(params: FetchParams = {}): Promise<FetchResult> {
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

  if (USE_STUBS) {
    await stubDelay()
    const raw = getDeliveriesStub({
      search,
      searchBy,
      status: selectedStatuses,
      channel,
      page,
      pageSize,
      range,
      sortField,
      sortDir
    })
    return mapDeliveriesResponse(raw)
  }

  const channelParam = channel && channel !== 'all' ? channel : undefined

  const raw = await apiGet<DeliveriesListResponseApi>('/alerts-admin/v1/deliveries', {
    search: search ?? '',
    searchBy,
    status: selectedStatuses.join(','),
    channel: channelParam,
    range,
    sortField,
    sortDir,
    page,
    pageSize
  })

  return mapDeliveriesResponse(raw)
}

/**
 * POST /alerts-admin/v1/deliveries/{messageId}/action
 * Path id is `String(referenceId)` from the delivery row.
 */
export async function submitDeliveryAction(params: {
  messageId: string
  action: DeliveryActionType
  comment: string
}): Promise<{ success: boolean }> {
  const body: DeliveryActionRequestApi = {
    action: params.action,
    comment: params.comment
  }

  if (USE_STUBS) {
    await stubDelay()
    return postDeliveryActionStub({ messageId: params.messageId, body })
  }

  return apiPost<DeliveryActionResponseApi>(
    `/alerts-admin/v1/deliveries/${encodeURIComponent(params.messageId)}/action`,
    body
  )
}

/**
 * GET /alerts-admin/v1/deliveries/{messageId}/payload
 * Path id is `String(referenceId)` from the delivery row.
 */
export async function fetchDeliveryPayload(messageId: string): Promise<Record<string, unknown>> {
  if (USE_STUBS) {
    await stubDelay()
    return getDeliveryPayloadStub(messageId)
  }

  return apiGet<Record<string, unknown>>(
    `/alerts-admin/v1/deliveries/${encodeURIComponent(messageId)}/payload`
  )
}

/** Re-export for callers that still expect DeliveryApiItem typing via this module. */
export type { DeliveryApiItem }
