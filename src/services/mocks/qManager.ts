/**
 * Mock rows for Q_MANAGER only.
 * Edit this file to change Quality Control manager dashboard data.
 * Tabs: unassigned | team_tasks | completed
 */
import type { RoleMockSeeds } from './helpers'

export const MOCK_Q_MANAGER: RoleMockSeeds = {
  unassigned: [
    {
      id: 'q-m-1001',
      applicant: 'Jordan Lee',
      obsAnalyst: 'A. Chen',
      banker: 'J. Rivera',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 5,
      taskDaysAgo: 4,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'Q Manager — unassigned',
      priority: 50
    },
    {
      id: 'q-m-1002',
      applicant: 'Sam Patel',
      obsAnalyst: 'L. Nguyen',
      banker: 'S. Patel',
      reviewStatus: 'Pending QC',
      startedDaysAgo: 8,
      taskDaysAgo: 7,
      assignee: null,
      state: 'CREATED',
      status: 'ACTIVE',
      description: 'Q Manager — unassigned',
      priority: 40
    }
  ],
  team_tasks: [
    {
      id: 'q-m-1003',
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
      description: 'Q Manager — team task',
      priority: 60
    },
    {
      id: 'q-m-1004',
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
      description: 'Q Manager — team task',
      priority: 55
    }
  ],
  completed: [
    {
      id: 'q-m-0990',
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
      description: 'Q Manager — completed',
      priority: 30
    },
    {
      id: 'q-m-0988',
      applicant: 'Casey Brooks',
      obsAnalyst: 'L. Nguyen',
      qcAnalyst: 'C. Park',
      banker: 'K. Diaz',
      reviewStatus: 'Completed',
      startedDaysAgo: 28,
      taskDaysAgo: 26,
      claimDaysAgo: 22,
      endDaysAgo: 8,
      assignee: 'C. Park',
      state: 'COMPLETED',
      status: 'COMPLETED',
      description: 'Q Manager — completed (older)',
      priority: 25
    }
  ]
}
