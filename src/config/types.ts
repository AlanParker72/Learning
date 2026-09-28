import type { Permission } from '../rbac/permissions'

/**
 * Skeleton config / DTO shapes.
 * Fill tabs/filters/widgets/columns/actions from product screenshots + API —
 * do not invent full UX inventories here.
 */

export type FilterFieldType = 'text' | 'select' | 'date'

export type ColumnDef = {
  id: string
  label: string
  field?: string
  /** When set, column is only shown if the user has this permission. */
  requiredPermission?: Permission
}

export type ActionDef = {
  id: string
  label: string
  requiredPermission?: Permission
  placement: 'row' | 'bulk' | 'header'
}

export type FilterDef = {
  id: string
  label: string
  type: FilterFieldType
  placeholder?: string
  options?: readonly { value: string; label: string }[]
  requiredPermission?: Permission
}

export type WidgetDef = {
  id: string
  type: 'metrics' | 'chart' | 'table'
  title?: string
  requiredPermission?: Permission
}

export type TabDef = {
  id: string
  label: string
  requiredPermission?: Permission
  columns: ColumnDef[]
}

export type DashboardConfig = {
  title: string
  subtitle?: string
  defaultTab: string
  tabs: TabDef[]
  filters: FilterDef[]
  widgets: WidgetDef[]
  actions: ActionDef[]
}

export type DashboardFilters = Record<string, string>

/** Placeholder response — replace fields when the API contract lands. */
export type DashboardDataResponse = {
  role: string
  tab: string
  rows: unknown[]
  total: number
}
