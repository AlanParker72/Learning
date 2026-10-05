import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Snackbar
} from '@mui/material'
import {
  filterByPermission,
  getDashboardConfig
} from '../../config/dashboardConfig'
import { useDashboardData } from '../../hooks/useDashboardData'
import { Can } from '../../rbac/Can'
import { Permission } from '../../rbac/permissions'
import { usePermission } from '../../rbac/usePermission'
import { claimWorkflowTask } from '../../services/dashboardApi'
import { useAuthStore } from '../../store/authStore'
import { useDashboardStore } from '../../store/dashboardStore'
import type { DashboardTableRow } from '../../types/workflow'
import { DashboardFilters as DashboardFiltersBar } from './DashboardFilters'
import { DashboardHeader } from './DashboardHeader'
import { DashboardTable } from './DashboardTable'
import { DashboardTabs } from './DashboardTabs'

/**
 * Generic dashboard shell — role differences come from config + permissions.
 * No `role === …` branching in presentational children.
 *
 * On mount / when role|tab|filters change: TanStack Query → getDashboardData.
 */
export function Dashboard() {
  const activeRole = useAuthStore((s) => s.activeRole)
  const { can } = usePermission()

  const activeTab = useDashboardStore((s) => s.activeTab)
  const filters = useDashboardStore((s) => s.filters)
  const selectedIds = useDashboardStore((s) => s.selectedIds)
  const setActiveTab = useDashboardStore((s) => s.setActiveTab)
  const setFilter = useDashboardStore((s) => s.setFilter)
  const resetFilters = useDashboardStore((s) => s.resetFilters)
  const toggleSelected = useDashboardStore((s) => s.toggleSelected)
  const setSelectedIds = useDashboardStore((s) => s.setSelectedIds)
  const clearSelection = useDashboardStore((s) => s.clearSelection)
  const hydrateForRole = useDashboardStore((s) => s.hydrateForRole)

  const [toast, setToast] = useState<string | null>(null)

  const config = getDashboardConfig(activeRole)
  const visibleTabs = filterByPermission(config.tabs, can)
  const visibleFilters = filterByPermission(config.filters, can)
  const visibleActions = filterByPermission(config.actions, can)

  const headerActions = visibleActions.filter((a) => a.placement === 'header')
  const tableActions = visibleActions.filter(
    (a) => a.placement === 'row' || a.placement === 'bulk'
  )

  // Reset tab/filters when temp role changes (not on every tab click)
  useEffect(() => {
    hydrateForRole(getDashboardConfig(activeRole).defaultTab)
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

  const visibleColumns = activeTabDef
    ? filterByPermission(activeTabDef.columns, can)
    : []

  const { data, isLoading, isError, isFetching, refetch } = useDashboardData(
    activeRole,
    queryTab,
    filters
  )

  if (!can(Permission.DASHBOARD_VIEW)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">You do not have access to this dashboard.</Alert>
      </Container>
    )
  }

  const handleRowAction = async (
    actionId: string,
    row: DashboardTableRow
  ) => {
    if (actionId === 'claim' || actionId === 'assign_to_me') {
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="xl">
        <Paper sx={{ p: { xs: 2, md: 3 } }} elevation={0} variant="outlined">
          <DashboardHeader
            config={config}
            headerActions={headerActions}
            selectedCount={selectedIds.length}
            onHeaderAction={(actionId) => {
              setToast(
                `${actionId} — ${selectedIds.length || 'no'} selected (UI only; server enforces)`
              )
              if (actionId === 'assign_records') clearSelection()
            }}
          />

          <DashboardTabs
            tabs={visibleTabs}
            activeTab={queryTab}
            tabCounts={data?.tabCounts}
            onChange={setActiveTab}
          />

          <DashboardFiltersBar
            filters={visibleFilters}
            values={filters}
            onChange={setFilter}
            onReset={resetFilters}
          />

          <Can permission={Permission.WIDGET_TABLE}>
            {isLoading || (isFetching && !data) ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={32} />
              </Box>
            ) : isError ? (
              <Alert severity="error">Failed to load dashboard data.</Alert>
            ) : (
              <DashboardTable
                columns={visibleColumns}
                rows={data?.rows ?? []}
                actions={tableActions}
                selectable={Boolean(activeTabDef?.selectable)}
                selectedIds={selectedIds}
                onToggleSelected={toggleSelected}
                onSelectAll={setSelectedIds}
                onRowAction={handleRowAction}
                onBulkAction={(actionId) => {
                  setToast(
                    `${actionId} for ${selectedIds.join(', ') || 'none'}`
                  )
                  clearSelection()
                }}
              />
            )}
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

export default Dashboard
