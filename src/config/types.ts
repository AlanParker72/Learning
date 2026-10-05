import type { Permission } from '../rbac/permissions'
import type { DashboardTableRow } from '../types/workflow'

/** UI control type — DashboardFilters renders by this, not by filter id. */
export type FilterFieldType =
  | 'text'
  | 'select'
  | 'date'
  | 'dateRangePreset'
  | 'dateRangePill'

/** Apply / clear live on the filter def — not separate ACTION_* grants. */
export type FilterControl = 'apply' | 'clear'

/** How DashboardFilters renders the filter before/while editing. */
export type FilterPresentation = 'chip' | 'inline'

/**
 * Table column mapping — listed on a tab ⇒ visible.
 * No COLUMN_* permission gate; visibility is the role tab’s `columns` array.
 */
export type ColumnDef = {
  id: string
  /** Column header label shown in the table. */
  header: string
  /** Key on the flat mapped row (`DashboardTableRow` / mapper output). */
  field: keyof DashboardTableRow | string
  width?: number | string
  /** Optional row action rendered in this column (e.g. Claim). */
  actionId?: string
}

export type ActionPlacement = 'row' | 'bulk' | 'header' | 'filterBar'

export type ActionDef = {
  id: string
  label: string
  requiredPermission?: Permission
  placement: ActionPlacement
}

export type FilterDef = {
  id: string
  label: string
  type: FilterFieldType
  placeholder?: string
  options?: readonly { value: string; label: string }[]
  requiredPermission?: Permission
  /**
   * For `dateRangePill`: which applied filter keys hold the range.
   * Defaults to `{ start: 'startDate', end: 'endDate' }`.
   */
  rangeKeys?: { start: string; end: string }
  /** Optional initial value when the tab/role hydrates filters. */
  defaultValue?: string
  /**
   * `chip` = collapsed label until expand; `inline` = always-visible control.
   * Defaults to `inline`.
   */
  presentation?: FilterPresentation
  /** When true, chip expands to the input + filter-owned controls on click. */
  expandOnClick?: boolean
  /**
   * Filter-owned actions (apply arrow, clear X). Do not require ACTION_APPLY /
   * ACTION_CLEAR on the role/tab for these.
   */
  controls?: readonly FilterControl[]
}

export type TabDef = {
  id: string
  label: string
  /** Permission that must be in the role’s array for this tab to appear. */
  requiredPermission: Permission
  columns: ColumnDef[]
  /**
   * Filter permission ids for this tab only (not full FilterDef objects).
   * Runtime: `tab.filterPermissions ∩ role.permissions` → resolve from filter catalog.
   */
  filterPermissions: Permission[]
  /**
   * Standalone action permission ids (Claim, Assign, Clear All, bulk select, …).
   * Merged with role-level `DashboardConfig.actionPermissions` (tab wins on same action id).
   * Apply/clear for a filter live on the FilterDef (`controls`), not here.
   */
  actionPermissions?: Permission[]
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
   * Role-wide action permission ids (header / row). Merged with each tab’s
   * `actionPermissions`; tab wins on the same action id.
   */
  actionPermissions?: Permission[]
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
