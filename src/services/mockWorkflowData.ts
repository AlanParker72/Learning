import {
  isDashboardTabId,
  TAB_REQUIRED_PERMISSION,
  type DashboardTabId
} from '../rbac/permissions'
import { roleHasPermission } from '../rbac/rolePermissions'
import { Role } from '../rbac/roles'
import type { WorkflowTaskItem } from '../types/workflow'

type RequestDomain = 'QC' | 'ONBOARDING'

/** Compact seed — one row description, expanded to WorkflowTaskItem at read time. */
type MockSeed = {
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

/**
 * Shared mock pool keyed by **tab id** (not by role).
 * Roles only see a tab when `ROLE_PERMISSIONS` includes that tab’s permission.
 * Domain (QC vs Onboarding) is applied when materializing rows for a role.
 */
const MOCK_SEEDS_BY_TAB: Record<DashboardTabId, readonly MockSeed[]> = {
  unassigned: [
    {
      id: '1001',
      applicant: 'Jordan Lee',
      obsAnalyst: 'A. Chen',
      banker: 'J. Rivera',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 5,
      taskDaysAgo: 4,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'Unassigned review',
      priority: 50
    },
    {
      id: '1002',
      applicant: 'Sam Patel',
      obsAnalyst: 'L. Nguyen',
      banker: 'S. Patel',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 8,
      taskDaysAgo: 7,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'Unassigned review',
      priority: 40
    },
    {
      id: '2002',
      applicant: 'Drew Nash',
      obsAnalyst: 'L. Nguyen',
      banker: 'S. Patel',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 3,
      taskDaysAgo: 2,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'Unassigned pool',
      priority: 45
    }
  ],
  team_tasks: [
    {
      id: '1003',
      applicant: 'Morgan Blake',
      obsAnalyst: 'A. Chen',
      qcAnalyst: 'M. Torres',
      banker: 'K. Diaz',
      reviewStatus: 'In Review',
      startedDaysAgo: 10,
      taskDaysAgo: 9,
      claimDaysAgo: 3,
      assignee: 'M. Torres',
      state: 'IN_PROGRESS',
      status: 'ACTIVE',
      description: 'In-progress team task',
      priority: 60
    },
    {
      id: '1004',
      applicant: 'Riley Quinn',
      obsAnalyst: 'L. Nguyen',
      qcAnalyst: 'C. Park',
      banker: 'M. Brooks',
      reviewStatus: 'In Review',
      startedDaysAgo: 12,
      taskDaysAgo: 11,
      claimDaysAgo: 2,
      assignee: 'C. Park',
      state: 'IN_PROGRESS',
      status: 'ACTIVE',
      description: 'In-progress team task',
      priority: 55
    }
  ],
  my_tasks: [
    {
      id: '2001',
      applicant: 'Casey Wong',
      obsAnalyst: 'A. Chen',
      qcAnalyst: 'You',
      banker: 'T. Wells',
      reviewStatus: 'In Review',
      startedDaysAgo: 6,
      taskDaysAgo: 5,
      claimDaysAgo: 4,
      assignee: 'You',
      state: 'IN_PROGRESS',
      status: 'ACTIVE',
      description: 'My task',
      priority: 50
    }
  ],
  completed: [
    {
      id: '0990',
      applicant: 'Avery Kim',
      obsAnalyst: 'A. Chen',
      qcAnalyst: 'M. Torres',
      banker: 'J. Rivera',
      reviewStatus: 'Completed',
      startedDaysAgo: 20,
      taskDaysAgo: 18,
      claimDaysAgo: 15,
      endDaysAgo: 1,
      assignee: 'M. Torres',
      state: 'COMPLETED',
      status: 'COMPLETED',
      description: 'Completed',
      priority: 30
    }
  ]
}

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

function buildItem(
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

/** Aligns with `requestGroupForRole` in dashboardApi (Q_* → QC, O_* → ONBOARDING). */
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
 * Rows for one tab if the role’s permission array includes that tab’s permission.
 * Otherwise empty. Shared seeds + light domain (QC / Onboarding) variation.
 */
export function mockItemsForTab(role: Role, tab: string): WorkflowTaskItem[] {
  if (!roleCanAccessTab(role, tab)) return []
  const seeds = MOCK_SEEDS_BY_TAB[tab] ?? []
  const domain = domainForRole(role)
  return seeds.map((seed) => buildItem(seed, domain, tab))
}

/** Counts only for tabs the role can see. */
export function mockTabCounts(role: Role): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const tab of Object.keys(TAB_REQUIRED_PERMISSION) as DashboardTabId[]) {
    if (!roleCanAccessTab(role, tab)) continue
    counts[tab] = MOCK_SEEDS_BY_TAB[tab].length
  }
  return counts
}
