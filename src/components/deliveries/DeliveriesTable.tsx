import { useCallback, useState } from 'react'
import {
  Alert,
  Button,
  IconButton,
  Link,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography
} from '@mui/material'
import { ChatBubbleOutline, MoreVert } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import type { DashboardRangeUi } from '../../api/contracts'
import {
  fetchDeliveryPayload,
  submitDeliveryAction,
  type Delivery,
  type DeliveryActionType,
  type DeliveryComment,
  type DeliveryRecipients
} from '../../api/mockApi'
import { brand } from '../../theme/brand'
import { splitDateTime } from '../../utils/format'
import { useDeliveries } from '../../hooks/useDeliveries'
import DeliveryFiltersBar from './DeliveryFiltersBar'
import DeliveryPagination from './DeliveryPagination'
import DeliveryStatusChip from './DeliveryStatusChip'
import RowActionsMenu from './RowActionsMenu'
import ActionConfirmDialog from './ActionConfirmDialog'
import PayloadDrawer from './PayloadDrawer'
import CommentsDrawer from './CommentsDrawer'
import RecipientsDialog from './RecipientsDialog'

const COLUMNS = [
  'Reference ID',
  'Recipient Type',
  'Recipient ID',
  'Application ID',
  'Account ID',
  'Tenant',
  'Source',
  'Date & Time',
  'Delivery Status',
  'Doc link'
] as const

const headerCellSx = {
  color: '#fff',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  py: 1.6,
  fontSize: 13,
  background: brand.tableHeader
} as const

const nowLabel = (): string => {
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${date} ${time}`
}

export default function DeliveriesTable({ range = 'TWO_WEEKS' }: { range?: DashboardRangeUi }) {
  const { enqueueSnackbar } = useSnackbar()
  const deliveries = useDeliveries(range)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [selectedRow, setSelectedRow] = useState<Delivery | null>(null)
  const [pendingAction, setPendingAction] = useState<DeliveryActionType | null>(null)
  const [actionMessageId, setActionMessageId] = useState<string | null>(null)
  const [actionComment, setActionComment] = useState('')
  const [actionSubmitting, setActionSubmitting] = useState(false)
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null)
  const [payloadOpen, setPayloadOpen] = useState(false)
  const [payloadLoading, setPayloadLoading] = useState(false)
  const [payloadError, setPayloadError] = useState<string | null>(null)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [selectedComments, setSelectedComments] = useState<DeliveryComment[]>([])
  const [recipientsOpen, setRecipientsOpen] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState<DeliveryRecipients | null>(null)

  const openMenu = (event: React.MouseEvent<HTMLElement>, row: Delivery) => {
    setSelectedRow(row)
    setMenuAnchor(event.currentTarget)
  }

  const loadPayload = useCallback(async (row: Delivery) => {
    setSelectedRow(row)
    setPayloadOpen(true)
    setPayloadLoading(true)
    setPayloadError(null)
    try {
      const nextPayload = await fetchDeliveryPayload(row.messageId)
      setPayload(nextPayload)
    } catch (cause) {
      setPayload(null)
      setPayloadError(cause instanceof Error ? cause.message : 'Unable to load payload')
    } finally {
      setPayloadLoading(false)
    }
  }, [])

  const handleViewComments = (row: Delivery) => {
    setSelectedRow(row)
    setSelectedComments(deliveries.commentsFor(row))
    setCommentsOpen(true)
  }

  const handleViewRecipients = (row: Delivery) => {
    setSelectedRow(row)
    setSelectedRecipients(row.recipients ?? { to: [], cc: [], bcc: [] })
    setRecipientsOpen(true)
  }

  const startAction = (action: DeliveryActionType, messageId: string) => {
    setPendingAction(action)
    setActionMessageId(messageId)
  }

  const handleActionSubmit = async () => {
    if (!pendingAction || !actionComment.trim() || !actionMessageId) return
    setActionSubmitting(true)
    try {
      const result = await submitDeliveryAction({
        messageId: actionMessageId,
        action: pendingAction,
        comment: actionComment.trim()
      })
      if (!result.success) {
        enqueueSnackbar('Action failed', { variant: 'error' })
        return
      }

      deliveries.prependComment([actionMessageId], {
        id: `${actionMessageId}-${Date.now()}`,
        comment: actionComment.trim(),
        action: pendingAction,
        commentedBy: 'You',
        commentedDate: nowLabel()
      })
      enqueueSnackbar('Action submitted successfully', { variant: 'success' })
    } catch {
      enqueueSnackbar('Action failed', { variant: 'error' })
    } finally {
      setActionSubmitting(false)
      setPendingAction(null)
      setActionComment('')
      setActionMessageId(null)
    }
  }

  const columnCount = COLUMNS.length + 1

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: `1px solid ${brand.border}`, boxShadow: brand.shadow.card }}>
      <DeliveryFiltersBar
        filters={deliveries.draftFilters}
        onChange={deliveries.setDraftFilters}
        onSearch={deliveries.applyFilters}
        onReset={deliveries.resetFilters}
      />

      {deliveries.error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={deliveries.reload}>
              Retry
            </Button>
          }
        >
          {deliveries.error}
        </Alert>
      )}

      <TableContainer sx={{ border: `1px solid ${brand.border}`, borderRadius: 2, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {COLUMNS.map((header) => (
                <TableCell key={header} sx={headerCellSx}>
                  {header === 'Date & Time' ? (
                    <TableSortLabel
                      active={deliveries.sortField === 'dateTime'}
                      direction={deliveries.sortDir}
                      onClick={() => deliveries.toggleSort('dateTime')}
                      sx={{
                        color: '#fff !important',
                        '& .MuiTableSortLabel-icon': { color: '#fff !important' }
                      }}
                    >
                      {header}
                    </TableSortLabel>
                  ) : (
                    header
                  )}
                </TableCell>
              ))}
              <TableCell sx={headerCellSx} />
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: columnCount }).map((__, cell) => (
                    <TableCell key={cell}>
                      <Skeleton height={22} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : deliveries.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} sx={{ py: 8, textAlign: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>No deliveries found</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try a different search, status, or time range.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              deliveries.rows.map((row) => {
                const dateTime = splitDateTime(row.deliveryDateTime)
                return (
                  <TableRow key={row.messageId} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.referenceId}</TableCell>
                    <TableCell>{row.recipientType}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                        {row.recipientId}
                      </Typography>
                      <Link
                        href="#"
                        underline="hover"
                        variant="caption"
                        onClick={(event) => {
                          event.preventDefault()
                          handleViewRecipients(row)
                        }}
                      >
                        recipient details
                      </Link>
                    </TableCell>
                    <TableCell>{row.applicationId}</TableCell>
                    <TableCell>{row.accountId}</TableCell>
                    <TableCell>{row.tenant}</TableCell>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{dateTime.date}</Typography>
                      <Typography variant="caption" color="text.secondary">{dateTime.time}</Typography>
                    </TableCell>
                    <TableCell>
                      <DeliveryStatusChip status={row.deliveryStatus} />
                    </TableCell>
                    <TableCell>
                      {row.inputAvailable ? (
                        <Link
                          href="#"
                          underline="hover"
                          onClick={(event) => {
                            event.preventDefault()
                            void loadPayload(row)
                          }}
                        >
                          Input
                        </Link>
                      ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          onClick={() => handleViewComments(row)}
                          aria-label={`View comments for ${row.referenceId}`}
                        >
                          <ChatBubbleOutline fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={(event) => openMenu(event, row)} aria-label={`Actions for ${row.referenceId}`}>
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DeliveryPagination
        page={deliveries.page}
        pageSize={deliveries.pageSize}
        total={deliveries.total}
        pageCount={deliveries.pageCount}
        pageNumbers={deliveries.pageNumbers}
        onPageChange={deliveries.setPage}
        onPageSizeChange={(nextPageSize) => {
          deliveries.setPageSize(nextPageSize)
          deliveries.setPage(1)
        }}
      />

      <RowActionsMenu
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onAction={(action) => {
          if (!selectedRow) return
          startAction(action, selectedRow.messageId)
        }}
      />

      <ActionConfirmDialog
        action={pendingAction}
        comment={actionComment}
        submitting={actionSubmitting}
        referenceLabel={selectedRow?.referenceId}
        onCommentChange={setActionComment}
        onClose={() => {
          setPendingAction(null)
          setActionComment('')
          setActionMessageId(null)
        }}
        onSubmit={handleActionSubmit}
      />

      <PayloadDrawer
        open={payloadOpen}
        loading={payloadLoading}
        error={payloadError}
        payload={payload}
        referenceLabel={selectedRow?.referenceId}
        onRetry={selectedRow ? () => void loadPayload(selectedRow) : undefined}
        onClose={() => {
          setPayloadOpen(false)
          setPayload(null)
          setPayloadError(null)
        }}
      />

      <CommentsDrawer
        open={commentsOpen}
        comments={selectedComments}
        referenceLabel={selectedRow?.referenceId}
        onClose={() => setCommentsOpen(false)}
      />

      <RecipientsDialog
        open={recipientsOpen}
        recipients={selectedRecipients}
        onClose={() => setRecipientsOpen(false)}
      />
    </Paper>
  )
}
