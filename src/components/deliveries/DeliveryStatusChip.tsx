import { Chip } from '@mui/material'
import type { DeliveryStatus } from '../../api/deliveriesApi'
import { STATUS_CONFIG } from '../../theme/statusConfig'

export default function DeliveryStatusChip({ status }: { status: DeliveryStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.QUEUED

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        background: config.background,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontWeight: 700,
        borderRadius: '999px',
        height: 26,
        '& .MuiChip-label': { px: 1.25 }
      }}
    />
  )
}
