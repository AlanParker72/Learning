import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { usePortalContainer } from '../../embed/PortalContainerContext'
import { brand } from '../../theme/brand'
import type { DeliveryActionType } from '../../api/deliveriesApi'

type ActionConfirmDialogProps = {
  action: DeliveryActionType | null
  comment: string
  submitting: boolean
  referenceLabel?: string
  onCommentChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

export default function ActionConfirmDialog({
  action,
  comment,
  submitting,
  referenceLabel,
  onCommentChange,
  onClose,
  onSubmit
}: ActionConfirmDialogProps) {
  const portalContainer = usePortalContainer() ?? undefined
  const title = action === 'acknowledge' ? 'Acknowledge delivery' : 'Resend delivery'

  return (
    <Dialog
      open={Boolean(action)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      container={portalContainer}
      disableScrollLock
    >
      <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent>
        {referenceLabel && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {referenceLabel}
          </Typography>
        )}
        <TextField
          autoFocus
          multiline
          minRows={4}
          fullWidth
          label="Comment (optional)"
          placeholder="Add an optional note before submitting..."
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && !submitting) {
              onSubmit()
            }
          }}
          helperText="Comment is optional. Leave blank if no note is needed."
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={submitting} sx={{ color: brand.textMuted, borderColor: brand.border }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={submitting} sx={{ background: brand.primary, '&:hover': { background: brand.primaryDark } }}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
