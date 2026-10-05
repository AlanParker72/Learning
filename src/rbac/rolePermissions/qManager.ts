import type { DashboardConfig } from '../../config/types'
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
import { Permission } from '../permissions'

/**
 * Q_MANAGER — Quality Control manager.
 * This file owns both the permission list and this role’s dashboard config.
 *
 * Queue tabs: Applicant + ID# (inline). Completed: date preset + start/end with
 * apply/clear on FILTER_END_DATE (filter-owned controls).
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

  // Filters (full set this role may ever use)
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID,
  Permission.FILTER_DATE_RANGE_PRESET,
  Permission.FILTER_START_DATE,
  Permission.FILTER_END_DATE,

  // Actions (standalone — apply/clear for dates live on FilterDef.controls)
  Permission.ACTION_ASSIGN_RECORDS,
  Permission.ACTION_BULK_SELECT
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

/** Completed columns — Date Completed; no Days in Queue. */
const Q_MANAGER_COMPLETED_COLUMNS = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_REVIEW,
  COL_DATE_COMPLETED,
  COL_OBS_ANALYST,
  COL_QC_ANALYST,
  COL_BANKER
]

const SEARCH_FILTER_PERMISSIONS = [
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID
]

/** Preset + start/end; apply/clear on FILTER_END_DATE in catalog. */
const COMPLETED_FILTER_PERMISSIONS = [
  Permission.FILTER_DATE_RANGE_PRESET,
  Permission.FILTER_START_DATE,
  Permission.FILTER_END_DATE
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
      filterPermissions: SEARCH_FILTER_PERMISSIONS,
      columns: Q_MANAGER_QUEUE_COLUMNS,
      selectable: true,
      actionPermissions: [Permission.ACTION_BULK_SELECT]
    },
    {
      id: 'team_tasks',
      label: 'Team Tasks',
      requiredPermission: Permission.TAB_TEAM_TASKS,
      filterPermissions: SEARCH_FILTER_PERMISSIONS,
      columns: Q_MANAGER_QUEUE_COLUMNS,
      selectable: true,
      actionPermissions: [Permission.ACTION_BULK_SELECT]
    },
    {
      id: 'completed',
      label: 'Completed',
      requiredPermission: Permission.TAB_COMPLETED,
      filterPermissions: COMPLETED_FILTER_PERMISSIONS,
      columns: Q_MANAGER_COMPLETED_COLUMNS
    }
  ],
  actionPermissions: [Permission.ACTION_ASSIGN_RECORDS]
}
