import { describe, expect, it } from 'vitest'
import { permissionsForRoles } from '../rbac/rolePermissions'
import { Permission } from '../rbac/permissions'
import { Role } from '../rbac/roles'
import {
  filterByPermission,
  getDashboardConfig
} from '../config/dashboardConfig'

describe('RBAC role → permissions', () => {
  it('gives O_MANAGER reassign but not assign_to_me', () => {
    const perms = permissionsForRoles([Role.O_MANAGER])
    expect(perms.has(Permission.ACTION_REASSIGN)).toBe(true)
    expect(perms.has(Permission.ACTION_ASSIGN_TO_ME)).toBe(false)
    expect(perms.has(Permission.TAB_TEAM_WORK)).toBe(true)
  })

  it('gives O_ANALYST my_tasks + assign_to_me', () => {
    const perms = permissionsForRoles([Role.O_ANALYST])
    expect(perms.has(Permission.TAB_MY_TASKS)).toBe(true)
    expect(perms.has(Permission.ACTION_ASSIGN_TO_ME)).toBe(true)
    expect(perms.has(Permission.ACTION_REASSIGN)).toBe(false)
  })

  it('gives Q_MANAGER bulk assign + date filters', () => {
    const perms = permissionsForRoles([Role.Q_MANAGER])
    expect(perms.has(Permission.ACTION_BULK_ASSIGN)).toBe(true)
    expect(perms.has(Permission.FILTER_DATE_RANGE)).toBe(true)
    expect(perms.has(Permission.TAB_TEAM_TASKS)).toBe(true)
  })

  it('unions permissions across roles', () => {
    const perms = permissionsForRoles([Role.O_ANALYST, Role.Q_ANALYST])
    expect(perms.has(Permission.ACTION_ASSIGN_TO_ME)).toBe(true)
    expect(perms.has(Permission.TAB_MY_TASKS)).toBe(true)
  })
})

describe('dashboardConfig by role', () => {
  it('O_MANAGER has Unassigned / Team Work / Completed', () => {
    const config = getDashboardConfig(Role.O_MANAGER)
    expect(config.tabs.map((t) => t.id)).toEqual([
      'unassigned',
      'team_work',
      'completed'
    ])
  })

  it('O_ANALYST defaults to my_tasks and has Assign to Me action', () => {
    const config = getDashboardConfig(Role.O_ANALYST)
    expect(config.defaultTab).toBe('my_tasks')
    expect(config.actions.some((a) => a.id === 'assign_to_me')).toBe(true)
  })

  it('Q_MANAGER tabs are selectable for bulk assign', () => {
    const config = getDashboardConfig(Role.Q_MANAGER)
    const unassigned = config.tabs.find((t) => t.id === 'unassigned')
    expect(unassigned?.selectable).toBe(true)
    expect(config.filters.some((f) => f.id === 'dateFrom')).toBe(true)
  })

  it('filters config items by permission', () => {
    const config = getDashboardConfig(Role.O_ANALYST)
    const can = (p: Permission) =>
      permissionsForRoles([Role.O_ANALYST]).has(p)
    const tabs = filterByPermission(config.tabs, can)
    expect(tabs.map((t) => t.id)).toEqual(['my_tasks', 'unassigned'])
    expect(tabs.some((t) => t.id === 'team_work')).toBe(false)
  })
})
