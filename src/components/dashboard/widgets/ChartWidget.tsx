import { Box, Paper, Typography } from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import type { DashboardChartPoint } from '../../../config/types'
import { brand } from '../../../theme/brand'

type Props = {
  title?: string
  points: DashboardChartPoint[]
}

export function ChartWidget({ title, points }: Props) {
  if (points.length === 0) return null

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      {title ? (
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
      ) : null}
      <Box sx={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={points}>
            <CartesianGrid strokeDasharray="3 3" stroke={brand.gridStroke} />
            <XAxis dataKey="name" tick={{ fill: brand.tick, fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: brand.tick, fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill={brand.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
