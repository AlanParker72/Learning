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
import {
  Close,
  ContentCopyOutlined,
  UnfoldLessOutlined,
  UnfoldMoreOutlined
} from '@mui/icons-material'
import { useEffect, useState } from 'react'
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

const collapseAll = (): boolean => false

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
  const [expandAll, setExpandAll] = useState(true)
  const [viewKey, setViewKey] = useState(0)

  useEffect(() => {
    if (!open) return
    setExpandAll(true)
    setViewKey((current) => current + 1)
    setCopied(false)
  }, [open, payload])

  const handleCopy = async () => {
    if (!payload) return
    const copiedJson = await copyToClipboard(JSON.stringify(payload, null, 2))
    if (!copiedJson) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const handleExpandAll = () => {
    setExpandAll(true)
    setViewKey((current) => current + 1)
  }

  const handleCollapseAll = () => {
    setExpandAll(false)
    setViewKey((current) => current + 1)
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 560 } } }}>
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Input payload</Typography>
            {referenceLabel && (
              <Typography variant="body2" color="text.secondary">{referenceLabel}</Typography>
            )}
          </Box>
          <IconButton onClick={onClose} aria-label="Close payload details">
            <Close />
          </IconButton>
        </Stack>

        <Stack
          direction="row"
          spacing={0.75}
          sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.75 }}
          alignItems="center"
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<UnfoldMoreOutlined fontSize="small" />}
            onClick={handleExpandAll}
            disabled={!payload || loading}
            sx={{ borderColor: brand.border, color: brand.textMuted, fontWeight: 700 }}
          >
            Expand all
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<UnfoldLessOutlined fontSize="small" />}
            onClick={handleCollapseAll}
            disabled={!payload || loading}
            sx={{ borderColor: brand.border, color: brand.textMuted, fontWeight: 700 }}
          >
            Collapse all
          </Button>
          <Button
            size="small"
            startIcon={<ContentCopyOutlined fontSize="small" />}
            onClick={handleCopy}
            disabled={!payload || loading}
            sx={{ color: brand.link, fontWeight: 700, ml: { sm: 'auto' } }}
          >
            {copied ? 'Copied' : 'Copy JSON'}
          </Button>
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
              <JsonView
                key={viewKey}
                data={payload}
                shouldExpandNode={expandAll ? allExpanded : collapseAll}
                style={defaultStyles}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}
