import type { Role } from '../rbac/roles'
import type { DashboardDataResponse, DashboardFilters } from '../config/types'
import { apiClient } from './apiClient'

export type GetDashboardDataParams = {
  role: Role
  tab: string
  filters: DashboardFilters
}

/**
 * Data-fetch stub — kept so the Role → Permissions → Config → API pipeline stays visible.
 *
 * Signature: `getDashboardData({ role, tab, filters })`.
 * TODO: implement against the real API. Backend must authorize from the session —
 * never trust the client-sent `role`.
 */
export async function getDashboardData(
  params: GetDashboardDataParams
): Promise<DashboardDataResponse> {
  const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false'

  if (useMock) {
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
