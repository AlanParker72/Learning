import { useEffect, useMemo } from 'react'
import { Alert, Box, Container, Paper } from '@mui/material'
import { useSnackbar } from 'notistack'
import {
  filterByPermission,
  getDashboardConfig
} from '../../config/dashboardConfig'
import { useRbacDashboardData } from '../../hooks/useRbacDashboardData'
import { Permission } from '../../rbac/permissions'
import { usePermission } from '../../rbac/usePermission'
import { useAuthStore } from '../../store/authStore'
import { useDashboardStore } from '../../store/dashboardStore'
import { DashboardContent } from './DashboardContent'
import { DashboardFilters as DashboardFiltersBar } from './DashboardFilters'
import { DashboardHeader } from './DashboardHeader'
import { DashboardTabs } from './DashboardTabs'

/**
 * Generic dashboard shell — role differences come from config + permissions.
 * No `role === …` branching in presentational children.
 */
export function Dashboard() {
  const { enqueueSnackbar } = useSnackbar()
  const activeRole = useAuthStore((s) => s.activeRole)
  const { can, permissions } = usePermission()

  const activeTab = useDashboardStore((s) => s.activeTab)
  const filters = useDashboardStore((s) => s.filters)
  const selectedIds = useDashboardStore((s) => s.selectedIds)
  const setActiveTab = useDashboardStore((s) => s.setActiveTab)
  const setFilter = useDashboardStore((s) => s.setFilter)
  const resetFilters = useDashboardStore((s) => s.resetFilters)
  const toggleSelected = useDashboardStore((s) => s.toggleSelected)
  const setSelectedIds = useDashboardStore((s) => s.setSelectedIds)
  const clearSelection = useDashboardStore((s) => s.clearSelection)

  const config = useMemo(() => getDashboardConfig(activeRole), [activeRole])

  const visibleTabs = useMemo(
    () => filterByPermission(config.tabs, (p) => permissions.has(p)),
    [config.tabs, permissions]
  )
  const visibleFilters = useMemo(
    () => filterByPermission(config.filters, (p) => permissions.has(p)),
    [config.filters, permissions]
  )
  const visibleWidgets = useMemo(
    () => filterByPermission(config.widgets, (p) => permissions.has(p)),
    [config.widgets, permissions]
  )
  const visibleActions = useMemo(
    () => filterByPermission(config.actions, (p) => permissions.has(p)),
    [config.actions, permissions]
  )

  const headerActions = visibleActions.filter((a) => a.placement === 'header')
  const tableActions = visibleActions.filter(
    (a) => a.placement === 'row' || a.placement === 'bulk'
  )

  // Keep active tab valid when role/config changes
  useEffect(() => {
    if (visibleTabs.length === 0) return
    if (!visibleTabs.some((t) => t.id === activeTab)) {
      setActiveTab(config.defaultTab)
    }
  }, [visibleTabs, activeTab, config.defaultTab, setActiveTab])

  const activeTabDef = visibleTabs.find((t) => t.id === activeTab) ?? visibleTabs[0]
  const queryTab = activeTabDef?.id ?? config.defaultTab

  const { data, isLoading, isError } = useRbacDashboardData(
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

  const notify = (message: string) => {
    enqueueSnackbar(message, { variant: 'info' })
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
              notify(
                `${actionId} — ${selectedIds.length || 'no'} selected (mock)`
              )
              if (actionId === 'assign_records') clearSelection()
            }}
          />

          <DashboardTabs
            tabs={visibleTabs}
            activeTab={queryTab}
            onChange={setActiveTab}
          />

          <DashboardFiltersBar
            filters={visibleFilters}
            values={filters}
            onChange={setFilter}
            onReset={resetFilters}
          />

          <DashboardContent
            widgets={visibleWidgets}
            activeTabDef={activeTabDef}
            actions={tableActions}
            data={data}
            isLoading={isLoading}
            isError={isError}
            selectedIds={selectedIds}
            onToggleSelected={toggleSelected}
            onSelectAll={setSelectedIds}
            onRowAction={(actionId, rowId) => {
              notify(`${actionId} on ${rowId} (mock)`)
            }}
            onBulkAction={(actionId) => {
              notify(`${actionId} for ${selectedIds.join(', ') || 'none'} (mock)`)
              clearSelection()
            }}
          />
        </Paper>
      </Container>
    </Box>
  )
}

export default Dashboard
