/**
 * Capability strings checked via `can()` / `<Can />`.
 * Prefer these over `role === …` in presentational components.
 */
export const Permission = {
  DASHBOARD_VIEW: 'dashboard.view',
  TAB_EXAMPLE: 'dashboard.tab.example',
  ACTION_EXAMPLE: 'dashboard.action.example'
} as const

export type Permission = (typeof Permission)[keyof typeof Permission]
