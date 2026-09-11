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

const STATUS_ALIASES: Record<string, DeliveryStatus> = {
  'sent / re-sent': 'Sent / Re-Sent',
  sent: 'Sent / Re-Sent',
  resent: 'Sent / Re-Sent',
  're-sent': 'Sent / Re-Sent',
  queued: 'Queued',
  failed: 'Failed',
  acknowledged: 'Acknowledged'
}

export const mapDeliveryStatus = (value: unknown): DeliveryStatus => {
  const normalized = asString(value).trim().toLowerCase()
  return STATUS_ALIASES[normalized] ?? (asString(value, 'Queued') as DeliveryStatus)
}

export const mapDeliveryAction = (value: unknown): DeliveryActionType => {
  const normalized = asString(value).trim().toLowerCase()
  return normalized === 'resend' ? 'resend' : 'acknowledge'
}

export const mapDeliveryComment = (raw: DeliveryCommentApi | Record<string, unknown>, index = 0): DeliveryComment => {
  const record = raw as Record<string, unknown>
  return {
    id: asString(record.id, `comment-${index}`),
    comment: asString(record.comment),
    action: mapDeliveryAction(record.action),
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
  const record = raw as Record<string, unknown>
  const messageId = asString(record.messageId) || asString(record.id) || `delivery-${index + 1}`
  const commentsRaw = Array.isArray(record.comments) ? record.comments : []

  return {
    id: messageId,
    messageId,
    tenantId: asString(record.tenantId),
    trackingId: asString(record.trackingId),
    referenceId: asString(record.referenceId, messageId),
    recipientType: asString(record.recipientType),
    recipientId: asString(record.recipientId),
    applicationId: asString(record.applicationId),
    accountId: asString(record.accountId),
    tenant: asString(record.tenant),
    source: asString(record.source),
    functionName: asString(record.function ?? record.functionName),
    deliveryDateTime: asString(record.deliveryDateTime ?? record.dateTime),
    deliveryStatus: mapDeliveryStatus(record.deliveryStatus),
    deliveryChannel: asString(record.deliveryChannel ?? record.channel),
    failureReason: asString(record.failureReason) || null,
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

  const list = (raw as DeliveriesListResponseApi).items ?? (raw as DeliveriesListResponseApi).data
  const items = Array.isArray(list) ? list.map((item, index) => mapDeliveryItem(item, index)) : []
  const total = typeof raw.total === 'number' ? raw.total : items.length
  return { items, total }
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
