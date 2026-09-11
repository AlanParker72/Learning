import { Box, Button, Checkbox, FormControl, InputAdornment, InputLabel, ListItemText, MenuItem, Select, Stack, TextField } from '@mui/material'
import { ReplayOutlined, SearchOutlined } from '@mui/icons-material'
import type { DeliveryFilters } from '../../hooks/useDeliveries'
import type { SearchField } from '../../api/mockApi'
import { brand } from '../../theme/brand'

type DeliveryFiltersBarProps = {
  filters: DeliveryFilters
  onChange: (filters: DeliveryFilters) => void
  onSearch: () => void
  onReset: () => void
}

const SEARCH_BY_OPTIONS: Array<{ label: string; value: SearchField }> = [
  { label: 'Customer ID', value: 'customerId' },
  { label: 'Reference ID', value: 'referenceId' },
  { label: 'Recipient ID', value: 'recipientId' },
  { label: 'Application ID', value: 'applicationId' },
  { label: 'Account ID', value: 'accountId' }
]

const STATUS_OPTIONS = ['Sent / Re-Sent', 'Queued', 'Failed', 'Acknowledged']
const CHANNEL_OPTIONS = ['Marketplace Email', 'Internal Email', 'SMTP Email', 'Push Notifications']
const RANGE_OPTIONS = ['Last 1 hour', 'Last 12 hours', 'Last 24 hours', 'Last 7 days']

const fieldSx = {
  minWidth: 150,
  '& .MuiOutlinedInput-root': { borderRadius: 2, background: brand.surface }
}

export default function DeliveryFiltersBar({ filters, onChange, onSearch, onReset }: DeliveryFiltersBarProps) {
  const searchByLabel = SEARCH_BY_OPTIONS.find((option) => option.value === filters.searchBy)?.label ?? 'Customer ID'

  return (
    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.5} alignItems={{ lg: 'flex-end' }} sx={{ mb: 2, flexWrap: 'wrap' }}>
      <FormControl size="small" sx={fieldSx}>
        <InputLabel>Search By</InputLabel>
        <Select
          label="Search By"
          value={filters.searchBy}
          onChange={(event) => onChange({ ...filters, searchBy: event.target.value as SearchField, search: '' })}
        >
          {SEARCH_BY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label={searchByLabel}
        placeholder={`Search by ${searchByLabel}...`}
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSearch()
        }}
        sx={{ minWidth: 220, flex: { lg: '1 1 220px' }, '& .MuiOutlinedInput-root': { borderRadius: 2, background: brand.surface } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined fontSize="small" sx={{ color: brand.muted }} />
            </InputAdornment>
          )
        }}
      />

      <FormControl size="small" sx={{ ...fieldSx, minWidth: 180 }}>
        <InputLabel>Delivery Status</InputLabel>
        <Select
          multiple
          label="Delivery Status"
          value={filters.status}
          renderValue={(selected) => (selected.length > 0 ? selected.join(', ') : 'All')}
          onChange={(event) => {
            const value = event.target.value
            onChange({ ...filters, status: typeof value === 'string' ? value.split(',') : value })
          }}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox size="small" checked={filters.status.includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={fieldSx}>
        <InputLabel>Delivery Channel</InputLabel>
        <Select
          label="Delivery Channel"
          value={filters.channel}
          onChange={(event) => onChange({ ...filters, channel: event.target.value })}
        >
          <MenuItem value="all">All channels</MenuItem>
          {CHANNEL_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={fieldSx}>
        <InputLabel>Range</InputLabel>
        <Select
          label="Range"
          value={filters.tableRange}
          onChange={(event) => onChange({ ...filters, tableRange: event.target.value })}
        >
          {RANGE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 1, ml: { lg: 'auto' } }}>
        <Button
          variant="contained"
          onClick={onSearch}
          aria-label="Search deliveries"
          sx={{
            minWidth: 44,
            width: 44,
            height: 40,
            background: brand.link,
            '&:hover': { background: brand.linkHover },
            borderRadius: 2
          }}
        >
          <SearchOutlined fontSize="small" />
        </Button>
        <Button
          variant="outlined"
          onClick={onReset}
          startIcon={<ReplayOutlined fontSize="small" />}
          sx={{
            height: 40,
            color: brand.textMuted,
            borderColor: brand.border,
            borderRadius: 2,
            px: 1.5,
            fontWeight: 600
          }}
        >
          Reset
        </Button>
      </Box>
    </Stack>
  )
}
