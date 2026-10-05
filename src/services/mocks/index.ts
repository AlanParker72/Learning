/**
 * Per-role mock workflow data.
 *
 * Edit a role’s rows in its file:
 *   qManager.ts  → MOCK_Q_MANAGER
 *   qAnalyst.ts  → MOCK_Q_ANALYST
 *   oManager.ts  → MOCK_O_MANAGER
 *   oAnalyst.ts  → MOCK_O_ANALYST
 *
 * `mockItemsForTab` still denies tabs the role lacks permission for.
 */
import {
  isDashboardTabId,
  TAB_REQUIRED_PERMISSION,
  type DashboardTabId
} from '../../rbac/permissions'
import { roleHasPermission } from '../../rbac/rolePermissions'
import { Role } from '../../rbac/roles'
import type { WorkflowTaskItem } from '../../types/workflow'
import {
  buildItem,
  type RequestDomain,
  type RoleMockSeeds
} from './helpers'
import { MOCK_O_ANALYST } from './oAnalyst'
import { MOCK_O_MANAGER } from './oManager'
import { MOCK_Q_ANALYST } from './qAnalyst'
import { MOCK_Q_MANAGER } from './qManager'

export { MOCK_O_ANALYST } from './oAnalyst'
export { MOCK_O_MANAGER } from './oManager'
export { MOCK_Q_ANALYST } from './qAnalyst'
export { MOCK_Q_MANAGER } from './qManager'

const MOCK_BY_ROLE: Record<Role, RoleMockSeeds> = {
  [Role.Q_MANAGER]: MOCK_Q_MANAGER,
  [Role.Q_ANALYST]: MOCK_Q_ANALYST,
  [Role.O_MANAGER]: MOCK_O_MANAGER,
  [Role.O_ANALYST]: MOCK_O_ANALYST
}

function domainForRole(role: Role): RequestDomain {
  switch (role) {
    case Role.O_MANAGER:
    case Role.O_ANALYST:
      return 'ONBOARDING'
    default:
      return 'QC'
  }
}

function roleCanAccessTab(role: Role, tab: string): tab is DashboardTabId {
  if (!isDashboardTabId(tab)) return false
  return roleHasPermission(role, TAB_REQUIRED_PERMISSION[tab])
}

/**
 * Rows for one tab from that role’s mock file.
 * Empty if the role lacks the tab permission.
 */
export function mockItemsForTab(role: Role, tab: string): WorkflowTaskItem[] {
  if (!roleCanAccessTab(role, tab)) return []
  const seeds = MOCK_BY_ROLE[role]?.[tab] ?? []
  const domain = domainForRole(role)
  return seeds.map((seed) => buildItem(seed, domain, tab))
}

/** Counts only for tabs the role can see (from that role’s mock file). */
export function mockTabCounts(role: Role): Record<string, number> {
  const counts: Record<string, number> = {}
  const roleSeeds = MOCK_BY_ROLE[role]
  for (const tab of Object.keys(TAB_REQUIRED_PERMISSION) as DashboardTabId[]) {
    if (!roleCanAccessTab(role, tab)) continue
    counts[tab] = roleSeeds[tab]?.length ?? 0
  }
  return counts
}
