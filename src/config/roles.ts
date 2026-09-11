/**
 * Role / permission scaffolding for delivery row actions.
 * Replace CURRENT_MOCK_ROLES / fetchCurrentUserRoles with a real auth API later.
 *
 * Clear capability model:
 * - READ_ONLY — view only; no Acknowledge / Resend submenu
 * - EDIT — can perform delivery actions (permission-gated per action below)
 */

export const UserRole = {
  READ_ONLY: 'READ_ONLY',
  EDIT: 'EDIT'
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

/** Actions that can appear in the delivery row overflow menu. */
export type DeliveryActionPermission = 'acknowledge' | 'resend'

/** Which menu actions each role may see. */
export const ROLE_ACTION_PERMISSIONS: Record<UserRole, readonly DeliveryActionPermission[]> = {
  [UserRole.READ_ONLY]: [],
  [UserRole.EDIT]: ['acknowledge', 'resend']
}

/**
 * Mock current-user roles until an identity/roles API exists.
 * Swap this constant (or fetchCurrentUserRoles) when wiring real auth.
 * Use `[UserRole.READ_ONLY]` to verify the actions menu is hidden.
 */
export const CURRENT_MOCK_ROLES: readonly UserRole[] = [UserRole.EDIT]

export function isEditRole(role: UserRole): boolean {
  return role === UserRole.EDIT
}

export function isReadOnlyRole(role: UserRole): boolean {
  return role === UserRole.READ_ONLY
}

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
