import { Permission } from '../permissions'
import type { ColumnDef } from '../../config/types'

/**
 * Optional reusable column stubs.
 * Roles may copy, spread, or define columns inline in their own dashboard config.
 * Visibility still requires the matching COLUMN_* grant in that role’s permission list.
 */
export const COL_ID: ColumnDef = {
  id: 'idNumber',
  header: 'ID #',
  field: 'idNumber',
  requiredPermission: Permission.COLUMN_ID
}

export const COL_APPLICANT: ColumnDef = {
  id: 'applicant',
  header: 'Applicant',
  field: 'applicant',
  requiredPermission: Permission.COLUMN_APPLICANT
}

export const COL_DAYS_IN_QUEUE: ColumnDef = {
  id: 'daysInQueue',
  header: 'Days in Queue',
  field: 'daysInQueue',
  requiredPermission: Permission.COLUMN_DAYS_IN_QUEUE
}

export const COL_DAYS_IN_REVIEW: ColumnDef = {
  id: 'daysInReview',
  header: 'Days in Review',
  field: 'daysInReview',
  requiredPermission: Permission.COLUMN_DAYS_IN_REVIEW
}

export const COL_REVIEW_STATUS: ColumnDef = {
  id: 'reviewStatus',
  header: 'Review Status',
  field: 'reviewStatus',
  requiredPermission: Permission.COLUMN_REVIEW_STATUS
}

export const COL_BANKER: ColumnDef = {
  id: 'banker',
  header: 'Banker',
  field: 'banker',
  requiredPermission: Permission.COLUMN_BANKER
}

/** Q_* — maps to field `qcAnalyst`. */
export const COL_QC_ANALYST: ColumnDef = {
  id: 'qcAnalyst',
  header: 'QC Analyst',
  field: 'qcAnalyst',
  requiredPermission: Permission.COLUMN_QC_ANALYST
}

/** O_* — maps to field `obsAnalyst`. */
export const COL_OBS_ANALYST: ColumnDef = {
  id: 'obsAnalyst',
  header: 'OBS Analyst',
  field: 'obsAnalyst',
  requiredPermission: Permission.COLUMN_OBS_ANALYST
}

/** Attach a row action to a column by id (returns a new array). */
export function withColumnAction(
  columns: ColumnDef[],
  columnId: string,
  actionId: string
): ColumnDef[] {
  return columns.map((c) => (c.id === columnId ? { ...c, actionId } : c))
}
