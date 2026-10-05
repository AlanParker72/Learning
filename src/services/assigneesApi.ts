import { apiClient } from './apiClient'

/**
 * Assignee options for the analyst-column Assign dropdown.
 * Mock-first (`VITE_USE_MOCK_API`); real path is a placeholder until backend exists.
 */

export type AssigneeOption = {
  id: string
  name: string
}

const MOCK_ASSIGNEES: AssigneeOption[] = [
  { id: 'assignee-alex-rivera', name: 'Alex Rivera' },
  { id: 'assignee-jordan-lee', name: 'Jordan Lee' },
  { id: 'assignee-sam-patel', name: 'Sam Patel' },
  { id: 'assignee-morgan-chen', name: 'Morgan Chen' },
  { id: 'assignee-casey-brooks', name: 'Casey Brooks' }
]

/** List assignees for the inline Assign select. */
export async function getAssigneeOptions(): Promise<AssigneeOption[]> {
  const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false'
  if (useMock) {
    await new Promise((r) => setTimeout(r, 80))
    return MOCK_ASSIGNEES
  }

  const { data } = await apiClient.get<AssigneeOption[]>(
    '/workflow-mgmt/v1/api/workflow/assignees'
  )
  return Array.isArray(data) ? data : []
}

/**
 * Stub assign / claim-as-assign with a chosen name.
 * Mock: resolve; real: POST claim with assignee hint (placeholder body).
 */
export async function assignTaskToAssignee(
  taskId: string,
  assignee: AssigneeOption
): Promise<{ ok: boolean; taskId: string; assignee: AssigneeOption }> {
  const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false'
  if (useMock) {
    await new Promise((r) => setTimeout(r, 100))
    console.info('[mock] assignTaskToAssignee', { taskId, assignee })
    return { ok: true, taskId, assignee }
  }

  const { data } = await apiClient.post(
    `/workflow-mgmt/v1/api/workflow/tasks/${encodeURIComponent(taskId)}/claim`,
    { assigneeId: assignee.id, assigneeName: assignee.name }
  )
  return { ok: true, taskId, assignee, ...(data as object) }
}
