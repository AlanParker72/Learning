import { Box } from '@mui/material'
import { type FormEvent, type ReactNode } from 'react'
import { FilterBar } from './FilterBar'
import type { ActionDef } from '../config/types'
import type { FormFieldConfig, FormHandle } from './types'

type Props = {
  /** Ordered field configs from `useFormConfig` / JSON catalog. */
  fields: Record<string, FormFieldConfig> | FormFieldConfig[]
  form: FormHandle
  /** Standalone filter-bar actions (e.g. Clear All). */
  actions?: ActionDef[]
  onAction?: (actionId: string) => void
  /** Called when Clear All runs (after form.reset). */
  onReset?: () => void
}

/**
 * Fields = FilterBar driven by form config.
 *
 * Closed: chip/trigger (icon + label from config) when `presentation: 'chip'`.
 * Open: shared FormFieldControl from `inputType` + validations.
 * Inline fields stay always-visible.
 *
 * TODO: replace with company DSP `<Fields />` when `@dsp` / form lib is available.
 */
export function Fields(props: Props) {
  return <FilterBar {...props} />
}

/**
 * Optional Form wrapper stub — company DSP typically provides `<Form>`.
 * Dashboard can wrap Fields / FilterBar in this or render them alone.
 */
export function Form({
  children,
  onSubmit
}: {
  children: ReactNode
  onSubmit?: (event: FormEvent) => void
}) {
  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(e)
      }}
    >
      {children}
    </Box>
  )
}
