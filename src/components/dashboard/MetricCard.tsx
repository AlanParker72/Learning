import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { brand } from '../../theme/brand'
import { formatNumber } from '../../utils/format'

type MetricCardProps = {
  label: string
  value: number
  color: string
  iconBg: string
  icon: ReactNode
}

/** KPI card — range total only (no delta / sparkline). Matches delivery dashboard canvas. */
export default function MetricCard({ label, value, color, iconBg, icon }: MetricCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        p: 2.25,
        borderRadius: 2.5,
        border: `1px solid ${brand.border}`,
        boxShadow: brand.shadow.card,
        minHeight: 118,
        background: brand.surface
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.75,
            background: iconBg,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            '& .MuiSvgIcon-root': { fontSize: 22 }
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1, pt: 0.15 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 14,
              lineHeight: 1.3,
              color: brand.text,
              mb: 0.65
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 30,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: brand.text,
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {formatNumber(value)}
          </Typography>
        </Box>
      </Stack>

      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          right: 16,
          bottom: 14,
          fontSize: 12,
          fontWeight: 500,
          color: brand.textMuted,
          lineHeight: 1
        }}
      >
        Range total
      </Typography>
    </Paper>
  )
}
