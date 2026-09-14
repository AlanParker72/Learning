import { Box, Button, CircularProgress, IconButton, Paper, Stack, Tooltip as MuiTooltip, Typography } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DashboardChannelPoint } from '../../api/dashboardStatusApi'
import type { DashboardRangeUi } from '../../api/contracts'
import { brand } from '../../theme/brand'
import { formatChartTick } from '../../utils/format'

type ChannelChartProps = {
  data: DashboardChannelPoint[]
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
  { key: 'marketToEmail', label: 'Marketplace Email', color: brand.chart.marketToEmail },
  { key: 'smtp', label: 'SMTP', color: brand.chart.smtp },
  { key: 'push', label: 'Push', color: brand.chart.push }
] as const

export default function ChannelChart({ data, range, onRangeChange, loading = false }: ChannelChartProps) {
  const chartData = data.map((item) => ({
    date: formatChartTick(item.date),
    marketToEmail: item.marketToEmail,
    smtp: item.smtp,
    push: item.push
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
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18 }}>Delivery Channel Trend</Typography>
          <MuiTooltip title="Daily delivery volume by channel">
            <IconButton size="small" aria-label="About channel trend chart" sx={{ color: brand.muted }}>
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
                aria-label={`Show ${option.label} channel trend`}
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

      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} stroke={brand.gridStroke} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: brand.tick, fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: brand.tick, fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${brand.border}` }} />
            <Legend
              iconType="plainline"
              formatter={(value) => <span style={{ color: brand.textMuted, fontSize: 13 }}>{value}</span>}
            />
            {SERIES.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.label}
                stroke={series.color}
                strokeWidth={2.5}
                dot={{ r: 3.5, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
