import { Permission } from '../../rbac/permissions'
import type { FormConfig, FormFieldConfig } from '../types'

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
 * Base JSON-shaped field catalog for dashboard filters.
 * Tab/role RBAC selects which keys appear via `filterPermissions` → field keys
 * (`FORM_FIELD_KEY_BY_PERMISSION` + `pickFormFields`).
 *
 * Shape matches company DSP form JSON (`label`, `inputType`, `options`, `validations`).
 * Extra keys (`presentation`, `controls`, `name`) support our filter UX until DSP lands.
 */
export const DASHBOARD_FORM_FIELDS = {
  /**
   * Search-style text — closed chip (search icon + label), expands to text +
   * apply/clear. Prefer chip/expand for search fields (hybrid filter bar).
   */
  applicantName: {
    label: 'Applicant Name',
    inputType: 'text',
    name: 'applicantName',
    placeholder: 'Search by Applicant Name',
    validations: {},
    presentation: 'chip',
    expandOnClick: true,
    controls: ['apply', 'clear'],
    requiredPermission: Permission.FILTER_APPLICANT_NAME
  },
  id: {
    label: 'ID#',
    inputType: 'text',
    name: 'id',
    placeholder: 'Search by ID#',
    validations: {},
    presentation: 'chip',
    expandOnClick: true,
    controls: ['apply', 'clear'],
    requiredPermission: Permission.FILTER_ID
  },
  /** Chip variant — same store key `id` as `id`, different label. */
  idNumber: {
    label: 'ID Number',
    inputType: 'text',
    name: 'id',
    placeholder: 'Search by ID Number',
    validations: {},
    presentation: 'chip',
    expandOnClick: true,
    controls: ['apply', 'clear'],
    requiredPermission: Permission.FILTER_ID_NUMBER
  },
  /**
   * Status — closed chip trigger (label); expands to select from `options`.
   * Select commits on change (no apply control).
   */
  status: {
    label: 'Status',
    inputType: 'select',
    name: 'status',
    validations: {},
    presentation: 'chip',
    expandOnClick: true,
    controls: ['clear'],
    defaultValue: '',
    options: [
      { value: '', label: 'All' },
      { value: 'Pending', label: 'Pending' },
      { value: 'In Review', label: 'In Review' },
      { value: 'Completed', label: 'Completed' }
    ],
    requiredPermission: Permission.FILTER_STATUS
  },
  dateRangePreset: {
    label: 'Custom Range',
    inputType: 'dateRangePreset',
    name: 'dateRangePreset',
    validations: {},
    presentation: 'inline',
    defaultValue: 'this_month',
    options: [
      { value: 'custom', label: 'Custom Range' },
      { value: 'last_7', label: 'Last 7 days' },
      { value: 'last_30', label: 'Last 30 days' },
      { value: 'this_month', label: 'This month' }
    ],
    requiredPermission: Permission.FILTER_DATE_RANGE_PRESET
  },
  startDate: {
    label: 'Start Date',
    inputType: 'date',
    name: 'startDate',
    validations: {},
    presentation: 'inline',
    requiredPermission: Permission.FILTER_START_DATE
  },
  endDate: {
    label: 'End Date',
    inputType: 'date',
    name: 'endDate',
    validations: {},
    presentation: 'inline',
    controls: ['apply', 'clear'],
    requiredPermission: Permission.FILTER_END_DATE
  },
  dateRangePill: {
    label: 'Date range',
    inputType: 'dateRangePill',
    name: 'dateRangePill',
    validations: {},
    presentation: 'chip',
    rangeKeys: { start: 'startDate', end: 'endDate' },
    defaultValue: currentMonthRangeDefault(),
    requiredPermission: Permission.FILTER_DATE_RANGE_PILL
  }
} as const satisfies Record<string, FormFieldConfig>

export type DashboardFormFieldKey = keyof typeof DASHBOARD_FORM_FIELDS

/** Permission → catalog field key (aligns tab `filterPermissions` with form fields). */
export const FORM_FIELD_KEY_BY_PERMISSION: Partial<
  Record<Permission, DashboardFormFieldKey>
> = {
  [Permission.FILTER_APPLICANT_NAME]: 'applicantName',
  [Permission.FILTER_ID]: 'id',
  [Permission.FILTER_ID_NUMBER]: 'idNumber',
  [Permission.FILTER_STATUS]: 'status',
  [Permission.FILTER_DATE_RANGE_PRESET]: 'dateRangePreset',
  [Permission.FILTER_START_DATE]: 'startDate',
  [Permission.FILTER_END_DATE]: 'endDate',
  [Permission.FILTER_DATE_RANGE_PILL]: 'dateRangePill'
}

/** Full dashboard form config (all fields). Prefer `pickFormFields` for RBAC subsets. */
export const dashboardFormConfig: FormConfig = {
  fields: { ...DASHBOARD_FORM_FIELDS }
}

/**
 * Build a FormConfig containing only the given catalog keys (order preserved).
 * Used after `filterPermissions ∩ role` resolves which filters are visible.
 */
export function pickFormFields(
  keys: readonly DashboardFormFieldKey[]
): FormConfig {
  const fields: Record<string, FormFieldConfig> = {}
  for (const key of keys) {
    const def = DASHBOARD_FORM_FIELDS[key]
    if (def) fields[key] = def
  }
  return { fields }
}

/**
 * `tab.filterPermissions ∩ role.permissions` → form field keys → FormConfig.
 */
export function resolveFormConfigForTab(
  rolePermissions: ReadonlySet<Permission> | readonly Permission[],
  filterPermissions: readonly Permission[]
): FormConfig {
  const granted =
    rolePermissions instanceof Set
      ? rolePermissions
      : new Set<Permission>(rolePermissions)
  const keys: DashboardFormFieldKey[] = []
  for (const p of filterPermissions) {
    if (!granted.has(p)) continue
    const key = FORM_FIELD_KEY_BY_PERMISSION[p]
    if (key) keys.push(key)
  }
  return pickFormFields(keys)
}

/** Default filter values from a form config (dateRangePill expands to start/end). */
export function initialValuesFromFormConfig(config: FormConfig): Record<string, string> {
  const next: Record<string, string> = {}
  for (const field of Object.values(config.fields) as FormFieldConfig[]) {
    if (field.inputType === 'dateRangePill') {
      const keys = field.rangeKeys ?? { start: 'startDate', end: 'endDate' }
      const raw = field.defaultValue ?? ''
      if (raw.includes('|')) {
        const [start, end] = raw.split('|')
        if (start) next[keys.start] = start
        if (end) next[keys.end] = end
      }
      continue
    }
    if (field.defaultValue != null && field.defaultValue !== '') {
      next[field.name] = field.defaultValue
    }
  }
  return next
}
