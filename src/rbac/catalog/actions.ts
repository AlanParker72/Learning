import { Permission } from '../permissions'
import type { ActionDef } from '../../config/types'

/**
 * Catalog of all possible action defs.
 * Roles pick from these (or define inline) — nothing here is wired to every role.
 */
export const ACTION_ASSIGN_RECORDS: ActionDef = {
  id: 'assign_records',
  label: 'Assign Records',
  placement: 'header',
  requiredPermission: Permission.ACTION_ASSIGN_RECORDS
}

export const ACTION_CLAIM: ActionDef = {
  id: 'claim',
  label: 'Claim',
  placement: 'row',
  requiredPermission: Permission.ACTION_CLAIM
}

export const ACTION_ASSIGN_TO_ME: ActionDef = {
  id: 'assign_to_me',
  label: 'Assign to Me',
  placement: 'row',
  requiredPermission: Permission.ACTION_ASSIGN_TO_ME
}

/** Apply draft start/end (and preset) into the query filters. */
export const ACTION_APPLY_DATE_FILTER: ActionDef = {
  id: 'apply_date_filter',
  label: 'Apply',
  placement: 'filterBar',
  requiredPermission: Permission.ACTION_APPLY_DATE_FILTER
}

/** Clear filters for the active tab (label may be “Clear” or “Clear All”). */
export const ACTION_CLEAR_FILTERS: ActionDef = {
  id: 'clear_filters',
  label: 'Clear filters',
  placement: 'filterBar',
  requiredPermission: Permission.ACTION_CLEAR_FILTERS
}

export const ACTION_CLEAR_ALL_FILTERS: ActionDef = {
  id: 'clear_filters',
  label: 'Clear All',
  placement: 'filterBar',
  requiredPermission: Permission.ACTION_CLEAR_FILTERS
}

/** Enables bulk row selection when present on the tab/role actions. */
export const ACTION_BULK_SELECT: ActionDef = {
  id: 'bulk_select',
  label: 'Bulk select',
  placement: 'bulk',
  requiredPermission: Permission.ACTION_BULK_SELECT
}

/** Menu of every known action — for reference / picking, not a shared role list. */
export const ALL_ACTIONS: readonly ActionDef[] = [
  ACTION_ASSIGN_RECORDS,
  ACTION_CLAIM,
  ACTION_ASSIGN_TO_ME,
  ACTION_APPLY_DATE_FILTER,
  ACTION_CLEAR_FILTERS,
  ACTION_CLEAR_ALL_FILTERS,
  ACTION_BULK_SELECT
]
