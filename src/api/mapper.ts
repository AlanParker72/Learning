import {
  toDashboardRange,
  type DashboardChannelPointApi,
  type DashboardChannelResponseApi,
  type DashboardStatusPointApi,
  type DashboardStatusResponseApi,
  type DeliveryApiItem,
  type DeliveryCommentApi,
  type DeliveriesListResponseApi
} from './contracts'
import type { DashboardChannelResponse, DashboardStatusResponse } from './dashboardStatusApi'
import type {
  Delivery,
  DeliveryActionType,
  DeliveryComment,
  DeliveryRecipients,
  DeliveryStatus,
  FetchResult
} from './deliveriesApi'
import { DELIVERY_STATUSES, type StatusCode } from '../theme/statusConfig'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const asBoolean = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const asNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return null
}

const STATUS_SET = new Set<string>(DELIVERY_STATUSES)

/** Map legacy display labels and aggregate keys onto the delivery list enum. */
const STATUS_ALIASES: Record<string, DeliveryStatus> = {
  new: 'NEW',
  dispatched: 'DISPATCHED',
  error_stop: 'ERROR_STOP',
  'error stop': 'ERROR_STOP',
  error_retry: 'ERROR_RETRY',
  'error retry': 'ERROR_RETRY',
  processing: 'PROCESSING',
  queued: 'QUEUED',
  failed_retry: 'FAILED_RETRY',
  'failed retry': 'FAILED_RETRY',
  failed: 'FAILED_RETRY',
  acknowledged: 'ACKNOWLEDGED',
  complete: 'COMPLETE',
  'sent / re-sent': 'COMPLETE',
  sent: 'COMPLETE',
  resent: 'COMPLETE',
  're-sent': 'COMPLETE'
}

export const mapDeliveryStatus = (value: unknown): DeliveryStatus => {
  const raw = asString(value, 'QUEUED').trim()
  const upper = raw.toUpperCase().replace(/[\s-]+/g, '_')
  if (STATUS_SET.has(upper)) return upper as StatusCode

  const normalized = raw.toLowerCase()
  return STATUS_ALIASES[normalized] ?? 'QUEUED'
}

export const mapDeliveryAction = (value: unknown): DeliveryActionType => {
  const normalized = asString(value).trim().toLowerCase()
  return normalized === 'resend' || normalized === 'retry' ? 'resend' : 'acknowledge'
}

/**
 * Map a comment row. Prefers wire field `acttion`; tolerates corrected `action`.
 * Missing / null comments arrays are handled by the caller — this never throws.
 */
export const mapDeliveryComment = (raw: DeliveryCommentApi | Record<string, unknown>, index = 0): DeliveryComment => {
  const record: Record<string, unknown> = isRecord(raw) ? { ...raw } : {}
  // Prefer API wire typo `acttion`; fall back to corrected `action` if present.
  const rawAction = asString(record.acttion ?? record.action).trim()
  return {
    id: asString(record.id, `comment-${index}`),
    comment: asString(record.comment),
    action: rawAction || 'unknown',
    commentedBy: asString(record.commentedBy, 'Unknown'),
    commentedDate: asString(record.commentedDate)
  }
}

export const mapRecipients = (raw: unknown): DeliveryRecipients => {
  if (!isRecord(raw)) return { to: [], cc: [], bcc: [] }
  return {
    to: asStringArray(raw.to),
    cc: asStringArray(raw.cc),
    bcc: asStringArray(raw.bcc)
  }
}

export const mapDeliveryItem = (raw: DeliveryApiItem | Record<string, unknown>, index = 0): Delivery => {
  const record: Record<string, unknown> = isRecord(raw) ? { ...raw } : {}
  const referenceId =
    typeof record.referenceId === 'number' && Number.isFinite(record.referenceId)
      ? record.referenceId
      : asNumber(Number(asString(record.referenceId)), index + 1)
  // Action/payload path id: prefer referenceId (stable); correlationId only if missing.
  const id =
    referenceId > 0
      ? String(referenceId)
      : asString(record.correlationId) || `delivery-${index + 1}`

  const commentsRaw = Array.isArray(record.comments) ? record.comments : []

  return {
    id,
    messageId: id,
    referenceId,
    correlationId: asString(record.correlationId),
    customerId: asNullableString(record.customerId),
    tenantId: asString(record.tenantId),
    recipientType: asString(record.recipientType),
    recipientId: asNullableString(record.recipientId),
    applicationId: asNullableString(record.applicationId),
    accountId: asNullableString(record.accountId),
    source: asString(record.source),
    functionName: asNullableString(record.function ?? record.functionName),
    deliveryDateTime: asString(record.deliveryDateTime ?? record.dateTime),
    deliveryStatus: mapDeliveryStatus(record.deliveryStatus),
    deliveryChannel: asString(record.deliveryChannel ?? record.channel),
    failureReason: asNullableString(record.failureReason),
    retryCount: asNumber(record.retryCount, 0),
    manualRetryAllowed: asBoolean(record.manualRetryAllowed, true),
    inputAvailable: asBoolean(record.inputAvailable, false),
    comments: commentsRaw.map((comment, commentIndex) =>
      mapDeliveryComment(comment as DeliveryCommentApi, commentIndex)
    ),
    recipients: mapRecipients(record.recipients)
  }
}

export function mapDeliveriesResponse(raw: unknown): FetchResult {
  if (!isRecord(raw)) return { items: [], total: 0 }

  const response = raw as DeliveriesListResponseApi & { items?: DeliveryApiItem[]; data?: DeliveryApiItem[]; total?: number }
  const list = response.records ?? response.items ?? response.data
  const items = Array.isArray(list) ? list.map((item, index) => mapDeliveryItem(item, index)) : []
  const total =
    typeof response.totalRecords === 'number'
      ? response.totalRecords
      : typeof response.total === 'number'
        ? response.total
        : items.length

  const rawRecord = raw as Record<string, unknown>
  const asofDateTime =
    typeof rawRecord.asofDateTime === 'string'
      ? rawRecord.asofDateTime
      : typeof rawRecord.asOfDateTime === 'string'
        ? rawRecord.asOfDateTime
        : typeof rawRecord.asOfDate === 'string'
          ? rawRecord.asOfDate
          : undefined

  return {
    items,
    total,
    page: typeof response.page === 'number' ? response.page : undefined,
    pageSize: typeof response.pageSize === 'number' ? response.pageSize : undefined,
    totalPages: typeof response.totalPages === 'number' ? response.totalPages : undefined,
    asofDateTime
  }
}

const mapStatusPoint = (raw: unknown): DashboardStatusPointApi | null => {
  if (!isRecord(raw)) return null
  return {
    date: asString(raw.date),
    sent: asNumber(raw.sent),
    failed: asNumber(raw.failed),
    queued: asNumber(raw.queued),
    acknowledged: asNumber(raw.acknowledged),
    total: asNumber(raw.total)
  }
}

const mapChannelPoint = (raw: unknown): DashboardChannelPointApi | null => {
  if (!isRecord(raw)) return null
  return {
    date: asString(raw.date),
    marketToEmail: asNumber(raw.marketToEmail ?? raw.marketEmail),
    smtp: asNumber(raw.smtp ?? raw.smtpEmail),
    push: asNumber(raw.push ?? raw.pushNotifications),
    total: asNumber(raw.total)
  }
}

export function mapDashboardStatusResponse(raw: unknown): DashboardStatusResponse | null {
  if (!isRecord(raw) || !Array.isArray(raw.data)) return null
  const response = raw as DashboardStatusResponseApi
  return {
    range: toDashboardRange(response.range),
    fromDate: asString(response.fromDate),
    toDate: asString(response.toDate),
    data: response.data.map(mapStatusPoint).filter((point): point is DashboardStatusPointApi => point !== null)
  }
}

export function mapDashboardChannelResponse(raw: unknown): DashboardChannelResponse | null {
  if (!isRecord(raw) || !Array.isArray(raw.data)) return null
  const response = raw as DashboardChannelResponseApi
  return {
    range: toDashboardRange(response.range),
    fromDate: asString(response.fromDate),
    toDate: asString(response.toDate),
    data: response.data.map(mapChannelPoint).filter((point): point is DashboardChannelPointApi => point !== null)
  }
}
