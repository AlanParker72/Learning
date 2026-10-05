import type { Permission } from '../rbac/permissions'

/**
 * Thin helpers only — per-role dashboard layouts live in
 * `src/rbac/rolePermissions/<role>.ts` next to that role’s permission list.
 *
 * Prefer importing `getDashboardConfig` from `../rbac/rolePermissions`
 * (re-exported here for existing import paths).
 */
export { getDashboardConfig, DASHBOARD_CONFIG_BY_ROLE } from '../rbac/rolePermissions'

/** Keep items whose `requiredPermission` is missing or granted. */
export function filterByPermission<T extends { requiredPermission?: Permission }>(
  items: readonly T[],
  can: (p: Permission) => boolean
): T[] {
  return items.filter((item) => !item.requiredPermission || can(item.requiredPermission))
}
