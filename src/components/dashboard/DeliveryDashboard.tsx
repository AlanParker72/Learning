import type { ReactNode } from 'react'
import { Alert, Box, Button, Grid, Skeleton, Stack, Typography } from '@mui/material'
import {
  AccessTime,
  CheckCircleOutline,
  ErrorOutline,
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
  sent: <SendOutlined />,
  queued: <AccessTime />,
  failed: <ErrorOutline />,
  acknowledged: <CheckCircleOutline />
}

const METRIC_COLORS: Record<MetricKey, string> = {
  sent: brand.status.sent.color,
  queued: brand.status.queued.color,
  failed: brand.status.failed.color,
  acknowledged: brand.status.acknowledged.color
}

const METRIC_ICON_BG: Record<MetricKey, string> = {
  sent: brand.status.sent.bg,
  queued: brand.status.queued.bg,
  failed: brand.status.failed.bg,
  acknowledged: brand.status.acknowledged.bg
}

export default function DeliveryDashboard() {
  const dashboard = useDashboardData('ONE_WEEK')
  const rangeLabel = `${formatDisplayDate(dashboard.rangeWindow.from)} – ${formatDisplayDate(dashboard.rangeWindow.to)}`

  return (
    <Box sx={{ minHeight: '100vh', background: brand.background, px: { xs: 2, md: 3 }, py: 3 }}>
      <Box component="main" sx={{ maxWidth: 1600, mx: 'auto' }}>
        <Stack sx={{ mb: 3, gap: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.04em', fontSize: { xs: 28, md: 32 } }}>
            Distribution Services Dashboard
          </Typography>

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
                    iconBg={METRIC_ICON_BG[card.key]}
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
