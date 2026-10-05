import type { DashboardConfig } from '../../config/types'
import {
  ACTION_ASSIGN_TO_ME,
  ACTION_CLAIM,
  ACTION_CLEAR_FILTERS
} from '../catalog/actions'
import {
  COL_APPLICANT,
  COL_BANKER,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_ID,
  COL_QC_ANALYST,
  COL_REVIEW_STATUS,
  withColumnAction
} from '../catalog/columns'
import { FILTER_APPLICANT_NAME, FILTER_ID } from '../catalog/filters'
import { Permission } from '../permissions'

/**
 * Q_ANALYST — Quality Control analyst.
 * This file owns both the permission list and this role’s dashboard config.
 */

export const Q_ANALYST_PERMISSIONS = [
  Permission.DASHBOARD_VIEW,
  Permission.HEADING_TITLE,
  Permission.HEADING_SUBTITLE,
  Permission.WIDGET_TABLE,

  // Tabs
  Permission.TAB_MY_TASKS,
  Permission.TAB_UNASSIGNED,

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
  Permission.ACTION_CLAIM,
  Permission.ACTION_ASSIGN_TO_ME,
  Permission.ACTION_CLEAR_FILTERS
] as const satisfies readonly Permission[]

const Q_ANALYST_COLUMNS = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_REVIEW_STATUS,
  COL_QC_ANALYST,
  COL_BANKER
]

export const Q_ANALYST_DASHBOARD: DashboardConfig = {
  title: 'Quality Control Requests',
  titleRequiredPermission: Permission.HEADING_TITLE,
  subtitle: 'QC Analyst',
  subtitleRequiredPermission: Permission.HEADING_SUBTITLE,
  defaultTab: 'my_tasks',
  tabs: [
    {
      id: 'my_tasks',
      label: 'My Tasks',
      requiredPermission: Permission.TAB_MY_TASKS,
      filters: [FILTER_APPLICANT_NAME, FILTER_ID],
      columns: withColumnAction(Q_ANALYST_COLUMNS, 'qcAnalyst', 'claim'),
      actions: [ACTION_CLEAR_FILTERS]
    },
    {
      id: 'unassigned',
      label: 'Unassigned',
      requiredPermission: Permission.TAB_UNASSIGNED,
      filters: [FILTER_APPLICANT_NAME, FILTER_ID],
      columns: withColumnAction(Q_ANALYST_COLUMNS, 'qcAnalyst', 'assign_to_me'),
      selectable: true,
      actions: [ACTION_CLEAR_FILTERS]
    }
  ],
  actions: [ACTION_CLAIM, ACTION_ASSIGN_TO_ME]
}
