import type { DashboardConfig } from '../../config/types'
import { Role } from '../roles'
import type { Permission } from '../permissions'
import { O_ANALYST_DASHBOARD, O_ANALYST_PERMISSIONS } from './oAnalyst'
import { O_MANAGER_DASHBOARD, O_MANAGER_PERMISSIONS } from './oManager'
import { Q_ANALYST_DASHBOARD, Q_ANALYST_PERMISSIONS } from './qAnalyst'
import { Q_MANAGER_DASHBOARD, Q_MANAGER_PERMISSIONS } from './qManager'

export { O_ANALYST_DASHBOARD, O_ANALYST_PERMISSIONS } from './oAnalyst'
export { O_MANAGER_DASHBOARD, O_MANAGER_PERMISSIONS } from './oManager'
export { Q_ANALYST_DASHBOARD, Q_ANALYST_PERMISSIONS } from './qAnalyst'
export { Q_MANAGER_DASHBOARD, Q_MANAGER_PERMISSIONS } from './qManager'

/**
 * Role → permission map assembled from one file per role.
 *
 * Tabs a role sees = which `dashboard.tab.*` permissions are listed in that role’s file.
 * UI: `config.tabs.filter(t => can(t.requiredPermission))`.
 * Mocks: same check before returning rows for a tab.
 *
 * Adding a role: new file here (permissions + dashboard config) + roles.ts + mocks.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.Q_MANAGER]: Q_MANAGER_PERMISSIONS,
  [Role.Q_ANALYST]: Q_ANALYST_PERMISSIONS,
  [Role.O_MANAGER]: O_MANAGER_PERMISSIONS,
  [Role.O_ANALYST]: O_ANALYST_PERMISSIONS
}

/** Per-role dashboard layouts — each role file owns its own config. */
export const DASHBOARD_CONFIG_BY_ROLE: Record<Role, DashboardConfig> = {
  [Role.Q_MANAGER]: Q_MANAGER_DASHBOARD,
  [Role.Q_ANALYST]: Q_ANALYST_DASHBOARD,
  [Role.O_MANAGER]: O_MANAGER_DASHBOARD,
  [Role.O_ANALYST]: O_ANALYST_DASHBOARD
}

/** Returns that role’s dashboard config only (from its role file). */
export function getDashboardConfig(role: Role): DashboardConfig {
  return DASHBOARD_CONFIG_BY_ROLE[role]
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

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission)
}
