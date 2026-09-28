import type { Permission } from '../rbac/permissions'

/**
 * Minimal config shapes for the RBAC filtering pattern.
 * Extend later when real tabs/actions land from product.
 */

export type TabDef = {
  id: string
  label: string
  /** When set, tab is only shown if `can(requiredPermission)`. */
  requiredPermission?: Permission
}

export type DashboardConfig = {
  title: string
  tabs: TabDef[]
}

/** Placeholder response — replace when the API contract lands. */
export type DashboardDataResponse = {
  role: string
  tab: string
  rows: unknown[]
  total: number
}

export type DashboardFilters = Record<string, string>
