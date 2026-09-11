import { Box, Button, Stack, Typography } from '@mui/material'
import { CalendarMonthOutlined, ScheduleOutlined } from '@mui/icons-material'
import type { DashboardRangeUi } from '../../api/contracts'
import { brand } from '../../theme/brand'

type HeaderControlsProps = {
  range: DashboardRangeUi
  onRangeChange: (range: DashboardRangeUi) => void
  rangeLabel: string
  lastUpdatedLabel: string
}

const HEADER_RANGES: Array<{ label: string; value: DashboardRangeUi }> = [
  { label: '1 Week', value: 'ONE_WEEK' },
  { label: '2 Weeks', value: 'TWO_WEEKS' }
]

export default function HeaderControls({
  range,
  onRangeChange,
  rangeLabel,
  lastUpdatedLabel
}: HeaderControlsProps) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap' }}>
      <Box
        sx={{
          display: 'flex',
          border: `1px solid ${brand.border}`,
          borderRadius: 999,
          overflow: 'hidden',
          background: brand.surface
        }}
      >
        {HEADER_RANGES.map((option) => {
          const active = range === option.value
          return (
            <Button
              key={option.value}
              onClick={() => onRangeChange(option.value)}
              sx={{
                px: 2,
                py: 0.75,
                minWidth: 88,
                borderRadius: 0,
                background: active ? '#2563eb' : brand.surface,
                color: active ? '#fff' : brand.headerText,
                fontWeight: 700,
                '&:hover': { background: active ? '#1d4ed8' : brand.hoverLight }
              }}
            >
              {option.label}
            </Button>
          )
        })}
      </Box>

      <Box
        sx={{
          px: 1.5,
          py: 0.85,
          borderRadius: 2,
          border: `1px solid ${brand.border}`,
          background: brand.surface,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <CalendarMonthOutlined fontSize="small" sx={{ color: brand.muted }} />
        <Typography variant="body2" sx={{ color: brand.textMuted, fontWeight: 600 }}>
          {rangeLabel}
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: brand.muted }}>
        <ScheduleOutlined fontSize="small" />
        <Typography variant="body2">Last updated: {lastUpdatedLabel}</Typography>
      </Stack>
    </Stack>
  )
}
