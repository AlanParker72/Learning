import type { DashboardConfig } from '../../config/types'
import {
  ACTION_APPLY_DATE_FILTER,
  ACTION_ASSIGN_RECORDS,
  ACTION_BULK_SELECT,
  ACTION_CLEAR_FILTERS
} from '../catalog/actions'
import {
  COL_APPLICANT,
  COL_BANKER,
  COL_DATE_COMPLETED,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_ID,
  COL_OBS_ANALYST,
  COL_QC_ANALYST,
  COL_REVIEW_STATUS
} from '../catalog/columns'
import {
  FILTER_APPLICANT_NAME,
  FILTER_DATE_RANGE_PRESET,
  FILTER_END_DATE,
  FILTER_ID,
  FILTER_START_DATE
} from '../catalog/filters'
import { Permission } from '../permissions'

/**
 * Q_MANAGER — Quality Control manager.
 * This file owns both the permission list and this role’s dashboard config.
 * Grant/revoke UI pieces by adding/removing Permission.* entries below;
 * layout (tabs / filters / columns / actions) is declared independently here.
 *
 * Completed filters (screenshot 1): Custom Range + Start/End + Apply/Clear icons.
 * Unassigned / Team Tasks keep applicant + id search filters.
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
  Permission.FILTER_DATE_RANGE_PRESET,
  Permission.FILTER_START_DATE,
  Permission.FILTER_END_DATE,

  // Columns
  Permission.COLUMN_ID,
  Permission.COLUMN_APPLICANT,
  Permission.COLUMN_DAYS_IN_QUEUE,
  Permission.COLUMN_DAYS_IN_REVIEW,
  Permission.COLUMN_DATE_COMPLETED,
  Permission.COLUMN_REVIEW_STATUS,
  Permission.COLUMN_OBS_ANALYST,
  Permission.COLUMN_QC_ANALYST,
  Permission.COLUMN_BANKER,

  // Actions
  Permission.ACTION_ASSIGN_RECORDS,
  Permission.ACTION_BULK_SELECT,
  Permission.ACTION_APPLY_DATE_FILTER,
  Permission.ACTION_CLEAR_FILTERS
] as const satisfies readonly Permission[]

const Q_MANAGER_QUEUE_COLUMNS = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_REVIEW_STATUS,
  COL_QC_ANALYST,
  COL_BANKER
]

/** Completed columns per screenshot — Date Completed; no Days in Queue. */
const Q_MANAGER_COMPLETED_COLUMNS = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_REVIEW,
  COL_DATE_COMPLETED,
  COL_OBS_ANALYST,
  COL_QC_ANALYST,
  COL_BANKER
]

const Q_MANAGER_SEARCH_FILTERS = [FILTER_APPLICANT_NAME, FILTER_ID]

/** Screenshot 1: preset dropdown + start/end dates. */
const Q_MANAGER_COMPLETED_FILTERS = [
  FILTER_DATE_RANGE_PRESET,
  FILTER_START_DATE,
  FILTER_END_DATE
]

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
      filters: Q_MANAGER_SEARCH_FILTERS,
      columns: Q_MANAGER_QUEUE_COLUMNS,
      selectable: true,
      actions: [ACTION_BULK_SELECT, ACTION_CLEAR_FILTERS]
    },
    {
      id: 'team_tasks',
      label: 'Team Tasks',
      requiredPermission: Permission.TAB_TEAM_TASKS,
      filters: Q_MANAGER_SEARCH_FILTERS,
      columns: Q_MANAGER_QUEUE_COLUMNS,
      selectable: true,
      actions: [ACTION_BULK_SELECT, ACTION_CLEAR_FILTERS]
    },
    {
      id: 'completed',
      label: 'Completed',
      requiredPermission: Permission.TAB_COMPLETED,
      filters: Q_MANAGER_COMPLETED_FILTERS,
      columns: Q_MANAGER_COMPLETED_COLUMNS,
      actions: [ACTION_APPLY_DATE_FILTER, ACTION_CLEAR_FILTERS]
    }
  ],
  actions: [ACTION_ASSIGN_RECORDS]
}
