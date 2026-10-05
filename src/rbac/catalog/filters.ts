import { Permission } from '../permissions'
import type { FilterDef } from '../../config/types'

function currentMonthRangeDefault(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0)
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  return `${iso(start)}|${iso(end)}`
}

/**
 * Catalog of all filter defs keyed by permission.
 * Tabs list permission ids only; runtime intersects with role.permissions and resolves here.
 * Apply/clear live on the def (`controls`) — no separate bundles / ACTION_APPLY grants.
 */
export const FILTER_APPLICANT_NAME: FilterDef = {
  id: 'applicantName',
  label: 'Applicant Name',
  type: 'text',
  placeholder: 'Search by Applicant Name',
  requiredPermission: Permission.FILTER_APPLICANT_NAME,
  presentation: 'inline'
}

/** Inline ID# (Unassigned-style). */
export const FILTER_ID: FilterDef = {
  id: 'id',
  label: 'ID#',
  type: 'text',
  placeholder: 'Search by ID#',
  requiredPermission: Permission.FILTER_ID,
  presentation: 'inline'
}

/**
 * Chip “ID Number” — closed: search icon + label; click expands to text field
 * + apply (arrow) + clear (X). Same store key (`id`) as FILTER_ID.
 * Inline filters (Applicant Name, ID#) stay always-visible — not this pattern.
 */
export const FILTER_ID_NUMBER: FilterDef = {
  id: 'id',
  label: 'ID Number',
  type: 'text',
  placeholder: 'Search by ID Number',
  requiredPermission: Permission.FILTER_ID_NUMBER,
  presentation: 'chip',
  expandOnClick: true,
  controls: ['apply', 'clear']
}

export const FILTER_STATUS: FilterDef = {
  id: 'status',
  label: 'Status',
  type: 'select',
  requiredPermission: Permission.FILTER_STATUS,
  presentation: 'inline',
  defaultValue: '',
  options: [
    { value: '', label: 'All' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Review', label: 'In Review' },
    { value: 'Completed', label: 'Completed' }
  ]
}

/**
 * Custom Range / Last N days dropdown (Completed-style).
 * `defaultValue` sets the select only — applied start/end come from Apply
 * (controls on FILTER_END_DATE) or from FILTER_DATE_RANGE_PILL (O), not from this preset alone.
 */
export const FILTER_DATE_RANGE_PRESET: FilterDef = {
  id: 'dateRangePreset',
  label: 'Custom Range',
  type: 'dateRangePreset',
  requiredPermission: Permission.FILTER_DATE_RANGE_PRESET,
  presentation: 'inline',
  defaultValue: 'this_month',
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
  requiredPermission: Permission.FILTER_START_DATE,
  presentation: 'inline'
}

/** End date owns apply/clear for the Q Completed date draft group. */
export const FILTER_END_DATE: FilterDef = {
  id: 'endDate',
  label: 'End Date',
  type: 'date',
  requiredPermission: Permission.FILTER_END_DATE,
  presentation: 'inline',
  controls: ['apply', 'clear']
}

/**
 * Active applied date-range chip with dismiss.
 * Reads/writes `startDate` + `endDate` via `rangeKeys` (not its own value key).
 * O_MANAGER Completed only — defaults to the current calendar month.
 */
export const FILTER_DATE_RANGE_PILL: FilterDef = {
  id: 'dateRangePill',
  label: 'Date range',
  type: 'dateRangePill',
  requiredPermission: Permission.FILTER_DATE_RANGE_PILL,
  presentation: 'chip',
  rangeKeys: { start: 'startDate', end: 'endDate' },
  defaultValue: currentMonthRangeDefault()
}

/** Permission → filter UI metadata. */
export const FILTER_BY_PERMISSION: Partial<Record<Permission, FilterDef>> = {
  [Permission.FILTER_APPLICANT_NAME]: FILTER_APPLICANT_NAME,
  [Permission.FILTER_ID]: FILTER_ID,
  [Permission.FILTER_ID_NUMBER]: FILTER_ID_NUMBER,
  [Permission.FILTER_STATUS]: FILTER_STATUS,
  [Permission.FILTER_DATE_RANGE_PRESET]: FILTER_DATE_RANGE_PRESET,
  [Permission.FILTER_START_DATE]: FILTER_START_DATE,
  [Permission.FILTER_END_DATE]: FILTER_END_DATE,
  [Permission.FILTER_DATE_RANGE_PILL]: FILTER_DATE_RANGE_PILL
}

/** Menu of every known filter — for reference / picking, not a shared role list. */
export const ALL_FILTERS: readonly FilterDef[] = [
  FILTER_APPLICANT_NAME,
  FILTER_ID,
  FILTER_ID_NUMBER,
  FILTER_STATUS,
  FILTER_DATE_RANGE_PRESET,
  FILTER_START_DATE,
  FILTER_END_DATE,
  FILTER_DATE_RANGE_PILL
]
