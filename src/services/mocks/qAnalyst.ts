/**
 * Mock rows for Q_ANALYST only.
 * Edit this file to change Quality Control analyst dashboard data.
 * Tabs: unassigned | my_tasks
 */
import type { RoleMockSeeds } from './helpers'

export const MOCK_Q_ANALYST: RoleMockSeeds = {
  unassigned: [
    {
      id: 'q-a-2002',
      applicant: 'Drew Nash',
      obsAnalyst: 'L. Nguyen',
      banker: 'S. Patel',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 3,
      taskDaysAgo: 2,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'Q Analyst — unassigned pool',
      priority: 45
    },
    {
      id: 'q-a-2003',
      applicant: 'Harper Cole',
      obsAnalyst: 'A. Chen',
      banker: 'J. Rivera',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 4,
      taskDaysAgo: 3,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'Q Analyst — unassigned pool',
      priority: 42
    }
  ],
  my_tasks: [
    {
      id: 'q-a-2001',
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
      description: 'Q Analyst — my task',
      priority: 50
    }
  ]
}
