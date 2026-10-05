import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Typography
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useQuery } from '@tanstack/react-query'
import {
  filterByPermission,
  getDashboardConfig,
  resolveActionsForTab,
  resolveFiltersForTab
} from '../../config/dashboardConfig'
import type { ActionDef, ColumnDef } from '../../config/types'
import { useDashboardData } from '../../hooks/useDashboardData'
import { Can } from '../../rbac/Can'
import { Permission } from '../../rbac/permissions'
import { ROLE_PERMISSIONS } from '../../rbac/rolePermissions'
import { usePermission } from '../../rbac/usePermission'
import {
  assignTaskToAssignee,
  getAssigneeOptions,
  type AssigneeOption
} from '../../services/assigneesApi'
import { claimWorkflowTask } from '../../services/dashboardApi'
import { useAuthStore } from '../../store/authStore'
import { useDashboardStore } from '../../store/dashboardStore'
import type { DashboardTableRow } from '../../types/workflow'
import {
  DataTable,
  type DataTableColumn
} from '../company/DataTable'
import { NoResultsView } from '../company/NoResultsView'
import { Spinner } from '../company/Spinner'
import { DashboardFilters as DashboardFiltersBar } from './DashboardFilters'
import { DashboardTabs } from './DashboardTabs'

const UNASSIGNED_DISPLAY = 'Unassigned'
const ASSIGN_DROPDOWN_ACTIONS = new Set(['assign_to_me'])
const PAGE_SIZE = 10

/**
 * Generic dashboard shell — role differences come from config + permissions.
 * No `role === …` branching in presentational children.
 *
 * Table UI follows the company DataTable pattern:
 *   loading → Spinner | error → Alert | rows → DataTable | empty → NoResultsView
 *
 * Columns: role tab `{ field, header }` → DataTable `{ field, headerName, renderCell }`.
 */
export function Dashboard() {
  const activeRole = useAuthStore((s) => s.activeRole)
  const { can } = usePermission()
  const rolePermissions = ROLE_PERMISSIONS[activeRole]

  const activeTab = useDashboardStore((s) => s.activeTab)
  const filters = useDashboardStore((s) => s.filters)
  const selectedIds = useDashboardStore((s) => s.selectedIds)
  const setActiveTab = useDashboardStore((s) => s.setActiveTab)
  const setFilter = useDashboardStore((s) => s.setFilter)
  const setFilters = useDashboardStore((s) => s.setFilters)
  const clearFilterKeys = useDashboardStore((s) => s.clearFilterKeys)
  const resetFilters = useDashboardStore((s) => s.resetFilters)
  const hydrateFiltersFromDefs = useDashboardStore(
    (s) => s.hydrateFiltersFromDefs
  )
  const toggleSelected = useDashboardStore((s) => s.toggleSelected)
  const setSelectedIds = useDashboardStore((s) => s.setSelectedIds)
  const clearSelection = useDashboardStore((s) => s.clearSelection)
  const hydrateForRole = useDashboardStore((s) => s.hydrateForRole)

  const [toast, setToast] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const prevTabRef = useRef<string | null>(null)

  const config = getDashboardConfig(activeRole)
  const visibleTabs = filterByPermission(config.tabs, can)

  // Reset tab/filters when role changes (authStore / env — no UI switcher)
  useEffect(() => {
    const cfg = getDashboardConfig(activeRole)
    const perms = ROLE_PERMISSIONS[activeRole]
    const defaultTabDef =
      cfg.tabs.find((t) => t.id === cfg.defaultTab) ?? cfg.tabs[0]
    const defs = defaultTabDef
      ? resolveFiltersForTab(perms, defaultTabDef)
      : []
    hydrateForRole(cfg.defaultTab, defs)
    prevTabRef.current = cfg.defaultTab
  }, [activeRole, hydrateForRole])

  useEffect(() => {
    if (visibleTabs.length === 0) return
    if (!visibleTabs.some((t) => t.id === activeTab)) {
      setActiveTab(config.defaultTab)
    }
  }, [visibleTabs, activeTab, config.defaultTab, setActiveTab])

  const activeTabDef =
    visibleTabs.find((t) => t.id === activeTab) ?? visibleTabs[0]
  const queryTab = activeTabDef?.id ?? config.defaultTab

  const visibleFilters = useMemo(
    () =>
      activeTabDef
        ? resolveFiltersForTab(rolePermissions, activeTabDef)
        : [],
    [activeTabDef, rolePermissions]
  )

  useEffect(() => {
    if (!activeTabDef) return
    if (prevTabRef.current === activeTabDef.id) return
    prevTabRef.current = activeTabDef.id
    hydrateFiltersFromDefs(
      resolveFiltersForTab(ROLE_PERMISSIONS[activeRole], activeTabDef)
    )
  }, [activeRole, activeTabDef, hydrateFiltersFromDefs])

  const visibleActions = useMemo(
    () =>
      activeTabDef
        ? resolveActionsForTab(
            rolePermissions,
            activeTabDef,
            config.actionPermissions ?? []
          )
        : [],
    [activeTabDef, config.actionPermissions, rolePermissions]
  )

  const filterBarActions = visibleActions.filter(
    (a) => a.placement === 'filterBar'
  )
  const tableActions = visibleActions.filter(
    (a) => a.placement === 'row' || a.placement === 'bulk'
  )
  const bulkActions = tableActions.filter((a) => a.placement === 'bulk')
  const hasBulkSelect = visibleActions.some((a) => a.id === 'bulk_select')
  const selectable =
    Boolean(activeTabDef?.selectable) || hasBulkSelect

  const visibleColumns = activeTabDef?.columns ?? []

  const { data, isLoading, isError, isFetching, refetch } = useDashboardData(
    activeRole,
    queryTab,
    filters
  )

  const rows = data?.rows ?? []

  // Client-side page resets when the result set identity changes.
  useEffect(() => {
    setPage(1)
  }, [activeRole, queryTab, filters, rows.length])

  const needsAssigneeOptions = visibleActions.some(
    (a) => a.id === 'assign_to_me'
  )
  const { data: assigneeOptions = [] } = useQuery({
    queryKey: ['assignee-options'],
    queryFn: getAssigneeOptions,
    enabled: needsAssigneeOptions,
    staleTime: 60_000
  })

  const handleRowAction = async (
    actionId: string,
    row: DashboardTableRow
  ) => {
    if (actionId === 'claim') {
      if (!row.taskId) {
        setToast('No task id available to claim')
        return
      }
      try {
        await claimWorkflowTask(row.taskId)
        setToast(`Claimed ${row.idNumber}`)
        void refetch()
      } catch {
        setToast('Claim failed')
      }
      return
    }
    setToast(`${actionId} on ${row.idNumber}`)
  }

  const handleAssignSelect = async (
    row: DashboardTableRow,
    assignee: AssigneeOption
  ) => {
    if (!row.taskId) {
      setToast('No task id available to assign')
      return
    }
    try {
      await assignTaskToAssignee(row.taskId, assignee)
      setToast(`Assigned ${row.idNumber} to ${assignee.name}`)
      void refetch()
    } catch {
      setToast('Assign failed')
    }
  }

  const actionById = useMemo(
    () => Object.fromEntries(tableActions.map((a) => [a.id, a])),
    [tableActions]
  )

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return rows.slice(start, start + PAGE_SIZE)
  }, [page, rows])

  const allIds = rows.map((r) => r.id)
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))

  // Role tab columns → company DataTable columns (header → headerName + renderCell).
  const dataTableColumns = useMemo((): DataTableColumn<DashboardTableRow>[] => {
    const mapped: DataTableColumn<DashboardTableRow>[] = visibleColumns.map(
      (col) => ({
        field: String(col.field),
        headerName: col.header,
        renderCell: (row) =>
          renderRoleCell({
            column: col,
            row,
            action: col.actionId ? actionById[col.actionId] : undefined,
            assigneeOptions,
            onRowAction: handleRowAction,
            onAssignSelect: handleAssignSelect
          })
      })
    )

    if (!selectable) return mapped

    return [
      {
        field: '_select',
        headerName: '',
        widthPercent: 4,
        align: 'center',
        renderCell: (row) => (
          <Checkbox
            size="small"
            checked={selectedIds.includes(row.id)}
            onChange={() => toggleSelected(row.id)}
            inputProps={{ 'aria-label': `Select ${row.idNumber}` }}
          />
        )
      },
      ...mapped
    ]
  }, [
    actionById,
    assigneeOptions,
    selectable,
    selectedIds,
    toggleSelected,
    visibleColumns
  ])

  if (!can(Permission.DASHBOARD_VIEW)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">You do not have access to this dashboard.</Alert>
      </Container>
    )
  }

  const showSpinner = isLoading || (isFetching && !data)
  const showError = !showSpinner && isError
  const showTable = !showSpinner && !showError && rows.length > 0
  const showEmpty = !showSpinner && !showError && rows.length === 0

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="xl">
        <Paper sx={{ p: { xs: 2, md: 3 } }} elevation={0} variant="outlined">
          <DashboardTabs
            tabs={visibleTabs}
            activeTab={queryTab}
            tabCounts={data?.tabCounts}
            onChange={setActiveTab}
          />

          <DashboardFiltersBar
            filters={visibleFilters}
            actions={filterBarActions}
            values={filters}
            onChange={setFilter}
            onSetFilters={setFilters}
            onClearKeys={clearFilterKeys}
            onReset={resetFilters}
            onAction={(actionId) => {
              if (actionId !== 'clear_filters') {
                setToast(actionId)
              }
            }}
          />

          <Can permission={Permission.WIDGET_TABLE}>
            {showSpinner ? <Spinner /> : null}

            {showError ? (
              <Alert severity="error">Failed to load dashboard data.</Alert>
            ) : null}

            {showTable ? (
              <Stack spacing={1.5}>
                {selectable ? (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Checkbox
                      size="small"
                      checked={allSelected}
                      indeterminate={
                        selectedIds.length > 0 && !allSelected
                      }
                      onChange={() =>
                        setSelectedIds(allSelected ? [] : allIds)
                      }
                      inputProps={{ 'aria-label': 'Select all rows' }}
                    />
                    {bulkActions.length > 0 && selectedIds.length > 0 ? (
                      <Stack direction="row" spacing={1}>
                        {bulkActions
                          .filter((a) => a.id !== 'bulk_select')
                          .map((action) => (
                            <Can
                              key={action.id}
                              permission={
                                action.requiredPermission ??
                                Permission.DASHBOARD_VIEW
                              }
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setToast(
                                    `${action.id} for ${selectedIds.join(', ') || 'none'}`
                                  )
                                  clearSelection()
                                }}
                              >
                                {action.label} ({selectedIds.length})
                              </Button>
                            </Can>
                          ))}
                      </Stack>
                    ) : null}
                  </Stack>
                ) : null}

                <DataTable
                  columns={dataTableColumns}
                  rows={pagedRows}
                  rowKey="id"
                  pagination={{
                    page,
                    pageSize: PAGE_SIZE,
                    total: rows.length,
                    onPageChange: setPage
                  }}
                />
              </Stack>
            ) : null}

            {showEmpty ? <NoResultsView /> : null}
          </Can>
        </Paper>
      </Container>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2800}
        onClose={() => setToast(null)}
        message={toast ?? ''}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}

function renderRoleCell({
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
  const raw = row[column.field as keyof DashboardTableRow]
  const display =
    raw == null || raw === '' || typeof raw === 'object' ? '—' : String(raw)

  if (!action) {
    return <>{display}</>
  }

  const isAssignDropdown = ASSIGN_DROPDOWN_ACTIONS.has(action.id)
  const isUnassigned =
    display === UNASSIGNED_DISPLAY ||
    display === '—' ||
    raw == null ||
    raw === ''

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

  // Claim / reassign: plain text + action control
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

export default Dashboard
