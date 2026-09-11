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
        px: 2.5,
        py: 2.25,
        borderRadius: 3,
        border: `1px solid ${brand.border}`,
        boxShadow: brand.shadow.card,
        minHeight: 112,
        background: brand.surface,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'box-shadow 160ms ease, border-color 160ms ease',
        '&:hover': {
          borderColor: brand.border,
          boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)'
        }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 13,
            lineHeight: 1.35,
            letterSpacing: '0.01em',
            color: brand.textMuted,
            pt: 0.35
          }}
        >
          {label}
        </Typography>

        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: iconBg,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: brand.shadow.insetBorderSubtle,
            '& .MuiSvgIcon-root': { fontSize: 20 }
          }}
        >
          {icon}
        </Box>
      </Stack>

      <Typography
        sx={{
          fontWeight: 800,
          fontSize: 32,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: brand.text,
          fontVariantNumeric: 'tabular-nums',
          mt: 1.75
        }}
      >
        {formatNumber(value)}
      </Typography>
    </Paper>
  )
}
