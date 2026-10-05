/**
 * Workflow-mgmt API contracts used by the QC / RBAC dashboard.
 *
 * List-on-load uses the product-specified claim URL with a filter body
 * (see `dashboardApi.ts`). Backend must authorize from the session —
 * never trust client-sent `role`.
 */

export type WorkflowTasksRequest = {
  submittedBy: string[]
  assignmentOrg: string[]
  status: string[]
  requestGroup: string[]
  channel: string[]
  /** ISO datetime string, or empty when unset */
  startDate: string
  /** ISO datetime string, or empty when unset */
  endDate: string
}

export type WorkflowActiveTask = {
  taskId: string
  taskName: string
  taskDefinitionKey: string
  executionId: string
  description: string
  assignee: string | null
  processInstanceId: string
  processDefinitionId: string
  candidateGroups: string[]
  formKey: string | null
  processState: string
  priority: number
  createdAt: string
  dueDate: string | null
  claimTime: string | null
  owner: string | null
  state: string
  category: string | null
  tenantId: string | null
  variables: Record<string, string>
}

export type WorkflowTaskItem = {
  processInstanceId: string
  name: string
  businessKey: string
  processDefinitionKey: string
  processDefinitionId: string
  deploymentId: string
  status: string
  createdBy: string
  startedAt: string
  endTime: string | null
  durationInMillis: number | null
  activeTask: WorkflowActiveTask | null
}

/** Display row for the reusable dashboard table (mapper output). */
export type DashboardTableRow = {
  id: string
  taskId: string | null
  idNumber: string
  applicant: string
  daysInQueue: number | string
  daysInReview: number | string
  /** Formatted completion date (Completed tab); `—` when unset. */
  dateCompleted: string
  reviewStatus: string
  obsAnalyst: string
  qcAnalyst: string
  banker: string
  raw: WorkflowTaskItem
}
