import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import {
  CalendarMonthOutlined,
  CheckCircleOutline,
  CloseOutlined,
  ScheduleOutlined,
  SendOutlined
} from '@mui/icons-material'
import { fetchDashboardStatus, fetchDeliveryChannelTrend, type DashboardStatusResponse } from './api/dashboardStatusApi'
import { normalizeDashboardRange, type DashboardRangeUi } from './api/contracts'
import StatusChart from './components/StatusChart'
import ChannelChart from './components/ChannelChart'
import DeliveriesTable from './components/DeliveriesTable'
import { brand } from './theme/brand'

type MetricCardModel = {
  label: string
  value: number
  delta: string
  positive: boolean
  color: string
  icon: React.ReactNode
}

type RangeOption = {
  label: string
  value: DashboardRangeUi
}

const RANGE_OPTIONS: RangeOption[] = [
  { label: '1 Week', value: 'ONE_WEEK' },
  { label: '2 Weeks', value: 'TWO_WEEKS' },
  { label: '30 Days', value: 'THIRTY_DAYS' },
  { label: 'Custom', value: 'CUSTOM' }
]

const formatISODate = (date: Date) => date.toISOString().slice(0, 10)

const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const getRangeDates = (range: DashboardRangeUi) => {
  const to = new Date()
  const from = new Date(to)

  switch (normalizeDashboardRange(range)) {
    case 'one_week':
      from.setDate(to.getDate() - 6)
      break
    case 'two_week':
      from.setDate(to.getDate() - 13)
      break
    case 'THIRTY_DAYS':
    case 'CUSTOM':
    default:
      from.setDate(to.getDate() - 29)
      break
  }

  return {
    from,
    to,
    fromIso: formatISODate(from),
    toIso: formatISODate(to),
    label: `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`
  }
}

function MetricCard({ card }: { card: MetricCardModel }) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${brand.border}`,
        background: brand.surface,
        minHeight: 118,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: `${card.color}18`,
            color: card.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: brand.shadow.insetBorderSubtle
          }}
        >
          {card.icon}
        </Box>
        <Box sx={{ fontSize: 11, color: card.positive ? brand.status.sent.color : brand.status.failed.color, fontWeight: 700 }}>
          {card.delta}
        </Box>
      </Stack>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
          {card.label}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1, fontSize: { xs: 28, md: 32 } }}>
            {card.value.toLocaleString()}
          </Typography>
          <Typography variant="caption" color={card.positive ? 'success.main' : 'error.main'} sx={{ fontSize: 10 }}>
            {card.delta}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  )
}

function RangeSelector({
  value,
  onChange
}: {
  value: DashboardRangeUi
  onChange: (range: DashboardRangeUi) => void
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        border: `1px solid ${brand.border}`,
        borderRadius: 1.6,
        overflow: 'hidden',
        background: brand.surface
      }}
    >
      {RANGE_OPTIONS.map((option) => {
        const active = value === option.value

        return (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            sx={{
              px: 2,
              py: 1,
              borderRadius: 0,
              minWidth: 96,
              background: active ? brand.primary : brand.surface,
              color: active ? '#fff' : brand.headerText,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: active ? brand.shadow.insetWhiteThin : 'none',
              '&:hover': { background: active ? brand.primary : brand.hoverLight }
            }}
          >
            {option.label}
          </Button>
        )
      })}
    </Box>
  )
}

export default function App() {
  const [statusResponse, setStatusResponse] = useState<DashboardStatusResponse | null>(null)
  const [channelResponse, setChannelResponse] = useState<DashboardStatusResponse | null>(null)
  const [headerRange, setHeaderRange] = useState<DashboardRangeUi>('TWO_WEEKS')
  const [statusRange, setStatusRange] = useState<DashboardRangeUi>('TWO_WEEKS')
  const [channelRange, setChannelRange] = useState<DashboardRangeUi>('TWO_WEEKS')
  const [statusLoading, setStatusLoading] = useState(false)
  const [channelLoading, setChannelLoading] = useState(false)

  const loadStatus = async (range: DashboardRangeUi) => {
    setStatusLoading(true)
    const { fromIso, toIso } = getRangeDates(range)
    const data = await fetchDashboardStatus({ range, fromDate: fromIso, toDate: toIso })
    setStatusResponse(data)
    setStatusLoading(false)
  }

  const loadChannel = async (range: DashboardRangeUi) => {
    setChannelLoading(true)
    const { fromIso, toIso } = getRangeDates(range)
    const data = await fetchDeliveryChannelTrend({ range, fromDate: fromIso, toDate: toIso })
    setChannelResponse(data)
    setChannelLoading(false)
  }

  const handleHeaderRangeChange = (range: DashboardRangeUi) => {
    setHeaderRange(range)
    setStatusRange(range)
    setChannelRange(range)
    void loadStatus(range)
    void loadChannel(range)
  }

  useEffect(() => {
    void loadStatus(statusRange)
  }, [statusRange])

  useEffect(() => {
    void loadChannel(channelRange)
  }, [channelRange])

  const rangeSummary = useMemo(() => getRangeDates(headerRange), [headerRange])

  const metricCards = useMemo<MetricCardModel[]>(() => {
    const rows = statusResponse?.data ?? []
    if (rows.length === 0) return []

    const totals = rows.reduce(
      (acc, item) => {
        acc.sent += item.sent
        acc.queued += item.queued
        acc.failed += item.failed
        acc.acknowledged += item.acknowledged
        return acc
      },
      { sent: 0, queued: 0, failed: 0, acknowledged: 0 }
    )

    return [
      {
        label: 'Sent / Re-Sent',
        value: totals.sent,
        delta: 'Range total',
        positive: true,
        color: brand.metrics.sent,
        icon: <SendOutlined fontSize="small" />
      },
      {
        label: 'Queued',
        value: totals.queued,
        delta: 'Range total',
        positive: true,
        color: brand.metrics.queued,
        icon: <ScheduleOutlined fontSize="small" />
      },
      {
        label: 'Failed',
        value: totals.failed,
        delta: 'Range total',
        positive: false,
        color: brand.metrics.failed,
        icon: <CloseOutlined fontSize="small" />
      },
      {
        label: 'Acknowledged',
        value: totals.acknowledged,
        delta: 'Range total',
        positive: true,
        color: brand.metrics.acknowledged,
        icon: <CheckCircleOutline fontSize="small" />
      }
    ]
  }, [statusResponse])

  return (
    <Box sx={{ minHeight: '100vh', background: brand.background, px: 3, py: 3 }}>
      <Box component="main" sx={{ maxWidth: 1600, mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.04em', mb: 0.5 }}>
              Delivery Performance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time overview of message delivery across all channels
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <RangeSelector value={headerRange} onChange={handleHeaderRangeChange} />

            <Box sx={{ px: 1.25, py: 0.8, borderRadius: 1.8, display: 'flex', alignItems: 'center', gap: 1, color: brand.muted }}>
              <CalendarMonthOutlined fontSize="small" sx={{ color: brand.muted }} />
              <Typography variant="body2" color="text.secondary">{rangeSummary.label}</Typography>
            </Box>

            <Box sx={{ px: 1.25, py: 0.8, borderRadius: 1.8, display: 'flex', alignItems: 'center', gap: 1, color: brand.muted }}>
              <ScheduleOutlined fontSize="small" sx={{ color: brand.muted }} />
              <Typography variant="body2" color="text.secondary">Last updated: 2:10 PM</Typography>
            </Box>
          </Stack>
        </Stack>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {metricCards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.label}>
              <MetricCard card={card} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={7}>
            <StatusChart data={statusResponse?.data ?? []} range={statusRange} onRangeChange={setStatusRange} loading={statusLoading} />
          </Grid>
          <Grid item xs={12} lg={5}>
            <ChannelChart data={channelResponse?.data ?? []} range={channelRange} onRangeChange={setChannelRange} loading={channelLoading} />
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${brand.border}`, background: brand.surface }}>
          <DeliveriesTable range={headerRange} />
        </Paper>
      </Box>
    </Box>
  )
}
