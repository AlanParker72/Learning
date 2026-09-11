import React from 'react'
import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { DashboardStatusPoint } from '../api/dashboardStatusApi'
import type { DashboardRangeUi } from '../api/contracts'
import { brand } from '../theme/brand'

const statusColors = {
  sent: brand.metrics.sent,
  queued: brand.metrics.queued,
  failed: brand.metrics.failed,
  acknowledged: brand.metrics.acknowledged
}

export default function StatusChart({
  data,
  range,
  onRangeChange,
  loading = false
}: {
  data: DashboardStatusPoint[]
  range: DashboardRangeUi
  onRangeChange: (value: DashboardRangeUi) => void
  loading?: boolean
}) {
  const visibleData =
    range === 'ONE_WEEK' ? data.slice(-7) : range === 'TWO_WEEKS' ? data.slice(-14) : data.slice(-30)

  const chartData = visibleData.map((item) => ({
    date: item.date.slice(5),
    sent: item.sent,
    queued: item.queued,
    failed: item.failed,
    acknowledged: item.acknowledged
  }))

  return (
    <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${brand.border}`, background: brand.surface, position: 'relative' }}>
      {loading && (
        <Box sx={{ position: 'absolute', inset: 0, background: brand.overlay.white60, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: brand.textMuted, fontSize: 13, fontWeight: 600 }}>
            <CircularProgress size={18} thickness={4} sx={{ color: brand.primary }} />
            Loading...
          </Box>
        </Box>
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Delivery Status</Typography>
        <Box sx={{ display: 'flex', gap: 1, border: `1px solid ${brand.border}`, borderRadius: 1.6, p: 0.5, background: brand.surfaceLight }}>
          {[
            { label: '1W', value: 'ONE_WEEK' },
            { label: '2W', value: 'TWO_WEEKS' },
            { label: '30D', value: 'THIRTY_DAYS' }
          ].map((option) => {
            const active = range === option.value
            return (
              <Button
                key={option.label}
                size="small"
                onClick={() => onRangeChange(option.value as DashboardRangeUi)}
                sx={{
                  minWidth: 42,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  background: active ? brand.primary : 'transparent',
                  border: active ? `1px solid ${brand.primary}` : '1px solid transparent',
                  color: active ? '#fff' : brand.textMuted,
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': { background: active ? brand.primary : brand.hoverLight }
                }}
              >
                {option.label}
              </Button>
            )
          })}
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {[
          { key: 'sent', label: 'Sent / Re-Sent', color: statusColors.sent },
          { key: 'queued', label: 'Queued', color: statusColors.queued },
          { key: 'failed', label: 'Failed', color: statusColors.failed },
          { key: 'acknowledged', label: 'Acknowledged', color: statusColors.acknowledged }
        ].map((item) => (
          <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ width: '100%', height: 270 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} barGap={6}>
            <CartesianGrid vertical={false} stroke={brand.gridStroke} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: brand.tick, fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: brand.tick, fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sent" stackId="status" fill={statusColors.sent} radius={[4, 4, 0, 0]} />
            <Bar dataKey="queued" stackId="status" fill={statusColors.queued} radius={[4, 4, 0, 0]} />
            <Bar dataKey="failed" stackId="status" fill={statusColors.failed} radius={[4, 4, 0, 0]} />
            <Bar dataKey="acknowledged" stackId="status" fill={statusColors.acknowledged} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
