/** Sample payloads keyed by messageId for GET /alerts-admin/v1/deliveries/{messageId}/payload */
const PAYLOADS: Record<string, Record<string, unknown>> = {
  'MSG-00010001': {
    messageId: 'MSG-00010001',
    status: 'processed',
    source: 'marketplace_email',
    meta: {
      correlationId: 'corr-MSG-00010001',
      createdAt: '2026-09-09T14:22:00.000Z',
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
      retryable: false,
      nested: {
        template: 'welcome',
        variables: { firstName: 'Alex', product: 'Checking' }
      }
    }
  },
  'MSG-00010003': {
    messageId: 'MSG-00010003',
    status: 'failed',
    source: 'push',
    error: {
      code: 'PROVIDER_TIMEOUT',
      detail: 'Upstream provider timeout',
      retryable: true
    },
    request: {
      channel: 'Push',
      deviceToken: 'device-abc-003',
      recipientId: '1234567892'
    },
    payload: {
      title: 'Payment update',
      body: 'Your settlement is ready for review',
      deepLink: '/payments/settlement/3'
    }
  }
}

const defaultPayload = (messageId: string): Record<string, unknown> => ({
  messageId,
  status: 'processed',
  source: 'stub',
  meta: {
    correlationId: `corr-${messageId}`,
    createdAt: new Date().toISOString()
  },
  request: {
    channel: 'Marketplace Email',
    recipientType: 'Customer'
  },
  payload: {
    message: 'Stub delivery payload',
    attempts: 1,
    retryable: false
  }
})

/** GET /alerts-admin/v1/deliveries/{messageId}/payload stub */
export function getDeliveryPayloadStub(messageId: string): Record<string, unknown> {
  return PAYLOADS[messageId] ?? defaultPayload(messageId)
}
