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

/** Custom Range / Last N days dropdown (Completed-style). */
export const FILTER_DATE_RANGE_PRESET: FilterDef = {
  id: 'dateRangePreset',
  label: 'Custom Range',
  type: 'dateRangePreset',
  requiredPermission: Permission.FILTER_DATE_RANGE_PRESET,
  options: [
    { value: 'custom', label: 'Custom Range' },
    { value: 'last_7', label: 'Last 7 days' },
    { value: 'last_30', label: 'Last 30 days' },
    { value: 'this_month', label: 'This month' }
  ]
}

export const FILTER_START_DATE: FilterDef = {
  id: 'startDate',
  label: 'Start Date',
  type: 'date',
  requiredPermission: Permission.FILTER_START_DATE
}

export const FILTER_END_DATE: FilterDef = {
  id: 'endDate',
  label: 'End Date',
  type: 'date',
  requiredPermission: Permission.FILTER_END_DATE
}

/**
 * Active applied date-range chip with dismiss.
 * Reads/writes `startDate` + `endDate` via `rangeKeys` (not its own value key).
 */
export const FILTER_DATE_RANGE_PILL: FilterDef = {
  id: 'dateRangePill',
  label: 'Date range',
  type: 'dateRangePill',
  requiredPermission: Permission.FILTER_DATE_RANGE_PILL,
  rangeKeys: { start: 'startDate', end: 'endDate' }
}

/** Menu of every known filter — for reference / picking, not a shared role list. */
export const ALL_FILTERS: readonly FilterDef[] = [
  FILTER_APPLICANT_NAME,
  FILTER_ID,
  FILTER_DATE_RANGE_PRESET,
  FILTER_START_DATE,
  FILTER_END_DATE,
  FILTER_DATE_RANGE_PILL
]
