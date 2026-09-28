import type { Role } from '../rbac/roles'
import type {
  DashboardChartPoint,
  DashboardDataResponse,
  DashboardFilters,
  DashboardMetric,
  DashboardRecord
} from '../config/types'
import { apiClient } from './apiClient'

export type GetDashboardDataParams = {
  role: Role
  tab: string
  filters: DashboardFilters
}

/**
 * Fetches dashboard data for the active role + tab + filters.
 *
 * Stub/mock path: returns role-scoped mock rows (does NOT fetch all roles
 * and hide client-side). Swap the body for a real `apiClient.get` when the
 * backend contract lands.
 *
 * BACKEND NOTE: Enforce role, tab, and action scope on the server. Do not
 * trust the client `role` parameter — re-resolve from the authenticated session.
 */
export async function getDashboardData(
  params: GetDashboardDataParams
): Promise<DashboardDataResponse> {
  const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false'

  if (useMock) {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 180))
    return buildMockResponse(params)
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

function buildMockResponse({
  role,
  tab,
  filters
}: GetDashboardDataParams): DashboardDataResponse {
  const pool = MOCK_ROWS_BY_ROLE[role] ?? []
  let rows = pool.filter((row) => row._tabs.includes(tab))

  const nameQ = (filters.name ?? '').trim().toLowerCase()
  const idQ = (filters.id ?? '').trim().toLowerCase()
  const statusQ = (filters.status ?? '').trim()

  if (nameQ) {
    rows = rows.filter((r) => r.name.toLowerCase().includes(nameQ))
  }
  if (idQ) {
    rows = rows.filter((r) => r.requestId.toLowerCase().includes(idQ))
  }
  if (statusQ) {
    rows = rows.filter((r) => r.status === statusQ)
  }

  const metrics = metricsFor(role, tab, rows.length)
  const chart = chartFor(role, rows)

  return {
    role,
    tab,
    metrics,
    chart,
    rows: rows.map(({ _tabs, ...rest }) => rest),
    total: rows.length
  }
}

type MockRow = DashboardRecord & { _tabs: string[] }

const MOCK_ROWS_BY_ROLE: Record<Role, MockRow[]> = {
  O_MANAGER: [
    {
      id: 'om-1',
      requestId: 'ONB-1001',
      name: 'Acme Holdings',
      status: 'Unassigned',
      obsAnalyst: null,
      banker: 'J. Rivera',
      _tabs: ['unassigned']
    },
    {
      id: 'om-2',
      requestId: 'ONB-1002',
      name: 'Northwind Bank',
      status: 'Unassigned',
      obsAnalyst: null,
      banker: 'S. Patel',
      _tabs: ['unassigned']
    },
    {
      id: 'om-3',
      requestId: 'ONB-1003',
      name: 'Contoso Retail',
      status: 'In Progress',
      obsAnalyst: 'A. Chen',
      banker: 'M. Brooks',
      assignedAt: '2026-03-12',
      _tabs: ['team_work']
    },
    {
      id: 'om-4',
      requestId: 'ONB-1004',
      name: 'Fabrikam Credit',
      status: 'In Progress',
      obsAnalyst: 'L. Nguyen',
      banker: 'K. Diaz',
      assignedAt: '2026-03-14',
      _tabs: ['team_work']
    },
    {
      id: 'om-5',
      requestId: 'ONB-0990',
      name: 'Adventure Works',
      status: 'Completed',
      obsAnalyst: 'A. Chen',
      banker: 'J. Rivera',
      completedAt: '2026-03-01',
      _tabs: ['completed']
    }
  ],
  O_ANALYST: [
    {
      id: 'oa-1',
      requestId: 'ONB-2001',
      name: 'Litware Capital',
      status: 'In Progress',
      obsAnalyst: 'You',
      banker: 'T. Wells',
      _tabs: ['my_tasks']
    },
    {
      id: 'oa-2',
      requestId: 'ONB-2002',
      name: 'Tailspin Mutual',
      status: 'In Progress',
      obsAnalyst: 'You',
      banker: 'R. Kim',
      _tabs: ['my_tasks']
    },
    {
      id: 'oa-3',
      requestId: 'ONB-2010',
      name: 'Wide World Importers',
      status: 'Unassigned',
      obsAnalyst: null,
      banker: 'P. Ortiz',
      _tabs: ['unassigned']
    },
    {
      id: 'oa-4',
      requestId: 'ONB-2011',
      name: 'Alpine Banking',
      status: 'Unassigned',
      obsAnalyst: null,
      banker: 'C. Frost',
      _tabs: ['unassigned']
    }
  ],
  Q_MANAGER: [
    {
      id: 'qm-1',
      requestId: 'QC-3001',
      name: 'Blue Yonder',
      status: 'Unassigned',
      obsAnalyst: 'A. Chen',
      qcAnalyst: null,
      banker: 'J. Rivera',
      _tabs: ['unassigned']
    },
    {
      id: 'qm-2',
      requestId: 'QC-3002',
      name: 'Proseware Trust',
      status: 'Unassigned',
      obsAnalyst: 'L. Nguyen',
      qcAnalyst: null,
      banker: 'S. Patel',
      _tabs: ['unassigned']
    },
    {
      id: 'qm-3',
      requestId: 'QC-3003',
      name: 'Wingtip Loans',
      status: 'Pending QC Review',
      obsAnalyst: 'A. Chen',
      qcAnalyst: 'M. Torres',
      banker: 'K. Diaz',
      assignedAt: '2026-03-18',
      _tabs: ['team_tasks']
    },
    {
      id: 'qm-4',
      requestId: 'QC-2980',
      name: 'Southridge Credit',
      status: 'Completed',
      obsAnalyst: 'L. Nguyen',
      qcAnalyst: 'M. Torres',
      banker: 'M. Brooks',
      completedAt: '2026-03-05',
      _tabs: ['completed']
    }
  ],
  Q_ANALYST: [
    {
      id: 'qa-1',
      requestId: 'QC-4001',
      name: 'Humongous Insurance',
      status: 'Pending QC Review',
      qcAnalyst: 'You',
      banker: 'T. Wells',
      _tabs: ['my_tasks']
    },
    {
      id: 'qa-2',
      requestId: 'QC-4002',
      name: 'City Power Credit',
      status: 'Pending QC Review',
      qcAnalyst: 'You',
      banker: 'R. Kim',
      _tabs: ['my_tasks']
    },
    {
      id: 'qa-3',
      requestId: 'QC-4010',
      name: 'Graphic Design Institute',
      status: 'Unassigned',
      qcAnalyst: null,
      banker: 'P. Ortiz',
      _tabs: ['unassigned']
    },
    {
      id: 'qa-4',
      requestId: 'QC-4011',
      name: 'Woodgrove Bank',
      status: 'Unassigned',
      qcAnalyst: null,
      banker: 'C. Frost',
      _tabs: ['unassigned']
    }
  ]
}

function metricsFor(role: Role, tab: string, count: number): DashboardMetric[] {
  if (role === 'O_MANAGER' || role === 'Q_MANAGER') {
    return [
      { id: 'visible', label: 'Visible records', value: count },
      { id: 'tab', label: 'Active tab', value: tab.replace(/_/g, ' ') },
      { id: 'role', label: 'Role', value: role }
    ]
  }
  return []
}

function chartFor(role: Role, rows: MockRow[]): DashboardChartPoint[] {
  if (role !== 'O_MANAGER' && role !== 'Q_MANAGER') return []
  const byStatus = new Map<string, number>()
  for (const row of rows) {
    byStatus.set(row.status, (byStatus.get(row.status) ?? 0) + 1)
  }
  return [...byStatus.entries()].map(([name, value]) => ({ name, value }))
}
