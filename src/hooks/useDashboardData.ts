import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchDashboardStatus,
  fetchDeliveryChannelTrend,
  type DashboardStatusPoint,
  type DashboardStatusResponse,
  type DashboardChannelResponse
} from '../api/dashboardStatusApi'
import { previousPeriodLabel, type DashboardRangeUi } from '../api/contracts'
import { formatISODate } from '../utils/format'

export type MetricKey = 'sent' | 'queued' | 'failed' | 'acknowledged'

export type MetricSummary = {
  key: MetricKey
  label: string
  value: number
  delta: number
  positive: boolean
  sparkline: number[]
  comparisonLabel: string
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

const summarizeMetric = (rows: DashboardStatusPoint[], key: MetricKey, range: DashboardRangeUi): MetricSummary => {
  const sparkline = rows.map((row) => row[key])
  const value = sparkline.reduce((sum, item) => sum + item, 0)
  const midpoint = Math.max(1, Math.floor(sparkline.length / 2))
  const previous = sparkline.slice(0, midpoint).reduce((sum, item) => sum + item, 0)
  const current = sparkline.slice(midpoint).reduce((sum, item) => sum + item, 0)
  const delta = previous === 0 ? 0 : ((current - previous) / previous) * 100

  return {
    key,
    label: METRIC_LABELS[key],
    value,
    delta,
    positive: key === 'failed' ? delta <= 0 : delta >= 0,
    sparkline,
    comparisonLabel: previousPeriodLabel(range)
  }
}

export function useDashboardData(initialRange: DashboardRangeUi = 'ONE_WEEK') {
  const [headerRange, setHeaderRange] = useState<DashboardRangeUi>(initialRange)
  const [statusRange, setStatusRange] = useState<DashboardRangeUi>(initialRange)
  const [metricsResponse, setMetricsResponse] = useState<DashboardStatusResponse | null>(null)
  const [statusResponse, setStatusResponse] = useState<DashboardStatusResponse | null>(null)
  const [channelResponse, setChannelResponse] = useState<DashboardChannelResponse | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [channelLoading, setChannelLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadMetrics = useCallback(async (range: DashboardRangeUi) => {
    setMetricsLoading(true)
    try {
      const { fromIso, toIso } = getRangeDates(range)
      const data = await fetchDashboardStatus({ range, fromDate: fromIso, toDate: toIso })
      setMetricsResponse(data)
      setLastUpdated(new Date())
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
      setLastUpdated(new Date())
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
      setLastUpdated(new Date())
      setError(null)
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setChannelLoading(false)
    }
  }, [])

  const handleHeaderRangeChange = useCallback((range: DashboardRangeUi) => {
    setHeaderRange(range)
    setStatusRange(range)
  }, [])

  const reload = useCallback(() => {
    void loadMetrics(headerRange)
    void loadStatus(statusRange)
    void loadChannel(headerRange)
  }, [headerRange, loadChannel, loadMetrics, loadStatus, statusRange])

  useEffect(() => {
    void loadMetrics(headerRange)
    void loadChannel(headerRange)
  }, [headerRange, loadChannel, loadMetrics])

  useEffect(() => {
    void loadStatus(statusRange)
  }, [loadStatus, statusRange])

  const rangeWindow = useMemo(() => getRangeDates(headerRange), [headerRange])

  const metrics = useMemo<MetricSummary[]>(() => {
    const rows = metricsResponse?.data ?? []
    if (rows.length === 0) return []
    return (['sent', 'queued', 'failed', 'acknowledged'] as MetricKey[]).map((key) =>
      summarizeMetric(rows, key, headerRange)
    )
  }, [headerRange, metricsResponse])

  return {
    headerRange,
    statusRange,
    setStatusRange,
    handleHeaderRangeChange,
    statusResponse,
    channelResponse,
    metricsLoading,
    statusLoading,
    channelLoading,
    metrics,
    rangeWindow,
    lastUpdated,
    error,
    reload
  }
}
