import { Box, Button, CircularProgress, IconButton, Paper, Stack, Tooltip as MuiTooltip, Typography } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DashboardStatusPoint } from '../../api/dashboardStatusApi'
import type { DashboardRangeUi } from '../../api/contracts'
import { brand } from '../../theme/brand'
import { formatChartTick } from '../../utils/format'

type StatusChartProps = {
  data: DashboardStatusPoint[]
  range: DashboardRangeUi
  onRangeChange: (value: DashboardRangeUi) => void
  loading?: boolean
}

const RANGE_TOGGLES: Array<{ label: string; value: DashboardRangeUi }> = [
  { label: '1W', value: 'ONE_WEEK' },
  { label: '2W', value: 'TWO_WEEKS' },
  { label: '1M', value: 'THIRTY_DAYS' }
]

const SERIES = [
  { key: 'sent', label: 'Sent / Re-Sent', color: brand.metrics.sent },
  { key: 'queued', label: 'Queued', color: brand.metrics.queued },
  { key: 'failed', label: 'Failed', color: brand.metrics.failed },
  { key: 'acknowledged', label: 'Acknowledged', color: brand.metrics.acknowledged }
] as const

export default function StatusChart({ data, range, onRangeChange, loading = false }: StatusChartProps) {
  // Data already matches the selected range from the status API.
  const chartData = data.map((item) => ({
    date: formatChartTick(item.date),
    sent: item.sent,
    queued: item.queued,
    failed: item.failed,
    acknowledged: item.acknowledged
  }))

  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brand.border}`, boxShadow: brand.shadow.card, position: 'relative', height: '100%' }}
    >
      {loading && (
        <Box sx={{ position: 'absolute', inset: 0, background: brand.overlay.white60, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, borderRadius: 3 }}>
          <CircularProgress size={22} sx={{ color: brand.primary }} />
        </Box>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 1.5 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18 }}>Delivery Status</Typography>
          <MuiTooltip title="Stacked daily totals by delivery outcome">
            <IconButton size="small" aria-label="About delivery status chart" sx={{ color: brand.muted }}>
              <InfoOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </MuiTooltip>
        </Stack>

        <Box sx={{ display: 'flex', gap: 0.5, borderRadius: 999, p: 0.4, background: brand.surfaceLight, border: `1px solid ${brand.border}` }}>
          {RANGE_TOGGLES.map((option) => {
            const active = range === option.value
            return (
              <Button
                key={option.value}
                size="small"
                onClick={() => onRangeChange(option.value)}
                aria-pressed={active}
                aria-label={`Show ${option.label} delivery status`}
                sx={{
                  minWidth: 42,
                  px: 1.25,
                  py: 0.4,
                  borderRadius: 999,
                  background: active ? brand.tableHeader : 'transparent',
                  color: active ? '#fff' : brand.textMuted,
                  fontWeight: 800,
                  '&:hover': { background: active ? brand.tableHeader : brand.hoverLight }
                }}
              >
                {option.label}
              </Button>
            )
          })}
        </Box>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
        {SERIES.map((item) => (
          <Stack key={item.key} direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
          </Stack>
        ))}
      </Stack>

      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} barGap={6} barSize={chartData.length > 14 ? 16 : 28}>
            <CartesianGrid vertical={false} stroke={brand.gridStroke} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: brand.tick, fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: brand.tick, fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: brand.hoverLight }}
              contentStyle={{ borderRadius: 12, border: `1px solid ${brand.border}`, boxShadow: brand.shadow.card }}
            />
            <Bar dataKey="sent" name="Sent / Re-Sent" stackId="status" fill={brand.metrics.sent} />
            <Bar dataKey="queued" name="Queued" stackId="status" fill={brand.metrics.queued} />
            <Bar dataKey="failed" name="Failed" stackId="status" fill={brand.metrics.failed} />
            <Bar dataKey="acknowledged" name="Acknowledged" stackId="status" fill={brand.metrics.acknowledged} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
