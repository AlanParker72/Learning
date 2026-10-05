import { Permission } from '../permissions'
import type { FilterDef, FilterFieldType } from '../../config/types'
import {
  DASHBOARD_FORM_FIELDS,
  FORM_FIELD_KEY_BY_PERMISSION
} from '../../form/formConfigs/dashboardFormConfig'
import type { FormFieldConfig } from '../../form/types'

/**
 * Filter catalog — UI metadata derived from the JSON-shaped form field catalog
 * (`src/form/formConfigs/dashboardFormConfig.ts`) so RBAC permission keys and
 * form field keys stay aligned.
 *
 * Tabs still list `filterPermissions` only; runtime intersects with role and
 * resolves here (and via `resolveFormConfigForTab` for the FilterBar renderer).
 */

function formFieldToFilterDef(field: FormFieldConfig): FilterDef {
  return {
    id: field.name,
    label: field.label,
    type: field.inputType as FilterFieldType,
    placeholder: field.placeholder,
    options: field.options,
    requiredPermission: field.requiredPermission,
    rangeKeys: field.rangeKeys,
    defaultValue: field.defaultValue,
    presentation: field.presentation,
    expandOnClick: field.expandOnClick,
    controls: field.controls
  }
}

function defForPermission(permission: Permission): FilterDef | undefined {
  const key = FORM_FIELD_KEY_BY_PERMISSION[permission]
  if (!key) return undefined
  return formFieldToFilterDef(DASHBOARD_FORM_FIELDS[key])
}

export const FILTER_APPLICANT_NAME = defForPermission(
  Permission.FILTER_APPLICANT_NAME
)!
export const FILTER_ID = defForPermission(Permission.FILTER_ID)!
export const FILTER_ID_NUMBER = defForPermission(Permission.FILTER_ID_NUMBER)!
export const FILTER_STATUS = defForPermission(Permission.FILTER_STATUS)!
export const FILTER_DATE_RANGE_PRESET = defForPermission(
  Permission.FILTER_DATE_RANGE_PRESET
)!
export const FILTER_START_DATE = defForPermission(Permission.FILTER_START_DATE)!
export const FILTER_END_DATE = defForPermission(Permission.FILTER_END_DATE)!
export const FILTER_DATE_RANGE_PILL = defForPermission(
  Permission.FILTER_DATE_RANGE_PILL
)!

/** Permission → filter UI metadata (backed by form catalog). */
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
