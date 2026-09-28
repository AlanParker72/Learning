import { Permission } from '../rbac/permissions'
import { Role } from '../rbac/roles'
import type {
  ActionDef,
  ColumnDef,
  DashboardConfig,
  FilterDef,
  TabDef,
  WidgetDef
} from './types'

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Unassigned', label: 'Unassigned' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Pending QC Review', label: 'Pending QC Review' },
  { value: 'Completed', label: 'Completed' }
] as const

const NAME_ID_STATUS_FILTERS: FilterDef[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Search name',
    requiredPermission: Permission.FILTER_NAME
  },
  {
    id: 'id',
    label: 'ID',
    type: 'text',
    placeholder: 'Request ID',
    requiredPermission: Permission.FILTER_ID
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: STATUS_OPTIONS,
    requiredPermission: Permission.FILTER_STATUS
  }
]

const DATE_RANGE_FILTERS: FilterDef[] = [
  {
    id: 'dateFrom',
    label: 'From',
    type: 'date',
    requiredPermission: Permission.FILTER_DATE_RANGE
  },
  {
    id: 'dateTo',
    label: 'To',
    type: 'date',
    requiredPermission: Permission.FILTER_DATE_RANGE
  }
]

const BASE_COLUMNS: ColumnDef[] = [
  { id: 'requestId', label: 'Request ID', field: 'requestId' },
  { id: 'name', label: 'Name', field: 'name' },
  { id: 'status', label: 'Status', field: 'status' }
]

const OBS_ANALYST_COLUMN = (actionId?: string): ColumnDef => ({
  id: 'obsAnalyst',
  label: 'OBS Analyst',
  field: 'obsAnalyst',
  actionId
})

const QC_ANALYST_COLUMN = (actionId?: string): ColumnDef => ({
  id: 'qcAnalyst',
  label: 'QC Analyst',
  field: 'qcAnalyst',
  actionId
})

const BANKER_COLUMN: ColumnDef = {
  id: 'banker',
  label: 'Banker',
  field: 'banker'
}

const COMPLETED_COLUMNS: ColumnDef[] = [
  ...BASE_COLUMNS,
  { id: 'completedAt', label: 'Completed', field: 'completedAt' },
  BANKER_COLUMN
]

const TABLE_WIDGET: WidgetDef = {
  id: 'records-table',
  type: 'table',
  title: 'Records',
  requiredPermission: Permission.WIDGET_TABLE
}

const METRICS_WIDGET: WidgetDef = {
  id: 'summary-metrics',
  type: 'metrics',
  title: 'Summary',
  requiredPermission: Permission.WIDGET_METRICS
}

const CHART_WIDGET: WidgetDef = {
  id: 'status-chart',
  type: 'chart',
  title: 'Status breakdown',
  requiredPermission: Permission.WIDGET_CHART
}

const O_MANAGER_ACTIONS: ActionDef[] = [
  {
    id: 'reassign',
    label: 'Reassign',
    placement: 'row',
    requiredPermission: Permission.ACTION_REASSIGN
  }
]

const O_ANALYST_ACTIONS: ActionDef[] = [
  {
    id: 'assign_to_me',
    label: 'Assign to Me',
    placement: 'row',
    requiredPermission: Permission.ACTION_ASSIGN_TO_ME
  }
]

const Q_MANAGER_ACTIONS: ActionDef[] = [
  {
    id: 'assign_records',
    label: 'Assign Records',
    placement: 'header',
    requiredPermission: Permission.ACTION_ASSIGN_RECORDS
  },
  {
    id: 'bulk_assign',
    label: 'Bulk Assign',
    placement: 'bulk',
    requiredPermission: Permission.ACTION_BULK_ASSIGN
  }
]

const Q_ANALYST_ACTIONS: ActionDef[] = [
  {
    id: 'assign_to_me',
    label: 'Assign to Me',
    placement: 'row',
    requiredPermission: Permission.ACTION_ASSIGN_TO_ME
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

/**
 * Per-role dashboard layout mapped from UX screenshots.
 * Visibility is further gated by `requiredPermission` on each item.
 *
 * To add a role: extend `Role`, `ROLE_PERMISSIONS`, and this map.
 */
export const dashboardConfigByRole: Record<Role, DashboardConfig> = {
  [Role.O_MANAGER]: {
    title: 'Onboarding Requests',
    subtitle: 'OBS Analyst Manager',
    defaultTab: 'unassigned',
    tabs: [
      tab('unassigned', 'Unassigned', Permission.TAB_UNASSIGNED, [
        ...BASE_COLUMNS,
        OBS_ANALYST_COLUMN('reassign'),
        BANKER_COLUMN
      ]),
      tab('team_work', 'Team Work', Permission.TAB_TEAM_WORK, [
        ...BASE_COLUMNS,
        OBS_ANALYST_COLUMN('reassign'),
        BANKER_COLUMN,
        { id: 'assignedAt', label: 'Assigned', field: 'assignedAt' }
      ]),
      tab('completed', 'Completed', Permission.TAB_COMPLETED, COMPLETED_COLUMNS)
    ],
    filters: NAME_ID_STATUS_FILTERS,
    widgets: [METRICS_WIDGET, CHART_WIDGET, TABLE_WIDGET],
    actions: O_MANAGER_ACTIONS
  },

  [Role.O_ANALYST]: {
    title: 'Onboarding Requests',
    subtitle: 'OBS Analyst — My Tasks',
    defaultTab: 'my_tasks',
    tabs: [
      tab('my_tasks', 'My Tasks', Permission.TAB_MY_TASKS, [
        ...BASE_COLUMNS,
        OBS_ANALYST_COLUMN(),
        BANKER_COLUMN
      ]),
      tab('unassigned', 'Unassigned', Permission.TAB_UNASSIGNED, [
        ...BASE_COLUMNS,
        OBS_ANALYST_COLUMN('assign_to_me'),
        BANKER_COLUMN
      ])
    ],
    filters: NAME_ID_STATUS_FILTERS,
    widgets: [TABLE_WIDGET],
    actions: O_ANALYST_ACTIONS
  },

  [Role.Q_MANAGER]: {
    title: 'QC Request Dashboard',
    subtitle: 'QC Analyst Manager',
    defaultTab: 'unassigned',
    tabs: [
      tab(
        'unassigned',
        'Unassigned',
        Permission.TAB_UNASSIGNED,
        [
          ...BASE_COLUMNS,
          OBS_ANALYST_COLUMN(),
          QC_ANALYST_COLUMN(),
          BANKER_COLUMN
        ],
        true
      ),
      tab(
        'team_tasks',
        'Team Tasks',
        Permission.TAB_TEAM_TASKS,
        [
          ...BASE_COLUMNS,
          OBS_ANALYST_COLUMN(),
          QC_ANALYST_COLUMN(),
          BANKER_COLUMN,
          { id: 'assignedAt', label: 'Assigned', field: 'assignedAt' }
        ],
        true
      ),
      tab('completed', 'Completed', Permission.TAB_COMPLETED, [
        ...COMPLETED_COLUMNS,
        QC_ANALYST_COLUMN()
      ])
    ],
    filters: [...NAME_ID_STATUS_FILTERS, ...DATE_RANGE_FILTERS],
    widgets: [METRICS_WIDGET, CHART_WIDGET, TABLE_WIDGET],
    actions: Q_MANAGER_ACTIONS
  },

  [Role.Q_ANALYST]: {
    title: 'QC Request Dashboard',
    subtitle: 'QC Analyst — My Tasks',
    defaultTab: 'my_tasks',
    tabs: [
      tab('my_tasks', 'My Tasks', Permission.TAB_MY_TASKS, [
        ...BASE_COLUMNS,
        QC_ANALYST_COLUMN(),
        BANKER_COLUMN
      ]),
      tab('unassigned', 'Unassigned', Permission.TAB_UNASSIGNED, [
        ...BASE_COLUMNS,
        QC_ANALYST_COLUMN('assign_to_me'),
        BANKER_COLUMN
      ])
    ],
    filters: NAME_ID_STATUS_FILTERS,
    widgets: [TABLE_WIDGET],
    actions: Q_ANALYST_ACTIONS
  }
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
