import { Permission } from '../permissions'

/**
 * O_MANAGER — Onboarding manager.
 * Same tab/action set as Q_MANAGER; domain comes from requestGroup, not extra perms.
 * Grant/revoke UI pieces by adding/removing Permission.* entries below.
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
  Permission.COLUMN_QC_ANALYST,
  Permission.COLUMN_BANKER,

  // Actions
  Permission.ACTION_ASSIGN_RECORDS
] as const satisfies readonly Permission[]
