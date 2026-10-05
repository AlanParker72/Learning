import { Permission } from '../permissions'
import type { FilterDef } from '../../config/types'

/**
 * Catalog of all possible filter defs.
 * Roles pick from these (or define inline) — nothing here is wired to every role.
 */
export const FILTER_APPLICANT_NAME: FilterDef = {
  id: 'applicantName',
  label: 'Applicant Name',
  type: 'text',
  placeholder: 'Search by Applicant Name',
  requiredPermission: Permission.FILTER_APPLICANT_NAME
}

export const FILTER_ID: FilterDef = {
  id: 'id',
  label: 'ID#',
  type: 'text',
  placeholder: 'Search by ID#',
  requiredPermission: Permission.FILTER_ID
}

/** Menu of every known filter — for reference / picking, not a shared role list. */
export const ALL_FILTERS: readonly FilterDef[] = [
  FILTER_APPLICANT_NAME,
  FILTER_ID
]
