import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { brand } from '../../theme/brand'
import { formatNumber } from '../../utils/format'

type MetricCardProps = {
  label: string
  value: number
  color: string
  icon: ReactNode
}

/** KPI card — total only (no historical delta / sparkline per API contract). */
export default function MetricCard({ label, value, color, icon }: MetricCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        p: 2.25,
        pl: 2.5,
        borderRadius: 2,
        border: `1px solid ${brand.border}`,
        boxShadow: 'none',
        minHeight: 112,
        background: brand.surface,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 14,
          bottom: 14,
          width: 3.5,
          borderRadius: 999,
          background: color
        }
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: `1px solid ${color}45`,
              background: `${color}14`,
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              '& .MuiSvgIcon-root': { fontSize: 24 }
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: brand.textMuted,
              fontSize: 12,
              lineHeight: 1.25
            }}
          >
            {label}
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 32,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: brand.text,
            fontVariantNumeric: 'tabular-nums',
            pl: 0.25
          }}
        >
          {formatNumber(value)}
        </Typography>
      </Stack>
    </Paper>
  )
}
