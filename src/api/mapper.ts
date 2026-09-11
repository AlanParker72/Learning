import type { DashboardStatusResponse } from './dashboardStatusApi'
import type { Delivery, FetchResult } from './mockApi'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export function mapDeliveriesResponse(raw: unknown): FetchResult {
  if (!isRecord(raw)) return { items: [], total: 0 }

  const items = Array.isArray(raw.items) ? (raw.items as Delivery[]) : []
  const total = typeof raw.total === 'number' ? raw.total : items.length
  return { items, total }
}

export function mapDashboardStatusResponse(raw: unknown): DashboardStatusResponse | null {
  if (!isRecord(raw) || !Array.isArray(raw.data)) return null
  return raw as DashboardStatusResponse
}
