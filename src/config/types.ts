import type { Permission } from '../rbac/permissions'
import type { DashboardTableRow } from '../types/workflow'

export type FilterFieldType = 'text' | 'select' | 'date'

export type ColumnDef = {
  id: string
  label: string
  /** Field key on `DashboardTableRow`; defaults to `id`. */
  field?: keyof DashboardTableRow | string
  width?: number | string
  requiredPermission?: Permission
  /** Optional row action rendered in this column (e.g. Claim). */
  actionId?: string
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

export type TabDef = {
  id: string
  label: string
  /** Permission that must be in the role’s array for this tab to appear. */
  requiredPermission: Permission
  columns: ColumnDef[]
  selectable?: boolean
}

export type DashboardConfig = {
  title: string
  subtitle?: string
  defaultTab: string
  tabs: TabDef[]
  filters: FilterDef[]
  actions: ActionDef[]
}

export type DashboardFilters = Record<string, string>

export type DashboardDataResponse = {
  role: string
  tab: string
  rows: DashboardTableRow[]
  total: number
  /** Optional badge counts per tab id (mock provides all; real may only fill active). */
  tabCounts?: Record<string, number>
}
