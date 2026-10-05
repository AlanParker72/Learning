import { Permission, TAB_REQUIRED_PERMISSION } from '../rbac/permissions'
import { Role } from '../rbac/roles'
import type { ActionDef, ColumnDef, DashboardConfig, FilterDef, TabDef } from './types'

const FILTERS: FilterDef[] = [
  {
    id: 'applicantName',
    label: 'Applicant Name',
    type: 'text',
    placeholder: 'Search by Applicant Name',
    requiredPermission: Permission.FILTER_APPLICANT_NAME
  },
  {
    id: 'id',
    label: 'ID#',
    type: 'text',
    placeholder: 'Search by ID#',
    requiredPermission: Permission.FILTER_ID
  }
]

/** Shared table columns — each gated by its own permission. */
const COLUMNS: ColumnDef[] = [
  {
    id: 'idNumber',
    label: 'ID #',
    field: 'idNumber',
    requiredPermission: Permission.COLUMN_ID
  },
  {
    id: 'applicant',
    label: 'Applicant',
    field: 'applicant',
    requiredPermission: Permission.COLUMN_APPLICANT
  },
  {
    id: 'daysInQueue',
    label: 'Days in Queue',
    field: 'daysInQueue',
    requiredPermission: Permission.COLUMN_DAYS_IN_QUEUE
  },
  {
    id: 'daysInReview',
    label: 'Days in Review',
    field: 'daysInReview',
    requiredPermission: Permission.COLUMN_DAYS_IN_REVIEW
  },
  {
    id: 'reviewStatus',
    label: 'Review Status',
    field: 'reviewStatus',
    requiredPermission: Permission.COLUMN_REVIEW_STATUS
  },
  {
    id: 'obsAnalyst',
    label: 'OBS Analyst',
    field: 'obsAnalyst',
    requiredPermission: Permission.COLUMN_OBS_ANALYST
  },
  {
    id: 'qcAnalyst',
    label: 'QC Analyst',
    field: 'qcAnalyst',
    requiredPermission: Permission.COLUMN_QC_ANALYST
  },
  {
    id: 'banker',
    label: 'Banker',
    field: 'banker',
    requiredPermission: Permission.COLUMN_BANKER
  }
]

function tab(
  id: keyof typeof TAB_REQUIRED_PERMISSION,
  label: string,
  columns: ColumnDef[],
  selectable = false
): TabDef {
  return {
    id,
    label,
    requiredPermission: TAB_REQUIRED_PERMISSION[id],
    columns,
    selectable
  }
}

/** Catalog of tabs. Roles see a subset via `ROLE_PERMISSIONS` + `filterByPermission`. */
const TABS = {
  unassigned: tab('unassigned', 'Unassigned', COLUMNS, true),
  team_tasks: tab('team_tasks', 'Team Tasks', COLUMNS, true),
  my_tasks: tab('my_tasks', 'My Tasks', COLUMNS),
  completed: tab('completed', 'Completed', COLUMNS)
} as const

function withColumnAction(columns: ColumnDef[], columnId: string, actionId: string): ColumnDef[] {
  return columns.map((c) => (c.id === columnId ? { ...c, actionId } : c))
}

const MANAGER_TABS: TabDef[] = [
  TABS.unassigned,
  TABS.team_tasks,
  TABS.completed
]

const ANALYST_TABS: TabDef[] = [
  tab(
    'my_tasks',
    'My Tasks',
    withColumnAction(COLUMNS, 'qcAnalyst', 'claim')
  ),
  tab(
    'unassigned',
    'Unassigned',
    withColumnAction(COLUMNS, 'qcAnalyst', 'assign_to_me'),
    true
  )
]

const MANAGER_ACTIONS: ActionDef[] = [
  {
    id: 'assign_records',
    label: 'Assign Records',
    placement: 'header',
    requiredPermission: Permission.ACTION_ASSIGN_RECORDS
  }
]

const ANALYST_ACTIONS: ActionDef[] = [
  {
    id: 'claim',
    label: 'Claim',
    placement: 'row',
    requiredPermission: Permission.ACTION_CLAIM
  },
  {
    id: 'assign_to_me',
    label: 'Assign to Me',
    placement: 'row',
    requiredPermission: Permission.ACTION_ASSIGN_TO_ME
  }
]

/**
 * Per-role dashboard layout.
 *
 * Visible tabs = `tabs.filter(t => can(t.requiredPermission))`.
 * Which permissions a role has lives only in `rolePermissions.ts`.
 *
 * Managers: Unassigned / Team Tasks / Completed.
 * Analysts: My Tasks / Unassigned.
 * Q_* vs O_* differ by title/domain (requestGroup), not by tab ids.
 */
export const dashboardConfigByRole: Record<Role, DashboardConfig> = {
  [Role.Q_MANAGER]: {
    title: 'Quality Control Requests',
    subtitle: 'QC Analyst Manager',
    defaultTab: 'unassigned',
    tabs: MANAGER_TABS,
    filters: FILTERS,
    actions: MANAGER_ACTIONS
  },
  [Role.Q_ANALYST]: {
    title: 'Quality Control Requests',
    subtitle: 'QC Analyst',
    defaultTab: 'my_tasks',
    tabs: ANALYST_TABS,
    filters: FILTERS,
    actions: ANALYST_ACTIONS
  },
  [Role.O_MANAGER]: {
    title: 'Onboarding Requests',
    subtitle: 'OBS Manager',
    defaultTab: 'unassigned',
    tabs: MANAGER_TABS,
    filters: FILTERS,
    actions: MANAGER_ACTIONS
  },
  [Role.O_ANALYST]: {
    title: 'Onboarding Requests',
    subtitle: 'OBS Analyst',
    defaultTab: 'my_tasks',
    tabs: ANALYST_TABS,
    filters: FILTERS,
    actions: ANALYST_ACTIONS
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
