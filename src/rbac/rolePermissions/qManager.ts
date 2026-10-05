import type { DashboardConfig } from '../../config/types'
import { ACTION_ASSIGN_RECORDS } from '../catalog/actions'
import {
  COL_APPLICANT,
  COL_BANKER,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_ID,
  COL_QC_ANALYST,
  COL_REVIEW_STATUS
} from '../catalog/columns'
import { FILTER_APPLICANT_NAME, FILTER_ID } from '../catalog/filters'
import { Permission } from '../permissions'

/**
 * Q_MANAGER — Quality Control manager.
 * This file owns both the permission list and this role’s dashboard config.
 * Grant/revoke UI pieces by adding/removing Permission.* entries below;
 * layout (tabs / filters / columns / actions) is declared independently here.
 */

export const Q_MANAGER_PERMISSIONS = [
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
  Permission.COLUMN_QC_ANALYST,
  Permission.COLUMN_BANKER,

  // Actions
  Permission.ACTION_ASSIGN_RECORDS
] as const satisfies readonly Permission[]

const Q_MANAGER_COLUMNS = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_REVIEW_STATUS,
  COL_QC_ANALYST,
  COL_BANKER
]

/** Filters for this role’s tabs — declared per tab so they can diverge later. */
const Q_MANAGER_TAB_FILTERS = [FILTER_APPLICANT_NAME, FILTER_ID]

export const Q_MANAGER_DASHBOARD: DashboardConfig = {
  title: 'Quality Control Requests',
  titleRequiredPermission: Permission.HEADING_TITLE,
  subtitle: 'QC Analyst Manager',
  subtitleRequiredPermission: Permission.HEADING_SUBTITLE,
  defaultTab: 'unassigned',
  tabs: [
    {
      id: 'unassigned',
      label: 'Unassigned',
      requiredPermission: Permission.TAB_UNASSIGNED,
      filters: Q_MANAGER_TAB_FILTERS,
      columns: Q_MANAGER_COLUMNS,
      selectable: true
    },
    {
      id: 'team_tasks',
      label: 'Team Tasks',
      requiredPermission: Permission.TAB_TEAM_TASKS,
      filters: Q_MANAGER_TAB_FILTERS,
      columns: Q_MANAGER_COLUMNS,
      selectable: true
    },
    {
      id: 'completed',
      label: 'Completed',
      requiredPermission: Permission.TAB_COMPLETED,
      filters: Q_MANAGER_TAB_FILTERS,
      columns: Q_MANAGER_COLUMNS
    }
  ],
  actions: [ACTION_ASSIGN_RECORDS]
}
