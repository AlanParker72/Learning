import { useState } from 'react'
import {
  Checkbox,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { MoreVert } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import type { DashboardRangeUi } from '../../api/contracts'
import {
  fetchInputPayload,
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
  'Function',
  'Date & Time',
  'Delivery Status'
] as const

const headerCellSx = {
  color: '#fff',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  py: 1.6,
  fontSize: 13
} as const

export default function DeliveriesTable({ range = 'TWO_WEEKS' }: { range?: DashboardRangeUi }) {
  const { enqueueSnackbar } = useSnackbar()
  const deliveries = useDeliveries(range)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [selectedRow, setSelectedRow] = useState<Delivery | null>(null)
  const [pendingAction, setPendingAction] = useState<DeliveryActionType | null>(null)
  const [actionComment, setActionComment] = useState('')
  const [actionSubmitting, setActionSubmitting] = useState(false)
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null)
  const [payloadOpen, setPayloadOpen] = useState(false)
  const [payloadLoading, setPayloadLoading] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [selectedComments, setSelectedComments] = useState<DeliveryComment[]>([])
  const [recipientsOpen, setRecipientsOpen] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState<DeliveryRecipients | null>(null)

  const openMenu = (event: React.MouseEvent<HTMLElement>, row: Delivery) => {
    setSelectedRow(row)
    setMenuAnchor(event.currentTarget)
  }

  const handleViewPayload = async () => {
    if (!selectedRow) return
    setPayloadOpen(true)
    setPayloadLoading(true)
    try {
      const nextPayload = await fetchInputPayload(selectedRow.id)
      setPayload(nextPayload)
    } finally {
      setPayloadLoading(false)
    }
  }

  const handleViewComments = () => {
    setSelectedComments(selectedRow?.comments ?? [])
    setCommentsOpen(true)
  }

  const handleViewRecipients = (recipients?: DeliveryRecipients) => {
    setSelectedRecipients(recipients ?? selectedRow?.recipients ?? { to: [], cc: [], bcc: [] })
    setRecipientsOpen(true)
  }

  const handleActionSubmit = async () => {
    if (!selectedRow || !pendingAction || !actionComment.trim()) return
    setActionSubmitting(true)
    try {
      const result = await submitDeliveryAction({
        id: selectedRow.id,
        action: pendingAction,
        comment: actionComment.trim()
      })
      enqueueSnackbar(result.success ? 'Action submitted successfully' : 'Action failed', {
        variant: result.success ? 'success' : 'error'
      })
    } catch {
      enqueueSnackbar('Action failed', { variant: 'error' })
    } finally {
      setActionSubmitting(false)
      setPendingAction(null)
      setActionComment('')
    }
  }

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: `1px solid ${brand.border}`, boxShadow: brand.shadow.card }}>
      <DeliveryFiltersBar
        filters={deliveries.draftFilters}
        onChange={deliveries.setDraftFilters}
        onSearch={deliveries.applyFilters}
        onReset={deliveries.resetFilters}
      />

      <TableContainer sx={{ border: `1px solid ${brand.border}`, borderRadius: 2, overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: brand.tableHeader }}>
              <TableCell padding="checkbox" sx={headerCellSx}>
                <Checkbox
                  size="small"
                  checked={deliveries.allVisibleSelected}
                  indeterminate={deliveries.someVisibleSelected && !deliveries.allVisibleSelected}
                  onChange={deliveries.toggleAllVisible}
                  sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' }, '&.MuiCheckbox-indeterminate': { color: '#fff' } }}
                  inputProps={{ 'aria-label': 'Select all deliveries on this page' }}
                />
              </TableCell>
              {COLUMNS.map((header) => (
                <TableCell key={header} sx={headerCellSx}>{header}</TableCell>
              ))}
              <TableCell sx={headerCellSx} />
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.loading ? (
              <TableRow>
                <TableCell colSpan={12} sx={{ py: 6, textAlign: 'center' }}>Loading deliveries...</TableCell>
              </TableRow>
            ) : deliveries.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} sx={{ py: 6, textAlign: 'center' }}>No deliveries match the current filters.</TableCell>
              </TableRow>
            ) : (
              deliveries.rows.map((row) => {
                const dateTime = splitDateTime(row.dateTime)
                return (
                  <TableRow key={row.id} hover selected={deliveries.selectedIds.includes(row.id)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={deliveries.selectedIds.includes(row.id)}
                        onChange={() => deliveries.toggleRow(row.id)}
                        inputProps={{ 'aria-label': `Select ${row.referenceId}` }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.referenceId}</TableCell>
                    <TableCell>{row.recipientType}</TableCell>
                    <TableCell>
                      <Link
                        href="#"
                        underline="hover"
                        onClick={(event) => {
                          event.preventDefault()
                          setSelectedRow(row)
                          handleViewRecipients(row.recipients)
                        }}
                      >
                        {row.recipientId}
                      </Link>
                    </TableCell>
                    <TableCell>{row.applicationId}</TableCell>
                    <TableCell>{row.accountId}</TableCell>
                    <TableCell>{row.tenant}</TableCell>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>{row.functionName}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{dateTime.date}</Typography>
                      <Typography variant="caption" color="text.secondary">{dateTime.time}</Typography>
                    </TableCell>
                    <TableCell>
                      <DeliveryStatusChip status={row.deliveryStatus} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(event) => openMenu(event, row)} aria-label={`Actions for ${row.referenceId}`}>
                        <MoreVert fontSize="small" />
                      </IconButton>
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
        onAction={setPendingAction}
        onViewComments={handleViewComments}
        onViewPayload={handleViewPayload}
        onViewRecipients={() => handleViewRecipients()}
      />

      <ActionConfirmDialog
        action={pendingAction}
        comment={actionComment}
        submitting={actionSubmitting}
        onCommentChange={setActionComment}
        onClose={() => {
          setPendingAction(null)
          setActionComment('')
        }}
        onSubmit={handleActionSubmit}
      />

      <PayloadDrawer
        open={payloadOpen}
        loading={payloadLoading}
        payload={payload}
        referenceLabel={selectedRow?.referenceId}
        onClose={() => {
          setPayloadOpen(false)
          setPayload(null)
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
