import type { Permission } from '../rbac/permissions'
import { ACTION_BY_PERMISSION } from '../rbac/catalog/actions'
import { FILTER_BY_PERMISSION } from '../rbac/catalog/filters'
import type { ActionDef, FilterDef, TabDef } from './types'

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

/**
 * `visibleFilters = tab.filterPermissions ∩ role.permissions` → filter catalog.
 * Order follows `tab.filterPermissions`.
 */
export function resolveFiltersForTab(
  rolePermissions: ReadonlySet<Permission> | readonly Permission[],
  tab: Pick<TabDef, 'filterPermissions'>
): FilterDef[] {
  const granted =
    rolePermissions instanceof Set
      ? rolePermissions
      : new Set<Permission>(rolePermissions)
  const result: FilterDef[] = []
  for (const p of tab.filterPermissions ?? []) {
    if (!granted.has(p)) continue
    const def = FILTER_BY_PERMISSION[p]
    if (def) result.push(def)
  }
  return result
}

/**
 * `visibleActions = (dashboard ∪ tab).actionPermissions ∩ role.permissions` → action catalog.
 * Tab wins on the same action `id` (e.g. Clear All vs Clear filters).
 */
export function resolveActionsForTab(
  rolePermissions: ReadonlySet<Permission> | readonly Permission[],
  tab: Pick<TabDef, 'actionPermissions'>,
  dashboardActionPermissions: readonly Permission[] = []
): ActionDef[] {
  const granted =
    rolePermissions instanceof Set
      ? rolePermissions
      : new Set<Permission>(rolePermissions)
  const byId = new Map<string, ActionDef>()

  for (const p of dashboardActionPermissions) {
    if (!granted.has(p)) continue
    const def = ACTION_BY_PERMISSION[p]
    if (def) byId.set(def.id, def)
  }
  for (const p of tab.actionPermissions ?? []) {
    if (!granted.has(p)) continue
    const def = ACTION_BY_PERMISSION[p]
    if (def) byId.set(def.id, def)
  }
  return [...byId.values()]
}
