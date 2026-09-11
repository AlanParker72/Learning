import type { DeliveryActionRequestApi, DeliveryActionResponseApi } from '../api/contracts'

export type DeliveryActionStubParams = {
  messageId: string
  body: DeliveryActionRequestApi
}

/** POST /alerts-admin/v1/deliveries/{messageId}/action stub */
export function postDeliveryActionStub(params: DeliveryActionStubParams): DeliveryActionResponseApi {
  const action = params.body.action?.trim()
  const comment = params.body.comment?.trim()
  if (!action || !comment || !params.messageId) {
    return { success: false }
  }
  return { success: true }
}
