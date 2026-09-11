/**
 * Role / permission scaffolding for delivery row actions.
 * Roles are bootstrapped from `main.tsx` via AppConfig (selectedRole).
 *
 * Clear capability model:
 * - READ_ONLY — view only; no Acknowledge / Resend submenu
 * - ADMIN — can perform delivery actions (Acknowledge + Resend)
 */

export const UserRole = {
  ADMIN: 'ADMIN',
  READ_ONLY: 'READ_ONLY'
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

/** Actions that can appear in the delivery row overflow menu. */
export type DeliveryActionPermission = 'acknowledge' | 'resend'

/** Which menu actions each role may see. */
export const ROLE_ACTION_PERMISSIONS: Record<UserRole, readonly DeliveryActionPermission[]> = {
  [UserRole.READ_ONLY]: [],
  [UserRole.ADMIN]: ['acknowledge', 'resend']
}

export function isAdminRole(role: UserRole): boolean {
  return role === UserRole.ADMIN
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

export function isUserRole(value: unknown): value is UserRole {
  return value === UserRole.ADMIN || value === UserRole.READ_ONLY
}
