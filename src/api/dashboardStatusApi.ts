import { apiRequest } from './httpClient'
import {
  normalizeDashboardRange,
  type DashboardChannelPointApi,
  type DashboardChannelResponseApi,
  type DashboardRange,
  type DashboardRangeApi,
  type DashboardStatusPointApi,
  type DashboardStatusResponseApi
} from './contracts'
import { mapDashboardChannelResponse, mapDashboardStatusResponse } from './mapper'

export type DashboardStatusPoint = DashboardStatusPointApi
export type DashboardChannelPoint = DashboardChannelPointApi

export type DashboardStatusResponse = {
  range: DashboardRangeApi
  fromDate: string
  toDate: string
  data: DashboardStatusPoint[]
}

export type DashboardChannelResponse = {
  range: DashboardRangeApi
  fromDate: string
  toDate: string
  data: DashboardChannelPoint[]
}

const statusByRange: Record<DashboardRangeApi, DashboardStatusPoint[]> = {
  ONE_WEEK: [
    { date: '2026-09-03', sent: 480, failed: 220, queued: 180, acknowledged: 150, total: 1030 },
    { date: '2026-09-04', sent: 520, failed: 250, queued: 200, acknowledged: 160, total: 1130 },
    { date: '2026-09-05', sent: 560, failed: 220, queued: 190, acknowledged: 170, total: 1140 },
    { date: '2026-09-06', sent: 610, failed: 260, queued: 210, acknowledged: 190, total: 1270 },
    { date: '2026-09-07', sent: 590, failed: 230, queued: 180, acknowledged: 210, total: 1210 },
    { date: '2026-09-08', sent: 640, failed: 280, queued: 220, acknowledged: 230, total: 1370 },
    { date: '2026-09-09', sent: 700, failed: 290, queued: 240, acknowledged: 250, total: 1480 }
  ],
  TWO_WEEKS: [
    { date: '2026-08-27', sent: 480, failed: 220, queued: 180, acknowledged: 150, total: 1030 },
    { date: '2026-08-28', sent: 520, failed: 250, queued: 200, acknowledged: 160, total: 1130 },
    { date: '2026-08-29', sent: 560, failed: 220, queued: 190, acknowledged: 170, total: 1140 },
    { date: '2026-08-30', sent: 610, failed: 260, queued: 210, acknowledged: 190, total: 1270 },
    { date: '2026-08-31', sent: 590, failed: 230, queued: 180, acknowledged: 210, total: 1210 },
    { date: '2026-09-01', sent: 640, failed: 280, queued: 220, acknowledged: 230, total: 1370 },
    { date: '2026-09-02', sent: 700, failed: 290, queued: 240, acknowledged: 250, total: 1480 },
    { date: '2026-09-03', sent: 680, failed: 260, queued: 230, acknowledged: 240, total: 1410 },
    { date: '2026-09-04', sent: 720, failed: 300, queued: 250, acknowledged: 260, total: 1530 },
    { date: '2026-09-05', sent: 690, failed: 280, queued: 240, acknowledged: 250, total: 1460 },
    { date: '2026-09-06', sent: 730, failed: 310, queued: 260, acknowledged: 270, total: 1570 },
    { date: '2026-09-07', sent: 760, failed: 330, queued: 270, acknowledged: 290, total: 1650 },
    { date: '2026-09-08', sent: 780, failed: 340, queued: 280, acknowledged: 300, total: 1700 },
    { date: '2026-09-09', sent: 820, failed: 360, queued: 290, acknowledged: 310, total: 1780 }
  ],
  THIRTY_DAYS: [
    { date: '2026-08-12', sent: 420, failed: 190, queued: 180, acknowledged: 120, total: 980 },
    { date: '2026-08-15', sent: 460, failed: 210, queued: 200, acknowledged: 140, total: 1060 },
    { date: '2026-08-18', sent: 510, failed: 230, queued: 210, acknowledged: 170, total: 1160 },
    { date: '2026-08-21', sent: 570, failed: 240, queued: 220, acknowledged: 180, total: 1220 },
    { date: '2026-08-24', sent: 620, failed: 270, queued: 240, acknowledged: 200, total: 1320 },
    { date: '2026-08-27', sent: 720, failed: 310, queued: 260, acknowledged: 240, total: 1470 },
    { date: '2026-08-30', sent: 760, failed: 330, queued: 280, acknowledged: 270, total: 1600 },
    { date: '2026-09-02', sent: 780, failed: 340, queued: 290, acknowledged: 280, total: 1700 },
    { date: '2026-09-05', sent: 800, failed: 350, queued: 300, acknowledged: 290, total: 1760 },
    { date: '2026-09-09', sent: 820, failed: 360, queued: 290, acknowledged: 310, total: 1780 }
  ],
  CUSTOM: [
    { date: '2026-08-27', sent: 610, failed: 260, queued: 220, acknowledged: 210, total: 1300 },
    { date: '2026-08-29', sent: 660, failed: 280, queued: 230, acknowledged: 230, total: 1380 },
    { date: '2026-08-31', sent: 700, failed: 290, queued: 240, acknowledged: 260, total: 1480 },
    { date: '2026-09-02', sent: 730, failed: 300, queued: 250, acknowledged: 270, total: 1550 },
    { date: '2026-09-05', sent: 760, failed: 330, queued: 280, acknowledged: 280, total: 1650 },
    { date: '2026-09-07', sent: 790, failed: 340, queued: 290, acknowledged: 290, total: 1710 },
    { date: '2026-09-09', sent: 820, failed: 360, queued: 290, acknowledged: 310, total: 1780 }
  ]
}

const channelByRange: Record<DashboardRangeApi, DashboardChannelPoint[]> = {
  ONE_WEEK: [
    { date: '2026-09-03', marketToEmail: 90, smtp: 70, push: 60, total: 220 },
    { date: '2026-09-04', marketToEmail: 110, smtp: 80, push: 75, total: 265 },
    { date: '2026-09-05', marketToEmail: 120, smtp: 90, push: 80, total: 290 },
    { date: '2026-09-06', marketToEmail: 140, smtp: 100, push: 90, total: 330 },
    { date: '2026-09-07', marketToEmail: 145, smtp: 100, push: 95, total: 340 },
    { date: '2026-09-08', marketToEmail: 160, smtp: 120, push: 100, total: 380 },
    { date: '2026-09-09', marketToEmail: 170, smtp: 130, push: 110, total: 410 }
  ],
  TWO_WEEKS: [
    { date: '2026-08-27', marketToEmail: 90, smtp: 80, push: 70, total: 240 },
    { date: '2026-08-28', marketToEmail: 95, smtp: 84, push: 72, total: 251 },
    { date: '2026-08-29', marketToEmail: 100, smtp: 88, push: 76, total: 264 },
    { date: '2026-08-30', marketToEmail: 110, smtp: 90, push: 80, total: 280 },
    { date: '2026-08-31', marketToEmail: 120, smtp: 94, push: 82, total: 296 },
    { date: '2026-09-01', marketToEmail: 130, smtp: 96, push: 86, total: 312 },
    { date: '2026-09-02', marketToEmail: 135, smtp: 100, push: 90, total: 325 },
    { date: '2026-09-03', marketToEmail: 150, smtp: 105, push: 98, total: 353 },
    { date: '2026-09-04', marketToEmail: 155, smtp: 110, push: 100, total: 365 },
    { date: '2026-09-05', marketToEmail: 160, smtp: 112, push: 102, total: 374 },
    { date: '2026-09-06', marketToEmail: 166, smtp: 116, push: 106, total: 388 },
    { date: '2026-09-07', marketToEmail: 170, smtp: 120, push: 110, total: 400 },
    { date: '2026-09-08', marketToEmail: 176, smtp: 130, push: 115, total: 421 },
    { date: '2026-09-09', marketToEmail: 180, smtp: 135, push: 120, total: 435 }
  ],
  THIRTY_DAYS: [
    { date: '2026-08-12', marketToEmail: 80, smtp: 70, push: 50, total: 200 },
    { date: '2026-08-15', marketToEmail: 95, smtp: 80, push: 60, total: 235 },
    { date: '2026-08-18', marketToEmail: 110, smtp: 90, push: 70, total: 270 },
    { date: '2026-08-21', marketToEmail: 120, smtp: 100, push: 75, total: 295 },
    { date: '2026-08-24', marketToEmail: 130, smtp: 110, push: 80, total: 320 },
    { date: '2026-08-27', marketToEmail: 150, smtp: 120, push: 90, total: 360 },
    { date: '2026-08-30', marketToEmail: 160, smtp: 130, push: 100, total: 390 },
    { date: '2026-09-02', marketToEmail: 170, smtp: 130, push: 110, total: 410 },
    { date: '2026-09-05', marketToEmail: 180, smtp: 140, push: 120, total: 440 },
    { date: '2026-09-09', marketToEmail: 180, smtp: 135, push: 120, total: 435 }
  ],
  CUSTOM: [
    { date: '2026-08-27', marketToEmail: 120, smtp: 95, push: 80, total: 295 },
    { date: '2026-08-29', marketToEmail: 135, smtp: 105, push: 82, total: 322 },
    { date: '2026-08-31', marketToEmail: 150, smtp: 110, push: 90, total: 350 },
    { date: '2026-09-02', marketToEmail: 160, smtp: 120, push: 98, total: 378 },
    { date: '2026-09-05', marketToEmail: 170, smtp: 130, push: 100, total: 400 },
    { date: '2026-09-07', marketToEmail: 176, smtp: 135, push: 110, total: 421 },
    { date: '2026-09-09', marketToEmail: 180, smtp: 135, push: 120, total: 435 }
  ]
}

export async function fetchDashboardStatus(params: {
  range: DashboardRange
  fromDate: string
  toDate: string
}): Promise<DashboardStatusResponse> {
  const normalizedRange = normalizeDashboardRange(params.range)
  const data = statusByRange[normalizedRange] ?? statusByRange.TWO_WEEKS

  const raw = await apiRequest<DashboardStatusResponseApi>({
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
      data
    }
  })

  return mapDashboardStatusResponse(raw) ?? {
    range: normalizedRange,
    fromDate: params.fromDate,
    toDate: params.toDate,
    data: []
  }
}

export async function fetchDeliveryChannelTrend(params: {
  range: DashboardRange
  fromDate: string
  toDate: string
}): Promise<DashboardChannelResponse> {
  const normalizedRange = normalizeDashboardRange(params.range)
  const data = channelByRange[normalizedRange] ?? channelByRange.TWO_WEEKS

  const raw = await apiRequest<DashboardChannelResponseApi>({
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
      data
    }
  })

  return mapDashboardChannelResponse(raw) ?? {
    range: normalizedRange,
    fromDate: params.fromDate,
    toDate: params.toDate,
    data: []
  }
}
