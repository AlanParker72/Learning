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

export const STATUS_CONFIG: Record<
  StatusCode,
  {
    label: string
    color: string
    background: string
    border: string
  }
> = {
  NEW: {
    label: 'New',
    color: '#6366F1',
    background: '#EEF0FF',
    border: '#C7CBF9'
  },
  DISPATCHED: {
    label: 'Dispatched',
    color: '#0D9488',
    background: '#E6F7F5',
    border: '#99D8D0'
  },
  ERROR_STOP: {
    label: 'Error Stop',
    color: '#B91C1C',
    background: '#FEE2E2',
    border: '#FCA5A5'
  },
  ERROR_RETRY: {
    label: 'Error Retry',
    color: '#C2410C',
    background: '#FFEDD5',
    border: '#FDBA74'
  },
  PROCESSING: {
    label: 'Processing',
    color: '#2563EB',
    background: '#DBEAFE',
    border: '#93C5FD'
  },
  QUEUED: {
    label: 'Queued',
    color: '#B45309',
    background: '#FFF1D8',
    border: '#F7D38B'
  },
  FAILED_RETRY: {
    label: 'Failed Retry',
    color: '#EB4D3D',
    background: '#FDE7E7',
    border: '#F6B5B5'
  },
  ACKNOWLEDGED: {
    label: 'Acknowledged',
    color: '#3B82F6',
    background: '#E9F1FF',
    border: '#AFCBFF'
  },
  COMPLETE: {
    label: 'Complete',
    color: '#2CBF73',
    background: '#E9F9EF',
    border: '#A7E7C1'
  }
}

export function statusLabel(status: StatusCode): string {
  return STATUS_CONFIG[status].label
}

export const CHANNEL_CONFIG = {
  MARKETPLACE_EMAIL: {
    label: 'Marketplace Email',
    color: '#2F7CF6',
    background: '#EAF2FF'
  },
  SMTP_EMAIL: {
    label: 'SMTP Email',
    color: '#FF5F57',
    background: '#FFE9E7'
  },
  PUSH_NOTIFICATION: {
    label: 'Push Notifications',
    color: '#22B07D',
    background: '#E8F9F1'
  }
} as const
