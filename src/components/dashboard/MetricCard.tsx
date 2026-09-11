import { Box, Paper, Stack, Typography } from '@mui/material'
import { TrendingDown, TrendingUp } from '@mui/icons-material'
import type { ReactNode } from 'react'
import { brand } from '../../theme/brand'
import { formatNumber, formatPercent } from '../../utils/format'
import Sparkline from './Sparkline'

type MetricCardProps = {
  label: string
  value: number
  delta: number
  comparisonLabel: string
  color: string
  icon: ReactNode
  sparkline: number[]
  invertDelta?: boolean
}

export default function MetricCard({
  label,
  value,
  delta,
  comparisonLabel,
  color,
  icon,
  sparkline,
  invertDelta = false
}: MetricCardProps) {
  const isUp = delta >= 0
  const favorable = invertDelta ? delta <= 0 : delta >= 0
  const trendColor = favorable ? brand.status.sent.color : brand.status.failed.color

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 3,
        border: `1px solid ${color}33`,
        boxShadow: brand.shadow.card,
        minHeight: 128,
        background: `linear-gradient(180deg, ${color}0d 0%, ${brand.surface} 42%)`
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Stack spacing={1.25} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: `${color}1f`,
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: brand.textMuted }}>
              {label}
            </Typography>
          </Stack>

          <Typography sx={{ fontWeight: 800, fontSize: 32, lineHeight: 1, letterSpacing: '-0.04em' }}>
            {formatNumber(value)}
          </Typography>

          <Stack direction="row" spacing={0.5} alignItems="center">
            {isUp ? (
              <TrendingUp sx={{ fontSize: 16, color: trendColor }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: trendColor }} />
            )}
            <Typography variant="caption" sx={{ fontWeight: 700, color: trendColor }}>
              {formatPercent(delta)}
            </Typography>
            <Typography variant="caption" sx={{ color: brand.textMuted }}>
              {comparisonLabel}
            </Typography>
          </Stack>
        </Stack>

        <Sparkline values={sparkline} color={color} />
      </Stack>
    </Paper>
  )
}
