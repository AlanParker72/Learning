import { useQuery } from '@tanstack/react-query'
import { getDashboardData } from '../services/dashboardApi'
import type { Role } from '../rbac/roles'
import type { DashboardFilters } from '../config/types'

export function useRbacDashboardData(
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
