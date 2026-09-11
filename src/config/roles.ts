/**
 * Role / permission scaffolding for delivery row actions.
 * Replace CURRENT_MOCK_ROLES / fetchCurrentUserRoles with a real auth API later.
 */

export const UserRole = {
  OPS_ADMIN: 'OPS_ADMIN',
  SUPPORT_AGENT: 'SUPPORT_AGENT'
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

/** Actions that can appear in the delivery row overflow menu. */
export type DeliveryActionPermission = 'acknowledge' | 'resend'

/** Which menu actions each role may see. */
export const ROLE_ACTION_PERMISSIONS: Record<UserRole, readonly DeliveryActionPermission[]> = {
  [UserRole.OPS_ADMIN]: ['acknowledge', 'resend'],
  [UserRole.SUPPORT_AGENT]: ['acknowledge']
}

/**
 * Mock current-user roles until an identity/roles API exists.
 * Swap this constant (or fetchCurrentUserRoles) when wiring real auth.
 */
export const CURRENT_MOCK_ROLES: readonly UserRole[] = [UserRole.OPS_ADMIN]

export function actionsForRoles(roles: readonly UserRole[]): DeliveryActionPermission[] {
  const allowed = new Set<DeliveryActionPermission>()
  roles.forEach((role) => {
    ROLE_ACTION_PERMISSIONS[role]?.forEach((action) => allowed.add(action))
  })
  return Array.from(allowed)
}

/** Stub for a future GET current-user / roles endpoint. */
export async function fetchCurrentUserRoles(): Promise<UserRole[]> {
  return [...CURRENT_MOCK_ROLES]
}
