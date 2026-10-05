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

/** Menu of every known action — for reference / picking, not a shared role list. */
export const ALL_ACTIONS: readonly ActionDef[] = [
  ACTION_ASSIGN_RECORDS,
  ACTION_CLAIM,
  ACTION_ASSIGN_TO_ME
]
