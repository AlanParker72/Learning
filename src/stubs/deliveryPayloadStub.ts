/** Sample payloads keyed by referenceId string for GET /alerts-admin/v1/deliveries/{messageId}/payload */
const PAYLOADS: Record<string, Record<string, unknown>> = {
  '463': {
    referenceId: 463,
    correlationId: '24ba5d35-7bb1-48be-8a48-1c6c875b995a',
    status: 'failed',
    source: 'DIRECT DEPOSIT1',
    meta: {
      tenantId: 'TENANT1',
      createdAt: '2026-09-10T15:56:02.497'
    },
    request: {
      channel: 'MARKETO EMAIL',
      recipientType: 'CUSTOMER',
      customerId: '123'
    },
    payload: {
      message: 'Unexpected error in REST call',
      attempts: 1,
      retryable: true,
      nested: {
        template: 'direct-deposit',
        variables: { firstName: 'Sam', product: 'Checking' }
      }
    }
  },
  '401': {
    referenceId: 401,
    status: 'processed',
    source: 'stub',
    meta: {
      correlationId: 'corr-401',
      createdAt: '2026-09-11T08:00:00.000'
    },
    request: {
      channel: 'MARKETO EMAIL',
      recipientType: 'CUSTOMER'
    },
    payload: {
      message: 'Stub delivery payload',
      attempts: 1,
      retryable: false
    }
  }
}

/** Fallback static payload when no keyed sample exists. */
const DEFAULT_PAYLOAD: Record<string, unknown> = {
  referenceId: 0,
  status: 'processed',
  source: 'stub',
  meta: {
    correlationId: 'corr-default',
    createdAt: '2026-09-11T08:00:00.000'
  },
  request: {
    channel: 'MARKETO EMAIL',
    recipientType: 'CUSTOMER'
  },
  payload: {
    message: 'Stub delivery payload',
    attempts: 1,
    retryable: false
  }
}

/** GET /alerts-admin/v1/deliveries/{messageId}/payload stub — id is String(referenceId). */
export function getDeliveryPayloadStub(messageId: string): Record<string, unknown> {
  return PAYLOADS[messageId] ?? DEFAULT_PAYLOAD
}
