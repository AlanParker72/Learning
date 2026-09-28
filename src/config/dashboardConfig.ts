import { Permission } from '../rbac/permissions'
import { Role } from '../rbac/roles'
import type { DashboardConfig } from './types'

/**
 * Tiny per-role config showing the `requiredPermission` filter pattern.
 *
 * To add a role: extend `Role`, `ROLE_PERMISSIONS`, and this map.
 * Do NOT fork a new page or put `role ===` in presentational components.
 */
export const dashboardConfigByRole: Record<Role, DashboardConfig> = {
  [Role.O_MANAGER]: {
    title: 'RBAC skeleton',
    tabs: [
      { id: 'overview', label: 'Overview', requiredPermission: Permission.TAB_EXAMPLE },
      { id: 'actions', label: 'Actions', requiredPermission: Permission.ACTION_EXAMPLE }
    ]
  },
  [Role.O_ANALYST]: {
    title: 'RBAC skeleton',
    tabs: [
      { id: 'overview', label: 'Overview', requiredPermission: Permission.TAB_EXAMPLE }
    ]
  },
  [Role.Q_MANAGER]: {
    title: 'RBAC skeleton',
    tabs: [
      { id: 'overview', label: 'Overview', requiredPermission: Permission.TAB_EXAMPLE },
      { id: 'actions', label: 'Actions', requiredPermission: Permission.ACTION_EXAMPLE }
    ]
  },
  [Role.Q_ANALYST]: {
    title: 'RBAC skeleton',
    tabs: [
      { id: 'overview', label: 'Overview', requiredPermission: Permission.TAB_EXAMPLE }
    ]
  }
}

export function getDashboardConfig(role: Role): DashboardConfig {
  return dashboardConfigByRole[role]
}

/** Keep items whose `requiredPermission` is missing or granted. */
export function filterByPermission<T extends { requiredPermission?: Permission }>(
  items: readonly T[],
  can: (p: Permission) => boolean
): T[] {
  return items.filter((item) => !item.requiredPermission || can(item.requiredPermission))
}
