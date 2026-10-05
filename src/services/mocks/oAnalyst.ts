/**
 * Mock rows for O_ANALYST only.
 * Edit this file to change Onboarding analyst dashboard data.
 * Tabs: unassigned | my_tasks
 */
import type { RoleMockSeeds } from './helpers'

export const MOCK_O_ANALYST: RoleMockSeeds = {
  unassigned: [
    {
      id: 'o-a-4002',
      applicant: 'Quinn Adler',
      obsAnalyst: 'K. Sato',
      banker: 'D. Hale',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 2,
      taskDaysAgo: 1,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'O Analyst — unassigned pool',
      priority: 44
    },
    {
      id: 'o-a-4003',
      applicant: 'Jules Remy',
      obsAnalyst: 'R. Shah',
      banker: 'P. Ortiz',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 5,
      taskDaysAgo: 4,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'O Analyst — unassigned pool',
      priority: 41
    }
  ],
  my_tasks: [
    {
      id: 'o-a-4001',
      applicant: 'Skye Benton',
      obsAnalyst: 'R. Shah',
      qcAnalyst: 'You',
      banker: 'P. Ortiz',
      reviewStatus: 'In Review',
      startedDaysAgo: 5,
      taskDaysAgo: 4,
      claimDaysAgo: 3,
      assignee: 'You',
      state: 'IN_PROGRESS',
      status: 'ACTIVE',
      description: 'O Analyst — my task',
      priority: 50
    }
  ]
}
