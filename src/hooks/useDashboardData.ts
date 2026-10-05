import { useQuery } from '@tanstack/react-query'
import { getDashboardData } from '../services/dashboardApi'
import type { Role } from '../rbac/roles'
import type { DashboardFilters } from '../config/types'

/**
 * TanStack Query wrapper — refetches when role | tab | filters change.
 * Mount of Dashboard with a valid tab triggers the initial load.
 */
export function useDashboardData(
  role: Role,
  tab: string,
  filters: DashboardFilters
) {
  return useQuery({
    queryKey: ['dashboard', role, tab, filters],
    queryFn: () => getDashboardData({ role, tab, filters }),
    enabled: Boolean(role && tab)
  })
}
