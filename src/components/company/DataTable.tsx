/**
 * Local stand-in for the company DataTable.
 *
 * When the real company package is available, replace this import site with:
 *   import { DataTable } from '@company/ui' // (or whatever the package path is)
 * and delete this file (plus Spinner / NoResultsView stubs if the package exports them).
 *
 * Public API mirrors company usage:
 *   <DataTable columns={columns} rows={rows} rowKey="id" pagination={...} />
 * Column shape: { field, headerName, align?, widthPercent?, renderCell?: (row) => … }
 */
import type { ReactNode } from 'react'
import {
  Box,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { brand } from '../../theme/brand'

export type DataTableColumnAlign = 'left' | 'center' | 'right'

export type DataTableColumn<T> = {
  field: string
  headerName: string
  align?: DataTableColumnAlign
  widthPercent?: number
  renderCell?: (row: T) => ReactNode
}

export type DataTablePagination = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export type DataTableProps<T extends object> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  /** Property name used as React key (e.g. "id", "cisNumber"). */
  rowKey: keyof T & string
  pagination?: DataTablePagination
}

function cellValue<T extends object>(row: T, field: string): ReactNode {
  const raw = (row as Record<string, unknown>)[field]
  if (raw == null || raw === '') return '—'
  if (typeof raw === 'object') return '—'
  return String(raw)
}

export function DataTable<T extends object>({
  columns,
  rows,
  rowKey,
  pagination
}: DataTableProps<T>) {
  const pageCount =
    pagination && pagination.pageSize > 0
      ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
      : 1

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                bgcolor: brand.tableHeader,
                '& .MuiTableCell-head': { color: '#fff', fontWeight: 700 }
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  align={col.align ?? 'left'}
                  sx={
                    col.widthPercent != null
                      ? { width: `${col.widthPercent}%` }
                      : undefined
                  }
                >
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const key = String(row[rowKey] ?? '')
              return (
                <TableRow key={key} hover>
                  {columns.map((col) => (
                    <TableCell key={col.field} align={col.align ?? 'left'}>
                      {col.renderCell
                        ? col.renderCell(row)
                        : cellValue(row, col.field)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>

      {pagination && pagination.total > pagination.pageSize ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: 2,
            py: 1.5,
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {pagination.total} total
          </Typography>
          <Pagination
            color="primary"
            page={pagination.page}
            count={pageCount}
            onChange={(_, next) => pagination.onPageChange(next)}
          />
        </Box>
      ) : null}
    </Paper>
  )
}

export default DataTable
