import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { brand } from '../../theme/brand'
import type { DeliveryActionType } from '../../api/mockApi'

type ActionConfirmDialogProps = {
  action: DeliveryActionType | null
  comment: string
  submitting: boolean
  onCommentChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

export default function ActionConfirmDialog({
  action,
  comment,
  submitting,
  onCommentChange,
  onClose,
  onSubmit
}: ActionConfirmDialogProps) {
  const isValid = comment.trim().length > 0

  return (
    <Dialog open={Boolean(action)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {action === 'acknowledge' ? 'Acknowledge delivery' : 'Resend delivery'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          multiline
          minRows={4}
          fullWidth
          label="Comment"
          placeholder="Add a note before submitting..."
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
          helperText="A comment is required so the activity timeline stays complete."
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={submitting} sx={{ color: brand.textMuted, borderColor: brand.border }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={submitting || !isValid} sx={{ background: brand.primary, '&:hover': { background: brand.primaryDark } }}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
