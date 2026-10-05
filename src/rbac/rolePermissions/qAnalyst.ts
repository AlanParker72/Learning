import type { DashboardConfig } from '../../config/types'
import { Permission } from '../permissions'

/**
 * Q_ANALYST — Quality Control analyst.
 * This file owns both the permission list and this role’s dashboard config.
 */

export const Q_ANALYST_PERMISSIONS = [
  Permission.DASHBOARD_VIEW,
  Permission.HEADING_TITLE,
  Permission.HEADING_SUBTITLE,
  Permission.WIDGET_TABLE,

  // Tabs
  Permission.TAB_MY_TASKS,
  Permission.TAB_UNASSIGNED,

  // Filters
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID,

  // Actions
  Permission.ACTION_CLAIM,
  Permission.ACTION_ASSIGN_TO_ME
] as const satisfies readonly Permission[]

const Q_ANALYST_MY_TASKS_COLUMNS = [
  { id: 'idNumber', header: 'ID #', field: 'idNumber' },
  { id: 'applicant', header: 'Applicant', field: 'applicant' },
  { id: 'daysInQueue', header: 'Days in Queue', field: 'daysInQueue' },
  { id: 'daysInReview', header: 'Days in Review', field: 'daysInReview' },
  { id: 'reviewStatus', header: 'Review Status', field: 'reviewStatus' },
  { id: 'qcAnalyst', header: 'QC Analyst', field: 'qcAnalyst', actionId: 'claim' },
  { id: 'banker', header: 'Banker', field: 'banker' }
]

const Q_ANALYST_UNASSIGNED_COLUMNS = [
  { id: 'idNumber', header: 'ID #', field: 'idNumber' },
  { id: 'applicant', header: 'Applicant', field: 'applicant' },
  { id: 'daysInQueue', header: 'Days in Queue', field: 'daysInQueue' },
  { id: 'daysInReview', header: 'Days in Review', field: 'daysInReview' },
  { id: 'reviewStatus', header: 'Review Status', field: 'reviewStatus' },
  {
    id: 'qcAnalyst',
    header: 'QC Analyst',
    field: 'qcAnalyst',
    actionId: 'assign_to_me'
  },
  { id: 'banker', header: 'Banker', field: 'banker' }
]

const SEARCH_FILTER_PERMISSIONS = [
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID
]

export const Q_ANALYST_DASHBOARD: DashboardConfig = {
  title: 'Quality Control Requests',
  titleRequiredPermission: Permission.HEADING_TITLE,
  subtitle: 'QC Analyst',
  subtitleRequiredPermission: Permission.HEADING_SUBTITLE,
  defaultTab: 'my_tasks',
  tabs: [
    {
      id: 'my_tasks',
      label: 'My Tasks',
      requiredPermission: Permission.TAB_MY_TASKS,
      filterPermissions: SEARCH_FILTER_PERMISSIONS,
      columns: Q_ANALYST_MY_TASKS_COLUMNS
    },
    {
      id: 'unassigned',
      label: 'Unassigned',
      requiredPermission: Permission.TAB_UNASSIGNED,
      filterPermissions: SEARCH_FILTER_PERMISSIONS,
      columns: Q_ANALYST_UNASSIGNED_COLUMNS,
      selectable: true
    }
  ],
  actionPermissions: [
    Permission.ACTION_CLAIM,
    Permission.ACTION_ASSIGN_TO_ME
  ]
}
