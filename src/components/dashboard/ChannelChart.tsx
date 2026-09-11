import { Box, CircularProgress, FormControl, MenuItem, Paper, Select, Stack, Tooltip as MuiTooltip, Typography } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMemo, useState } from 'react'
import type { DashboardStatusPoint } from '../../api/dashboardStatusApi'
import { brand } from '../../theme/brand'
import { formatChartTick } from '../../utils/format'

type ChannelChartProps = {
  data: DashboardStatusPoint[]
  loading?: boolean
}

type GroupBy = 'day' | 'week'

const SERIES = [
  { key: 'marketEmail', label: 'Marketplace Email', color: brand.chart.marketEmail, dashed: false },
  { key: 'internalEmail', label: 'Internal Email', color: brand.chart.internalEmail, dashed: true }
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
        marketEmail: item.marketEmail,
        internalEmail: item.internalEmail
      }))
    }

    const grouped = new Map<string, { marketEmail: number; internalEmail: number; count: number }>()
    data.forEach((item) => {
      const key = weekKey(item.date)
      const current = grouped.get(key) ?? { marketEmail: 0, internalEmail: 0, count: 0 }
      grouped.set(key, {
        marketEmail: current.marketEmail + item.marketEmail,
        internalEmail: current.internalEmail + item.internalEmail,
        count: current.count + 1
      })
    })

    return Array.from(grouped.entries()).map(([date, values]) => ({
      date: `Week of ${formatChartTick(date)}`,
      marketEmail: Math.round(values.marketEmail / values.count),
      internalEmail: Math.round(values.internalEmail / values.count)
    }))
  }, [data, groupBy])

  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brand.border}`, boxShadow: brand.shadow.card, position: 'relative' }}
    >
      {loading && (
        <Box sx={{ position: 'absolute', inset: 0, background: brand.overlay.white60, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, borderRadius: 3 }}>
          <CircularProgress size={22} sx={{ color: brand.primary }} />
        </Box>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 1.5 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18 }}>Delivery Channel Trend</Typography>
          <MuiTooltip title="Average delivery volume by channel">
            <InfoOutlined sx={{ fontSize: 16, color: brand.muted }} />
          </MuiTooltip>
        </Stack>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value as GroupBy)}
            sx={{ borderRadius: 2, fontWeight: 600, fontSize: 13 }}
            renderValue={(value) => `Group by: ${value === 'day' ? 'Day' : 'Week'}`}
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
