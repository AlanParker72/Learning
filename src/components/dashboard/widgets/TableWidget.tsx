import {
  Box,
  Button,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import type { ActionDef, ColumnDef, DashboardRecord } from '../../../config/types'
import { brand } from '../../../theme/brand'

type Props = {
  title?: string
  columns: ColumnDef[]
  rows: DashboardRecord[]
  actions: ActionDef[]
  selectable: boolean
  selectedIds: string[]
  onToggleSelected: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onRowAction: (actionId: string, rowId: string) => void
  onBulkAction: (actionId: string) => void
}

export function TableWidget({
  title,
  columns,
  rows,
  actions,
  selectable,
  selectedIds,
  onToggleSelected,
  onSelectAll,
  onRowAction,
  onBulkAction
}: Props) {
  const allIds = rows.map((r) => r.id)
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
  const bulkActions = actions.filter((a) => a.placement === 'bulk')
  const actionById = Object.fromEntries(actions.map((a) => [a.id, a]))

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          {title ?? 'Records'}
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({rows.length})
          </Typography>
        </Typography>
        {selectable && bulkActions.length > 0 && selectedIds.length > 0 ? (
          <Stack direction="row" spacing={1}>
            {bulkActions.map((action) => (
              <Button
                key={action.id}
                size="small"
                variant="outlined"
                onClick={() => onBulkAction(action.id)}
              >
                {action.label} ({selectedIds.length})
              </Button>
            ))}
          </Stack>
        ) : null}
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                bgcolor: brand.tableHeader,
                '& .MuiTableCell-head': { color: '#fff', fontWeight: 700 }
              }}
            >
              {selectable ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' } }}
                    checked={allSelected}
                    indeterminate={selectedIds.length > 0 && !allSelected}
                    onChange={() =>
                      onSelectAll(allSelected ? [] : allIds)
                    }
                  />
                </TableCell>
              ) : null}
              {columns.map((col) => (
                <TableCell key={col.id}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  align="center"
                  sx={{ py: 4, color: 'text.secondary' }}
                >
                  No records for this tab / filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} hover selected={selectedIds.includes(row.id)}>
                  {selectable ? (
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => onToggleSelected(row.id)}
                      />
                    </TableCell>
                  ) : null}
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      <CellContent
                        column={col}
                        row={row}
                        action={col.actionId ? actionById[col.actionId] : undefined}
                        onRowAction={onRowAction}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  )
}

function CellContent({
  column,
  row,
  action,
  onRowAction
}: {
  column: ColumnDef
  row: DashboardRecord
  action?: ActionDef
  onRowAction: (actionId: string, rowId: string) => void
}) {
  const field = column.field ?? column.id
  const raw = row[field]
  const display = raw == null || raw === '' ? '—' : String(raw)

  if (!action) {
    return <>{display}</>
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="body2">{display}</Typography>
      <Button
        size="small"
        variant="text"
        onClick={() => onRowAction(action.id, row.id)}
      >
        {action.label}
      </Button>
    </Stack>
  )
}
