import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip
} from '@mui/material'
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
const CHANNEL_OPTIONS = ['Marketplace Email', 'SMTP', 'Push']
const RANGE_OPTIONS = ['Last 1 hour', 'Last 12 hours', 'Last 24 hours', 'Last 7 days']

const compactFieldSx = {
  minWidth: 128,
  maxWidth: 148,
  '& .MuiOutlinedInput-root': { borderRadius: 1.5, background: brand.surface }
}

const statusFieldSx = {
  minWidth: 150,
  maxWidth: 168,
  '& .MuiOutlinedInput-root': { borderRadius: 1.5, background: brand.surface }
}

const selectFieldSx = {
  minWidth: 132,
  maxWidth: 148,
  '& .MuiOutlinedInput-root': { borderRadius: 1.5, background: brand.surface }
}

function SelectedValuesLabel({ selected }: { selected: string[] }) {
  if (selected.length === 0) {
    return (
      <Box component="span" sx={{ color: brand.textMuted }}>
        All
      </Box>
    )
  }

  const label = selected.join(', ')
  return (
    <Tooltip title={label} enterDelay={350} placement="top">
      <Box
        component="span"
        sx={{
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          fontWeight: 600
        }}
      >
        {label}
      </Box>
    </Tooltip>
  )
}

export default function DeliveryFiltersBar({ filters, onChange, onSearch, onReset }: DeliveryFiltersBarProps) {
  const searchByLabel = SEARCH_BY_OPTIONS.find((option) => option.value === filters.searchBy)?.label ?? 'Customer ID'

  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={1}
      alignItems={{ lg: 'flex-end' }}
      sx={{ mb: 1.75, flexWrap: 'wrap', gap: 1 }}
    >
      <FormControl size="small" sx={compactFieldSx}>
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
        placeholder={`${searchByLabel}…`}
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSearch()
        }}
        sx={{
          width: { xs: '100%', lg: 168 },
          minWidth: 140,
          maxWidth: 180,
          '& .MuiOutlinedInput-root': { borderRadius: 1.5, background: brand.surface }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined fontSize="small" sx={{ color: brand.muted }} />
            </InputAdornment>
          )
        }}
      />

      <FormControl size="small" sx={statusFieldSx}>
        <InputLabel shrink>Delivery Status</InputLabel>
        <Select
          multiple
          displayEmpty
          label="Delivery Status"
          value={filters.status}
          renderValue={(selected) => <SelectedValuesLabel selected={selected} />}
          onChange={(event) => {
            const value = event.target.value
            onChange({ ...filters, status: typeof value === 'string' ? value.split(',') : value })
          }}
          sx={{
            '& .MuiSelect-select': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              pr: 3
            }
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

      <FormControl size="small" sx={selectFieldSx}>
        <InputLabel>Channel</InputLabel>
        <Select
          label="Channel"
          value={filters.channel}
          onChange={(event) => onChange({ ...filters, channel: event.target.value })}
        >
          <MenuItem value="all">All channels</MenuItem>
          {CHANNEL_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={selectFieldSx}>
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

      <Box sx={{ display: 'flex', gap: 0.75, ml: { lg: 'auto' } }}>
        <Button
          variant="contained"
          onClick={onSearch}
          aria-label="Search deliveries"
          sx={{
            minWidth: 40,
            width: 40,
            height: 36,
            background: brand.link,
            '&:hover': { background: brand.linkHover },
            borderRadius: 1.5
          }}
        >
          <SearchOutlined fontSize="small" />
        </Button>
        <Button
          variant="outlined"
          onClick={onReset}
          startIcon={<ReplayOutlined fontSize="small" />}
          sx={{
            height: 36,
            color: brand.textMuted,
            borderColor: brand.border,
            borderRadius: 1.5,
            px: 1.25,
            fontWeight: 600
          }}
        >
          Reset
        </Button>
      </Box>
    </Stack>
  )
}
