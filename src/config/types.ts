import type { Permission } from '../rbac/permissions'

export type FilterFieldType = 'text' | 'select' | 'date'

export type ColumnDef = {
  id: string
  label: string
  /** Optional field key on row payload; defaults to `id`. */
  field?: string
  width?: number | string
  /** When set, column is only shown if the user has this permission. */
  requiredPermission?: Permission
  /**
   * Render a row-level action control in this column
   * (e.g. Reassign / Assign to Me under OBS or QC Analyst).
   */
  actionId?: string
}

export type ActionDef = {
  id: string
  label: string
  requiredPermission?: Permission
  /** 'row' | 'bulk' | 'header' — where the action appears. */
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
  /** Enable checkbox selection (Q_MANAGER Assign Records). */
  selectable?: boolean
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

export type DashboardRecord = {
  id: string
  requestId: string
  name: string
  status: string
  obsAnalyst?: string | null
  qcAnalyst?: string | null
  banker?: string | null
  assignedAt?: string | null
  completedAt?: string | null
  [key: string]: unknown
}

export type DashboardMetric = {
  id: string
  label: string
  value: number | string
}

export type DashboardChartPoint = {
  name: string
  value: number
}

export type DashboardDataResponse = {
  role: string
  tab: string
  metrics: DashboardMetric[]
  chart: DashboardChartPoint[]
  rows: DashboardRecord[]
  total: number
}
