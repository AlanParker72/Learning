import { Box, Button, Stack, Typography } from '@mui/material'
import type { ActionDef, DashboardConfig } from '../../config/types'
import { Can } from '../../rbac/Can'
import { Permission } from '../../rbac/permissions'
import { RoleSwitcher } from './RoleSwitcher'

type Props = {
  config: DashboardConfig
  headerActions: ActionDef[]
  selectedCount: number
  onHeaderAction: (actionId: string) => void
}

export function DashboardHeader({
  config,
  headerActions,
  selectedCount,
  onHeaderAction
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 2
      }}
    >
      <Box>
        <Can permission={config.titleRequiredPermission ?? Permission.HEADING_TITLE}>
          <Typography variant="h5" fontWeight={700}>
            {config.title}
          </Typography>
        </Can>
        {config.subtitle ? (
          <Can
            permission={
              config.subtitleRequiredPermission ?? Permission.HEADING_SUBTITLE
            }
          >
            <Typography variant="body2" color="text.secondary">
              {config.subtitle}
            </Typography>
          </Can>
        ) : null}
      </Box>

      <Stack spacing={1.5} alignItems={{ xs: 'stretch', md: 'flex-end' }}>
        {/* TEMP — delete RoleSwitcher when real auth supplies role */}
        <RoleSwitcher />
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
          {headerActions.map((action) => (
            <Can
              key={action.id}
              permission={action.requiredPermission ?? Permission.DASHBOARD_VIEW}
            >
              <Button variant="contained" onClick={() => onHeaderAction(action.id)}>
                {action.label}
                {action.id === 'assign_records' && selectedCount > 0
                  ? ` (${selectedCount})`
                  : ''}
              </Button>
            </Can>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
