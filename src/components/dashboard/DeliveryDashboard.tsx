import type { ReactNode } from 'react'
import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material'
import {
  CheckCircleOutline,
  CloseOutlined,
  ScheduleOutlined,
  SendOutlined
} from '@mui/icons-material'
import { brand } from '../../theme/brand'
import { formatClockTime, formatDisplayDate } from '../../utils/format'
import { useDashboardData, type MetricKey } from '../../hooks/useDashboardData'
import HeaderControls from './HeaderControls'
import MetricCard from './MetricCard'
import StatusChart from './StatusChart'
import ChannelChart from './ChannelChart'
import DeliveriesTable from '../deliveries/DeliveriesTable'

const METRIC_ICONS: Record<MetricKey, ReactNode> = {
  sent: <SendOutlined fontSize="small" />,
  queued: <ScheduleOutlined fontSize="small" />,
  failed: <CloseOutlined fontSize="small" />,
  acknowledged: <CheckCircleOutline fontSize="small" />
}

const METRIC_COLORS: Record<MetricKey, string> = {
  sent: brand.metrics.sent,
  queued: brand.metrics.queued,
  failed: brand.metrics.failed,
  acknowledged: brand.metrics.acknowledged
}

export default function DeliveryDashboard() {
  const dashboard = useDashboardData('ONE_WEEK')
  const rangeLabel = `${formatDisplayDate(dashboard.rangeWindow.from)} – ${formatDisplayDate(dashboard.rangeWindow.to)}`

  return (
    <Box sx={{ minHeight: '100vh', background: brand.background, px: { xs: 2, md: 3 }, py: 3 }}>
      <Box component="main" sx={{ maxWidth: 1600, mx: 'auto' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ md: 'flex-start' }}
          sx={{ mb: 3, gap: 2 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 0.5, fontSize: { xs: 28, md: 32 } }}>
              Delivery Performance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time overview of message delivery across all channels
            </Typography>
          </Box>

          <HeaderControls
            range={dashboard.headerRange}
            onRangeChange={dashboard.handleHeaderRangeChange}
            rangeLabel={rangeLabel}
            lastUpdatedLabel={formatClockTime(dashboard.lastUpdated)}
          />
        </Stack>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {dashboard.metrics.length === 0
            ? Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Skeleton variant="rounded" height={128} />
                </Grid>
              ))
            : dashboard.metrics.map((card) => (
                <Grid item xs={12} sm={6} md={3} key={card.key}>
                  <MetricCard
                    label={card.label}
                    value={card.value}
                    delta={card.delta}
                    comparisonLabel={card.comparisonLabel}
                    color={METRIC_COLORS[card.key]}
                    icon={METRIC_ICONS[card.key]}
                    sparkline={card.sparkline}
                    invertDelta={card.key === 'failed'}
                  />
                </Grid>
              ))}
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={7}>
            <StatusChart
              data={dashboard.statusResponse?.data ?? []}
              range={dashboard.statusRange}
              onRangeChange={dashboard.setStatusRange}
              loading={dashboard.statusLoading}
            />
          </Grid>
          <Grid item xs={12} lg={5}>
            <ChannelChart data={dashboard.channelResponse?.data ?? []} loading={dashboard.channelLoading} />
          </Grid>
        </Grid>

        <DeliveriesTable range={dashboard.headerRange} />
      </Box>
    </Box>
  )
}
