import { Box, CircularProgress, FormControl, IconButton, MenuItem, Paper, Select, Stack, Tooltip as MuiTooltip, Typography } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMemo, useState } from 'react'
import type { DashboardChannelPoint } from '../../api/dashboardStatusApi'
import { brand } from '../../theme/brand'
import { formatChartTick } from '../../utils/format'

type ChannelChartProps = {
  data: DashboardChannelPoint[]
  loading?: boolean
}

type GroupBy = 'day' | 'week'

const SERIES = [
  { key: 'marketToEmail', label: 'Marketplace Email', color: brand.chart.marketToEmail, dashed: false },
  { key: 'smtp', label: 'SMTP', color: brand.chart.smtp, dashed: true },
  { key: 'push', label: 'Push', color: brand.chart.push, dashed: false }
] as const

const weekKey = (isoDate: string): string => {
  const date = new Date(`${isoDate}T00:00:00`)
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  return start.toISOString().slice(0, 10)
}

export default function ChannelChart({ data, loading = false }: ChannelChartProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>('day')

  const chartData = useMemo(() => {
    if (groupBy === 'day') {
      return data.map((item) => ({
        date: formatChartTick(item.date),
        marketToEmail: item.marketToEmail,
        smtp: item.smtp,
        push: item.push
      }))
    }

    const grouped = new Map<string, { marketToEmail: number; smtp: number; push: number; count: number }>()
    data.forEach((item) => {
      const key = weekKey(item.date)
      const current = grouped.get(key) ?? { marketToEmail: 0, smtp: 0, push: 0, count: 0 }
      grouped.set(key, {
        marketToEmail: current.marketToEmail + item.marketToEmail,
        smtp: current.smtp + item.smtp,
        push: current.push + item.push,
        count: current.count + 1
      })
    })

    return Array.from(grouped.entries()).map(([date, values]) => ({
      date: `Week of ${formatChartTick(date)}`,
      marketToEmail: Math.round(values.marketToEmail / values.count),
      smtp: Math.round(values.smtp / values.count),
      push: Math.round(values.push / values.count)
    }))
  }, [data, groupBy])

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
          <MuiTooltip title="Average delivery volume by channel">
            <IconButton size="small" aria-label="About channel trend chart" sx={{ color: brand.muted }}>
              <InfoOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </MuiTooltip>
        </Stack>

        <FormControl size="small" sx={{ minWidth: 148 }}>
          <Select
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value as GroupBy)}
            sx={{ borderRadius: 2, fontWeight: 600, fontSize: 13 }}
            renderValue={(value) => `Group by: ${value === 'day' ? 'Day' : 'Week'}`}
            inputProps={{ 'aria-label': 'Group channel trend by day or week' }}
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
          </Select>
        </FormControl>
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
                strokeDasharray={series.dashed ? '6 6' : undefined}
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
