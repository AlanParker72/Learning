import { useCallback, useMemo } from 'react'
import type {
  FormConfig,
  FormHandle,
  FormValues,
  UseFormConfigOptions
} from './types'

/**
 * Stub for company DSP `useFormConfig(config, { mode })`.
 *
 * Returns `{ form, fields }` where:
 * - `form` — values + setValue / reset
 * - `fields` — field configs from the JSON-shaped FormConfig
 *
 * When `defaultValues` + `onValuesChange` are provided, the form is
 * store-controlled (dashboard filters live in Zustand — no local mirror).
 *
 * TODO: replace this module with the real `@dsp` / company form library import.
 */
export function useFormConfig(
  config: FormConfig,
  options: UseFormConfigOptions = {}
): { form: FormHandle; fields: FormConfig['fields'] } {
  const mode = options.mode ?? 'onChange'
  const values = options.defaultValues ?? {}
  const onValuesChange = options.onValuesChange

  const setValues = useCallback(
    (next: FormValues) => {
      onValuesChange?.(next)
    },
    [onValuesChange]
  )

  const setValue = useCallback(
    (name: string, value: string) => {
      onValuesChange?.({ ...values, [name]: value })
    },
    [onValuesChange, values]
  )

  const reset = useCallback(
    (next?: FormValues) => {
      onValuesChange?.(next ?? {})
    },
    [onValuesChange]
  )

  const getValues = useCallback(() => values, [values])

  const form = useMemo<FormHandle>(
    () => ({
      values,
      getValues,
      setValue,
      setValues,
      reset,
      mode
    }),
    [values, getValues, setValue, setValues, reset, mode]
  )

  return { form, fields: config.fields }
}
