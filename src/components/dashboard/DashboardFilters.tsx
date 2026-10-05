import { Box, Button, MenuItem, Stack, TextField } from '@mui/material'
import type { DashboardFilters as FilterValues, FilterDef } from '../../config/types'

type Props = {
  filters: FilterDef[]
  values: FilterValues
  onChange: (id: string, value: string) => void
  onReset: () => void
}

export function DashboardFilters({ filters, values, onChange, onReset }: Props) {
  if (filters.length === 0) return null

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', md: 'center' }}
      sx={{ mb: 2, flexWrap: 'wrap' }}
    >
      {filters.map((filter) => {
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

        return (
          <TextField
            key={filter.id}
            size="small"
            type={filter.type === 'date' ? 'date' : 'text'}
            label={filter.label}
            placeholder={filter.placeholder}
            value={values[filter.id] ?? ''}
            onChange={(e) => onChange(filter.id, e.target.value)}
            InputLabelProps={filter.type === 'date' ? { shrink: true } : undefined}
            sx={{ minWidth: 200 }}
          />
        )
      })}
      <Box>
        <Button size="small" onClick={onReset}>
          Clear filters
        </Button>
      </Box>
    </Stack>
  )
}
