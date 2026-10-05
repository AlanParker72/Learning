import type { Role } from '../rbac/roles'
import type { DashboardDataResponse, DashboardFilters } from '../config/types'
import type { WorkflowTaskItem, WorkflowTasksRequest } from '../types/workflow'
import { apiClient } from './apiClient'
import { mockItemsForTab, mockTabCounts } from './mocks'
import {
  applyClientFilters,
  mapWorkflowItemsToRows
} from './workflowMapper'

export type GetDashboardDataParams = {
  role: Role
  tab: string
  filters: DashboardFilters
  page?: number
  size?: number
}

/**
 * Product-specified path (claim URL used with list filter body on load):
 *   POST /workflow-mgmt/v1/api/workflow/tasks/{task_id}/claim?page=&size=
 *
 * When list-on-load has no real task id, use `VITE_WORKFLOW_TASK_ID` or the
 * tab-scoped sentinel below. Real claim actions should pass the row's taskId.
 *
 * If the backend later exposes a dedicated list endpoint, prefer
 * `WORKFLOW_TASKS_LIST_PATH` and keep `workflowClaimPath` for claim mutations.
 */
export const WORKFLOW_TASKS_LIST_PATH =
  '/workflow-mgmt/v1/api/workflow/tasks'

export function workflowClaimPath(taskId: string): string {
  return `/workflow-mgmt/v1/api/workflow/tasks/${encodeURIComponent(taskId)}/claim`
}

/** Sentinel / env task id for list-on-load when no row task is selected. */
export function resolveListTaskId(tab: string): string {
  const fromEnv = import.meta.env.VITE_WORKFLOW_TASK_ID?.trim()
  if (fromEnv) return fromEnv
  return `dashboard-list-${tab}`
}

/** Map Zustand tab → API `status` filter values. */
export function statusForTab(tab: string): string[] {
  switch (tab) {
    case 'unassigned':
      return ['UNASSIGNED', 'CREATED']
    case 'team_tasks':
      return ['IN_PROGRESS', 'ASSIGNED', 'IN_REVIEW']
    case 'my_tasks':
      return ['IN_PROGRESS', 'ASSIGNED', 'IN_REVIEW']
    case 'completed':
      return ['COMPLETED']
    default:
      return []
  }
}

/** Map role → `requestGroup` hint (backend re-validates from session). */
export function requestGroupForRole(role: Role): string[] {
  switch (role) {
    case 'Q_MANAGER':
    case 'Q_ANALYST':
      return ['QC']
    case 'O_MANAGER':
    case 'O_ANALYST':
      return ['ONBOARDING']
    default:
      return []
  }
}

/**
 * Build the workflow list/claim filter body from role + activeTab + filters.
 * Do not fetch all roles' data and hide — scope the request here.
 */
export function buildWorkflowTasksRequest(
  params: GetDashboardDataParams
): WorkflowTasksRequest {
  const name = (params.filters.applicantName ?? '').trim()
  return {
    // Applicant name has no dedicated body field; reuse submittedBy as a hint.
    submittedBy: name ? [name] : [],
    assignmentOrg: [],
    status: statusForTab(params.tab),
    requestGroup: requestGroupForRole(params.role),
    channel: [],
    startDate: (params.filters.startDate ?? '').trim(),
    endDate: (params.filters.endDate ?? '').trim()
  }
}

/**
 * Dashboard list fetch used on mount and when role|tab|filters change.
 *
 * SECURITY: Backend must authorize from the authenticated session.
 * Client-sent `role` / filters are UX hints only — not security.
 */
export async function getDashboardData(
  params: GetDashboardDataParams
): Promise<DashboardDataResponse> {
  const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false'
  const page = params.page ?? 0
  const size = params.size ?? 10

  if (useMock) {
    await new Promise((r) => setTimeout(r, 160))
    // Empty when role lacks the tab permission; otherwise that role’s mock file + tab.
    const items = mockItemsForTab(params.role, params.tab)
    const rows = applyClientFilters(mapWorkflowItemsToRows(items), {
      applicantName: params.filters.applicantName,
      id: params.filters.id
    })
    return {
      role: params.role,
      tab: params.tab,
      rows,
      total: rows.length,
      tabCounts: mockTabCounts(params.role)
    }
  }

  const items = await fetchWorkflowTasks(params, page, size)
  const rows = applyClientFilters(mapWorkflowItemsToRows(items), {
    applicantName: params.filters.applicantName,
    id: params.filters.id
  })

  return {
    role: params.role,
    tab: params.tab,
    rows,
    total: rows.length,
    tabCounts: { [params.tab]: rows.length }
  }
}

/**
 * POST list call matching the user-provided claim URL + filter body.
 * Method name reflects list/dashboard usage; path is the product claim path.
 */
export async function fetchWorkflowTasks(
  params: GetDashboardDataParams,
  page = 0,
  size = 10
): Promise<WorkflowTaskItem[]> {
  const taskId = resolveListTaskId(params.tab)
  const body = buildWorkflowTasksRequest(params)

  const { data } = await apiClient.post<WorkflowTaskItem[]>(
    workflowClaimPath(taskId),
    body,
    { params: { page, size } }
  )
  return Array.isArray(data) ? data : []
}

/**
 * Claim a concrete task (row action). Uses the real `taskId` from the row.
 * Available when config grants claim / assign_to_me permission.
 */
export async function claimWorkflowTask(taskId: string): Promise<unknown> {
  const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false'
  if (useMock) {
    await new Promise((r) => setTimeout(r, 120))
    return { ok: true, taskId, mocked: true }
  }

  // Empty filter body — claim is authorized from session + path task id.
  const body: WorkflowTasksRequest = {
    submittedBy: [],
    assignmentOrg: [],
    status: [],
    requestGroup: [],
    channel: [],
    startDate: '',
    endDate: ''
  }
  const { data } = await apiClient.post(workflowClaimPath(taskId), body)
  return data
}
