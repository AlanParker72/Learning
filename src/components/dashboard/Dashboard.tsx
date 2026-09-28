import { useEffect, useMemo } from 'react'
import {
  Alert,
  Box,
  Chip,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import {
  filterByPermission,
  getDashboardConfig
} from '../../config/dashboardConfig'
import { Can } from '../../rbac/Can'
import { Permission } from '../../rbac/permissions'
import { usePermission } from '../../rbac/usePermission'
import { useAuthStore } from '../../store/authStore'
import { useDashboardStore } from '../../store/dashboardStore'
import { RoleSwitcher } from './RoleSwitcher'

/**
 * Skeleton shell — demonstrates composition only:
 *   resolve permissions → read config → list tab ids + `<Can>` example
 *
 * No real tables, filters, charts, or widgets. Fill those in later from
 * `dashboardConfig` + `getDashboardData({ role, tab, filters })`.
 */
export function Dashboard() {
  const activeRole = useAuthStore((s) => s.activeRole)
  const { can, permissions } = usePermission()

  const activeTab = useDashboardStore((s) => s.activeTab)
  const setActiveTab = useDashboardStore((s) => s.setActiveTab)

  const config = useMemo(() => getDashboardConfig(activeRole), [activeRole])

  const visibleTabs = useMemo(
    () => filterByPermission(config.tabs, (p) => permissions.has(p)),
    [config.tabs, permissions]
  )

  useEffect(() => {
    if (visibleTabs.length === 0) {
      if (activeTab !== '') setActiveTab('')
      return
    }
    if (!visibleTabs.some((t) => t.id === activeTab)) {
      setActiveTab(config.defaultTab || visibleTabs[0].id)
    }
  }, [visibleTabs, activeTab, config.defaultTab, setActiveTab])

  if (!can(Permission.DASHBOARD_VIEW)) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">You do not have access to this dashboard.</Alert>
      </Container>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
          <Stack spacing={2}>
            <Typography variant="h5">{config.title}</Typography>
            {config.subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {config.subtitle}
              </Typography>
            ) : null}

            {/* TEMP — delete RoleSwitcher when real auth supplies role */}
            <RoleSwitcher />

            <Typography variant="subtitle2">
              Active role: <Chip size="small" label={activeRole} />
            </Typography>

            <Typography variant="subtitle2">Visible tab ids (from config ∩ permissions)</Typography>
            {visibleTabs.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tabs configured for this role yet — fill `dashboardConfigByRole`.
              </Typography>
            ) : (
              <List dense disablePadding>
                {visibleTabs.map((tab) => (
                  <ListItem
                    key={tab.id}
                    disableGutters
                    secondaryAction={
                      tab.id === activeTab ? (
                        <Chip size="small" label="active" color="primary" />
                      ) : null
                    }
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <ListItemText primary={tab.id} secondary={tab.label} />
                  </ListItem>
                ))}
              </List>
            )}

            {/* Prefer `<Can>` / `can()` over `role === …` in UI */}
            <Can
              permission={Permission.ACTION_EXAMPLE}
              fallback={
                <Typography variant="body2" color="text.secondary">
                  &lt;Can permission=&quot;dashboard.action.example&quot;&gt; — hidden for this role
                </Typography>
              }
            >
              <Alert severity="info">
                &lt;Can&gt; example: this role has ACTION_EXAMPLE
              </Alert>
            </Can>

            <Typography variant="caption" color="text.secondary">
              {
                'Pipeline: Role → Permissions → dashboardConfig → Zustand → shell → getDashboardData({ role, tab, filters })'
              }
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default Dashboard
