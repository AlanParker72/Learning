import { Chip } from '@mui/material'
import type { DeliveryStatus } from '../../api/mockApi'
import { STATUS_CONFIG } from '../../theme/statusConfig'

const STATUS_KEY: Record<DeliveryStatus, keyof typeof STATUS_CONFIG> = {
  'Sent / Re-Sent': 'SENT',
  Queued: 'QUEUED',
  Failed: 'FAILED',
  Acknowledged: 'ACKNOWLEDGED'
}

export default function DeliveryStatusChip({ status }: { status: DeliveryStatus }) {
  const config = STATUS_CONFIG[STATUS_KEY[status]]

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
