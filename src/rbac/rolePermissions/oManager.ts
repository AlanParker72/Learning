import type { DashboardConfig } from '../../config/types'
import { ACTION_ASSIGN_RECORDS } from '../catalog/actions'
import {
  COL_APPLICANT,
  COL_BANKER,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_ID,
  COL_OBS_ANALYST,
  COL_REVIEW_STATUS
} from '../catalog/columns'
import { FILTER_APPLICANT_NAME, FILTER_ID } from '../catalog/filters'
import { Permission } from '../permissions'

/**
 * O_MANAGER — Onboarding manager.
 * This file owns both the permission list and this role’s dashboard config.
 * Domain (ONBOARDING) comes from requestGroup mapping, not extra permissions.
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

  // Filters
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID,

  // Columns
  Permission.COLUMN_ID,
  Permission.COLUMN_APPLICANT,
  Permission.COLUMN_DAYS_IN_QUEUE,
  Permission.COLUMN_DAYS_IN_REVIEW,
  Permission.COLUMN_REVIEW_STATUS,
  Permission.COLUMN_OBS_ANALYST,
  Permission.COLUMN_BANKER,

  // Actions
  Permission.ACTION_ASSIGN_RECORDS
] as const satisfies readonly Permission[]

const O_MANAGER_COLUMNS = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_REVIEW_STATUS,
  COL_OBS_ANALYST,
  COL_BANKER
]

const O_MANAGER_TAB_FILTERS = [FILTER_APPLICANT_NAME, FILTER_ID]

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
      filters: O_MANAGER_TAB_FILTERS,
      columns: O_MANAGER_COLUMNS,
      selectable: true
    },
    {
      id: 'team_tasks',
      label: 'Team Tasks',
      requiredPermission: Permission.TAB_TEAM_TASKS,
      filters: O_MANAGER_TAB_FILTERS,
      columns: O_MANAGER_COLUMNS,
      selectable: true
    },
    {
      id: 'completed',
      label: 'Completed',
      requiredPermission: Permission.TAB_COMPLETED,
      filters: O_MANAGER_TAB_FILTERS,
      columns: O_MANAGER_COLUMNS
    }
  ],
  actions: [ACTION_ASSIGN_RECORDS]
}
