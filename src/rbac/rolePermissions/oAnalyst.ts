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
  COL_OBS_ANALYST,
  COL_REVIEW_STATUS,
  withColumnAction
} from '../catalog/columns'
import { FILTER_APPLICANT_NAME, FILTER_ID } from '../catalog/filters'
import { Permission } from '../permissions'

/**
 * O_ANALYST — Onboarding analyst.
 * This file owns both the permission list and this role’s dashboard config.
 * Domain (ONBOARDING) comes from requestGroup mapping, not extra permissions.
 */

export const O_ANALYST_PERMISSIONS = [
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
  Permission.COLUMN_OBS_ANALYST,
  Permission.COLUMN_BANKER,

  // Actions
  Permission.ACTION_CLAIM,
  Permission.ACTION_ASSIGN_TO_ME,
  Permission.ACTION_CLEAR_FILTERS
] as const satisfies readonly Permission[]

const O_ANALYST_COLUMNS = [
  COL_ID,
  COL_APPLICANT,
  COL_DAYS_IN_QUEUE,
  COL_DAYS_IN_REVIEW,
  COL_REVIEW_STATUS,
  COL_OBS_ANALYST,
  COL_BANKER
]

export const O_ANALYST_DASHBOARD: DashboardConfig = {
  title: 'Onboarding Requests',
  titleRequiredPermission: Permission.HEADING_TITLE,
  subtitle: 'OBS Analyst',
  subtitleRequiredPermission: Permission.HEADING_SUBTITLE,
  defaultTab: 'my_tasks',
  tabs: [
    {
      id: 'my_tasks',
      label: 'My Tasks',
      requiredPermission: Permission.TAB_MY_TASKS,
      filters: [FILTER_APPLICANT_NAME, FILTER_ID],
      columns: withColumnAction(O_ANALYST_COLUMNS, 'obsAnalyst', 'claim'),
      actions: [ACTION_CLEAR_FILTERS]
    },
    {
      id: 'unassigned',
      label: 'Unassigned',
      requiredPermission: Permission.TAB_UNASSIGNED,
      filters: [FILTER_APPLICANT_NAME, FILTER_ID],
      columns: withColumnAction(O_ANALYST_COLUMNS, 'obsAnalyst', 'assign_to_me'),
      selectable: true,
      actions: [ACTION_CLEAR_FILTERS]
    }
  ],
  actions: [ACTION_CLAIM, ACTION_ASSIGN_TO_ME]
}
