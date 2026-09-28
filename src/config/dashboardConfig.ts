import { Permission } from '../rbac/permissions'
import { Role } from '../rbac/roles'
import type { DashboardConfig } from './types'

/**
 * Per-role layout skeleton.
 *
 * Shape only — mostly empty arrays + one illustrative stub per concept.
 * Real tab/filter/widget/column/action inventories come from screenshots + API.
 *
 * To add a role: extend `Role`, `ROLE_PERMISSIONS`, and this map.
 * Do NOT fork a new page or put `role ===` in presentational components.
 */
const emptyConfig = (title: string): DashboardConfig => ({
  title,
  defaultTab: '',
  tabs: [],
  filters: [],
  widgets: [],
  actions: []
})

export const dashboardConfigByRole: Record<Role, DashboardConfig> = {
  [Role.O_MANAGER]: {
    title: 'Dashboard (skeleton)',
    subtitle: 'O_MANAGER — extend tabs/filters below',
    defaultTab: 'example',
    // EXAMPLE stub tab — replace with real tabs from screenshot
    tabs: [
      {
        id: 'example',
        label: 'Example',
        requiredPermission: Permission.TAB_EXAMPLE,
        // EXAMPLE stub column
        columns: [{ id: 'id', label: 'ID' }]
      }
    ],
    // EXAMPLE stub filter (empty until product defines filters)
    filters: [
      {
        id: 'q',
        label: 'Search',
        type: 'text',
        placeholder: '…',
        requiredPermission: Permission.FILTER_EXAMPLE
      }
    ],
    // EXAMPLE stub widget
    widgets: [
      {
        id: 'records-table',
        type: 'table',
        title: 'Records',
        requiredPermission: Permission.WIDGET_TABLE
      }
    ],
    // EXAMPLE stub action
    actions: [
      {
        id: 'example_action',
        label: 'Example action',
        placement: 'row',
        requiredPermission: Permission.ACTION_EXAMPLE
      }
    ]
  },

  // Other roles: empty placeholders showing the same shape.
  // Copy the O_MANAGER stubs and adjust requiredPermission / ids as needed.
  [Role.O_ANALYST]: emptyConfig('Dashboard (skeleton) — O_ANALYST'),
  [Role.Q_MANAGER]: emptyConfig('Dashboard (skeleton) — Q_MANAGER'),
  [Role.Q_ANALYST]: emptyConfig('Dashboard (skeleton) — Q_ANALYST')
}

export function getDashboardConfig(role: Role): DashboardConfig {
  return dashboardConfigByRole[role]
}

/** Filter config items by optional `requiredPermission`. */
export function filterByPermission<T extends { requiredPermission?: Permission }>(
  items: readonly T[],
  can: (p: Permission) => boolean
): T[] {
  return items.filter((item) => !item.requiredPermission || can(item.requiredPermission))
}
