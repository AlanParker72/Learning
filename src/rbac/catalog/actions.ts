import { Permission } from '../permissions'
import type { ActionDef } from '../../config/types'

/**
 * Catalog of standalone action defs keyed by permission.
 * Apply/clear for a filter live on FilterDef.controls — not here.
 */
export const ACTION_ASSIGN_RECORDS: ActionDef = {
  id: 'assign_records',
  label: 'Assign Records',
  placement: 'header',
  requiredPermission: Permission.ACTION_ASSIGN_RECORDS
}

export const ACTION_REASSIGN: ActionDef = {
  id: 'reassign',
  label: 'Reassign',
  placement: 'header',
  requiredPermission: Permission.ACTION_REASSIGN
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

/** Global clear of all filter values (O_MANAGER-style “Clear All”). */
export const ACTION_CLEAR_ALL_FILTERS: ActionDef = {
  id: 'clear_filters',
  label: 'Clear All',
  placement: 'filterBar',
  requiredPermission: Permission.ACTION_CLEAR_ALL_FILTERS
}

/** Enables bulk row selection when present on the tab/role actions. */
export const ACTION_BULK_SELECT: ActionDef = {
  id: 'bulk_select',
  label: 'Bulk select',
  placement: 'bulk',
  requiredPermission: Permission.ACTION_BULK_SELECT
}

/** Permission → action UI metadata. */
export const ACTION_BY_PERMISSION: Partial<Record<Permission, ActionDef>> = {
  [Permission.ACTION_ASSIGN_RECORDS]: ACTION_ASSIGN_RECORDS,
  [Permission.ACTION_REASSIGN]: ACTION_REASSIGN,
  [Permission.ACTION_CLAIM]: ACTION_CLAIM,
  [Permission.ACTION_ASSIGN_TO_ME]: ACTION_ASSIGN_TO_ME,
  [Permission.ACTION_CLEAR_ALL_FILTERS]: ACTION_CLEAR_ALL_FILTERS,
  [Permission.ACTION_BULK_SELECT]: ACTION_BULK_SELECT
}

/** Menu of every known action — for reference / picking, not a shared role list. */
export const ALL_ACTIONS: readonly ActionDef[] = [
  ACTION_ASSIGN_RECORDS,
  ACTION_REASSIGN,
  ACTION_CLAIM,
  ACTION_ASSIGN_TO_ME,
  ACTION_CLEAR_ALL_FILTERS,
  ACTION_BULK_SELECT
]
