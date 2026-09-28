import { describe, expect, it } from 'vitest'
import { permissionsForRoles } from './rolePermissions'
import { Permission } from './permissions'
import { Role } from './roles'
import { filterByPermission, getDashboardConfig } from '../config/dashboardConfig'

describe('RBAC skeleton', () => {
  it('maps O_MANAGER to example action permission', () => {
    const perms = permissionsForRoles([Role.O_MANAGER])
    expect(perms.has(Permission.ACTION_EXAMPLE)).toBe(true)
    expect(perms.has(Permission.DASHBOARD_VIEW)).toBe(true)
  })

  it('filters config tabs by permission', () => {
    const config = getDashboardConfig(Role.O_MANAGER)
    const can = (p: Permission) => permissionsForRoles([Role.O_MANAGER]).has(p)
    const tabs = filterByPermission(config.tabs, can)
    expect(tabs.map((t) => t.id)).toEqual(['example'])
  })
})
