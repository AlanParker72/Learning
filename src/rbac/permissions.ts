/**
 * Capability strings checked via `can()` / `<Can />`.
 * Prefer these over `role === …` in presentational components.
 *
 * Every UI piece (tab, filter, heading, column, action) has its own constant.
 * Grant by adding that constant to the role’s file under `rolePermissions/`.
 */
export const Permission = {
  DASHBOARD_VIEW: 'dashboard.view',

  /** Page heading / title */
  HEADING_TITLE: 'dashboard.heading.title',
  HEADING_SUBTITLE: 'dashboard.heading.subtitle',

  TAB_UNASSIGNED: 'dashboard.tab.unassigned',
  TAB_TEAM_TASKS: 'dashboard.tab.team_tasks',
  TAB_MY_TASKS: 'dashboard.tab.my_tasks',
  TAB_COMPLETED: 'dashboard.tab.completed',

  FILTER_APPLICANT_NAME: 'dashboard.filter.applicant_name',
  FILTER_ID: 'dashboard.filter.id',
  FILTER_DATE_RANGE_PRESET: 'dashboard.filter.date_range_preset',
  FILTER_START_DATE: 'dashboard.filter.start_date',
  FILTER_END_DATE: 'dashboard.filter.end_date',
  FILTER_DATE_RANGE_PILL: 'dashboard.filter.date_range_pill',

  /** Column visibility only — header/field mapping lives in each role’s dashboard config. */
  COLUMN_ID: 'dashboard.column.id',
  COLUMN_APPLICANT: 'dashboard.column.applicant',
  COLUMN_DAYS_IN_QUEUE: 'dashboard.column.days_in_queue',
  COLUMN_DAYS_IN_REVIEW: 'dashboard.column.days_in_review',
  COLUMN_DATE_COMPLETED: 'dashboard.column.date_completed',
  COLUMN_REVIEW_STATUS: 'dashboard.column.review_status',
  /** O_* roles — maps to field `obsAnalyst` in O column catalog. */
  COLUMN_OBS_ANALYST: 'dashboard.column.obs_analyst',
  /** Q_* roles — maps to field `qcAnalyst` in Q column catalog. */
  COLUMN_QC_ANALYST: 'dashboard.column.qc_analyst',
  COLUMN_BANKER: 'dashboard.column.banker',

  ACTION_CLAIM: 'dashboard.action.claim',
  ACTION_ASSIGN_TO_ME: 'dashboard.action.assign_to_me',
  ACTION_ASSIGN_RECORDS: 'dashboard.action.assign_records',
  ACTION_CLEAR_FILTERS: 'dashboard.action.clear_filters',
  ACTION_APPLY_DATE_FILTER: 'dashboard.action.apply_date_filter',
  ACTION_BULK_SELECT: 'dashboard.action.bulk_select',

  WIDGET_TABLE: 'dashboard.widget.table'
} as const

/** Alias matching handoff / grant examples (`PERMISSIONS.FILTER_ID`). */
export const PERMISSIONS = Permission

export type Permission = (typeof Permission)[keyof typeof Permission]

/**
 * Tab id → permission that gates visibility (UI + mock data).
 * Adding a tab: add a `TAB_*` constant here, map the id, grant in a role file, add config entry.
 */
export const TAB_REQUIRED_PERMISSION = {
  unassigned: Permission.TAB_UNASSIGNED,
  team_tasks: Permission.TAB_TEAM_TASKS,
  my_tasks: Permission.TAB_MY_TASKS,
  completed: Permission.TAB_COMPLETED
} as const

export type DashboardTabId = keyof typeof TAB_REQUIRED_PERMISSION

export function isDashboardTabId(value: string): value is DashboardTabId {
  return value in TAB_REQUIRED_PERMISSION
}
