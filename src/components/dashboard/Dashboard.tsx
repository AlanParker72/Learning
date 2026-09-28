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
import { RoleSwitcher } from './RoleSwitcher'

/**
 * Thin demo shell — RBAC wiring only:
 *   RoleSwitcher → permissions for role → filtered config tabs → `<Can>`
 *
 * No tables, filters UI, widgets, or charts.
 */
export function Dashboard() {
  const activeRole = useAuthStore((s) => s.activeRole)
  const { can, permissions } = usePermission()
  const config = getDashboardConfig(activeRole)
  const visibleTabs = filterByPermission(config.tabs, can)

  if (!can(Permission.DASHBOARD_VIEW)) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">You do not have access to this dashboard.</Alert>
      </Container>
    )
  }

  const permissionList = [...permissions]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
          <Stack spacing={2}>
            <Typography variant="h5">{config.title}</Typography>

            {/* TEMP — delete RoleSwitcher when real auth supplies role */}
            <RoleSwitcher />

            <Typography variant="subtitle2">
              Active role: <Chip size="small" label={activeRole} />
            </Typography>

            <Typography variant="subtitle2">Permissions for active role</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {permissionList.map((p) => (
                <Chip key={p} size="small" label={p} variant="outlined" />
              ))}
            </Stack>

            <Typography variant="subtitle2">
              Config tabs filtered by can()
            </Typography>
            {visibleTabs.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tabs visible for this role.
              </Typography>
            ) : (
              <List dense disablePadding>
                {visibleTabs.map((tab) => (
                  <ListItem key={tab.id} disableGutters>
                    <ListItemText
                      primary={tab.label}
                      secondary={`${tab.id}${tab.requiredPermission ? ` · requires ${tab.requiredPermission}` : ''}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}

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
              Pipeline: Role → Permissions → dashboardConfig → can() / &lt;Can&gt; → getDashboardData
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default Dashboard
