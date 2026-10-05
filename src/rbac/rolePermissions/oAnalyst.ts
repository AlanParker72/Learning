import { Permission } from '../permissions'

/**
 * O_ANALYST — Onboarding analyst.
 * Same tab/action set as Q_ANALYST; domain comes from requestGroup, not extra perms.
 * Grant/revoke UI pieces by adding/removing Permission.* entries below.
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
  Permission.COLUMN_QC_ANALYST,
  Permission.COLUMN_BANKER,

  // Actions
  Permission.ACTION_CLAIM,
  Permission.ACTION_ASSIGN_TO_ME
] as const satisfies readonly Permission[]
