import { Permission } from '../rbac/permissions'
import { Role } from '../rbac/roles'
import type { ActionDef, ColumnDef, DashboardConfig, FilterDef, TabDef } from './types'

const QC_FILTERS: FilterDef[] = [
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

/** Quality Control Requests columns (screenshot). */
const QC_COLUMNS: ColumnDef[] = [
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
  id: string,
  label: string,
  requiredPermission: Permission,
  columns: ColumnDef[],
  selectable = false
): TabDef {
  return { id, label, requiredPermission, columns, selectable }
}

const Q_MANAGER_ACTIONS: ActionDef[] = [
  {
    id: 'assign_records',
    label: 'Assign Records',
    placement: 'header',
    requiredPermission: Permission.ACTION_ASSIGN_RECORDS
  }
]

const Q_ANALYST_ACTIONS: ActionDef[] = [
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
 * Visibility is further gated by `requiredPermission` on each item.
 *
 * Primary product mapping: Q_MANAGER (Quality Control Requests screenshot).
 * Q_ANALYST: My Tasks / Unassigned. O_* keep thin stubs.
 */
export const dashboardConfigByRole: Record<Role, DashboardConfig> = {
  [Role.Q_MANAGER]: {
    title: 'Quality Control Requests',
    subtitle: 'QC Analyst Manager',
    defaultTab: 'unassigned',
    tabs: [
      tab('unassigned', 'Unassigned', Permission.TAB_UNASSIGNED, QC_COLUMNS, true),
      tab('team_tasks', 'Team Tasks', Permission.TAB_TEAM_TASKS, QC_COLUMNS, true),
      tab('completed', 'Completed', Permission.TAB_COMPLETED, QC_COLUMNS)
    ],
    filters: QC_FILTERS,
    actions: Q_MANAGER_ACTIONS
  },

  [Role.Q_ANALYST]: {
    title: 'Quality Control Requests',
    subtitle: 'QC Analyst',
    defaultTab: 'my_tasks',
    tabs: [
      tab('my_tasks', 'My Tasks', Permission.TAB_MY_TASKS, [
        ...QC_COLUMNS.map((c) =>
          c.id === 'qcAnalyst' ? { ...c, actionId: 'claim' } : c
        )
      ]),
      tab('unassigned', 'Unassigned', Permission.TAB_UNASSIGNED, [
        ...QC_COLUMNS.map((c) =>
          c.id === 'qcAnalyst' ? { ...c, actionId: 'assign_to_me' } : c
        )
      ])
    ],
    filters: QC_FILTERS,
    actions: Q_ANALYST_ACTIONS
  },

  /** Thin stubs — preserve RBAC skeleton until O_* screenshots arrive. */
  [Role.O_MANAGER]: {
    title: 'Onboarding Requests',
    subtitle: 'OBS Manager (stub)',
    defaultTab: 'overview',
    tabs: [tab('overview', 'Overview', Permission.TAB_OVERVIEW, QC_COLUMNS)],
    filters: QC_FILTERS,
    actions: []
  },
  [Role.O_ANALYST]: {
    title: 'Onboarding Requests',
    subtitle: 'OBS Analyst (stub)',
    defaultTab: 'overview',
    tabs: [tab('overview', 'Overview', Permission.TAB_OVERVIEW, QC_COLUMNS)],
    filters: QC_FILTERS,
    actions: []
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
