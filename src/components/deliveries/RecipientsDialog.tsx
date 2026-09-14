import { Box, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Tooltip, Typography, Button } from '@mui/material'
import { ContentCopyOutlined } from '@mui/icons-material'
import { useState } from 'react'
import type { DeliveryRecipients } from '../../api/deliveriesApi'
import { usePortalContainer } from '../../embed/PortalContainerContext'
import { brand } from '../../theme/brand'
import { copyToClipboard } from '../../utils/clipboard'

type RecipientsDialogProps = {
  open: boolean
  recipients: DeliveryRecipients | null
  onClose: () => void
}

function RecipientGroup({ label, emails, copiedEmail, onCopy }: {
  label: string
  emails: string[]
  copiedEmail: string | null
  onCopy: (email: string) => void
}) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>{label}</Typography>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {emails.length === 0 ? (
          <Typography variant="body2" color="text.secondary">None</Typography>
        ) : (
          emails.map((email) => (
            <Stack key={email} direction="row" spacing={0.5} alignItems="center">
              <Chip label={email} size="small" sx={{ borderRadius: 1.5 }} />
              <Tooltip title={copiedEmail === email ? 'Copied' : 'Copy email'}>
                <IconButton size="small" onClick={() => onCopy(email)} aria-label={`Copy ${email}`}>
                  <ContentCopyOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          ))
        )}
      </Stack>
    </Box>
  )
}

export default function RecipientsDialog({ open, recipients, onClose }: RecipientsDialogProps) {
  const portalContainer = usePortalContainer() ?? undefined
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const handleCopy = async (email: string) => {
    const copied = await copyToClipboard(email)
    if (!copied) return
    setCopiedEmail(email)
    window.setTimeout(() => setCopiedEmail(null), 1600)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth container={portalContainer} disableScrollLock>
      <DialogTitle sx={{ fontWeight: 800 }}>Recipients</DialogTitle>
      <DialogContent dividers>
        {!recipients ? (
          <Typography variant="body2" color="text.secondary">No recipient data.</Typography>
        ) : (
          <Stack spacing={2.5}>
            <RecipientGroup label="To" emails={recipients.to} copiedEmail={copiedEmail} onCopy={handleCopy} />
            <RecipientGroup label="CC" emails={recipients.cc} copiedEmail={copiedEmail} onCopy={handleCopy} />
            <RecipientGroup label="BCC" emails={recipients.bcc} copiedEmail={copiedEmail} onCopy={handleCopy} />
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onClose} sx={{ background: brand.primary, '&:hover': { background: brand.primaryDark } }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
