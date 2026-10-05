import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip
} from '@mui/material'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import type { ActionDef } from '../config/types'
import { formatDisplayDate, rangeForPreset } from '../utils/dateRange'
import type { FormFieldConfig, FormHandle, FormValues } from './types'

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

function asFieldList(
  fields: Record<string, FormFieldConfig> | FormFieldConfig[]
): FormFieldConfig[] {
  return Array.isArray(fields) ? fields : Object.values(fields)
}

function rangeKeysFor(field: FormFieldConfig): { start: string; end: string } {
  return field.rangeKeys ?? { start: 'startDate', end: 'endDate' }
}

function hasControl(field: FormFieldConfig, control: 'apply' | 'clear'): boolean {
  return Boolean(field.controls?.includes(control))
}

function FilterControls({
  field,
  onApply,
  onClear
}: {
  field: FormFieldConfig
  onApply?: () => void
  onClear?: () => void
}) {
  if (!field.controls?.length) return null
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
      {hasControl(field, 'apply') && onApply ? (
        <Tooltip title="Apply">
          <IconButton
            size="small"
            color="primary"
            aria-label={`Apply ${field.label}`}
            onClick={onApply}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
      {hasControl(field, 'clear') && onClear ? (
        <Tooltip title="Clear">
          <IconButton
            size="small"
            aria-label={`Clear ${field.label}`}
            onClick={onClear}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Box>
  )
}

/**
 * Dynamic form Fields renderer — builds controls from JSON form config `inputType`.
 *
 * TODO: replace with company DSP `<Fields />` when `@dsp` / form lib is available.
 * Until then: text | select | date (+ dateRangePreset / dateRangePill extensions).
 */
export function Fields({
  fields,
  form,
  actions = [],
  onAction,
  onReset
}: Props) {
  const fieldList = useMemo(() => asFieldList(fields), [fields])
  const values = form.values

  const dateApplyOwner = fieldList.find(
    (f) =>
      (f.inputType === 'date' || f.inputType === 'dateRangePreset') &&
      hasControl(f, 'apply')
  )
  const usesDateDraft = Boolean(dateApplyOwner)

  const [draftStart, setDraftStart] = useState(values.startDate ?? '')
  const [draftEnd, setDraftEnd] = useState(values.endDate ?? '')
  const [draftPreset, setDraftPreset] = useState(
    values.dateRangePreset ?? 'custom'
  )
  const [expandedChips, setExpandedChips] = useState<Record<string, boolean>>(
    {}
  )
  const [chipDrafts, setChipDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    setDraftStart(values.startDate ?? '')
    setDraftEnd(values.endDate ?? '')
    setDraftPreset(values.dateRangePreset ?? 'custom')
  }, [values.startDate, values.endDate, values.dateRangePreset])

  useEffect(() => {
    setExpandedChips({})
    const next: Record<string, string> = {}
    for (const f of fieldList) {
      if (f.presentation === 'chip' && f.inputType === 'text') {
        next[f.name] = values[f.name] ?? ''
      }
    }
    setChipDrafts(next)
    // Only reset chip UI when the field set changes (tab switch).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldList])

  if (fieldList.length === 0 && actions.length === 0) return null

  const clearAllAction = actions.find((a) => a.id === 'clear_filters')
  const otherActions = actions.filter((a) => a.id !== 'clear_filters')

  const commitValues = (next: FormValues) => {
    form.setValues(next)
  }

  const clearKeys = (keys: string[]) => {
    const next = { ...form.getValues() }
    for (const key of keys) delete next[key]
    form.setValues(next)
  }

  const applyDateDraft = () => {
    let start = draftStart
    let end = draftEnd
    if (draftPreset && draftPreset !== 'custom') {
      const range = rangeForPreset(draftPreset)
      if (range) {
        start = range.start
        end = range.end
        setDraftStart(start)
        setDraftEnd(end)
      }
    }
    commitValues({
      ...values,
      dateRangePreset: draftPreset,
      startDate: start,
      endDate: end
    })
  }

  const clearDateDraft = () => {
    setDraftStart('')
    setDraftEnd('')
    setDraftPreset('custom')
    clearKeys(['dateRangePreset', 'startDate', 'endDate'])
  }

  const commitPreset = (preset: string) => {
    const range = preset === 'custom' ? null : rangeForPreset(preset)
    commitValues({
      ...values,
      dateRangePreset: preset,
      ...(range ? { startDate: range.start, endDate: range.end } : {})
    })
    if (range) {
      setDraftStart(range.start)
      setDraftEnd(range.end)
    }
  }

  const handleClearAll = () => {
    setDraftStart('')
    setDraftEnd('')
    setDraftPreset('custom')
    setChipDrafts({})
    setExpandedChips({})
    form.reset({})
    onReset?.()
    onAction?.('clear_filters')
  }

  const fieldKey = (field: FormFieldConfig, index: number) =>
    `${field.name}-${field.label}-${index}`

  const applyChipFilter = (field: FormFieldConfig) => {
    const draft = chipDrafts[field.name] ?? ''
    form.setValue(field.name, draft)
    setExpandedChips((s) => ({ ...s, [field.name]: false }))
  }

  const clearChipFilter = (field: FormFieldConfig) => {
    setChipDrafts((s) => ({ ...s, [field.name]: '' }))
    clearKeys([field.name])
    setExpandedChips((s) => ({ ...s, [field.name]: false }))
  }

  const renderTextControl = (
    field: FormFieldConfig,
    value: string,
    onValue: (v: string) => void
  ) => (
    <TextField
      size="small"
      type="text"
      label={field.label}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onValue(e.target.value)}
      sx={{ minWidth: 200 }}
    />
  )

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', md: 'center' }}
      sx={{ mb: 2, flexWrap: 'wrap' }}
    >
      {fieldList.map((field, index) => {
        const presentation = field.presentation ?? 'inline'
        const key = fieldKey(field, index)

        if (field.inputType === 'dateRangePreset') {
          const selectValue = usesDateDraft
            ? draftPreset
            : (values[field.name] ?? field.defaultValue ?? 'custom')
          return (
            <TextField
              key={key}
              select
              size="small"
              label={field.label}
              value={selectValue}
              onChange={(e) => {
                const preset = e.target.value
                setDraftPreset(preset)
                if (!usesDateDraft) commitPreset(preset)
              }}
              sx={{ minWidth: 180 }}
            >
              {(field.options ?? []).map((opt) => (
                <MenuItem key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )
        }

        if (field.inputType === 'select') {
          return (
            <TextField
              key={key}
              select
              size="small"
              label={field.label}
              value={values[field.name] ?? ''}
              onChange={(e) => form.setValue(field.name, e.target.value)}
              sx={{ minWidth: 180 }}
            >
              {(field.options ?? []).map((opt) => (
                <MenuItem key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )
        }

        if (field.inputType === 'dateRangePill') {
          const keys = rangeKeysFor(field)
          const start = values[keys.start] ?? ''
          const end = values[keys.end] ?? ''
          if (!start && !end) return null
          const label =
            start && end
              ? `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`
              : formatDisplayDate(start || end)
          return (
            <Chip
              key={key}
              label={label}
              onDelete={() => clearKeys([keys.start, keys.end])}
              deleteIcon={<CloseIcon />}
              variant="outlined"
              sx={{ height: 36 }}
            />
          )
        }

        if (field.inputType === 'date') {
          const isStart = field.name === 'startDate'
          const isEnd = field.name === 'endDate'
          const draftMode = usesDateDraft && (isStart || isEnd)
          const value = draftMode
            ? isStart
              ? draftStart
              : draftEnd
            : (values[field.name] ?? '')
          return (
            <Box
              key={key}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <TextField
                size="small"
                type="date"
                label={field.label}
                value={value}
                onChange={(e) => {
                  const v = e.target.value
                  if (draftMode) {
                    if (isStart) setDraftStart(v)
                    else setDraftEnd(v)
                    setDraftPreset('custom')
                  } else {
                    form.setValue(field.name, v)
                  }
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 160 }}
              />
              <FilterControls
                field={field}
                onApply={hasControl(field, 'apply') ? applyDateDraft : undefined}
                onClear={hasControl(field, 'clear') ? clearDateDraft : undefined}
              />
            </Box>
          )
        }

        // text — chip presentation
        if (presentation === 'chip') {
          const applied = values[field.name] ?? ''
          const expanded = Boolean(expandedChips[field.name])
          const draft = chipDrafts[field.name] ?? applied
          const canExpand = field.expandOnClick !== false

          if (!expanded) {
            return (
              <Chip
                key={key}
                icon={<SearchIcon fontSize="small" />}
                label={applied ? `${field.label}: ${applied}` : field.label}
                variant="outlined"
                onClick={
                  canExpand
                    ? () => {
                        setChipDrafts((s) => ({
                          ...s,
                          [field.name]: values[field.name] ?? ''
                        }))
                        setExpandedChips((s) => ({
                          ...s,
                          [field.name]: true
                        }))
                      }
                    : undefined
                }
                onDelete={
                  applied && hasControl(field, 'clear')
                    ? () => clearChipFilter(field)
                    : undefined
                }
                deleteIcon={applied ? <CloseIcon /> : undefined}
                sx={{
                  height: 36,
                  cursor: canExpand ? 'pointer' : 'default',
                  '& .MuiChip-icon': { ml: 0.75 }
                }}
              />
            )
          }

          return (
            <Box
              key={key}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              {renderTextControl(field, draft, (v) =>
                setChipDrafts((s) => ({ ...s, [field.name]: v }))
              )}
              <FilterControls
                field={field}
                onApply={
                  hasControl(field, 'apply')
                    ? () => applyChipFilter(field)
                    : undefined
                }
                onClear={
                  hasControl(field, 'clear')
                    ? () => clearChipFilter(field)
                    : undefined
                }
              />
            </Box>
          )
        }

        // inline text
        return (
          <Box
            key={key}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            {renderTextControl(field, values[field.name] ?? '', (v) =>
              form.setValue(field.name, v)
            )}
            <FilterControls
              field={field}
              onApply={
                hasControl(field, 'apply')
                  ? () => form.setValue(field.name, values[field.name] ?? '')
                  : undefined
              }
              onClear={
                hasControl(field, 'clear')
                  ? () => clearKeys([field.name])
                  : undefined
              }
            />
          </Box>
        )
      })}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {clearAllAction ? (
          <Button size="small" onClick={handleClearAll}>
            {clearAllAction.label}
          </Button>
        ) : null}

        {otherActions.map((action) => (
          <Button
            key={action.id}
            size="small"
            onClick={() => onAction?.(action.id)}
          >
            {action.label}
          </Button>
        ))}
      </Box>
    </Stack>
  )
}

/**
 * Optional Form wrapper stub — company DSP typically provides `<Form>`.
 * Dashboard can wrap Fields in this or render Fields alone.
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
