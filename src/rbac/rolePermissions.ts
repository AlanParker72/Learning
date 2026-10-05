import { Permission } from './permissions'
import { Role } from './roles'

const TABLE_COLUMNS: readonly Permission[] = [
  Permission.COLUMN_ID,
  Permission.COLUMN_APPLICANT,
  Permission.COLUMN_DAYS_IN_QUEUE,
  Permission.COLUMN_DAYS_IN_REVIEW,
  Permission.COLUMN_REVIEW_STATUS,
  Permission.COLUMN_OBS_ANALYST,
  Permission.COLUMN_QC_ANALYST,
  Permission.COLUMN_BANKER
]

const MANAGER_TABS: readonly Permission[] = [
  Permission.TAB_UNASSIGNED,
  Permission.TAB_TEAM_TASKS,
  Permission.TAB_COMPLETED
]

const ANALYST_TABS: readonly Permission[] = [
  Permission.TAB_MY_TASKS,
  Permission.TAB_UNASSIGNED
]

const SHARED_DASHBOARD: readonly Permission[] = [
  Permission.DASHBOARD_VIEW,
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID,
  Permission.WIDGET_TABLE,
  ...TABLE_COLUMNS
]

/**
 * Role → permission map.
 *
 * Tabs a role sees = which `dashboard.tab.*` permissions are listed here.
 * UI: `config.tabs.filter(t => can(t.requiredPermission))`.
 * Mocks: same check before returning rows for a tab.
 *
 * Adding a role: new row here + roles.ts + (optional) config entries for new tabs/actions.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.Q_MANAGER]: [
    ...SHARED_DASHBOARD,
    ...MANAGER_TABS,
    Permission.ACTION_ASSIGN_RECORDS
  ],
  [Role.Q_ANALYST]: [
    ...SHARED_DASHBOARD,
    ...ANALYST_TABS,
    Permission.ACTION_CLAIM,
    Permission.ACTION_ASSIGN_TO_ME
  ],
  /** Same tab set as Q_MANAGER; domain (Onboarding) comes from requestGroup, not extra tabs. */
  [Role.O_MANAGER]: [
    ...SHARED_DASHBOARD,
    ...MANAGER_TABS,
    Permission.ACTION_ASSIGN_RECORDS
  ],
  /** Same tab set as Q_ANALYST; domain (Onboarding) comes from requestGroup. */
  [Role.O_ANALYST]: [
    ...SHARED_DASHBOARD,
    ...ANALYST_TABS,
    Permission.ACTION_CLAIM,
    Permission.ACTION_ASSIGN_TO_ME
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

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission)
}
