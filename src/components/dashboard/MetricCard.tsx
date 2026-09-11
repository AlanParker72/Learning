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
        position: 'relative',
        overflow: 'hidden',
        p: 2,
        pl: 2.25,
        borderRadius: 2,
        border: `1px solid ${brand.border}`,
        boxShadow: 'none',
        minHeight: 118,
        background: brand.surface,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 12,
          bottom: 12,
          width: 3,
          borderRadius: 999,
          background: color
        }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="stretch" spacing={1.25}>
        <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1.25,
                border: `1px solid ${color}40`,
                background: `${color}12`,
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {icon}
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: brand.textMuted,
                fontSize: 11,
                lineHeight: 1.2
              }}
            >
              {label}
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 28,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: brand.text,
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {formatNumber(value)}
          </Typography>

          <Stack direction="row" spacing={0.4} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            {isUp ? (
              <TrendingUp sx={{ fontSize: 14, color: trendColor }} />
            ) : (
              <TrendingDown sx={{ fontSize: 14, color: trendColor }} />
            )}
            <Typography variant="caption" sx={{ fontWeight: 700, color: trendColor, fontSize: 12 }}>
              {formatPercent(delta)}
            </Typography>
            <Typography variant="caption" sx={{ color: brand.muted, fontSize: 11 }}>
              {comparisonLabel}
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ alignSelf: 'flex-end', opacity: 0.9 }}>
          <Sparkline values={sparkline} color={color} />
        </Box>
      </Stack>
    </Paper>
  )
}
