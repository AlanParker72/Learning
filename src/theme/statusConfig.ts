import { brand } from './brand'

/** Delivery list status enum — exact API / filter values. */
export const DELIVERY_STATUSES = [
  'NEW',
  'DISPATCHED',
  'ERROR_STOP',
  'ERROR_RETRY',
  'PROCESSING',
  'QUEUED',
  'FAILED_RETRY',
  'ACKNOWLEDGED',
  'COMPLETE'
] as const

export type StatusCode = (typeof DELIVERY_STATUSES)[number]

type StatusStyle = {
  label: string
  color: string
  background: string
  border: string
}

const ds = brand.deliveryStatus

/** Maps each delivery status to label + brand color tokens only. */
export const STATUS_CONFIG: Record<StatusCode, StatusStyle> = {
  NEW: {
    label: 'New',
    color: ds.NEW.color,
    background: ds.NEW.background,
    border: ds.NEW.border
  },
  DISPATCHED: {
    label: 'Dispatched',
    color: ds.DISPATCHED.color,
    background: ds.DISPATCHED.background,
    border: ds.DISPATCHED.border
  },
  ERROR_STOP: {
    label: 'Error Stop',
    color: ds.ERROR_STOP.color,
    background: ds.ERROR_STOP.background,
    border: ds.ERROR_STOP.border
  },
  ERROR_RETRY: {
    label: 'Error Retry',
    color: ds.ERROR_RETRY.color,
    background: ds.ERROR_RETRY.background,
    border: ds.ERROR_RETRY.border
  },
  PROCESSING: {
    label: 'Processing',
    color: ds.PROCESSING.color,
    background: ds.PROCESSING.background,
    border: ds.PROCESSING.border
  },
  QUEUED: {
    label: 'Queued',
    color: ds.QUEUED.color,
    background: ds.QUEUED.background,
    border: ds.QUEUED.border
  },
  FAILED_RETRY: {
    label: 'Failed Retry',
    color: ds.FAILED_RETRY.color,
    background: ds.FAILED_RETRY.background,
    border: ds.FAILED_RETRY.border
  },
  ACKNOWLEDGED: {
    label: 'Acknowledged',
    color: ds.ACKNOWLEDGED.color,
    background: ds.ACKNOWLEDGED.background,
    border: ds.ACKNOWLEDGED.border
  },
  COMPLETE: {
    label: 'Complete',
    color: ds.COMPLETE.color,
    background: ds.COMPLETE.background,
    border: ds.COMPLETE.border
  }
}

export function statusLabel(status: StatusCode): string {
  return STATUS_CONFIG[status].label
}

export const CHANNEL_CONFIG = {
  MARKETPLACE_EMAIL: {
    label: 'Marketplace Email',
    color: brand.chart.marketToEmail,
    background: brand.chart.marketToEmailBg
  },
  SMTP_EMAIL: {
    label: 'SMTP Email',
    color: brand.chart.smtp,
    background: brand.chart.smtpBg
  },
  PUSH_NOTIFICATION: {
    label: 'Push Notifications',
    color: brand.chart.push,
    background: brand.chart.pushBg
  }
} as const
