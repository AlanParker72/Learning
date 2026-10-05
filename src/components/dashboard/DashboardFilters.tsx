import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
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
import { useEffect, useState } from 'react'
import type {
  ActionDef,
  DashboardFilters as FilterValues,
  FilterDef
} from '../../config/types'
import { formatDisplayDate, rangeForPreset } from '../../utils/dateRange'

type Props = {
  filters: FilterDef[]
  /** Permission-gated filter-bar actions (Apply, Clear, …). */
  actions?: ActionDef[]
  values: FilterValues
  onChange: (id: string, value: string) => void
  onSetFilters: (values: FilterValues) => void
  onClearKeys: (keys: string[]) => void
  onReset: () => void
  onAction?: (actionId: string) => void
}

function rangeKeysFor(filter: FilterDef): { start: string; end: string } {
  return filter.rangeKeys ?? { start: 'startDate', end: 'endDate' }
}

/**
 * Config-driven filter bar — renders each def by `type`.
 * Does not assume every tab has applicant + id.
 */
export function DashboardFilters({
  filters,
  actions = [],
  values,
  onChange,
  onSetFilters,
  onClearKeys,
  onReset,
  onAction
}: Props) {
  // Draft start/end until Apply (Q_MANAGER Completed style).
  const [draftStart, setDraftStart] = useState(values.startDate ?? '')
  const [draftEnd, setDraftEnd] = useState(values.endDate ?? '')
  const [draftPreset, setDraftPreset] = useState(
    values.dateRangePreset ?? 'custom'
  )

  useEffect(() => {
    setDraftStart(values.startDate ?? '')
    setDraftEnd(values.endDate ?? '')
    setDraftPreset(values.dateRangePreset ?? 'custom')
  }, [values.startDate, values.endDate, values.dateRangePreset])

  if (filters.length === 0 && actions.length === 0) return null

  const hasApply = actions.some((a) => a.id === 'apply_date_filter')
  const clearAction = actions.find((a) => a.id === 'clear_filters')
  const otherActions = actions.filter(
    (a) => a.id !== 'apply_date_filter' && a.id !== 'clear_filters'
  )

  const applyDraft = () => {
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
    onSetFilters({
      ...values,
      dateRangePreset: draftPreset,
      startDate: start,
      endDate: end
    })
    onAction?.('apply_date_filter')
  }

  const commitPreset = (preset: string) => {
    const range = preset === 'custom' ? null : rangeForPreset(preset)
    onSetFilters({
      ...values,
      dateRangePreset: preset,
      ...(range ? { startDate: range.start, endDate: range.end } : {})
    })
    if (range) {
      setDraftStart(range.start)
      setDraftEnd(range.end)
    }
  }

  const handleClear = () => {
    setDraftStart('')
    setDraftEnd('')
    setDraftPreset('custom')
    onReset()
    onAction?.('clear_filters')
  }

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', md: 'center' }}
      sx={{ mb: 2, flexWrap: 'wrap' }}
    >
      {filters.map((filter) => {
        if (filter.type === 'dateRangePreset') {
          const selectValue = hasApply
            ? draftPreset
            : (values[filter.id] ?? filter.defaultValue ?? 'custom')
          return (
            <TextField
              key={filter.id}
              select
              size="small"
              label={filter.label}
              value={selectValue}
              onChange={(e) => {
                const preset = e.target.value
                setDraftPreset(preset)
                if (!hasApply) commitPreset(preset)
              }}
              sx={{ minWidth: 180 }}
            >
              {(filter.options ?? []).map((opt) => (
                <MenuItem key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )
        }

        if (filter.type === 'select') {
          return (
            <TextField
              key={filter.id}
              select
              size="small"
              label={filter.label}
              value={values[filter.id] ?? ''}
              onChange={(e) => onChange(filter.id, e.target.value)}
              sx={{ minWidth: 180 }}
            >
              {(filter.options ?? []).map((opt) => (
                <MenuItem key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )
        }

        if (filter.type === 'dateRangePill') {
          const keys = rangeKeysFor(filter)
          const start = values[keys.start] ?? ''
          const end = values[keys.end] ?? ''
          if (!start && !end) return null
          const label =
            start && end
              ? `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`
              : formatDisplayDate(start || end)
          return (
            <Chip
              key={filter.id}
              label={label}
              onDelete={() => onClearKeys([keys.start, keys.end])}
              deleteIcon={<CloseIcon />}
              variant="outlined"
              sx={{ height: 36 }}
            />
          )
        }

        if (filter.type === 'date') {
          const isStart = filter.id === 'startDate'
          const isEnd = filter.id === 'endDate'
          const draftMode = hasApply && (isStart || isEnd)
          const value = draftMode
            ? isStart
              ? draftStart
              : draftEnd
            : (values[filter.id] ?? '')
          return (
            <TextField
              key={filter.id}
              size="small"
              type="date"
              label={filter.label}
              value={value}
              onChange={(e) => {
                const v = e.target.value
                if (draftMode) {
                  if (isStart) setDraftStart(v)
                  else setDraftEnd(v)
                  setDraftPreset('custom')
                } else {
                  onChange(filter.id, v)
                }
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />
          )
        }

        return (
          <TextField
            key={filter.id}
            size="small"
            type="text"
            label={filter.label}
            placeholder={filter.placeholder}
            value={values[filter.id] ?? ''}
            onChange={(e) => onChange(filter.id, e.target.value)}
            sx={{ minWidth: 200 }}
          />
        )
      })}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {hasApply ? (
          <Tooltip title="Apply">
            <IconButton
              size="small"
              color="primary"
              aria-label="Apply date filter"
              onClick={applyDraft}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}

        {clearAction ? (
          hasApply ? (
            <Tooltip title={clearAction.label}>
              <IconButton
                size="small"
                aria-label={clearAction.label}
                onClick={handleClear}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Button size="small" onClick={handleClear}>
              {clearAction.label}
            </Button>
          )
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
