import type { DashboardConfig } from '../../config/types'
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
import { Permission } from '../permissions'

/**
 * O_MANAGER — Onboarding manager.
 * This file owns both the permission list and this role’s dashboard config.
 * Domain (ONBOARDING) comes from requestGroup mapping, not extra permissions.
 * Tabs list filter/action permission ids only — catalog supplies UI metadata.
 *
 * Completed filters (screenshot 2): Select preset + date-range pill + Clear All.
 * Distinct from Q_MANAGER Completed (start/end + apply/clear icons).
 * Month default lives on FILTER_DATE_RANGE_PILL in the catalog.
 */

export const O_MANAGER_PERMISSIONS = [
  Permission.DASHBOARD_VIEW,
  Permission.HEADING_TITLE,
  Permission.HEADING_SUBTITLE,
  Permission.WIDGET_TABLE,

  // Tabs
  Permission.TAB_UNASSIGNED,
  Permission.TAB_TEAM_TASKS,
  Permission.TAB_COMPLETED,

  // Filters (full set this role may ever use)
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
  Permission.ACTION_CLEAR_ALL_FILTERS
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

const SEARCH_FILTER_PERMISSIONS = [
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID
]

/** Screenshot 2: select + active date-range pill (month default in catalog). */
const COMPLETED_FILTER_PERMISSIONS = [
  Permission.FILTER_DATE_RANGE_PRESET,
  Permission.FILTER_DATE_RANGE_PILL
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
      filterPermissions: SEARCH_FILTER_PERMISSIONS,
      columns: O_MANAGER_QUEUE_COLUMNS,
      selectable: true,
      actionPermissions: [
        Permission.ACTION_BULK_SELECT,
        Permission.ACTION_CLEAR_ALL_FILTERS
      ]
    },
    {
      id: 'team_tasks',
      label: 'Team Tasks',
      requiredPermission: Permission.TAB_TEAM_TASKS,
      filterPermissions: SEARCH_FILTER_PERMISSIONS,
      columns: O_MANAGER_QUEUE_COLUMNS,
      selectable: true,
      actionPermissions: [
        Permission.ACTION_BULK_SELECT,
        Permission.ACTION_CLEAR_ALL_FILTERS
      ]
    },
    {
      id: 'completed',
      label: 'Completed',
      requiredPermission: Permission.TAB_COMPLETED,
      filterPermissions: COMPLETED_FILTER_PERMISSIONS,
      columns: O_MANAGER_COMPLETED_COLUMNS,
      actionPermissions: [Permission.ACTION_CLEAR_ALL_FILTERS]
    }
  ],
  actionPermissions: [Permission.ACTION_ASSIGN_RECORDS]
}
