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
        alignItems: { xs: 'stretch', md: 'flex-start' },
        gap: 2,
        mb: 2
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          {config.title}
        </Typography>
        {config.subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {config.subtitle}
          </Typography>
        ) : null}
      </Box>

      <Stack spacing={1.5} alignItems={{ xs: 'stretch', md: 'flex-end' }}>
        <RoleSwitcher />
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
          {headerActions.map((action) => (
            <Can
              key={action.id}
              permission={action.requiredPermission ?? Permission.DASHBOARD_VIEW}
            >
              <Button
                variant="contained"
                onClick={() => onHeaderAction(action.id)}
                disabled={
                  action.id === 'assign_records' && selectedCount === 0
                    ? false
                    : false
                }
              >
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
