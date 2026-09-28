import { Permission } from './permissions'
import { Role } from './roles'

/**
 * Tiny role → permission map.
 * Adding a role is primarily a new row here + a `dashboardConfig` entry —
 * not a new page or `role ===` branches in components.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.O_MANAGER]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_EXAMPLE,
    Permission.FILTER_EXAMPLE,
    Permission.ACTION_EXAMPLE,
    Permission.WIDGET_TABLE
  ],
  [Role.O_ANALYST]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_EXAMPLE,
    Permission.WIDGET_TABLE
  ],
  [Role.Q_MANAGER]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_EXAMPLE,
    Permission.FILTER_EXAMPLE,
    Permission.ACTION_EXAMPLE,
    Permission.WIDGET_TABLE
  ],
  [Role.Q_ANALYST]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_EXAMPLE,
    Permission.WIDGET_TABLE
  ]
}

/** Union permissions across roles (multi-role users). */
export function permissionsForRoles(roles: readonly Role[]): Set<Permission> {
  const set = new Set<Permission>()
  for (const role of roles) {
    for (const p of ROLE_PERMISSIONS[role] ?? []) {
      set.add(p)
    }
  }
  return set
}
