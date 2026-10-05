import type { DashboardTableRow, WorkflowTaskItem } from '../types/workflow'

const UNASSIGNED_LABEL = 'Unassigned'

/** Extensible variable keys for display fields. */
export const VARIABLE_KEYS = {
  applicantName: ['applicantName', 'applicant', 'customerName', 'fullName'],
  obsAnalyst: ['obsAnalyst', 'obs_analyst', 'obsAnalystName'],
  qcAnalyst: ['qcAnalyst', 'qc_analyst', 'qcAnalystName'],
  banker: ['banker', 'bankerName', 'relationshipManager'],
  reviewStatus: ['reviewStatus', 'review_status', 'qcStatus'],
  daysInQueue: ['daysInQueue', 'days_in_queue'],
  daysInReview: ['daysInReview', 'days_in_review']
} as const

function firstVariable(
  vars: Record<string, string> | undefined,
  keys: readonly string[]
): string | undefined {
  if (!vars) return undefined
  for (const key of keys) {
    const value = vars[key]
    if (value != null && String(value).trim() !== '') return String(value)
  }
  return undefined
}

function daysBetween(fromIso: string | null | undefined, to = new Date()): number | string {
  if (!fromIso) return '—'
  const from = new Date(fromIso)
  if (Number.isNaN(from.getTime())) return '—'
  const ms = to.getTime() - from.getTime()
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

function displayOrUnassigned(value: string | null | undefined): string {
  if (value == null || String(value).trim() === '') return UNASSIGNED_LABEL
  return String(value)
}

/**
 * Single place: workflow API item → flat table display row.
 * Keys (`idNumber`, `applicant`, `qcAnalyst`, `obsAnalyst`, …) match
 * `ColumnDef.field` in the role’s dashboard config. Table reads `row[column.field]`.
 * Prefer `variables` keys; fall back to task/process fields.
 */
export function mapWorkflowItemToRow(item: WorkflowTaskItem): DashboardTableRow {
  const task = item.activeTask
  const vars = task?.variables ?? {}

  const idNumber =
    item.businessKey ||
    task?.taskId ||
    item.processInstanceId ||
    '—'

  const applicant =
    firstVariable(vars, VARIABLE_KEYS.applicantName) ||
    item.name ||
    item.createdBy ||
    '—'

  const daysInQueueVar = firstVariable(vars, VARIABLE_KEYS.daysInQueue)
  const daysInReviewVar = firstVariable(vars, VARIABLE_KEYS.daysInReview)

  const daysInQueue =
    daysInQueueVar != null && daysInQueueVar !== ''
      ? Number(daysInQueueVar) || daysInQueueVar
      : daysBetween(item.startedAt)

  const reviewStart = task?.claimTime || task?.createdAt || null
  const daysInReview =
    daysInReviewVar != null && daysInReviewVar !== ''
      ? Number(daysInReviewVar) || daysInReviewVar
      : daysBetween(reviewStart)

  const reviewStatus =
    firstVariable(vars, VARIABLE_KEYS.reviewStatus) ||
    task?.state ||
    item.status ||
    '—'

  const obsAnalyst = displayOrUnassigned(
    firstVariable(vars, VARIABLE_KEYS.obsAnalyst)
  )

  const qcFromVars = firstVariable(vars, VARIABLE_KEYS.qcAnalyst)
  const qcAnalyst = displayOrUnassigned(qcFromVars ?? task?.assignee ?? null)

  const banker = displayOrUnassigned(firstVariable(vars, VARIABLE_KEYS.banker))

  return {
    id: item.processInstanceId || task?.taskId || idNumber,
    taskId: task?.taskId ?? null,
    idNumber,
    applicant,
    daysInQueue,
    daysInReview,
    reviewStatus,
    obsAnalyst,
    qcAnalyst,
    banker,
    raw: item
  }
}

export function mapWorkflowItemsToRows(
  items: readonly WorkflowTaskItem[]
): DashboardTableRow[] {
  return items.map(mapWorkflowItemToRow)
}

/**
 * Client-side name / ID# filters applied after the role+tab scoped fetch.
 * (Request body has no dedicated applicant/businessKey fields yet.)
 */
export function applyClientFilters(
  rows: DashboardTableRow[],
  filters: { applicantName?: string; id?: string }
): DashboardTableRow[] {
  const nameQ = (filters.applicantName ?? '').trim().toLowerCase()
  const idQ = (filters.id ?? '').trim().toLowerCase()
  return rows.filter((row) => {
    if (nameQ && !row.applicant.toLowerCase().includes(nameQ)) return false
    if (
      idQ &&
      !row.idNumber.toLowerCase().includes(idQ) &&
      !(row.taskId ?? '').toLowerCase().includes(idQ)
    ) {
      return false
    }
    return true
  })
}
