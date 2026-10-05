/**
 * Mock rows for O_MANAGER only.
 * Edit this file to change Onboarding manager dashboard data.
 * Tabs: unassigned | team_tasks | completed
 */
import type { RoleMockSeeds } from './helpers'

export const MOCK_O_MANAGER: RoleMockSeeds = {
  unassigned: [
    {
      id: 'o-m-3001',
      applicant: 'Elena Vargas',
      obsAnalyst: 'R. Shah',
      banker: 'P. Ortiz',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 4,
      taskDaysAgo: 3,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'O Manager — unassigned',
      priority: 48
    },
    {
      id: 'o-m-3002',
      applicant: 'Noah Briggs',
      obsAnalyst: 'K. Sato',
      banker: 'D. Hale',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 7,
      taskDaysAgo: 6,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'O Manager — unassigned',
      priority: 38
    }
  ],
  team_tasks: [
    {
      id: 'o-m-3003',
      applicant: 'Ivy Monroe',
      obsAnalyst: 'R. Shah',
      qcAnalyst: 'B. Adler',
      banker: 'P. Ortiz',
      reviewStatus: 'In Review',
      startedDaysAgo: 9,
      taskDaysAgo: 8,
      claimDaysAgo: 2,
      assignee: 'B. Adler',
      state: 'IN_PROGRESS',
      status: 'ACTIVE',
      description: 'O Manager — team task',
      priority: 58
    },
    {
      id: 'o-m-3004',
      applicant: 'Theo Grant',
      obsAnalyst: 'K. Sato',
      qcAnalyst: 'N. West',
      banker: 'D. Hale',
      reviewStatus: 'In Review',
      startedDaysAgo: 11,
      taskDaysAgo: 10,
      claimDaysAgo: 1,
      assignee: 'N. West',
      state: 'IN_PROGRESS',
      status: 'ACTIVE',
      description: 'O Manager — team task',
      priority: 52
    }
  ],
  completed: [
    {
      id: 'o-m-2900',
      applicant: 'Mia Soto',
      obsAnalyst: 'R. Shah',
      qcAnalyst: 'B. Adler',
      banker: 'P. Ortiz',
      reviewStatus: 'Completed',
      startedDaysAgo: 18,
      taskDaysAgo: 16,
      claimDaysAgo: 14,
      endDaysAgo: 2,
      assignee: 'B. Adler',
      state: 'COMPLETED',
      status: 'COMPLETED',
      description: 'O Manager — completed',
      priority: 28
    },
    {
      id: 'o-m-2895',
      applicant: 'Owen Blake',
      obsAnalyst: 'K. Sato',
      qcAnalyst: 'N. West',
      banker: 'D. Hale',
      reviewStatus: 'Completed',
      startedDaysAgo: 40,
      taskDaysAgo: 38,
      claimDaysAgo: 35,
      endDaysAgo: 20,
      assignee: 'N. West',
      state: 'COMPLETED',
      status: 'COMPLETED',
      description: 'O Manager — completed (outside default month)',
      priority: 22
    }
  ]
}
