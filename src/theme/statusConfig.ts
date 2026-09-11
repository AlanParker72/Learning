export type StatusCode = 'SENT' | 'QUEUED' | 'FAILED' | 'ACKNOWLEDGED'

export const STATUS_CONFIG: Record<
  StatusCode,
  {
    label: string
    color: string
    background: string
    border: string
  }
> = {
  SENT: {
    label: 'Sent / Re-Sent',
    color: '#2CBF73',
    background: '#E9F9EF',
    border: '#A7E7C1'
  },
  QUEUED: {
    label: 'Queued',
    color: '#F3B63F',
    background: '#FFF1D8',
    border: '#F7D38B'
  },
  FAILED: {
    label: 'Failed',
    color: '#EB4D3D',
    background: '#FDE7E7',
    border: '#F6B5B5'
  },
  ACKNOWLEDGED: {
    label: 'Acknowledged',
    color: '#3B82F6',
    background: '#E9F1FF',
    border: '#AFCBFF'
  }
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
