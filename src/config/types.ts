import type { Permission } from '../rbac/permissions'
import type { DashboardTableRow } from '../types/workflow'

export type FilterFieldType = 'text' | 'select' | 'date'

/**
 * Table column mapping (label + data field) lives in each role’s dashboard config.
 * Visibility is gated by `requiredPermission` (`COLUMN_*`) granted in the same role file.
 */
export type ColumnDef = {
  id: string
  /** Column header label shown in the table. */
  header: string
  /** Key on the flat mapped row (`DashboardTableRow` / mapper output). */
  field: keyof DashboardTableRow | string
  width?: number | string
  /** Must be granted in the role’s permission file for this column to appear. */
  requiredPermission: Permission
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
  /**
   * Filters for this tab only. Prefer this over a role-wide list when tabs differ.
   * When omitted, the shell falls back to `DashboardConfig.filters`.
   */
  filters?: FilterDef[]
  selectable?: boolean
}

export type DashboardConfig = {
  title: string
  /** Permission that gates the page title. */
  titleRequiredPermission?: Permission
  subtitle?: string
  /** Permission that gates the subtitle. */
  subtitleRequiredPermission?: Permission
  defaultTab: string
  tabs: TabDef[]
  /**
   * Optional role-level filters used when the active tab has no `filters` array.
   * Prefer per-tab `filters` when tabs need different controls.
   */
  filters?: FilterDef[]
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
