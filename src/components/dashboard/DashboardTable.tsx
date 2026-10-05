import {
  Box,
  Button,
  Checkbox,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { ActionDef, ColumnDef } from '../../config/types'
import type { DashboardTableRow } from '../../types/workflow'
import { Can } from '../../rbac/Can'
import { Permission } from '../../rbac/permissions'
import type { AssigneeOption } from '../../services/assigneesApi'
import { brand } from '../../theme/brand'

const UNASSIGNED_DISPLAY = 'Unassigned'
const ASSIGN_DROPDOWN_ACTIONS = new Set(['assign_to_me'])

type Props = {
  columns: ColumnDef[]
  rows: DashboardTableRow[]
  actions: ActionDef[]
  selectable: boolean
  selectedIds: string[]
  assigneeOptions?: AssigneeOption[]
  onToggleSelected: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onRowAction: (actionId: string, row: DashboardTableRow) => void
  onAssignSelect: (row: DashboardTableRow, assignee: AssigneeOption) => void
  onBulkAction: (actionId: string) => void
}

export function DashboardTable({
  columns,
  rows,
  actions,
  selectable,
  selectedIds,
  assigneeOptions = [],
  onToggleSelected,
  onSelectAll,
  onRowAction,
  onAssignSelect,
  onBulkAction
}: Props) {
  const allIds = rows.map((r) => r.id)
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
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
          Requests
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{ ml: 1 }}
          >
            ({rows.length})
          </Typography>
        </Typography>
        {selectable && bulkActions.length > 0 && selectedIds.length > 0 ? (
          <Stack direction="row" spacing={1}>
            {bulkActions.map((action) => (
              <Can
                key={action.id}
                permission={action.requiredPermission ?? Permission.DASHBOARD_VIEW}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onBulkAction(action.id)}
                >
                  {action.label} ({selectedIds.length})
                </Button>
              </Can>
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
                    onChange={() => onSelectAll(allSelected ? [] : allIds)}
                  />
                </TableCell>
              ) : null}
              {columns.map((col) => (
                <TableCell key={col.id}>{col.header}</TableCell>
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
                <TableRow
                  key={row.id}
                  hover
                  selected={selectedIds.includes(row.id)}
                >
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
                        action={
                          col.actionId ? actionById[col.actionId] : undefined
                        }
                        assigneeOptions={assigneeOptions}
                        onRowAction={onRowAction}
                        onAssignSelect={onAssignSelect}
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
  assigneeOptions,
  onRowAction,
  onAssignSelect
}: {
  column: ColumnDef
  row: DashboardTableRow
  action?: ActionDef
  assigneeOptions: AssigneeOption[]
  onRowAction: (actionId: string, row: DashboardTableRow) => void
  onAssignSelect: (row: DashboardTableRow, assignee: AssigneeOption) => void
}) {
  // Flat row from workflowMapper; no role switches — config supplies `field`.
  const raw = row[column.field as keyof DashboardTableRow]
  const display =
    raw == null || raw === '' || typeof raw === 'object' ? '—' : String(raw)

  if (!action) {
    return <>{display}</>
  }

  const isAssignDropdown = ASSIGN_DROPDOWN_ACTIONS.has(action.id)
  const isUnassigned =
    display === UNASSIGNED_DISPLAY || display === '—' || raw == null || raw === ''

  // Assign to Me: inline Select instead of a claim/navigate link.
  if (isAssignDropdown && isUnassigned) {
    return (
      <Can permission={action.requiredPermission ?? Permission.DASHBOARD_VIEW}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            displayEmpty
            value=""
            onChange={(event: SelectChangeEvent<string>) => {
              const id = event.target.value
              const option = assigneeOptions.find((o) => o.id === id)
              if (option) onAssignSelect(row, option)
            }}
            renderValue={() => (
              <Typography variant="body2" color="text.secondary">
                Select assignee
              </Typography>
            )}
            inputProps={{ 'aria-label': 'Select assignee' }}
          >
            {assigneeOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Can>
    )
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="body2">{display}</Typography>
      <Can permission={action.requiredPermission ?? Permission.DASHBOARD_VIEW}>
        <Button
          size="small"
          variant="text"
          onClick={() => onRowAction(action.id, row)}
        >
          {action.label}
        </Button>
      </Can>
    </Stack>
  )
}
