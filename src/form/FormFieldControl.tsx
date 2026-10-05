import {
  MenuItem,
  TextField,
  type TextFieldProps
} from '@mui/material'
import type { FormFieldConfig } from './types'

export type FormFieldControlProps = {
  field: FormFieldConfig
  value: string
  onChange: (value: string) => void
  /** Validation message from form-config `validations` (or apply-time check). */
  error?: string | null
  disabled?: boolean
  /** Override TextField size / sx when the bar needs a tighter control. */
  textFieldProps?: Partial<TextFieldProps>
}

/**
 * Shared control renderer driven by form-config `inputType` (+ options / label /
 * placeholder / validations appearance). Used by FilterBar when a chip expands
 * and for always-inline fields.
 *
 * TODO: replace with company DSP field renderer when `@dsp` is available.
 */
export function FormFieldControl({
  field,
  value,
  onChange,
  error,
  disabled,
  textFieldProps
}: FormFieldControlProps) {
  const common: Partial<TextFieldProps> = {
    size: 'small',
    label: field.label,
    placeholder: field.placeholder,
    value,
    disabled,
    error: Boolean(error),
    helperText: error || undefined,
    ...textFieldProps
  }

  if (field.inputType === 'select' || field.inputType === 'dateRangePreset') {
    return (
      <TextField
        {...common}
        select
        onChange={(e) => onChange(e.target.value)}
        sx={{ minWidth: 180, ...textFieldProps?.sx }}
      >
        {(field.options ?? []).map((opt) => (
          <MenuItem key={opt.value || 'all'} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    )
  }

  if (field.inputType === 'date') {
    return (
      <TextField
        {...common}
        type="date"
        onChange={(e) => onChange(e.target.value)}
        InputLabelProps={{ shrink: true, ...textFieldProps?.InputLabelProps }}
        sx={{ minWidth: 160, ...textFieldProps?.sx }}
      />
    )
  }

  // text (default) — and any unknown inputType falls back to text
  return (
    <TextField
      {...common}
      type="text"
      onChange={(e) => onChange(e.target.value)}
      sx={{ minWidth: 200, ...textFieldProps?.sx }}
    />
  )
}

/**
 * Lightweight apply-time validation from form-config `validations`.
 * DSP will own this later; stub covers required / maxLength / pattern.
 */
export function validateFormField(
  field: FormFieldConfig,
  value: string
): string | null {
  const rules = field.validations ?? {}
  if (rules.required && !String(value ?? '').trim()) {
    return `${field.label} is required`
  }
  if (
    typeof rules.maxLength === 'number' &&
    String(value ?? '').length > rules.maxLength
  ) {
    return `${field.label} must be at most ${rules.maxLength} characters`
  }
  if (typeof rules.pattern === 'string' && value) {
    try {
      if (!new RegExp(rules.pattern).test(value)) {
        return `${field.label} is invalid`
      }
    } catch {
      // ignore bad pattern in stub config
    }
  }
  return null
}
