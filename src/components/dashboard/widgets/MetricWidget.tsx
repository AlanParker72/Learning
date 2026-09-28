import { Box, Paper, Stack, Typography } from '@mui/material'
import type { DashboardMetric } from '../../../config/types'

type Props = {
  title?: string
  metrics: DashboardMetric[]
}

export function MetricWidget({ title, metrics }: Props) {
  if (metrics.length === 0) return null

  return (
    <Box>
      {title ? (
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
      ) : null}
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        {metrics.map((m) => (
          <Paper
            key={m.id}
            variant="outlined"
            sx={{ px: 2, py: 1.5, minWidth: 140 }}
          >
            <Typography variant="caption" color="text.secondary">
              {m.label}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {m.value}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}
