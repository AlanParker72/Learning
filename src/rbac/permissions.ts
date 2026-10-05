/**
 * Capability strings checked via `can()` / `<Can />`.
 * Prefer these over `role === …` in presentational components.
 */
export const Permission = {
  DASHBOARD_VIEW: 'dashboard.view',

  TAB_UNASSIGNED: 'dashboard.tab.unassigned',
  TAB_TEAM_TASKS: 'dashboard.tab.team_tasks',
  TAB_MY_TASKS: 'dashboard.tab.my_tasks',
  TAB_COMPLETED: 'dashboard.tab.completed',
  /** Thin stub tab for O_* roles until their screenshots land. */
  TAB_OVERVIEW: 'dashboard.tab.overview',

  FILTER_APPLICANT_NAME: 'dashboard.filter.applicant_name',
  FILTER_ID: 'dashboard.filter.id',

  COLUMN_ID: 'dashboard.column.id',
  COLUMN_APPLICANT: 'dashboard.column.applicant',
  COLUMN_DAYS_IN_QUEUE: 'dashboard.column.days_in_queue',
  COLUMN_DAYS_IN_REVIEW: 'dashboard.column.days_in_review',
  COLUMN_REVIEW_STATUS: 'dashboard.column.review_status',
  COLUMN_OBS_ANALYST: 'dashboard.column.obs_analyst',
  COLUMN_QC_ANALYST: 'dashboard.column.qc_analyst',
  COLUMN_BANKER: 'dashboard.column.banker',

  ACTION_CLAIM: 'dashboard.action.claim',
  ACTION_ASSIGN_TO_ME: 'dashboard.action.assign_to_me',
  ACTION_ASSIGN_RECORDS: 'dashboard.action.assign_records',

  WIDGET_TABLE: 'dashboard.widget.table'
} as const

export type Permission = (typeof Permission)[keyof typeof Permission]
