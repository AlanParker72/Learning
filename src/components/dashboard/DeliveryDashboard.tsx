import type { ReactNode } from 'react'
import { Alert, Box, Button, Grid, Skeleton, Stack, Typography } from '@mui/material'
import {
  ErrorOutline,
  HourglassEmptyOutlined,
  OutboxOutlined,
  TaskAltOutlined
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
  sent: <OutboxOutlined />,
  queued: <HourglassEmptyOutlined />,
  failed: <ErrorOutline />,
  acknowledged: <TaskAltOutlined />
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

        {dashboard.error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={dashboard.reload}>
                Retry
              </Button>
            }
          >
            {dashboard.error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {dashboard.metrics.length === 0
            ? Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Skeleton variant="rounded" height={112} />
                </Grid>
              ))
            : dashboard.metrics.map((card) => (
                <Grid item xs={12} sm={6} md={3} key={card.key}>
                  <MetricCard
                    label={card.label}
                    value={card.value}
                    color={METRIC_COLORS[card.key]}
                    icon={METRIC_ICONS[card.key]}
                  />
                </Grid>
              ))}
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }} alignItems="stretch">
          <Grid item xs={12} lg={7} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%', display: 'flex', '& > *': { flex: 1 } }}>
              <StatusChart
                data={dashboard.statusResponse?.data ?? []}
                range={dashboard.statusRange}
                onRangeChange={dashboard.handleStatusRangeChange}
                loading={dashboard.statusLoading}
              />
            </Box>
          </Grid>
          <Grid item xs={12} lg={5} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%', display: 'flex', '& > *': { flex: 1 } }}>
              <ChannelChart
                data={dashboard.channelResponse?.data ?? []}
                range={dashboard.channelRange}
                onRangeChange={dashboard.handleChannelRangeChange}
                loading={dashboard.channelLoading}
              />
            </Box>
          </Grid>
        </Grid>

        <DeliveriesTable range={dashboard.headerRange} />
      </Box>
    </Box>
  )
}
