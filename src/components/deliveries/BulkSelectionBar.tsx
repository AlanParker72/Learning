import { Button, Paper, Stack, Typography } from '@mui/material'
import { brand } from '../../theme/brand'

type BulkSelectionBarProps = {
  count: number
  onAcknowledge: () => void
  onResend: () => void
  onClear: () => void
}

export default function BulkSelectionBar({ count, onAcknowledge, onResend, onClear }: BulkSelectionBarProps) {
  if (count === 0) return null

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        px: 2,
        py: 1.25,
        borderRadius: 2,
        border: `1px solid ${brand.border}`,
        background: brand.primaryLight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap'
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {count} {count === 1 ? 'delivery' : 'deliveries'} selected
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="contained" onClick={onAcknowledge} sx={{ background: brand.primary, '&:hover': { background: brand.primaryDark } }}>
          Acknowledge
        </Button>
        <Button size="small" variant="outlined" onClick={onResend} sx={{ borderColor: brand.border, color: brand.text, fontWeight: 700 }}>
          Resend
        </Button>
        <Button size="small" onClick={onClear} sx={{ color: brand.textMuted, fontWeight: 700 }}>
          Clear
        </Button>
      </Stack>
    </Paper>
  )
}
