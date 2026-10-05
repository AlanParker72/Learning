import type { ColumnDef } from '../../config/types'

/**
 * Optional reusable column stubs (header + field only).
 * Roles may copy, spread, or define columns inline in their own dashboard config.
 * Listed on a tab ⇒ visible — no COLUMN_* permission.
 */
export const COL_ID: ColumnDef = {
  id: 'idNumber',
  header: 'ID #',
  field: 'idNumber'
}

export const COL_APPLICANT: ColumnDef = {
  id: 'applicant',
  header: 'Applicant',
  field: 'applicant'
}

export const COL_DAYS_IN_QUEUE: ColumnDef = {
  id: 'daysInQueue',
  header: 'Days in Queue',
  field: 'daysInQueue'
}

export const COL_DAYS_IN_REVIEW: ColumnDef = {
  id: 'daysInReview',
  header: 'Days in Review',
  field: 'daysInReview'
}

export const COL_DATE_COMPLETED: ColumnDef = {
  id: 'dateCompleted',
  header: 'Date Completed',
  field: 'dateCompleted'
}

export const COL_REVIEW_STATUS: ColumnDef = {
  id: 'reviewStatus',
  header: 'Review Status',
  field: 'reviewStatus'
}

export const COL_BANKER: ColumnDef = {
  id: 'banker',
  header: 'Banker',
  field: 'banker'
}

/** Q_* — maps to field `qcAnalyst`. */
export const COL_QC_ANALYST: ColumnDef = {
  id: 'qcAnalyst',
  header: 'QC Analyst',
  field: 'qcAnalyst'
}

/** O_* — maps to field `obsAnalyst`. */
export const COL_OBS_ANALYST: ColumnDef = {
  id: 'obsAnalyst',
  header: 'OBS Analyst',
  field: 'obsAnalyst'
}

/** Attach a row action to a column by id (returns a new array). */
export function withColumnAction(
  columns: ColumnDef[],
  columnId: string,
  actionId: string
): ColumnDef[] {
  return columns.map((c) => (c.id === columnId ? { ...c, actionId } : c))
}
