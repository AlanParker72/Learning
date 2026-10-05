import type { Permission } from '../rbac/permissions'

/**
 * Form field shape mirrors company DSP / JSON form configs.
 * Swap `useFormConfig` + `Fields` for the real `@dsp` (or company) form lib when available.
 */

export type FormInputType =
  | 'text'
  | 'select'
  | 'date'
  | 'dateRangePreset'
  | 'dateRangePill'

export type FormFieldPresentation = 'chip' | 'inline'
export type FormFieldControl = 'apply' | 'clear'

export type FormFieldOption = {
  value: string
  label: string
}

/**
 * One field in the JSON-shaped catalog.
 * `name` is the Zustand / API filter key written on change.
 * Catalog object keys may differ when two UIs share a name (e.g. id vs idNumber).
 */
export type FormFieldConfig = {
  label: string
  inputType: FormInputType
  /** Store / request key for this control’s value. */
  name: string
  placeholder?: string
  options?: readonly FormFieldOption[]
  /**
   * DSP-style validation map. Stub FilterBar uses `required` / `maxLength` /
   * `pattern` on chip apply; full schema lands with the real form lib.
   */
  validations?: Record<string, unknown>
  /**
   * `chip` = closed trigger → expand to FormFieldControl;
   * `inline` = always-visible control (dates, presets).
   */
  presentation?: FormFieldPresentation
  /** When true (default for chip), click expands the closed trigger. */
  expandOnClick?: boolean
  /** Per-field apply/clear icons when the expanded control should own them. */
  controls?: readonly FormFieldControl[]
  defaultValue?: string
  rangeKeys?: { start: string; end: string }
  requiredPermission?: Permission
}

export type FormConfig = {
  fields: Record<string, FormFieldConfig>
}

export type FormValues = Record<string, string>

export type UseFormConfigOptions = {
  mode?: 'onChange' | 'onSubmit'
  /** Seed values (e.g. from dashboardStore.filters). */
  defaultValues?: FormValues
  /** Called when mode is onChange and a field value commits. */
  onValuesChange?: (values: FormValues) => void
}

/**
 * Lightweight form handle — subset of DSP / react-hook-form style API.
 * Replace with company form lib return value when wiring `@dsp`.
 */
export type FormHandle = {
  values: FormValues
  getValues: () => FormValues
  setValue: (name: string, value: string) => void
  setValues: (values: FormValues) => void
  reset: (values?: FormValues) => void
  mode: 'onChange' | 'onSubmit'
}
