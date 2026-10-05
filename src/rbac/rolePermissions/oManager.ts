import type { DashboardConfig } from '../../config/types'
import { Permission } from '../permissions'

/**
 * O_MANAGER — Onboarding manager.
 * This file owns both the permission list and this role’s dashboard config.
 *
 * Unassigned / Team Work search filters: chip triggers → expand (form config).
 * Completed: preset + date-range pill (inline) + Clear All (global action).
 */

export const O_MANAGER_PERMISSIONS = [
  Permission.DASHBOARD_VIEW,
  Permission.HEADING_TITLE,
  Permission.HEADING_SUBTITLE,
  Permission.WIDGET_TABLE,

  // Tabs
  Permission.TAB_UNASSIGNED,
  Permission.TAB_TEAM_TASKS,
  Permission.TAB_COMPLETED,

  // Filters (full set this role may ever use)
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID,
  Permission.FILTER_ID_NUMBER,
  Permission.FILTER_STATUS,
  Permission.FILTER_DATE_RANGE_PRESET,
  Permission.FILTER_DATE_RANGE_PILL,

  // Actions (standalone)
  Permission.ACTION_ASSIGN_RECORDS,
  Permission.ACTION_BULK_SELECT,
  Permission.ACTION_CLEAR_ALL_FILTERS
] as const satisfies readonly Permission[]

const O_MANAGER_QUEUE_COLUMNS = [
  { id: 'idNumber', header: 'ID #', field: 'idNumber' },
  { id: 'applicant', header: 'Applicant', field: 'applicant' },
  { id: 'daysInQueue', header: 'Days in Queue', field: 'daysInQueue' },
  { id: 'daysInReview', header: 'Days in Review', field: 'daysInReview' },
  { id: 'reviewStatus', header: 'Review Status', field: 'reviewStatus' },
  { id: 'obsAnalyst', header: 'OBS Analyst', field: 'obsAnalyst' },
  { id: 'banker', header: 'Banker', field: 'banker' }
]

const O_MANAGER_COMPLETED_COLUMNS = [
  { id: 'idNumber', header: 'ID #', field: 'idNumber' },
  { id: 'applicant', header: 'Applicant', field: 'applicant' },
  { id: 'daysInReview', header: 'Days in Review', field: 'daysInReview' },
  { id: 'dateCompleted', header: 'Date Completed', field: 'dateCompleted' },
  { id: 'obsAnalyst', header: 'OBS Analyst', field: 'obsAnalyst' },
  { id: 'banker', header: 'Banker', field: 'banker' }
]

/** Unassigned: Applicant Name, ID#, Status — chip/expand from form config. */
const UNASSIGNED_FILTER_PERMISSIONS = [
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID,
  Permission.FILTER_STATUS
]

/** Team Work: Applicant Name, ID Number, Status — chip/expand from form config. */
const TEAM_WORK_FILTER_PERMISSIONS = [
  Permission.FILTER_APPLICANT_NAME,
  Permission.FILTER_ID_NUMBER,
  Permission.FILTER_STATUS
]

/** Completed: select + active date-range pill (month default in catalog). */
const COMPLETED_FILTER_PERMISSIONS = [
  Permission.FILTER_DATE_RANGE_PRESET,
  Permission.FILTER_DATE_RANGE_PILL
]

export const O_MANAGER_DASHBOARD: DashboardConfig = {
  title: 'Onboarding Requests',
  titleRequiredPermission: Permission.HEADING_TITLE,
  subtitle: 'OBS Manager',
  subtitleRequiredPermission: Permission.HEADING_SUBTITLE,
  defaultTab: 'unassigned',
  tabs: [
    {
      id: 'unassigned',
      label: 'Unassigned',
      requiredPermission: Permission.TAB_UNASSIGNED,
      filterPermissions: UNASSIGNED_FILTER_PERMISSIONS,
      columns: O_MANAGER_QUEUE_COLUMNS,
      selectable: true,
      actionPermissions: [
        Permission.ACTION_BULK_SELECT,
        Permission.ACTION_CLEAR_ALL_FILTERS
      ]
    },
    {
      id: 'team_tasks',
      label: 'Team Work',
      requiredPermission: Permission.TAB_TEAM_TASKS,
      filterPermissions: TEAM_WORK_FILTER_PERMISSIONS,
      columns: O_MANAGER_QUEUE_COLUMNS,
      selectable: true,
      actionPermissions: [
        Permission.ACTION_BULK_SELECT,
        Permission.ACTION_CLEAR_ALL_FILTERS
      ]
    },
    {
      id: 'completed',
      label: 'Completed',
      requiredPermission: Permission.TAB_COMPLETED,
      filterPermissions: COMPLETED_FILTER_PERMISSIONS,
      columns: O_MANAGER_COMPLETED_COLUMNS,
      actionPermissions: [Permission.ACTION_CLEAR_ALL_FILTERS]
    }
  ],
  actionPermissions: [Permission.ACTION_ASSIGN_RECORDS]
}
