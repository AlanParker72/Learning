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

/** Shared column defs — same `field` keys for Q and O; visibility via COLUMN_* grants. */
const COL_ID: ColumnDef = {
  id: 'idNumber',
  header: 'ID #',
  field: 'idNumber',
  requiredPermission: Permission.COLUMN_ID
}
const COL_APPLICANT: ColumnDef = {
  id: 'applicant',
  header: 'Applicant',
  field: 'applicant',
  requiredPermission: Permission.COLUMN_APPLICANT
}
const COL_DAYS_IN_QUEUE: ColumnDef = {
  id: 'daysInQueue',
  header: 'Days in Queue',
  field: 'daysInQueue',
  requiredPermission: Permission.COLUMN_DAYS_IN_QUEUE
}
const COL_DAYS_IN_REVIEW: ColumnDef = {
  id: 'daysInReview',
  header: 'Days in Review',
  field: 'daysInReview',
  requiredPermission: Permission.COLUMN_DAYS_IN_REVIEW
}
const COL_REVIEW_STATUS: ColumnDef = {
  id: 'reviewStatus',
  header: 'Review Status',
  field: 'reviewStatus',
  requiredPermission: Permission.COLUMN_REVIEW_STATUS
}
const COL_BANKER: ColumnDef = {
  id: 'banker',
  header: 'Banker',
  field: 'banker',
  requiredPermission: Permission.COLUMN_BANKER
}
const COL_QC_ANALYST: ColumnDef = {
  id: 'qcAnalyst',
  header: 'QC Analyst',
  field: 'qcAnalyst',
  requiredPermission: Permission.COLUMN_QC_ANALYST
}
const COL_OBS_ANALYST: ColumnDef = {
  id: 'obsAnalyst',
  header: 'OBS Analyst',
  field: 'obsAnalyst',
  requiredPermission: Permission.COLUMN_OBS_ANALYST
}

/** Q_* catalog: QC Analyst column (`field: 'qcAnalyst'`). */
const Q_COLUMNS: ColumnDef[] = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_REVIEW_STATUS,
  COL_QC_ANALYST,
  COL_BANKER
]

/** O_* catalog: OBS Analyst column (`field: 'obsAnalyst'`). */
const O_COLUMNS: ColumnDef[] = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_REVIEW_STATUS,
  COL_OBS_ANALYST,
  COL_BANKER
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

function withColumnAction(
  columns: ColumnDef[],
  columnId: string,
  actionId: string
): ColumnDef[] {
  return columns.map((c) => (c.id === columnId ? { ...c, actionId } : c))
}

function managerTabs(columns: ColumnDef[]): TabDef[] {
  return [
    tab('unassigned', 'Unassigned', columns, true),
    tab('team_tasks', 'Team Tasks', columns, true),
    tab('completed', 'Completed', columns)
  ]
}

/** Analyst tabs: row actions attach to the domain analyst column. */
function analystTabs(columns: ColumnDef[], analystColumnId: string): TabDef[] {
  return [
    tab(
      'my_tasks',
      'My Tasks',
      withColumnAction(columns, analystColumnId, 'claim')
    ),
    tab(
      'unassigned',
      'Unassigned',
      withColumnAction(columns, analystColumnId, 'assign_to_me'),
      true
    )
  ]
}

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
 * **Visibility** of a column = `COLUMN_*` granted in `rolePermissions/<role>.ts`.
 * **Mapping** (header + field) = entries below; table reads `row[column.field]`.
 *
 * Managers: Unassigned / Team Tasks / Completed.
 * Analysts: My Tasks / Unassigned.
 * Q_* vs O_* differ by title/domain (requestGroup) and analyst column catalog.
 */
export const dashboardConfigByRole: Record<Role, DashboardConfig> = {
  [Role.Q_MANAGER]: {
    title: 'Quality Control Requests',
    titleRequiredPermission: Permission.HEADING_TITLE,
    subtitle: 'QC Analyst Manager',
    subtitleRequiredPermission: Permission.HEADING_SUBTITLE,
    defaultTab: 'unassigned',
    tabs: managerTabs(Q_COLUMNS),
    filters: FILTERS,
    actions: MANAGER_ACTIONS
  },
  [Role.Q_ANALYST]: {
    title: 'Quality Control Requests',
    titleRequiredPermission: Permission.HEADING_TITLE,
    subtitle: 'QC Analyst',
    subtitleRequiredPermission: Permission.HEADING_SUBTITLE,
    defaultTab: 'my_tasks',
    tabs: analystTabs(Q_COLUMNS, 'qcAnalyst'),
    filters: FILTERS,
    actions: ANALYST_ACTIONS
  },
  [Role.O_MANAGER]: {
    title: 'Onboarding Requests',
    titleRequiredPermission: Permission.HEADING_TITLE,
    subtitle: 'OBS Manager',
    subtitleRequiredPermission: Permission.HEADING_SUBTITLE,
    defaultTab: 'unassigned',
    tabs: managerTabs(O_COLUMNS),
    filters: FILTERS,
    actions: MANAGER_ACTIONS
  },
  [Role.O_ANALYST]: {
    title: 'Onboarding Requests',
    titleRequiredPermission: Permission.HEADING_TITLE,
    subtitle: 'OBS Analyst',
    subtitleRequiredPermission: Permission.HEADING_SUBTITLE,
    defaultTab: 'my_tasks',
    tabs: analystTabs(O_COLUMNS, 'obsAnalyst'),
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
