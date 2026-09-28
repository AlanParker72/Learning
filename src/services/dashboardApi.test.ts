import { describe, expect, it } from 'vitest'
import { getDashboardData } from '../services/dashboardApi'
import { Role } from '../rbac/roles'

describe('getDashboardData mock', () => {
  it('returns only requested role+tab rows (not all roles)', async () => {
    const data = await getDashboardData({
      role: Role.O_ANALYST,
      tab: 'my_tasks',
      filters: {}
    })
    expect(data.role).toBe(Role.O_ANALYST)
    expect(data.tab).toBe('my_tasks')
    expect(data.rows.length).toBeGreaterThan(0)
    expect(data.rows.every((r) => r.requestId.startsWith('ONB-2'))).toBe(true)
  })

  it('applies name filter server-side in mock', async () => {
    const data = await getDashboardData({
      role: Role.Q_MANAGER,
      tab: 'unassigned',
      filters: { name: 'Blue' }
    })
    expect(data.rows).toHaveLength(1)
    expect(data.rows[0].name).toContain('Blue')
  })

  it('returns QC analyst unassigned with Assign-to-me eligible rows', async () => {
    const data = await getDashboardData({
      role: Role.Q_ANALYST,
      tab: 'unassigned',
      filters: {}
    })
    expect(data.rows.every((r) => !r.qcAnalyst)).toBe(true)
  })
})
