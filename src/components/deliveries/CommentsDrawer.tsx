import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import { Close } from '@mui/icons-material'
import type { DeliveryComment } from '../../api/mockApi'
import { brand } from '../../theme/brand'
import { initialsFromName, splitDateTime } from '../../utils/format'

type CommentsDrawerProps = {
  open: boolean
  comments: DeliveryComment[]
  referenceLabel?: string
  onClose: () => void
}

export default function CommentsDrawer({ open, comments, referenceLabel, onClose }: CommentsDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 460 } } }}>
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Activity</Typography>
            <Typography variant="body2" color="text.secondary">
              {referenceLabel ? `${referenceLabel} · ${comments.length} comment${comments.length === 1 ? '' : 's'}` : `${comments.length} comments`}
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close comments">
            <Close />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ overflow: 'auto', pr: 0.5 }}>
          {comments.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>No activity yet</Typography>
              <Typography variant="body2" color="text.secondary">
                Acknowledge or resend a delivery to start this timeline.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={0}>
              {comments.map((comment, index) => {
                const actionColor = brand.actionColors[comment.action]
                const isLast = index === comments.length - 1

                return (
                  <Stack key={comment.id} direction="row" spacing={1.5} alignItems="stretch">
                    <Stack alignItems="center" sx={{ width: 36 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: brand.primary, fontWeight: 700 }}>
                        {initialsFromName(comment.commentedBy)}
                      </Avatar>
                      {!isLast && (
                        <Box sx={{ width: 2, flex: 1, minHeight: 24, background: brand.border, my: 0.5 }} />
                      )}
                    </Stack>

                    <Box
                      sx={{
                        flex: 1,
                        mb: isLast ? 0 : 2,
                        p: 1.75,
                        borderRadius: 2,
                        border: `1px solid ${brand.border}`,
                        background: brand.surface
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{comment.commentedBy}</Typography>
                        <Chip
                          label={comment.action}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            background: actionColor.bg,
                            color: actionColor.color,
                            fontWeight: 700,
                            height: 22
                          }}
                        />
                      </Stack>
                      <Typography variant="caption" sx={{ color: brand.textMuted, display: 'block', mb: 1 }}>
                        {(() => {
                          const parts = splitDateTime(comment.commentedDate)
                          return parts.time ? `${parts.date} ${parts.time}` : comment.commentedDate
                        })()}
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.65 }}>{comment.comment}</Typography>
                    </Box>
                  </Stack>
                )
              })}
            </Stack>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}
