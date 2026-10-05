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
import { useEffect, useState } from 'react'
import type {
  ActionDef,
  DashboardFilters as FilterValues,
  FilterDef
} from '../../config/types'
import { formatDisplayDate, rangeForPreset } from '../../utils/dateRange'

type Props = {
  filters: FilterDef[]
  /** Standalone filter-bar actions (e.g. Clear All) — not filter-owned apply/clear. */
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

function hasControl(filter: FilterDef, control: 'apply' | 'clear'): boolean {
  return Boolean(filter.controls?.includes(control))
}

function FilterControls({
  filter,
  onApply,
  onClear
}: {
  filter: FilterDef
  onApply?: () => void
  onClear?: () => void
}) {
  if (!filter.controls?.length) return null
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
      {hasControl(filter, 'apply') && onApply ? (
        <Tooltip title="Apply">
          <IconButton
            size="small"
            color="primary"
            aria-label={`Apply ${filter.label}`}
            onClick={onApply}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
      {hasControl(filter, 'clear') && onClear ? (
        <Tooltip title="Clear">
          <IconButton
            size="small"
            aria-label={`Clear ${filter.label}`}
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
 * Config-driven filter bar — renders each def by `type` + `presentation`.
 * Only `presentation: 'chip'` text filters use icon+label closed → expand;
 * inline/select/date stay as configured. Apply/clear live on FilterDef.controls.
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
  const dateApplyOwner = filters.find(
    (f) =>
      (f.type === 'date' || f.type === 'dateRangePreset') &&
      hasControl(f, 'apply')
  )
  const usesDateDraft = Boolean(dateApplyOwner)

  const [draftStart, setDraftStart] = useState(values.startDate ?? '')
  const [draftEnd, setDraftEnd] = useState(values.endDate ?? '')
  const [draftPreset, setDraftPreset] = useState(
    values.dateRangePreset ?? 'custom'
  )
  /** Expanded chip filter ids (text with expandOnClick). */
  const [expandedChips, setExpandedChips] = useState<Record<string, boolean>>(
    {}
  )
  /** Draft values for chip text filters until Apply. */
  const [chipDrafts, setChipDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    setDraftStart(values.startDate ?? '')
    setDraftEnd(values.endDate ?? '')
    setDraftPreset(values.dateRangePreset ?? 'custom')
  }, [values.startDate, values.endDate, values.dateRangePreset])

  // Collapse chips / sync drafts when the filter set changes (tab switch).
  useEffect(() => {
    setExpandedChips({})
    const next: Record<string, string> = {}
    for (const f of filters) {
      if (f.presentation === 'chip' && f.type === 'text') {
        next[f.id] = values[f.id] ?? ''
      }
    }
    setChipDrafts(next)
  }, [filters])

  if (filters.length === 0 && actions.length === 0) return null

  const clearAllAction = actions.find((a) => a.id === 'clear_filters')
  const otherActions = actions.filter((a) => a.id !== 'clear_filters')

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
    onSetFilters({
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
    onClearKeys(['dateRangePreset', 'startDate', 'endDate'])
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

  const handleClearAll = () => {
    setDraftStart('')
    setDraftEnd('')
    setDraftPreset('custom')
    setChipDrafts({})
    setExpandedChips({})
    onReset()
    onAction?.('clear_filters')
  }

  const applyChipFilter = (filter: FilterDef) => {
    const draft = chipDrafts[filter.id] ?? ''
    onChange(filter.id, draft)
    setExpandedChips((s) => ({ ...s, [filter.id]: false }))
  }

  const clearChipFilter = (filter: FilterDef) => {
    setChipDrafts((s) => ({ ...s, [filter.id]: '' }))
    onClearKeys([filter.id])
    setExpandedChips((s) => ({ ...s, [filter.id]: false }))
  }

  const renderTextControl = (filter: FilterDef, value: string, onValue: (v: string) => void) => (
    <TextField
      size="small"
      type="text"
      label={filter.label}
      placeholder={filter.placeholder}
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
      {filters.map((filter) => {
        const presentation = filter.presentation ?? 'inline'

        if (filter.type === 'dateRangePreset') {
          const selectValue = usesDateDraft
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
                if (!usesDateDraft) commitPreset(preset)
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
          const draftMode = usesDateDraft && (isStart || isEnd)
          const value = draftMode
            ? isStart
              ? draftStart
              : draftEnd
            : (values[filter.id] ?? '')
          return (
            <Box
              key={filter.id}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <TextField
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
              <FilterControls
                filter={filter}
                onApply={hasControl(filter, 'apply') ? applyDateDraft : undefined}
                onClear={hasControl(filter, 'clear') ? clearDateDraft : undefined}
              />
            </Box>
          )
        }

        // text — chip: closed = search icon + label; click expands to field + controls
        if (presentation === 'chip') {
          const applied = values[filter.id] ?? ''
          const expanded = Boolean(expandedChips[filter.id])
          const draft = chipDrafts[filter.id] ?? applied
          const canExpand = filter.expandOnClick !== false

          if (!expanded) {
            return (
              <Chip
                key={filter.id}
                icon={<SearchIcon fontSize="small" />}
                label={applied ? `${filter.label}: ${applied}` : filter.label}
                variant="outlined"
                onClick={
                  canExpand
                    ? () => {
                        setChipDrafts((s) => ({
                          ...s,
                          [filter.id]: values[filter.id] ?? ''
                        }))
                        setExpandedChips((s) => ({ ...s, [filter.id]: true }))
                      }
                    : undefined
                }
                onDelete={
                  applied && hasControl(filter, 'clear')
                    ? () => clearChipFilter(filter)
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
              key={filter.id}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              {renderTextControl(filter, draft, (v) =>
                setChipDrafts((s) => ({ ...s, [filter.id]: v }))
              )}
              <FilterControls
                filter={filter}
                onApply={
                  hasControl(filter, 'apply')
                    ? () => applyChipFilter(filter)
                    : undefined
                }
                onClear={
                  hasControl(filter, 'clear')
                    ? () => clearChipFilter(filter)
                    : undefined
                }
              />
            </Box>
          )
        }

        // inline text — live update (no filter-owned apply)
        return (
          <Box
            key={filter.id}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            {renderTextControl(filter, values[filter.id] ?? '', (v) =>
              onChange(filter.id, v)
            )}
            <FilterControls
              filter={filter}
              onApply={
                hasControl(filter, 'apply')
                  ? () => onChange(filter.id, values[filter.id] ?? '')
                  : undefined
              }
              onClear={
                hasControl(filter, 'clear')
                  ? () => onClearKeys([filter.id])
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
