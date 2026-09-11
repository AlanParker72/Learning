import React, { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Link,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip
} from '@mui/material'
import { Close, CommentOutlined, ExpandMore, MoreVert, ReplayOutlined, SearchOutlined, ContentCopyOutlined } from '@mui/icons-material'
import { JsonView, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import { fetchDeliveries, fetchInputPayload, submitDeliveryAction, type Delivery, type DeliveryActionType, type DeliveryComment } from '../api/mockApi'
import type { DashboardRangeUi } from '../api/contracts'
import { brand } from '../theme/brand'
import { STATUS_CONFIG } from '../theme/statusConfig'
import { useSnackbar } from 'notistack'

type Filters = {
  search: string
  customerId: string
  status: string[]
  channel: string
  range: string
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  customerId: 'Customer ID',
  status: ['Failed'],
  channel: 'Marketplace Email',
  range: 'Last 1 hour'
}

const columnHeaders = [
  'Reference ID',
  'Recipient Type',
  'Recipient ID',
  'Tenant',
  'Source',
  'Date & Time',
  'Input Link',
  'Delivery Status',
  'Action'
]

function CommentAccordion({
  commentItem,
  index
}: {
  commentItem: DeliveryComment
  index: number
}) {
  const [expanded, setExpanded] = useState(index === 0)

  const actionColor = (brand.actionColors as Record<string, { bg: string; color: string }>)[commentItem.action] ?? {
    bg: brand.surfaceLight,
    color: brand.primary
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded((current) => !current)}
      disableGutters
      sx={{
        border: `1px solid ${brand.border}`,
        borderRadius: '12px !important',
        overflow: 'hidden',
        mb: 1.5,
        boxShadow: 'none',
        background: brand.surface,
        '&:before': { display: 'none' }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: brand.primary }} />}
        sx={{
          px: 2,
          minHeight: 52,
          '& .MuiAccordionSummary-content': { margin: '12px 0' }
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brand.text }}>Comment {index + 1}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, pb: 2, pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.75, fontWeight: 700, color: brand.textMuted }}>Comment</Typography>
          <Box sx={{ background: brand.surfaceLight, border: `1px solid ${brand.border}`, borderRadius: 1.5, p: 1.5 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.6, color: brand.text }}>{commentItem.comment}</Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.75, fontWeight: 700, color: brand.textMuted }}>Action</Typography>
          <Chip
            label={commentItem.action}
            size="small"
            sx={{
              textTransform: 'capitalize',
              borderRadius: '8px',
              background: actionColor.bg,
              color: actionColor.color,
              fontWeight: 700,
              border: `1px solid ${brand.border}`
            }}
          />
        </Box>

        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.75, fontWeight: 700, color: brand.textMuted }}>Commented By</Typography>
          <Typography variant="body2" sx={{ color: brand.text }}>{commentItem.commentedBy}</Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.75, fontWeight: 700, color: brand.textMuted }}>Commented Date</Typography>
          <Typography variant="body2" sx={{ color: brand.text }}>{commentItem.commentedDate}</Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default function DeliveriesTable({ range = 'TWO_WEEKS' }: { range?: DashboardRangeUi }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [rows, setRows] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<DeliveryActionType | null>(null)
  const [actionComment, setActionComment] = useState('')
  const [actionSubmitting, setActionSubmitting] = useState(false)
  const [inputPayload, setInputPayload] = useState<Record<string, unknown> | null>(null)
  const [inputPayloadLoading, setInputPayloadLoading] = useState(false)
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false)
  const [selectedComments, setSelectedComments] = useState<DeliveryComment[]>([])
  const [recipientsDialogOpen, setRecipientsDialogOpen] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState<{ to: string[]; cc: string[]; bcc: string[] } | null>(null)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const isReady = (v: string) => v && v !== 'Customer ID' && v !== 'All'
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  const loadRows = async (newFilters: Filters, newPage: number) => {
    setLoading(true)
    const result = await fetchDeliveries({
      search: newFilters.search,
      status: newFilters.status.length ? newFilters.status : [],
      channel: isReady(newFilters.channel) ? newFilters.channel : '',
      customerId: isReady(newFilters.customerId) ? newFilters.customerId : '',
      range,
      page: newPage,
      pageSize
    })

    setRows(result.items)
    setTotal(result.total)
    setLoading(false)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const statusParam = params.get('status')
    const next: Filters = {
      search: params.get('search') ?? '',
      customerId: params.get('customerId') ?? 'Customer ID',
      status: statusParam ? statusParam.split(',').map((item) => item.trim()).filter(Boolean) : ['Failed'],
      channel: params.get('channel') ?? 'Marketplace Email',
      range: params.get('range') ?? 'Last 1 hour'
    }
    setFilters(next)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.customerId && filters.customerId !== 'Customer ID') params.set('customerId', filters.customerId)
    if (filters.status.length > 0 && !(filters.status.length === 1 && filters.status[0] === 'Failed')) params.set('status', filters.status.join(','))
    if (filters.channel && filters.channel !== 'Marketplace Email') params.set('channel', filters.channel)
    if (filters.range && filters.range !== 'Last 1 hour') params.set('range', filters.range)
    if (params.toString()) {
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
    } else {
      window.history.replaceState({}, '', window.location.pathname)
    }

    loadRows(filters, page)
  }, [filters, page, pageSize, range])

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  const statusOptions = useMemo(() => ['Sent / Re-Sent', 'Queued', 'Failed', 'Acknowledged'], [])
  const channelOptions = useMemo(() => ['All', 'Marketplace Email', 'Internal Email', 'SMTP Email', 'Push Notifications'], [])
  const customerOptions = useMemo(() => ['Customer ID', 'Customer', 'Prospect', 'Employee'], [])
  const rangeOptions = useMemo(() => ['Last 1 hour', 'Last 12 hours', 'Last 24 hours', 'Last 7 days'], [])

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const handleSearch = () => {
    setPage(1)
  }

  const pageNumbers = useMemo(() => {
    const pages = new Set<number>([1, pageCount, page])
    for (let i = Math.max(1, page - 2); i <= Math.min(pageCount, page + 2); i += 1) {
      pages.add(i)
    }
    return Array.from(pages).sort((a, b) => a - b)
  }, [page, pageCount])

  const handleActionOpen = (event: React.MouseEvent<HTMLElement>, rowId: string) => {
    setSelectedRowId(rowId)
    setMenuAnchor(event.currentTarget)
  }

  const isActionCommentValid = actionComment.trim().length > 0

  const { enqueueSnackbar } = useSnackbar()

  const handleActionSubmit = async () => {
    if (!selectedRowId || !pendingAction || !isActionCommentValid) return

    setActionSubmitting(true)
    try {
      const res = await submitDeliveryAction({
        id: selectedRowId,
        action: pendingAction,
        comment: actionComment.trim()
      })

      if (res && (res as any).success) {
        enqueueSnackbar('Action submitted successfully', { variant: 'success', autoHideDuration: 3000 })
      } else {
        enqueueSnackbar('Action failed', { variant: 'error', autoHideDuration: 3000 })
      }
    } catch (err) {
      enqueueSnackbar('Action failed', { variant: 'error', autoHideDuration: 3000 })
    }

    setActionSubmitting(false)
    setMenuAnchor(null)
    setSelectedRowId(null)
    setPendingAction(null)
    setActionComment('')
  }

  const handleOpenInputPayload = async (rowId: string) => {
    setInputPayloadLoading(true)
    const payload = await fetchInputPayload(rowId)
    setInputPayload(payload)
    setInputPayloadLoading(false)
  }

  const handleOpenComments = (comments: DeliveryComment[]) => {
    setSelectedComments(comments)
    setCommentsDialogOpen(true)
  }

  const handleOpenRecipients = (recipients: { to: string[]; cc: string[]; bcc: string[] } | undefined) => {
    setSelectedRecipients(recipients ?? { to: [], cc: [], bcc: [] })
    setRecipientsDialogOpen(true)
  }

  const copyEmailToClipboard = async (email: string) => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email)
      } else {
        // fallback
        const textarea = document.createElement('textarea')
        textarea.value = email
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedEmail(email)
      window.setTimeout(() => setCopiedEmail(null), 2000)
    } catch (err) {
      // ignore copy errors silently
      console.error('Copy failed', err)
    }
  }

  const statusStyleMap: Record<string, { bg: string; color: string; label: string }> = {
    'Sent / Re-Sent': { bg: STATUS_CONFIG.SENT.background, color: STATUS_CONFIG.SENT.color, label: 'Sent / Re-Sent' },
    Queued: { bg: STATUS_CONFIG.QUEUED.background, color: STATUS_CONFIG.QUEUED.color, label: 'Queued' },
    Failed: { bg: STATUS_CONFIG.FAILED.background, color: STATUS_CONFIG.FAILED.color, label: 'Failed' },
    Acknowledged: { bg: STATUS_CONFIG.ACKNOWLEDGED.background, color: STATUS_CONFIG.ACKNOWLEDGED.color, label: 'Acknowledged' }
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          size="small"
          value={filters.customerId}
          onChange={(e) => setFilters((current) => ({ ...current, customerId: e.target.value }))}
          sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
        >
          {customerOptions.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>

        <TextField
          size="small"
          placeholder="Search by Customer ID..."
          value={filters.search}
          onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))}
          sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                              <SearchOutlined fontSize="small" sx={{ color: brand.muted }} />
              </InputAdornment>
            )
          }}
        />

        <TextField
          select
          size="small"
          SelectProps={{
            multiple: true,
            renderValue: (selected) =>
              typeof selected === 'string' ? selected : selected.length > 0 ? selected.join(', ') : 'Status'
          }}
          value={filters.status}
          onChange={(event) => {
            const value = event.target.value
            setFilters((current) => ({
              ...current,
              status: typeof value === 'string' ? [value] : value
            }))
          }}
          sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          value={filters.channel}
          onChange={(e) => setFilters((current) => ({ ...current, channel: e.target.value }))}
          sx={{ minWidth: 170, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
        >
          {channelOptions.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          value={filters.range}
          onChange={(e) => setFilters((current) => ({ ...current, range: e.target.value }))}
          sx={{ minWidth: 170, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
        >
          {rangeOptions.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          onClick={handleSearch}
          size="small"
          startIcon={<SearchOutlined fontSize="small" />}
          sx={{
            ml: 'auto',
            background: brand.link,
            '&:hover': { background: brand.linkHover },
            minWidth: 36,
            px: 1.25,
            height: 32,
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 1.25
          }}
        >
          Search
        </Button>

        <Button
          variant="outlined"
          onClick={handleReset}
          size="small"
          startIcon={<ReplayOutlined fontSize="small" />}
          sx={{
            minWidth: 36,
            px: 1.25,
            height: 32,
            color: brand.textMuted,
            borderColor: brand.border,
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 1.25
          }}
        >
          Reset
        </Button>
      </Stack>

      <TableContainer sx={{ border: `1px solid ${brand.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: brand.primary }}>
              {columnHeaders.map((header) => (
                <TableCell key={header} sx={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', py: 1.5 }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} sx={{ py: 4, textAlign: 'center' }}>Loading...</TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.referenceId}</TableCell>
                  <TableCell>{row.recipientType}</TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      underline="hover"
                      onClick={(event) => { event.preventDefault(); handleOpenRecipients(row.recipients) }}
                      sx={{ color: brand.link, '&:hover': { color: brand.linkHover } }}
                    >
                      {row.recipientId}
                    </Link>
                  </TableCell>
                  <TableCell>{row.tenant}</TableCell>
                  <TableCell>{row.source}</TableCell>
                  <TableCell>{row.dateTime}</TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      underline="hover"
                      sx={{ color: brand.link, '&:hover': { color: brand.linkHover } }}
                      onClick={(event) => {
                        event.preventDefault()
                        handleOpenInputPayload(row.id)
                      }}
                    >
                      Input
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusStyleMap[row.deliveryStatus]?.label ?? row.deliveryStatus}
                      size="small"
                      sx={{
                        background: statusStyleMap[row.deliveryStatus]?.bg ?? brand.surfaceLight,
                        color: statusStyleMap[row.deliveryStatus]?.color ?? brand.status.acknowledged.color,
                        fontWeight: 700,
                        borderRadius: '6px',
                        px: 0.5,
                        height: 28,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(event) => handleActionOpen(event, row.id)}
                      aria-label={`Actions for ${row.referenceId}`}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      aria-label={`View comments for ${row.referenceId}`}
                      onClick={() => handleOpenComments(row.comments ?? [])}
                      sx={{ color: brand.link }}
                    >
                      <CommentOutlined fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null)
          setSelectedRowId(null)
        }}
      >
        <MenuItem
          onClick={() => {
            setPendingAction('acknowledge')
            setMenuAnchor(null)
          }}
        >
          Acknowledge
        </MenuItem>
        <MenuItem
          onClick={() => {
            setPendingAction('resend')
            setMenuAnchor(null)
          }}
        >
          Resend
        </MenuItem>
      </Menu>

      <Dialog open={Boolean(pendingAction)} onClose={() => { setPendingAction(null); setActionComment('') }} maxWidth="sm" fullWidth>
        <DialogTitle>{pendingAction === 'acknowledge' ? 'Acknowledge delivery' : 'Resend delivery'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            minRows={4}
            fullWidth
            label="Comments"
            placeholder="Add a note before submitting..."
            value={actionComment}
            onChange={(event) => setActionComment(event.target.value)}
            error={!isActionCommentValid && actionComment.length > 0}
            helperText={
              !isActionCommentValid && actionComment.length > 0
                ? 'Please enter a confirmation comment before submitting.'
                : 'This confirmation is required.'
            }
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => { setPendingAction(null); setActionComment('') }}
            disabled={actionSubmitting}
            sx={{
              color: brand.textMuted,
              borderColor: brand.border,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1.25,
              '&:hover': { borderColor: brand.link, background: brand.hoverBg.linkLight }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleActionSubmit}
            disabled={actionSubmitting || !isActionCommentValid}
            sx={{
              background: brand.primary,
              '&:hover': { background: brand.primaryDark },
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 1.25
            }}
          >
            {actionSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(inputPayload) || inputPayloadLoading} onClose={() => setInputPayload(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>JSON Viewer</span>
        </DialogTitle>
        <DialogContent dividers>
          {inputPayloadLoading ? (
            <Typography variant="body2" color="text.secondary">Loading input payload...</Typography>
          ) : inputPayload ? (
            <Box sx={{ background: brand.surfaceLight, border: `1px solid ${brand.border}`, borderRadius: 2, p: 1.5 }}>
              <JsonView
                data={inputPayload}
                shouldInitialExpand={(level) => level < 3}
                style={defaultStyles}
              />
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setInputPayload(null)}
            startIcon={<Close fontSize="small" />}
            sx={{
              background: brand.primary,
              '&:hover': { background: brand.primaryDark },
              minWidth: 36,
              px: 1.25,
              height: 32,
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 1.25
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={commentsDialogOpen} onClose={() => setCommentsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {selectedComments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No comments available.</Typography>
          ) : (
            selectedComments.map((commentItem, index) => (
              <CommentAccordion key={`${commentItem.commentedDate}-${index}`} commentItem={commentItem} index={index} />
            ))
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setCommentsDialogOpen(false)}
            sx={{
              background: brand.primary,
              '&:hover': { background: brand.primaryDark },
              minWidth: 36,
              px: 1.25,
              height: 32,
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 1.25
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={recipientsDialogOpen} onClose={() => setRecipientsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Recipients</DialogTitle>
        <DialogContent dividers>
          {!selectedRecipients ? (
            <Typography variant="body2" color="text.secondary">No recipient data.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2">To</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {selectedRecipients.to.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  ) : (
                    selectedRecipients.to.map((email) => (
                      <Box key={email} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip label={email} size="small" sx={{ borderRadius: 1 }} />
                        <Tooltip title={copiedEmail === email ? 'Copied!' : 'Copy'}>
                          <IconButton size="small" onClick={() => copyEmailToClipboard(email)} sx={{ color: brand.primary }}>
                            <ContentCopyOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2">CC</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {selectedRecipients.cc.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  ) : (
                    selectedRecipients.cc.map((email) => (
                      <Box key={email} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip label={email} size="small" sx={{ borderRadius: 1 }} />
                        <Tooltip title={copiedEmail === email ? 'Copied!' : 'Copy'}>
                          <IconButton size="small" onClick={() => copyEmailToClipboard(email)} sx={{ color: brand.primary }}>
                            <ContentCopyOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2">BCC</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {selectedRecipients.bcc.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  ) : (
                    selectedRecipients.bcc.map((email) => (
                      <Box key={email} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip label={email} size="small" sx={{ borderRadius: 1 }} />
                        <Tooltip title={copiedEmail === email ? 'Copied!' : 'Copy'}>
                          <IconButton size="small" onClick={() => copyEmailToClipboard(email)} sx={{ color: brand.primary }}>
                            <ContentCopyOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setRecipientsDialogOpen(false)}
            sx={{
              background: brand.primary,
              '&:hover': { background: brand.primaryDark },
              minWidth: 36,
              px: 1.25,
              height: 32,
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 1.25
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, px: 1, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} results
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <TextField
            select
            size="small"
            value={String(pageSize)}
            onChange={(event) => {
              const nextPageSize = Number(event.target.value)
              setPageSize(nextPageSize)
              setPage(1)
            }}
            sx={{ minWidth: 110, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          >
            {[10, 25, 50, 100].map((option) => (
              <MenuItem key={option} value={option}>{option} per page</MenuItem>
            ))}
          </TextField>

          <Button
            size="small"
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            sx={{ minWidth: 36, px: 1, borderRadius: 1.5 }}
          >
            «
          </Button>

          {pageNumbers.map((pageNumber, index, array) => {
            const prev = index > 0 ? array[index - 1] : null
            const gap = prev !== null && pageNumber - prev > 1

            return (
              <React.Fragment key={pageNumber}>
                {gap && <Typography variant="body2" color="text.secondary">...</Typography>}
                <Button
                  size="small"
                  variant={page === pageNumber ? 'contained' : 'outlined'}
                  onClick={() => setPage(pageNumber)}
                  sx={{
                    minWidth: 36,
                    px: 1,
                    borderRadius: 1.5,
                    background: page === pageNumber ? brand.primary : undefined,
                    color: page === pageNumber ? '#fff' : undefined,
                                        borderColor: page === pageNumber ? brand.primary : undefined
                  }}
                >
                  {pageNumber}
                </Button>
              </React.Fragment>
            )
          })}

          <Button
            size="small"
            variant="outlined"
            disabled={page >= pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            sx={{ minWidth: 36, px: 1, borderRadius: 1.5 }}
          >
            »
          </Button>
        </Stack>
      </Stack>



    </Box>
  )
}