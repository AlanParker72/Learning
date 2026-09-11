import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import { Close, ContentCopyOutlined } from '@mui/icons-material'
import { useMemo, useState } from 'react'
import { brand } from '../../theme/brand'
import { copyToClipboard } from '../../utils/clipboard'
import { humanizeKey, toPayloadSections } from '../../utils/payload'

type PayloadDrawerProps = {
  open: boolean
  loading: boolean
  error?: string | null
  payload: Record<string, unknown> | null
  referenceLabel?: string
  onClose: () => void
  onRetry?: () => void
}

export default function PayloadDrawer({
  open,
  loading,
  error,
  payload,
  referenceLabel,
  onClose,
  onRetry
}: PayloadDrawerProps) {
  const [copied, setCopied] = useState(false)
  const sections = useMemo(() => (payload ? toPayloadSections(payload) : []), [payload])

  const handleCopy = async () => {
    if (!payload) return
    const copiedJson = await copyToClipboard(JSON.stringify(payload, null, 2))
    if (!copiedJson) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 460 } } }}>
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Input payload</Typography>
            {referenceLabel && (
              <Typography variant="body2" color="text.secondary">{referenceLabel}</Typography>
            )}
          </Box>
          <Stack direction="row" spacing={0.5}>
            <Button
              size="small"
              startIcon={<ContentCopyOutlined fontSize="small" />}
              onClick={handleCopy}
              disabled={!payload}
              sx={{ color: brand.link, fontWeight: 700 }}
            >
              {copied ? 'Copied' : 'Copy JSON'}
            </Button>
            <IconButton onClick={onClose} aria-label="Close payload details">
              <Close />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ overflow: 'auto', pr: 0.5 }}>
          {loading && (
            <Typography variant="body2" color="text.secondary">Loading payload details...</Typography>
          )}

          {!loading && error && (
            <Alert
              severity="error"
              sx={{ borderRadius: 2 }}
              action={onRetry ? <Button color="inherit" size="small" onClick={onRetry}>Retry</Button> : undefined}
            >
              {error}
            </Alert>
          )}

          {!loading && !error && !payload && (
            <Typography variant="body2" color="text.secondary">No payload is available for this delivery.</Typography>
          )}

          {!loading && !error && sections.map((section) => (
            <Box
              key={section.title}
              sx={{
                mb: 2,
                p: 1.75,
                borderRadius: 2,
                border: `1px solid ${brand.border}`,
                background: brand.surfaceLight
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.25, textTransform: 'capitalize' }}>
                {humanizeKey(section.title)}
              </Typography>
              <Stack spacing={1.1}>
                {section.fields.map((field) => (
                  <Stack key={field.key} direction="row" justifyContent="space-between" spacing={2}>
                    <Typography variant="caption" sx={{ color: brand.textMuted, fontWeight: 700 }}>
                      {humanizeKey(field.key)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', wordBreak: 'break-word' }}>
                      {field.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  )
}
