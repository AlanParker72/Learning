import { Permission } from './permissions'
import { Role } from './roles'

const QC_TABLE_COLUMNS: readonly Permission[] = [
  Permission.COLUMN_ID,
  Permission.COLUMN_APPLICANT,
  Permission.COLUMN_DAYS_IN_QUEUE,
  Permission.COLUMN_DAYS_IN_REVIEW,
  Permission.COLUMN_REVIEW_STATUS,
  Permission.COLUMN_OBS_ANALYST,
  Permission.COLUMN_QC_ANALYST,
  Permission.COLUMN_BANKER
]

/**
 * Role → permission map.
 * Adding a role is primarily a new row here + a `dashboardConfig` entry —
 * not a new page or `role ===` branches in components.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.O_MANAGER]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_OVERVIEW,
    Permission.FILTER_APPLICANT_NAME,
    Permission.FILTER_ID,
    Permission.WIDGET_TABLE,
    ...QC_TABLE_COLUMNS
  ],
  [Role.O_ANALYST]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_OVERVIEW,
    Permission.FILTER_APPLICANT_NAME,
    Permission.FILTER_ID,
    Permission.WIDGET_TABLE,
    ...QC_TABLE_COLUMNS
  ],
  [Role.Q_MANAGER]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_UNASSIGNED,
    Permission.TAB_TEAM_TASKS,
    Permission.TAB_COMPLETED,
    Permission.FILTER_APPLICANT_NAME,
    Permission.FILTER_ID,
    Permission.ACTION_ASSIGN_RECORDS,
    Permission.WIDGET_TABLE,
    ...QC_TABLE_COLUMNS
  ],
  [Role.Q_ANALYST]: [
    Permission.DASHBOARD_VIEW,
    Permission.TAB_MY_TASKS,
    Permission.TAB_UNASSIGNED,
    Permission.FILTER_APPLICANT_NAME,
    Permission.FILTER_ID,
    Permission.ACTION_CLAIM,
    Permission.ACTION_ASSIGN_TO_ME,
    Permission.WIDGET_TABLE,
    ...QC_TABLE_COLUMNS
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
