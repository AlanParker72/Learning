import type { DashboardConfig } from '../../config/types'
import {
  ACTION_ASSIGN_RECORDS,
  ACTION_BULK_SELECT,
  ACTION_CLEAR_ALL_FILTERS
} from '../catalog/actions'
import {
  COL_APPLICANT,
  COL_BANKER,
  COL_DATE_COMPLETED,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_ID,
  COL_OBS_ANALYST,
  COL_REVIEW_STATUS
} from '../catalog/columns'
import {
  FILTER_APPLICANT_NAME,
  FILTER_DATE_RANGE_PILL,
  FILTER_DATE_RANGE_PRESET,
  FILTER_ID
} from '../catalog/filters'
import { Permission } from '../permissions'

/**
 * O_MANAGER — Onboarding manager.
 * This file owns both the permission list and this role’s dashboard config.
 * Domain (ONBOARDING) comes from requestGroup mapping, not extra permissions.
 *
 * Completed filters (screenshot 2): Select preset + date-range pill + Clear All.
 * Distinct from Q_MANAGER Completed (start/end + apply/clear icons).
 */

function currentMonthRange(): { start: string; end: string } {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0)
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  return { start: iso(start), end: iso(end) }
}

const MONTH = currentMonthRange()

export const O_MANAGER_PERMISSIONS = [
  Permission.DASHBOARD_VIEW,
  Permission.HEADING_TITLE,
  Permission.HEADING_SUBTITLE,
  Permission.WIDGET_TABLE,

  // Tabs
  Permission.TAB_UNASSIGNED,
  Permission.TAB_TEAM_TASKS,
  Permission.TAB_COMPLETED,

  // Filters
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID,
  Permission.FILTER_DATE_RANGE_PRESET,
  Permission.FILTER_DATE_RANGE_PILL,

  // Columns
  Permission.COLUMN_ID,
  Permission.COLUMN_APPLICANT,
  Permission.COLUMN_DAYS_IN_QUEUE,
  Permission.COLUMN_DAYS_IN_REVIEW,
  Permission.COLUMN_DATE_COMPLETED,
  Permission.COLUMN_REVIEW_STATUS,
  Permission.COLUMN_OBS_ANALYST,
  Permission.COLUMN_BANKER,

  // Actions
  Permission.ACTION_ASSIGN_RECORDS,
  Permission.ACTION_BULK_SELECT,
  Permission.ACTION_CLEAR_FILTERS
] as const satisfies readonly Permission[]

const O_MANAGER_QUEUE_COLUMNS = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_REVIEW_STATUS,
  COL_OBS_ANALYST,
  COL_BANKER
]

const O_MANAGER_COMPLETED_COLUMNS = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_REVIEW,
  COL_DATE_COMPLETED,
  COL_OBS_ANALYST,
  COL_BANKER
]

const O_MANAGER_SEARCH_FILTERS = [FILTER_APPLICANT_NAME, FILTER_ID]

/**
 * Screenshot 2: select + active date-range pill.
 * startDate/endDate live in store (pill rangeKeys); not rendered as date inputs.
 */
const O_MANAGER_COMPLETED_FILTERS = [
  {
    ...FILTER_DATE_RANGE_PRESET,
    defaultValue: 'this_month'
  },
  {
    ...FILTER_DATE_RANGE_PILL,
    // Encodes initial applied range as start|end for tab hydrate
    defaultValue: `${MONTH.start}|${MONTH.end}`
  }
]

export const O_MANAGER_DASHBOARD: DashboardConfig = {
  title: 'Onboarding Requests',
  titleRequiredPermission: Permission.HEADING_TITLE,
  subtitle: 'OBS Manager',
  subtitleRequiredPermission: Permission.HEADING_SUBTITLE,
  defaultTab: 'unassigned',
  tabs: [
    {
      id: 'unassigned',
      label: 'Unassigned',
      requiredPermission: Permission.TAB_UNASSIGNED,
      filters: O_MANAGER_SEARCH_FILTERS,
      columns: O_MANAGER_QUEUE_COLUMNS,
      selectable: true,
      actions: [ACTION_BULK_SELECT, ACTION_CLEAR_ALL_FILTERS]
    },
    {
      id: 'team_tasks',
      label: 'Team Tasks',
      requiredPermission: Permission.TAB_TEAM_TASKS,
      filters: O_MANAGER_SEARCH_FILTERS,
      columns: O_MANAGER_QUEUE_COLUMNS,
      selectable: true,
      actions: [ACTION_BULK_SELECT, ACTION_CLEAR_ALL_FILTERS]
    },
    {
      id: 'completed',
      label: 'Completed',
      requiredPermission: Permission.TAB_COMPLETED,
      filters: O_MANAGER_COMPLETED_FILTERS,
      columns: O_MANAGER_COMPLETED_COLUMNS,
      actions: [ACTION_CLEAR_ALL_FILTERS]
    }
  ],
  actions: [ACTION_ASSIGN_RECORDS]
}
