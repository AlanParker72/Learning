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
import { JsonView, allExpanded } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import { brand } from '../../theme/brand'
import { copyToClipboard } from '../../utils/clipboard'
import { payloadJsonStyles } from './payloadJsonViewerStyles'

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

const toolbarButtonSx = {
  minHeight: 30,
  px: 1.25,
  borderRadius: '8px',
  borderColor: brand.border,
  color: brand.headerText,
  backgroundColor: brand.surface,
  fontWeight: 700,
  fontSize: 12.5,
  boxShadow: 'none',
  textTransform: 'none' as const,
  '&:hover': {
    borderColor: brand.primaryLight,
    backgroundColor: brand.primaryLight,
    color: brand.primary
  },
  '&.Mui-disabled': {
    borderColor: brand.border,
    color: brand.muted,
    backgroundColor: brand.surfaceLight
  }
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
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', background: brand.surface }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: brand.text }}>Input payload</Typography>
            {referenceLabel && (
              <Typography variant="body2" sx={{ color: brand.textMuted, mt: 0.25 }}>{referenceLabel}</Typography>
            )}
          </Box>
          <IconButton
            onClick={onClose}
            aria-label="Close payload details"
            sx={{
              color: brand.muted,
              '&:hover': { backgroundColor: brand.hoverLight, color: brand.text }
            }}
          >
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
            startIcon={<UnfoldMoreOutlined sx={{ fontSize: 16 }} />}
            onClick={handleExpandAll}
            disabled={!payload || loading}
            sx={toolbarButtonSx}
          >
            Expand all
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<UnfoldLessOutlined sx={{ fontSize: 16 }} />}
            onClick={handleCollapseAll}
            disabled={!payload || loading}
            sx={toolbarButtonSx}
          >
            Collapse all
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ContentCopyOutlined sx={{ fontSize: 16 }} />}
            onClick={handleCopy}
            disabled={!payload || loading}
            sx={{
              ...toolbarButtonSx,
              ml: { sm: 'auto' },
              borderColor: copied ? brand.link : brand.border,
              color: copied ? brand.linkHover : brand.link,
              backgroundColor: copied ? brand.overlay.linkSoft : brand.surface,
              '&:hover': {
                borderColor: brand.link,
                backgroundColor: brand.overlay.linkSoft,
                color: brand.linkHover
              }
            }}
          >
            {copied ? 'Copied' : 'Copy JSON'}
          </Button>
        </Stack>

        <Divider sx={{ mb: 2, borderColor: brand.border }} />

        <Box sx={{ overflow: 'auto', pr: 0.5, flex: 1 }}>
          {loading && (
            <Typography variant="body2" sx={{ color: brand.textMuted }}>Loading payload details...</Typography>
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
            <Typography variant="body2" sx={{ color: brand.textMuted }}>No payload is available for this delivery.</Typography>
          )}

          {!loading && !error && payload && (
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                border: `1px solid ${brand.border}`,
                background: brand.surfaceLight,
                boxShadow: brand.shadow.insetBorderSubtle,
                '& .payload-json': {
                  margin: 0
                }
              }}
            >
              <JsonView
                key={viewKey}
                data={payload}
                shouldExpandNode={expandAll ? allExpanded : collapseAll}
                style={payloadJsonStyles}
                clickToExpandNode
              />
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}
