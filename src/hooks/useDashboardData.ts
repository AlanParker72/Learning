import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchDashboardStatus,
  fetchDeliveryChannelTrend,
  type DashboardStatusPoint,
  type DashboardStatusResponse,
  type DashboardChannelResponse
} from '../api/dashboardStatusApi'
import type { DashboardRangeUi } from '../api/contracts'
import { formatISODate } from '../utils/format'

export type MetricKey = 'sent' | 'queued' | 'failed' | 'acknowledged'

export type MetricSummary = {
  key: MetricKey
  label: string
  value: number
}

const METRIC_LABELS: Record<MetricKey, string> = {
  sent: 'Sent / Re-Sent',
  queued: 'Queued',
  failed: 'Failed',
  acknowledged: 'Acknowledged'
}

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unable to load dashboard data'

export const getRangeDates = (range: DashboardRangeUi) => {
  const to = new Date()
  const from = new Date(to)

  if (range === 'ONE_WEEK') from.setDate(to.getDate() - 6)
  else if (range === 'TWO_WEEKS') from.setDate(to.getDate() - 13)
  else from.setDate(to.getDate() - 29)

  return { fromIso: formatISODate(from), toIso: formatISODate(to), from, to }
}

/** Sum daily status counts across the selected range for KPI totals (no period-over-period). */
const summarizeMetric = (rows: DashboardStatusPoint[], key: MetricKey): MetricSummary => ({
  key,
  label: METRIC_LABELS[key],
  value: rows.reduce((sum, row) => sum + row[key], 0)
})

export function useDashboardData(initialRange: DashboardRangeUi = 'TWO_WEEKS') {
  const [headerRange, setHeaderRange] = useState<DashboardRangeUi>(initialRange)
  const [statusRange, setStatusRange] = useState<DashboardRangeUi>(initialRange)
  const [channelRange, setChannelRange] = useState<DashboardRangeUi>(initialRange)
  const [metricsResponse, setMetricsResponse] = useState<DashboardStatusResponse | null>(null)
  const [statusResponse, setStatusResponse] = useState<DashboardStatusResponse | null>(null)
  const [channelResponse, setChannelResponse] = useState<DashboardChannelResponse | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [channelLoading, setChannelLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMetrics = useCallback(async (range: DashboardRangeUi) => {
    setMetricsLoading(true)
    try {
      const { fromIso, toIso } = getRangeDates(range)
      const data = await fetchDashboardStatus({ range, fromDate: fromIso, toDate: toIso })
      setMetricsResponse(data)
      setError(null)
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setMetricsLoading(false)
    }
  }, [])

  const loadStatus = useCallback(async (range: DashboardRangeUi) => {
    setStatusLoading(true)
    try {
      const { fromIso, toIso } = getRangeDates(range)
      const data = await fetchDashboardStatus({ range, fromDate: fromIso, toDate: toIso })
      setStatusResponse(data)
      setError(null)
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setStatusLoading(false)
    }
  }, [])

  const loadChannel = useCallback(async (range: DashboardRangeUi) => {
    setChannelLoading(true)
    try {
      const { fromIso, toIso } = getRangeDates(range)
      const data = await fetchDeliveryChannelTrend({ range, fromDate: fromIso, toDate: toIso })
      setChannelResponse(data)
      setError(null)
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setChannelLoading(false)
    }
  }, [])

  /** Top header 1W / 2W / 1M: refresh KPIs, both charts, and (via prop) deliveries list. */
  const handleHeaderRangeChange = useCallback((range: DashboardRangeUi) => {
    setHeaderRange(range)
    setStatusRange(range)
    setChannelRange(range)
  }, [])

  const handleStatusRangeChange = useCallback((range: DashboardRangeUi) => {
    setStatusRange(range)
  }, [])

  const handleChannelRangeChange = useCallback((range: DashboardRangeUi) => {
    setChannelRange(range)
  }, [])

  const reload = useCallback(() => {
    void loadMetrics(headerRange)
    void loadStatus(statusRange)
    void loadChannel(channelRange)
  }, [channelRange, headerRange, loadChannel, loadMetrics, loadStatus, statusRange])

  useEffect(() => {
    void loadMetrics(headerRange)
  }, [headerRange, loadMetrics])

  useEffect(() => {
    void loadStatus(statusRange)
  }, [loadStatus, statusRange])

  useEffect(() => {
    void loadChannel(channelRange)
  }, [channelRange, loadChannel])

  const rangeWindow = useMemo(() => getRangeDates(headerRange), [headerRange])

  const metrics = useMemo<MetricSummary[]>(() => {
    const rows = metricsResponse?.data ?? []
    if (rows.length === 0) return []
    return (['sent', 'queued', 'failed', 'acknowledged'] as MetricKey[]).map((key) =>
      summarizeMetric(rows, key)
    )
  }, [metricsResponse])

  return {
    headerRange,
    statusRange,
    channelRange,
    handleHeaderRangeChange,
    handleStatusRangeChange,
    handleChannelRangeChange,
    statusResponse,
    channelResponse,
    metricsLoading,
    statusLoading,
    channelLoading,
    metrics,
    rangeWindow,
    error,
    reload
  }
}
