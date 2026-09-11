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
import { useState } from 'react'
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import { brand } from '../../theme/brand'
import { copyToClipboard } from '../../utils/clipboard'

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

  const handleCopy = async () => {
    if (!payload) return
    const copiedJson = await copyToClipboard(JSON.stringify(payload, null, 2))
    if (!copiedJson) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 520 } } }}>
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

        <Box sx={{ overflow: 'auto', pr: 0.5, flex: 1 }}>
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

          {!loading && !error && payload && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${brand.border}`,
                background: brand.surfaceLight,
                '& .json-view-lite': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: 13 }
              }}
            >
              <JsonView data={payload} shouldExpandNode={allExpanded} style={defaultStyles} />
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}
