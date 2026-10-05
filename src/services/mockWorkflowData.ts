import type { Role } from '../rbac/roles'
import type { WorkflowTaskItem } from '../types/workflow'

type MockItem = WorkflowTaskItem & { _tabs: string[] }

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function item(
  partial: Omit<WorkflowTaskItem, 'activeTask'> & {
    activeTask: NonNullable<WorkflowTaskItem['activeTask']>
    _tabs: string[]
  }
): MockItem {
  return partial
}

/**
 * Realistic mock workflow tasks shaped like the API response.
 * Scoped per role — never one mega-list filtered only in the UI by role.
 */
const Q_MANAGER_ITEMS: MockItem[] = [
  item({
    processInstanceId: 'pi-qc-1001',
    name: 'QC Review — Jordan Lee',
    businessKey: 'QC-1001',
    processDefinitionKey: 'qc-review',
    processDefinitionId: 'qc-review:1',
    deploymentId: 'dep-1',
    status: 'ACTIVE',
    createdBy: 'system',
    startedAt: daysAgo(5),
    endTime: null,
    durationInMillis: null,
    activeTask: {
      taskId: 'task-qc-1001',
      taskName: 'QC Review',
      taskDefinitionKey: 'qcReview',
      executionId: 'ex-1001',
      description: 'Unassigned QC review',
      assignee: null,
      processInstanceId: 'pi-qc-1001',
      processDefinitionId: 'qc-review:1',
      candidateGroups: ['QC_ANALYST'],
      formKey: null,
      processState: 'ACTIVE',
      priority: 50,
      createdAt: daysAgo(4),
      dueDate: null,
      claimTime: null,
      owner: null,
      state: 'CREATED',
      category: 'QC',
      tenantId: null,
      variables: {
        applicantName: 'Jordan Lee',
        obsAnalyst: 'A. Chen',
        banker: 'J. Rivera',
        reviewStatus: 'Pending QC'
      }
    },
    _tabs: ['unassigned']
  }),
  item({
    processInstanceId: 'pi-qc-1002',
    name: 'QC Review — Sam Patel',
    businessKey: 'QC-1002',
    processDefinitionKey: 'qc-review',
    processDefinitionId: 'qc-review:1',
    deploymentId: 'dep-1',
    status: 'ACTIVE',
    createdBy: 'system',
    startedAt: daysAgo(8),
    endTime: null,
    durationInMillis: null,
    activeTask: {
      taskId: 'task-qc-1002',
      taskName: 'QC Review',
      taskDefinitionKey: 'qcReview',
      executionId: 'ex-1002',
      description: 'Unassigned QC review',
      assignee: null,
      processInstanceId: 'pi-qc-1002',
      processDefinitionId: 'qc-review:1',
      candidateGroups: ['QC_ANALYST'],
      formKey: null,
      processState: 'ACTIVE',
      priority: 40,
      createdAt: daysAgo(7),
      dueDate: null,
      claimTime: null,
      owner: null,
      state: 'CREATED',
      category: 'QC',
      tenantId: null,
      variables: {
        applicantName: 'Sam Patel',
        obsAnalyst: 'L. Nguyen',
        banker: 'S. Patel',
        reviewStatus: 'Pending QC'
      }
    },
    _tabs: ['unassigned']
  }),
  item({
    processInstanceId: 'pi-qc-1003',
    name: 'QC Review — Morgan Blake',
    businessKey: 'QC-1003',
    processDefinitionKey: 'qc-review',
    processDefinitionId: 'qc-review:1',
    deploymentId: 'dep-1',
    status: 'ACTIVE',
    createdBy: 'system',
    startedAt: daysAgo(10),
    endTime: null,
    durationInMillis: null,
    activeTask: {
      taskId: 'task-qc-1003',
      taskName: 'QC Review',
      taskDefinitionKey: 'qcReview',
      executionId: 'ex-1003',
      description: 'In-progress team task',
      assignee: 'M. Torres',
      processInstanceId: 'pi-qc-1003',
      processDefinitionId: 'qc-review:1',
      candidateGroups: ['QC_ANALYST'],
      formKey: null,
      processState: 'ACTIVE',
      priority: 60,
      createdAt: daysAgo(9),
      dueDate: null,
      claimTime: daysAgo(3),
      owner: null,
      state: 'IN_PROGRESS',
      category: 'QC',
      tenantId: null,
      variables: {
        applicantName: 'Morgan Blake',
        obsAnalyst: 'A. Chen',
        qcAnalyst: 'M. Torres',
        banker: 'K. Diaz',
        reviewStatus: 'In Review'
      }
    },
    _tabs: ['team_tasks']
  }),
  item({
    processInstanceId: 'pi-qc-1004',
    name: 'QC Review — Riley Quinn',
    businessKey: 'QC-1004',
    processDefinitionKey: 'qc-review',
    processDefinitionId: 'qc-review:1',
    deploymentId: 'dep-1',
    status: 'ACTIVE',
    createdBy: 'system',
    startedAt: daysAgo(12),
    endTime: null,
    durationInMillis: null,
    activeTask: {
      taskId: 'task-qc-1004',
      taskName: 'QC Review',
      taskDefinitionKey: 'qcReview',
      executionId: 'ex-1004',
      description: 'In-progress team task',
      assignee: 'C. Park',
      processInstanceId: 'pi-qc-1004',
      processDefinitionId: 'qc-review:1',
      candidateGroups: ['QC_ANALYST'],
      formKey: null,
      processState: 'ACTIVE',
      priority: 55,
      createdAt: daysAgo(11),
      dueDate: null,
      claimTime: daysAgo(2),
      owner: null,
      state: 'IN_PROGRESS',
      category: 'QC',
      tenantId: null,
      variables: {
        applicantName: 'Riley Quinn',
        obsAnalyst: 'L. Nguyen',
        qcAnalyst: 'C. Park',
        banker: 'M. Brooks',
        reviewStatus: 'In Review'
      }
    },
    _tabs: ['team_tasks']
  }),
  item({
    processInstanceId: 'pi-qc-0990',
    name: 'QC Review — Avery Kim',
    businessKey: 'QC-0990',
    processDefinitionKey: 'qc-review',
    processDefinitionId: 'qc-review:1',
    deploymentId: 'dep-1',
    status: 'COMPLETED',
    createdBy: 'system',
    startedAt: daysAgo(20),
    endTime: daysAgo(1),
    durationInMillis: 19 * 24 * 60 * 60 * 1000,
    activeTask: {
      taskId: 'task-qc-0990',
      taskName: 'QC Review',
      taskDefinitionKey: 'qcReview',
      executionId: 'ex-0990',
      description: 'Completed',
      assignee: 'M. Torres',
      processInstanceId: 'pi-qc-0990',
      processDefinitionId: 'qc-review:1',
      candidateGroups: ['QC_ANALYST'],
      formKey: null,
      processState: 'COMPLETED',
      priority: 30,
      createdAt: daysAgo(18),
      dueDate: null,
      claimTime: daysAgo(15),
      owner: null,
      state: 'COMPLETED',
      category: 'QC',
      tenantId: null,
      variables: {
        applicantName: 'Avery Kim',
        obsAnalyst: 'A. Chen',
        qcAnalyst: 'M. Torres',
        banker: 'J. Rivera',
        reviewStatus: 'Completed',
        daysInQueue: '5',
        daysInReview: '14'
      }
    },
    _tabs: ['completed']
  })
]

const Q_ANALYST_ITEMS: MockItem[] = [
  item({
    processInstanceId: 'pi-qa-2001',
    name: 'QC Review — Casey Wong',
    businessKey: 'QC-2001',
    processDefinitionKey: 'qc-review',
    processDefinitionId: 'qc-review:1',
    deploymentId: 'dep-1',
    status: 'ACTIVE',
    createdBy: 'system',
    startedAt: daysAgo(6),
    endTime: null,
    durationInMillis: null,
    activeTask: {
      taskId: 'task-qa-2001',
      taskName: 'QC Review',
      taskDefinitionKey: 'qcReview',
      executionId: 'ex-2001',
      description: 'My task',
      assignee: 'You',
      processInstanceId: 'pi-qa-2001',
      processDefinitionId: 'qc-review:1',
      candidateGroups: ['QC_ANALYST'],
      formKey: null,
      processState: 'ACTIVE',
      priority: 50,
      createdAt: daysAgo(5),
      dueDate: null,
      claimTime: daysAgo(4),
      owner: null,
      state: 'IN_PROGRESS',
      category: 'QC',
      tenantId: null,
      variables: {
        applicantName: 'Casey Wong',
        obsAnalyst: 'A. Chen',
        qcAnalyst: 'You',
        banker: 'T. Wells',
        reviewStatus: 'In Review'
      }
    },
    _tabs: ['my_tasks']
  }),
  item({
    processInstanceId: 'pi-qa-2002',
    name: 'QC Review — Drew Nash',
    businessKey: 'QC-2002',
    processDefinitionKey: 'qc-review',
    processDefinitionId: 'qc-review:1',
    deploymentId: 'dep-1',
    status: 'ACTIVE',
    createdBy: 'system',
    startedAt: daysAgo(3),
    endTime: null,
    durationInMillis: null,
    activeTask: {
      taskId: 'task-qa-2002',
      taskName: 'QC Review',
      taskDefinitionKey: 'qcReview',
      executionId: 'ex-2002',
      description: 'Unassigned pool',
      assignee: null,
      processInstanceId: 'pi-qa-2002',
      processDefinitionId: 'qc-review:1',
      candidateGroups: ['QC_ANALYST'],
      formKey: null,
      processState: 'ACTIVE',
      priority: 45,
      createdAt: daysAgo(2),
      dueDate: null,
      claimTime: null,
      owner: null,
      state: 'CREATED',
      category: 'QC',
      tenantId: null,
      variables: {
        applicantName: 'Drew Nash',
        obsAnalyst: 'L. Nguyen',
        banker: 'S. Patel',
        reviewStatus: 'Pending QC'
      }
    },
    _tabs: ['unassigned']
  })
]

const O_STUB_ITEMS: MockItem[] = [
  item({
    processInstanceId: 'pi-o-3001',
    name: 'Onboarding — Stub Applicant',
    businessKey: 'ONB-3001',
    processDefinitionKey: 'onboarding',
    processDefinitionId: 'onboarding:1',
    deploymentId: 'dep-o',
    status: 'ACTIVE',
    createdBy: 'system',
    startedAt: daysAgo(2),
    endTime: null,
    durationInMillis: null,
    activeTask: {
      taskId: 'task-o-3001',
      taskName: 'OBS Review',
      taskDefinitionKey: 'obsReview',
      executionId: 'ex-3001',
      description: 'O_* stub row',
      assignee: null,
      processInstanceId: 'pi-o-3001',
      processDefinitionId: 'onboarding:1',
      candidateGroups: ['O_ANALYST'],
      formKey: null,
      processState: 'ACTIVE',
      priority: 40,
      createdAt: daysAgo(1),
      dueDate: null,
      claimTime: null,
      owner: null,
      state: 'CREATED',
      category: 'ONBOARDING',
      tenantId: null,
      variables: {
        applicantName: 'Stub Applicant',
        obsAnalyst: '',
        banker: 'J. Rivera',
        reviewStatus: 'Unassigned'
      }
    },
    _tabs: ['overview']
  })
]

export const MOCK_WORKFLOW_BY_ROLE: Record<Role, MockItem[]> = {
  Q_MANAGER: Q_MANAGER_ITEMS,
  Q_ANALYST: Q_ANALYST_ITEMS,
  O_MANAGER: O_STUB_ITEMS,
  O_ANALYST: O_STUB_ITEMS
}

export function mockItemsForTab(role: Role, tab: string): WorkflowTaskItem[] {
  return (MOCK_WORKFLOW_BY_ROLE[role] ?? [])
    .filter((row) => row._tabs.includes(tab))
    .map(({ _tabs: _ignored, ...rest }) => rest)
}

export function mockTabCounts(role: Role): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const row of MOCK_WORKFLOW_BY_ROLE[role] ?? []) {
    for (const tab of row._tabs) {
      counts[tab] = (counts[tab] ?? 0) + 1
    }
  }
  return counts
}
