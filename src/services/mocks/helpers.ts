import type { DashboardTabId } from '../../rbac/permissions'
import type { WorkflowTaskItem } from '../../types/workflow'

export type RequestDomain = 'QC' | 'ONBOARDING'

/** Compact seed — expand with `buildItem` in the role’s index path. */
export type MockSeed = {
  id: string
  applicant: string
  obsAnalyst?: string
  qcAnalyst?: string
  banker?: string
  reviewStatus: string
  /** Days ago for process `startedAt`. */
  startedDaysAgo: number
  /** Days ago for activeTask `createdAt`. */
  taskDaysAgo: number
  claimDaysAgo?: number | null
  endDaysAgo?: number | null
  assignee?: string | null
  state: string
  status: string
  description?: string
  priority?: number
}

/** Tab → seed rows for one role. Omit tabs the role never uses. */
export type RoleMockSeeds = Partial<
  Record<DashboardTabId, readonly MockSeed[]>
>

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function domainPrefix(domain: RequestDomain): string {
  return domain === 'QC' ? 'QC' : 'ONB'
}

function processKey(domain: RequestDomain): string {
  return domain === 'QC' ? 'qc-review' : 'onboarding'
}

function taskName(domain: RequestDomain): string {
  return domain === 'QC' ? 'QC Review' : 'OBS Review'
}

function candidateGroup(domain: RequestDomain): string {
  return domain === 'QC' ? 'QC_ANALYST' : 'O_ANALYST'
}

function reviewStatusForDomain(status: string, domain: RequestDomain): string {
  if (domain === 'ONBOARDING' && status === 'Pending QC') return 'Pending OBS'
  return status
}

export function buildItem(
  seed: MockSeed,
  domain: RequestDomain,
  tab: DashboardTabId
): WorkflowTaskItem {
  const prefix = domainPrefix(domain)
  const proc = processKey(domain)
  const pi = `pi-${prefix.toLowerCase()}-${seed.id}`
  const taskId = `task-${prefix.toLowerCase()}-${seed.id}`
  const endTime =
    seed.endDaysAgo == null ? null : daysAgo(seed.endDaysAgo)
  const durationInMillis =
    endTime == null
      ? null
      : (seed.startedDaysAgo - (seed.endDaysAgo ?? 0)) * 24 * 60 * 60 * 1000

  const variables: Record<string, string> = {
    applicantName: seed.applicant,
    reviewStatus: reviewStatusForDomain(seed.reviewStatus, domain),
    ...(seed.obsAnalyst ? { obsAnalyst: seed.obsAnalyst } : {}),
    ...(seed.qcAnalyst ? { qcAnalyst: seed.qcAnalyst } : {}),
    ...(seed.banker ? { banker: seed.banker } : {})
  }
  if (tab === 'completed') {
    variables.daysInQueue = '5'
    variables.daysInReview = '14'
    if (endTime) {
      variables.dateCompleted = endTime.slice(0, 10)
    }
  }

  return {
    processInstanceId: pi,
    name: `${taskName(domain)} — ${seed.applicant}`,
    businessKey: `${prefix}-${seed.id}`,
    processDefinitionKey: proc,
    processDefinitionId: `${proc}:1`,
    deploymentId: domain === 'QC' ? 'dep-1' : 'dep-o',
    status: seed.status,
    createdBy: 'system',
    startedAt: daysAgo(seed.startedDaysAgo),
    endTime,
    durationInMillis,
    activeTask: {
      taskId,
      taskName: taskName(domain),
      taskDefinitionKey: domain === 'QC' ? 'qcReview' : 'obsReview',
      executionId: `ex-${seed.id}`,
      description: seed.description ?? '',
      assignee: seed.assignee ?? null,
      processInstanceId: pi,
      processDefinitionId: `${proc}:1`,
      candidateGroups: [candidateGroup(domain)],
      formKey: null,
      processState: seed.status === 'COMPLETED' ? 'COMPLETED' : 'ACTIVE',
      priority: seed.priority ?? 50,
      createdAt: daysAgo(seed.taskDaysAgo),
      dueDate: null,
      claimTime:
        seed.claimDaysAgo == null ? null : daysAgo(seed.claimDaysAgo),
      owner: null,
      state: seed.state,
      category: domain,
      tenantId: null,
      variables
    }
  }
}
