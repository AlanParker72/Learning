/**
 * Capability strings checked by the UI via `can()` / `<Can />`.
 * Prefer these over `role === …` in presentational components.
 */
export const Permission = {
  DASHBOARD_VIEW: 'dashboard.view',

  TAB_UNASSIGNED: 'dashboard.tab.unassigned',
  TAB_TEAM_WORK: 'dashboard.tab.team_work',
  TAB_TEAM_TASKS: 'dashboard.tab.team_tasks',
  TAB_MY_TASKS: 'dashboard.tab.my_tasks',
  TAB_COMPLETED: 'dashboard.tab.completed',

  FILTER_NAME: 'dashboard.filter.name',
  FILTER_ID: 'dashboard.filter.id',
  FILTER_STATUS: 'dashboard.filter.status',
  FILTER_DATE_RANGE: 'dashboard.filter.date_range',

  ACTION_REASSIGN: 'dashboard.action.reassign',
  ACTION_ASSIGN_TO_ME: 'dashboard.action.assign_to_me',
  ACTION_BULK_ASSIGN: 'dashboard.action.bulk_assign',
  ACTION_ASSIGN_RECORDS: 'dashboard.action.assign_records',

  WIDGET_METRICS: 'dashboard.widget.metrics',
  WIDGET_CHART: 'dashboard.widget.chart',
  WIDGET_TABLE: 'dashboard.widget.table'
} as const

export type Permission = (typeof Permission)[keyof typeof Permission]
