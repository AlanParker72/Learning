/**
 * Capability strings checked via `can()` / `<Can />`.
 * Prefer these over `role === …` in presentational components.
 *
 * Extend this inventory as real tabs/filters/actions land from product.
 */
export const Permission = {
  DASHBOARD_VIEW: 'dashboard.view',

  /** Illustrative stubs — replace ids when screenshot/API inventory arrives. */
  TAB_EXAMPLE: 'dashboard.tab.example',
  FILTER_EXAMPLE: 'dashboard.filter.example',
  ACTION_EXAMPLE: 'dashboard.action.example',
  WIDGET_TABLE: 'dashboard.widget.table'
} as const

export type Permission = (typeof Permission)[keyof typeof Permission]
