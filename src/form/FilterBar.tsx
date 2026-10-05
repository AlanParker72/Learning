import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip
} from '@mui/material'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ActionDef } from '../config/types'
import { formatDisplayDate, rangeForPreset } from '../utils/dateRange'
import {
  FormFieldControl,
  validateFormField
} from './FormFieldControl'
import type { FormFieldConfig, FormHandle, FormValues } from './types'

type Props = {
  /** Ordered field configs from `useFormConfig` / RBAC-resolved form catalog. */
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

function isChipExpandable(field: FormFieldConfig): boolean {
  return (
    (field.presentation ?? 'inline') === 'chip' &&
    field.inputType !== 'dateRangePill' &&
    field.expandOnClick !== false
  )
}

function closedChipLabel(field: FormFieldConfig, applied: string): string {
  if (!applied) return field.label
  if (field.inputType === 'select' || field.inputType === 'dateRangePreset') {
    const opt = field.options?.find((o) => o.value === applied)
    return `${field.label}: ${opt?.label ?? applied}`
  }
  return `${field.label}: ${applied}`
}

function ClosedFilterTrigger({
  field,
  applied,
  onExpand,
  onClear
}: {
  field: FormFieldConfig
  applied: string
  onExpand: () => void
  onClear?: () => void
}) {
  const showSearchIcon =
    field.inputType === 'text' || field.inputType === undefined
  return (
    <Chip
      icon={showSearchIcon ? <SearchIcon fontSize="small" /> : undefined}
      label={closedChipLabel(field, applied)}
      variant="outlined"
      onClick={onExpand}
      onDelete={applied && onClear ? onClear : undefined}
      deleteIcon={applied ? <CloseIcon /> : undefined}
      sx={{
        height: 36,
        cursor: 'pointer',
        '& .MuiChip-icon': { ml: 0.75 }
      }}
    />
  )
}

/**
 * Hybrid filter bar: closed chips/triggers (icon + label from form config) that
 * expand into the real control rendered from `inputType` + validations.
 *
 * Flow: `filterPermissions ∩ role` → form fields → closed trigger → open control.
 * `presentation: 'chip'` → trigger+expand; `inline` → always-visible control.
 * Apply/clear come from field `controls` when present.
 */
export function FilterBar({
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
  const [chipErrors, setChipErrors] = useState<Record<string, string | null>>(
    {}
  )

  useEffect(() => {
    setDraftStart(values.startDate ?? '')
    setDraftEnd(values.endDate ?? '')
    setDraftPreset(values.dateRangePreset ?? 'custom')
  }, [values.startDate, values.endDate, values.dateRangePreset])

  useEffect(() => {
    setExpandedChips({})
    setChipErrors({})
    const next: Record<string, string> = {}
    for (const f of fieldList) {
      if (isChipExpandable(f)) {
        next[f.name] = values[f.name] ?? ''
      }
    }
    setChipDrafts(next)
    // Reset chip UI when the field set changes (tab switch).
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
    setChipErrors({})
    form.reset({})
    onReset?.()
    onAction?.('clear_filters')
  }

  const fieldKey = (field: FormFieldConfig, index: number) =>
    `${field.name}-${field.label}-${index}`

  const expandChip = (field: FormFieldConfig) => {
    setChipDrafts((s) => ({
      ...s,
      [field.name]: values[field.name] ?? ''
    }))
    setChipErrors((s) => ({ ...s, [field.name]: null }))
    setExpandedChips((s) => ({ ...s, [field.name]: true }))
  }

  const applyChipFilter = (field: FormFieldConfig) => {
    const draft = chipDrafts[field.name] ?? ''
    const err = validateFormField(field, draft)
    if (err) {
      setChipErrors((s) => ({ ...s, [field.name]: err }))
      return
    }
    setChipErrors((s) => ({ ...s, [field.name]: null }))
    form.setValue(field.name, draft)
    setExpandedChips((s) => ({ ...s, [field.name]: false }))
  }

  const clearChipFilter = (field: FormFieldConfig) => {
    setChipDrafts((s) => ({ ...s, [field.name]: '' }))
    setChipErrors((s) => ({ ...s, [field.name]: null }))
    clearKeys([field.name])
    setExpandedChips((s) => ({ ...s, [field.name]: false }))
  }

  /** Commit select immediately on change and collapse the chip. */
  const commitChipSelect = (field: FormFieldConfig, next: string) => {
    setChipDrafts((s) => ({ ...s, [field.name]: next }))
    form.setValue(field.name, next)
    setExpandedChips((s) => ({ ...s, [field.name]: false }))
  }

  const renderExpandedControl = (
    field: FormFieldConfig,
    draft: string,
    error: string | null | undefined
  ): ReactNode => {
    if (field.inputType === 'select' || field.inputType === 'dateRangePreset') {
      return (
        <FormFieldControl
          field={field}
          value={draft}
          error={error}
          onChange={(v) => {
            if (hasControl(field, 'apply')) {
              setChipDrafts((s) => ({ ...s, [field.name]: v }))
            } else {
              commitChipSelect(field, v)
            }
          }}
        />
      )
    }

    return (
      <FormFieldControl
        field={field}
        value={draft}
        error={error}
        onChange={(v) => {
          setChipDrafts((s) => ({ ...s, [field.name]: v }))
          setChipErrors((s) => ({ ...s, [field.name]: null }))
        }}
      />
    )
  }

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

        // Active date-range pill (read-only chip with dismiss) — not expand.
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

        // Chip / trigger → expand into form-config control
        if (isChipExpandable(field)) {
          const applied = values[field.name] ?? ''
          const expanded = Boolean(expandedChips[field.name])
          const draft = chipDrafts[field.name] ?? applied
          const error = chipErrors[field.name]

          if (!expanded) {
            return (
              <ClosedFilterTrigger
                key={key}
                field={field}
                applied={applied}
                onExpand={() => expandChip(field)}
                onClear={
                  hasControl(field, 'clear')
                    ? () => clearChipFilter(field)
                    : undefined
                }
              />
            )
          }

          return (
            <Box
              key={key}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              {renderExpandedControl(field, draft, error)}
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

        // Inline dateRangePreset (draft-aware when endDate owns apply)
        if (field.inputType === 'dateRangePreset') {
          const selectValue = usesDateDraft
            ? draftPreset
            : (values[field.name] ?? field.defaultValue ?? 'custom')
          return (
            <FormFieldControl
              key={key}
              field={field}
              value={selectValue}
              onChange={(preset) => {
                setDraftPreset(preset)
                if (!usesDateDraft) commitPreset(preset)
              }}
            />
          )
        }

        // Inline select
        if (field.inputType === 'select') {
          return (
            <FormFieldControl
              key={key}
              field={field}
              value={values[field.name] ?? ''}
              onChange={(v) => form.setValue(field.name, v)}
            />
          )
        }

        // Inline date (+ shared draft for start/end when apply lives on a date field)
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
              <FormFieldControl
                field={field}
                value={value}
                onChange={(v) => {
                  if (draftMode) {
                    if (isStart) setDraftStart(v)
                    else setDraftEnd(v)
                    setDraftPreset('custom')
                  } else {
                    form.setValue(field.name, v)
                  }
                }}
              />
              <FilterControls
                field={field}
                onApply={hasControl(field, 'apply') ? applyDateDraft : undefined}
                onClear={hasControl(field, 'clear') ? clearDateDraft : undefined}
              />
            </Box>
          )
        }

        // Inline text (presentation !== chip)
        if (presentation === 'inline' || field.inputType === 'text') {
          return (
            <Box
              key={key}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <FormFieldControl
                field={field}
                value={values[field.name] ?? ''}
                onChange={(v) => form.setValue(field.name, v)}
              />
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
        }

        return null
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
