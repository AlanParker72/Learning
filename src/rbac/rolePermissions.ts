import { Permission } from './permissions'
import { Role } from './roles'

/**
 * Role → permission map. Adding a role is primarily a new row here
 * plus a `dashboardConfig` entry — not a new page.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.O_MANAGER]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_UNASSIGNED,
    Permission.TAB_TEAM_WORK,
    Permission.TAB_COMPLETED,
    Permission.FILTER_NAME,
    Permission.FILTER_ID,
    Permission.FILTER_STATUS,
    Permission.ACTION_REASSIGN,
    Permission.WIDGET_METRICS,
    Permission.WIDGET_CHART,
    Permission.WIDGET_TABLE
  ],
  [Role.O_ANALYST]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_MY_TASKS,
    Permission.TAB_UNASSIGNED,
    Permission.FILTER_NAME,
    Permission.FILTER_ID,
    Permission.FILTER_STATUS,
    Permission.ACTION_ASSIGN_TO_ME,
    Permission.WIDGET_TABLE
  ],
  [Role.Q_MANAGER]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_UNASSIGNED,
    Permission.TAB_TEAM_TASKS,
    Permission.TAB_COMPLETED,
    Permission.FILTER_NAME,
    Permission.FILTER_ID,
    Permission.FILTER_STATUS,
    Permission.FILTER_DATE_RANGE,
    Permission.ACTION_BULK_ASSIGN,
    Permission.ACTION_ASSIGN_RECORDS,
    Permission.WIDGET_METRICS,
    Permission.WIDGET_CHART,
    Permission.WIDGET_TABLE
  ],
  [Role.Q_ANALYST]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_MY_TASKS,
    Permission.TAB_UNASSIGNED,
    Permission.FILTER_NAME,
    Permission.FILTER_ID,
    Permission.FILTER_STATUS,
    Permission.ACTION_ASSIGN_TO_ME,
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
