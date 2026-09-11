import { apiRequest } from './httpClient'
import { normalizeDashboardRange, type DashboardRange, type DashboardRangeApi } from './contracts'

export type DashboardRangePreset = 'ONE_WEEK' | 'TWO_WEEKS' | 'THIRTY_DAYS' | 'CUSTOM'

export type DashboardStatusPoint = {
  date: string
  sent: number
  failed: number
  queued: number
  acknowledged: number
  marketEmail: number
  internalEmail: number
  smtpEmail: number
  pushNotifications: number
  total: number
}

type DashboardStatusSeed = Omit<DashboardStatusPoint, 'internalEmail'>

const withChannelAliases = (points: DashboardStatusSeed[]): DashboardStatusPoint[] =>
  points.map((point) => ({
    ...point,
    internalEmail: Math.round(point.smtpEmail * 0.85 + point.pushNotifications * 0.2)
  }))

export type DashboardStatusResponse = {
  range: DashboardRangeApi
  fromDate: string
  toDate: string
  data: DashboardStatusPoint[]
}

const statusByRange: Record<DashboardRangeApi, DashboardStatusSeed[]> = {
  one_week: [
    { date: '2026-09-03', sent: 480, failed: 220, queued: 180, acknowledged: 150, marketEmail: 210, smtpEmail: 110, pushNotifications: 160, total: 1030 },
    { date: '2026-09-04', sent: 520, failed: 250, queued: 200, acknowledged: 160, marketEmail: 220, smtpEmail: 130, pushNotifications: 170, total: 1130 },
    { date: '2026-09-05', sent: 560, failed: 220, queued: 190, acknowledged: 170, marketEmail: 230, smtpEmail: 140, pushNotifications: 190, total: 1140 },
    { date: '2026-09-06', sent: 610, failed: 260, queued: 210, acknowledged: 190, marketEmail: 250, smtpEmail: 150, pushNotifications: 210, total: 1270 },
    { date: '2026-09-07', sent: 590, failed: 230, queued: 180, acknowledged: 210, marketEmail: 240, smtpEmail: 160, pushNotifications: 190, total: 1210 },
    { date: '2026-09-08', sent: 640, failed: 280, queued: 220, acknowledged: 230, marketEmail: 270, smtpEmail: 180, pushNotifications: 190, total: 1370 },
    { date: '2026-09-09', sent: 700, failed: 290, queued: 240, acknowledged: 250, marketEmail: 290, smtpEmail: 200, pushNotifications: 210, total: 1480 }
  ],
  two_week: [
    { date: '2026-08-27', sent: 480, failed: 220, queued: 180, acknowledged: 150, marketEmail: 210, smtpEmail: 110, pushNotifications: 160, total: 1030 },
    { date: '2026-08-28', sent: 520, failed: 250, queued: 200, acknowledged: 160, marketEmail: 220, smtpEmail: 130, pushNotifications: 170, total: 1130 },
    { date: '2026-08-29', sent: 560, failed: 220, queued: 190, acknowledged: 170, marketEmail: 230, smtpEmail: 140, pushNotifications: 190, total: 1140 },
    { date: '2026-08-30', sent: 610, failed: 260, queued: 210, acknowledged: 190, marketEmail: 250, smtpEmail: 150, pushNotifications: 210, total: 1270 },
    { date: '2026-08-31', sent: 590, failed: 230, queued: 180, acknowledged: 210, marketEmail: 240, smtpEmail: 160, pushNotifications: 190, total: 1210 },
    { date: '2026-09-01', sent: 640, failed: 280, queued: 220, acknowledged: 230, marketEmail: 270, smtpEmail: 180, pushNotifications: 190, total: 1370 },
    { date: '2026-09-02', sent: 700, failed: 290, queued: 240, acknowledged: 250, marketEmail: 290, smtpEmail: 200, pushNotifications: 210, total: 1480 },
    { date: '2026-09-03', sent: 680, failed: 260, queued: 230, acknowledged: 240, marketEmail: 280, smtpEmail: 190, pushNotifications: 210, total: 1410 },
    { date: '2026-09-04', sent: 720, failed: 300, queued: 250, acknowledged: 260, marketEmail: 300, smtpEmail: 200, pushNotifications: 220, total: 1530 },
    { date: '2026-09-05', sent: 690, failed: 280, queued: 240, acknowledged: 250, marketEmail: 290, smtpEmail: 210, pushNotifications: 190, total: 1460 },
    { date: '2026-09-06', sent: 730, failed: 310, queued: 260, acknowledged: 270, marketEmail: 310, smtpEmail: 220, pushNotifications: 200, total: 1570 },
    { date: '2026-09-07', sent: 760, failed: 330, queued: 270, acknowledged: 290, marketEmail: 320, smtpEmail: 230, pushNotifications: 210, total: 1650 },
    { date: '2026-09-08', sent: 780, failed: 340, queued: 280, acknowledged: 300, marketEmail: 330, smtpEmail: 240, pushNotifications: 210, total: 1700 },
    { date: '2026-09-09', sent: 820, failed: 360, queued: 290, acknowledged: 310, marketEmail: 350, smtpEmail: 250, pushNotifications: 220, total: 1780 }
  ],
  THIRTY_DAYS: [
    { date: '2026-08-12', sent: 420, failed: 190, queued: 180, acknowledged: 120, marketEmail: 190, smtpEmail: 110, pushNotifications: 150, total: 980 },
    { date: '2026-08-15', sent: 460, failed: 210, queued: 200, acknowledged: 140, marketEmail: 200, smtpEmail: 120, pushNotifications: 170, total: 1060 },
    { date: '2026-08-18', sent: 510, failed: 230, queued: 210, acknowledged: 170, marketEmail: 220, smtpEmail: 140, pushNotifications: 180, total: 1160 },
    { date: '2026-08-21', sent: 570, failed: 240, queued: 220, acknowledged: 180, marketEmail: 250, smtpEmail: 160, pushNotifications: 190, total: 1220 },
    { date: '2026-08-24', sent: 620, failed: 270, queued: 240, acknowledged: 200, marketEmail: 270, smtpEmail: 180, pushNotifications: 210, total: 1320 },
    { date: '2026-08-27', sent: 720, failed: 310, queued: 260, acknowledged: 240, marketEmail: 310, smtpEmail: 200, pushNotifications: 220, total: 1470 },
    { date: '2026-08-30', sent: 760, failed: 330, queued: 280, acknowledged: 270, marketEmail: 330, smtpEmail: 220, pushNotifications: 230, total: 1600 },
    { date: '2026-09-02', sent: 780, failed: 340, queued: 290, acknowledged: 280, marketEmail: 340, smtpEmail: 240, pushNotifications: 240, total: 1700 },
    { date: '2026-09-05', sent: 800, failed: 350, queued: 300, acknowledged: 290, marketEmail: 360, smtpEmail: 250, pushNotifications: 250, total: 1760 },
    { date: '2026-09-09', sent: 820, failed: 360, queued: 290, acknowledged: 310, marketEmail: 350, smtpEmail: 250, pushNotifications: 220, total: 1780 }
  ],
  CUSTOM: [
    { date: '2026-08-27', sent: 610, failed: 260, queued: 220, acknowledged: 210, marketEmail: 260, smtpEmail: 180, pushNotifications: 180, total: 1300 },
    { date: '2026-08-29', sent: 660, failed: 280, queued: 230, acknowledged: 230, marketEmail: 280, smtpEmail: 200, pushNotifications: 190, total: 1380 },
    { date: '2026-08-31', sent: 700, failed: 290, queued: 240, acknowledged: 260, marketEmail: 300, smtpEmail: 220, pushNotifications: 200, total: 1480 },
    { date: '2026-09-02', sent: 730, failed: 300, queued: 250, acknowledged: 270, marketEmail: 310, smtpEmail: 220, pushNotifications: 210, total: 1550 },
    { date: '2026-09-05', sent: 760, failed: 330, queued: 280, acknowledged: 280, marketEmail: 330, smtpEmail: 230, pushNotifications: 220, total: 1650 },
    { date: '2026-09-07', sent: 790, failed: 340, queued: 290, acknowledged: 290, marketEmail: 340, smtpEmail: 240, pushNotifications: 230, total: 1710 },
    { date: '2026-09-09', sent: 820, failed: 360, queued: 290, acknowledged: 310, marketEmail: 350, smtpEmail: 250, pushNotifications: 220, total: 1780 }
  ]
}

const channelByRange: Record<DashboardRangeApi, DashboardStatusSeed[]> = {
  one_week: [
    { date: '2026-09-03', sent: 110, failed: 45, queued: 30, acknowledged: 70, marketEmail: 90, smtpEmail: 70, pushNotifications: 60, total: 300 },
    { date: '2026-09-04', sent: 130, failed: 50, queued: 35, acknowledged: 80, marketEmail: 110, smtpEmail: 80, pushNotifications: 75, total: 350 },
    { date: '2026-09-05', sent: 140, failed: 60, queued: 40, acknowledged: 85, marketEmail: 120, smtpEmail: 90, pushNotifications: 80, total: 390 },
    { date: '2026-09-06', sent: 170, failed: 70, queued: 60, acknowledged: 95, marketEmail: 140, smtpEmail: 100, pushNotifications: 90, total: 470 },
    { date: '2026-09-07', sent: 165, failed: 72, queued: 54, acknowledged: 100, marketEmail: 145, smtpEmail: 100, pushNotifications: 95, total: 475 },
    { date: '2026-09-08', sent: 190, failed: 80, queued: 62, acknowledged: 110, marketEmail: 160, smtpEmail: 120, pushNotifications: 100, total: 540 },
    { date: '2026-09-09', sent: 205, failed: 85, queued: 65, acknowledged: 120, marketEmail: 170, smtpEmail: 130, pushNotifications: 110, total: 590 }
  ],
  two_week: [
    { date: '2026-08-27', sent: 120, failed: 40, queued: 35, acknowledged: 80, marketEmail: 90, smtpEmail: 80, pushNotifications: 70, total: 340 },
    { date: '2026-08-28', sent: 130, failed: 45, queued: 36, acknowledged: 82, marketEmail: 95, smtpEmail: 84, pushNotifications: 72, total: 370 },
    { date: '2026-08-29', sent: 140, failed: 48, queued: 38, acknowledged: 85, marketEmail: 100, smtpEmail: 88, pushNotifications: 76, total: 400 },
    { date: '2026-08-30', sent: 150, failed: 53, queued: 40, acknowledged: 90, marketEmail: 110, smtpEmail: 90, pushNotifications: 80, total: 430 },
    { date: '2026-08-31', sent: 155, failed: 56, queued: 42, acknowledged: 92, marketEmail: 120, smtpEmail: 94, pushNotifications: 82, total: 450 },
    { date: '2026-09-01', sent: 165, failed: 58, queued: 44, acknowledged: 98, marketEmail: 130, smtpEmail: 96, pushNotifications: 86, total: 480 },
    { date: '2026-09-02', sent: 175, failed: 62, queued: 48, acknowledged: 100, marketEmail: 135, smtpEmail: 100, pushNotifications: 90, total: 510 },
    { date: '2026-09-03', sent: 180, failed: 70, queued: 52, acknowledged: 108, marketEmail: 150, smtpEmail: 105, pushNotifications: 98, total: 560 },
    { date: '2026-09-04', sent: 185, failed: 76, queued: 58, acknowledged: 112, marketEmail: 155, smtpEmail: 110, pushNotifications: 100, total: 585 },
    { date: '2026-09-05', sent: 192, failed: 80, queued: 60, acknowledged: 115, marketEmail: 160, smtpEmail: 112, pushNotifications: 102, total: 610 },
    { date: '2026-09-06', sent: 200, failed: 82, queued: 62, acknowledged: 118, marketEmail: 166, smtpEmail: 116, pushNotifications: 106, total: 630 },
    { date: '2026-09-07', sent: 210, failed: 88, queued: 64, acknowledged: 122, marketEmail: 170, smtpEmail: 120, pushNotifications: 110, total: 660 },
    { date: '2026-09-08', sent: 220, failed: 90, queued: 66, acknowledged: 130, marketEmail: 176, smtpEmail: 130, pushNotifications: 115, total: 680 },
    { date: '2026-09-09', sent: 230, failed: 95, queued: 70, acknowledged: 135, marketEmail: 180, smtpEmail: 135, pushNotifications: 120, total: 710 }
  ],
  THIRTY_DAYS: [
    { date: '2026-08-12', sent: 100, failed: 35, queued: 20, acknowledged: 60, marketEmail: 80, smtpEmail: 70, pushNotifications: 50, total: 350 },
    { date: '2026-08-15', sent: 120, failed: 40, queued: 25, acknowledged: 70, marketEmail: 95, smtpEmail: 80, pushNotifications: 60, total: 390 },
    { date: '2026-08-18', sent: 140, failed: 50, queued: 30, acknowledged: 80, marketEmail: 110, smtpEmail: 90, pushNotifications: 70, total: 440 },
    { date: '2026-08-21', sent: 170, failed: 60, queued: 35, acknowledged: 90, marketEmail: 120, smtpEmail: 100, pushNotifications: 75, total: 500 },
    { date: '2026-08-24', sent: 180, failed: 65, queued: 40, acknowledged: 100, marketEmail: 130, smtpEmail: 110, pushNotifications: 80, total: 560 },
    { date: '2026-08-27', sent: 210, failed: 70, queued: 45, acknowledged: 110, marketEmail: 150, smtpEmail: 120, pushNotifications: 90, total: 620 },
    { date: '2026-08-30', sent: 220, failed: 75, queued: 48, acknowledged: 120, marketEmail: 160, smtpEmail: 130, pushNotifications: 100, total: 680 },
    { date: '2026-09-02', sent: 230, failed: 80, queued: 52, acknowledged: 120, marketEmail: 170, smtpEmail: 130, pushNotifications: 110, total: 700 },
    { date: '2026-09-05', sent: 250, failed: 85, queued: 55, acknowledged: 130, marketEmail: 180, smtpEmail: 140, pushNotifications: 120, total: 760 },
    { date: '2026-09-09', sent: 230, failed: 95, queued: 70, acknowledged: 135, marketEmail: 180, smtpEmail: 135, pushNotifications: 120, total: 710 }
  ],
  CUSTOM: [
    { date: '2026-08-27', sent: 150, failed: 52, queued: 35, acknowledged: 90, marketEmail: 120, smtpEmail: 95, pushNotifications: 80, total: 450 },
    { date: '2026-08-29', sent: 170, failed: 58, queued: 38, acknowledged: 92, marketEmail: 135, smtpEmail: 105, pushNotifications: 82, total: 500 },
    { date: '2026-08-31', sent: 180, failed: 63, queued: 42, acknowledged: 100, marketEmail: 150, smtpEmail: 110, pushNotifications: 90, total: 560 },
    { date: '2026-09-02', sent: 190, failed: 66, queued: 44, acknowledged: 110, marketEmail: 160, smtpEmail: 120, pushNotifications: 98, total: 600 },
    { date: '2026-09-05', sent: 210, failed: 72, queued: 48, acknowledged: 120, marketEmail: 170, smtpEmail: 130, pushNotifications: 100, total: 660 },
    { date: '2026-09-07', sent: 220, failed: 80, queued: 52, acknowledged: 122, marketEmail: 176, smtpEmail: 135, pushNotifications: 110, total: 690 },
    { date: '2026-09-09', sent: 230, failed: 95, queued: 70, acknowledged: 135, marketEmail: 180, smtpEmail: 135, pushNotifications: 120, total: 710 }
  ]
}

export async function fetchDashboardStatus(params: {
  range: DashboardRange
  fromDate: string
  toDate: string
}): Promise<DashboardStatusResponse> {
  const normalizedRange = normalizeDashboardRange(params.range)
  const data = statusByRange[normalizedRange] ?? statusByRange.two_week

  return apiRequest<DashboardStatusResponse>({
    method: 'GET',
    url: '/alerts-admin/v1/dashboard/status',
    params: {
      range: normalizedRange,
      fromDate: params.fromDate,
      toDate: params.toDate
    },
    mockResponse: {
      range: normalizedRange,
      fromDate: params.fromDate,
      toDate: params.toDate,
      data: withChannelAliases(data)
    }
  })
}

export async function fetchDeliveryChannelTrend(params: {
  range: DashboardRange
  fromDate: string
  toDate: string
}): Promise<DashboardStatusResponse> {
  const normalizedRange = normalizeDashboardRange(params.range)
  const data = channelByRange[normalizedRange] ?? channelByRange.two_week

  return apiRequest<DashboardStatusResponse>({
    method: 'GET',
    url: '/alerts-admin/v1/dashboard/channel',
    params: {
      range: normalizedRange,
      fromDate: params.fromDate,
      toDate: params.toDate
    },
    mockResponse: {
      range: normalizedRange,
      fromDate: params.fromDate,
      toDate: params.toDate,
      data: withChannelAliases(data)
    }
  })
}
