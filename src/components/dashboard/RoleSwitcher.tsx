import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { getDashboardConfig } from '../../config/dashboardConfig'
import { ALL_ROLES, ROLE_LABELS, type Role } from '../../rbac/roles'
import { useAuthStore } from '../../store/authStore'
import { useDashboardStore } from '../../store/dashboardStore'

/**
 * TEMP — local role switcher for demos.
 * Removal: delete this file and its import in `Dashboard.tsx`, then drive
 * `authStore` from real session/auth.
 */
export function RoleSwitcher() {
  const activeRole = useAuthStore((s) => s.activeRole)
  const setActiveRole = useAuthStore((s) => s.setActiveRole)
  const hydrateForRole = useDashboardStore((s) => s.hydrateForRole)

  const onChange = (role: Role) => {
    setActiveRole(role)
    hydrateForRole(getDashboardConfig(role).defaultTab)
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
      <Typography variant="caption" color="text.secondary">
        Temp role
      </Typography>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="role-switcher-label">Role</InputLabel>
        <Select
          labelId="role-switcher-label"
          label="Role"
          value={activeRole}
          onChange={(e) => onChange(e.target.value as Role)}
        >
          {ALL_ROLES.map((role) => (
            <MenuItem key={role} value={role}>
              {ROLE_LABELS[role]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}
