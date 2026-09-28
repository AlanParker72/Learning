import type { Role } from '../rbac/roles'
import type { DashboardDataResponse, DashboardFilters } from '../config/types'
import { apiClient } from './apiClient'

export type GetDashboardDataParams = {
  role: Role
  tab: string
  filters: DashboardFilters
}

/**
 * Signature locked: `getDashboardData({ role, tab, filters })`.
 *
 * TODO: implement against the real API contract. Until then this returns an
 * empty placeholder (no rich mock datasets).
 *
 * BACKEND: Enforce role/tab/action scope from the session — do not trust
 * the client `role` parameter.
 */
export async function getDashboardData(
  params: GetDashboardDataParams
): Promise<DashboardDataResponse> {
  const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false'

  if (useMock) {
    // Skeleton: empty mock — replace with role-scoped fixtures when needed.
    return {
      role: params.role,
      tab: params.tab,
      rows: [],
      total: 0
    }
  }

  const { data } = await apiClient.get<DashboardDataResponse>('/dashboard', {
    params: {
      role: params.role,
      tab: params.tab,
      ...params.filters
    }
  })
  return data
}
