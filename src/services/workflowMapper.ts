import type { DashboardTableRow, WorkflowTaskItem } from '../types/workflow'
import { formatDisplayDate } from '../utils/dateRange'

const UNASSIGNED_LABEL = 'Unassigned'

/** Extensible variable keys for display fields. */
export const VARIABLE_KEYS = {
  applicantName: ['applicantName', 'applicant', 'customerName', 'fullName'],
  obsAnalyst: ['obsAnalyst', 'obs_analyst', 'obsAnalystName'],
  qcAnalyst: ['qcAnalyst', 'qc_analyst', 'qcAnalystName'],
  banker: ['banker', 'bankerName', 'relationshipManager'],
  reviewStatus: ['reviewStatus', 'review_status', 'qcStatus'],
  daysInQueue: ['daysInQueue', 'days_in_queue'],
  daysInReview: ['daysInReview', 'days_in_review'],
  dateCompleted: ['dateCompleted', 'date_completed', 'completedAt', 'completedDate']
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

function formatDateCompleted(
  vars: Record<string, string> | undefined,
  endTime: string | null | undefined
): string {
  const fromVar = firstVariable(vars, VARIABLE_KEYS.dateCompleted)
  const raw = fromVar || endTime
  if (!raw) return '—'
  // Accept ISO datetime or YYYY-MM-DD
  const isoDay = raw.slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDay)) return formatDisplayDate(isoDay)
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  return formatDisplayDate(d.toISOString().slice(0, 10))
}

/**
 * Single place: workflow API item → flat table display row.
 * Keys (`idNumber`, `applicant`, `qcAnalyst`, `obsAnalyst`, `dateCompleted`, …) match
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

  const dateCompleted = formatDateCompleted(vars, item.endTime)

  return {
    id: item.processInstanceId || task?.taskId || idNumber,
    taskId: task?.taskId ?? null,
    idNumber,
    applicant,
    daysInQueue,
    daysInReview,
    dateCompleted,
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

function parseRowDate(displayOrIso: string): Date | null {
  if (!displayOrIso || displayOrIso === '—') return null
  // MM/DD/YYYY from mapper
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(displayOrIso)
  if (m) {
    const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]))
    return Number.isNaN(d.getTime()) ? null : d
  }
  const d = new Date(displayOrIso)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * Client-side name / ID# / date-range filters after the role+tab scoped fetch.
 * (Request body has no dedicated applicant/businessKey fields yet.)
 */
export function applyClientFilters(
  rows: DashboardTableRow[],
  filters: {
    applicantName?: string
    id?: string
    startDate?: string
    endDate?: string
  }
): DashboardTableRow[] {
  const nameQ = (filters.applicantName ?? '').trim().toLowerCase()
  const idQ = (filters.id ?? '').trim().toLowerCase()
  const start = (filters.startDate ?? '').trim()
  const end = (filters.endDate ?? '').trim()
  const startD = start ? new Date(`${start}T00:00:00`) : null
  const endD = end ? new Date(`${end}T23:59:59`) : null

  return rows.filter((row) => {
    if (nameQ && !row.applicant.toLowerCase().includes(nameQ)) return false
    if (
      idQ &&
      !row.idNumber.toLowerCase().includes(idQ) &&
      !(row.taskId ?? '').toLowerCase().includes(idQ)
    ) {
      return false
    }
    if (startD || endD) {
      const completed = parseRowDate(row.dateCompleted)
      if (!completed) return false
      if (startD && completed < startD) return false
      if (endD && completed > endD) return false
    }
    return true
  })
}
