import type {
  DashboardRangeApi,
  DashboardStatusPointApi,
  DashboardStatusResponseApi
} from '../api/contracts'

/** Status series keyed by contract `range` — returned as-is for stub mode. */
const STATUS_BY_RANGE: Record<DashboardRangeApi, DashboardStatusPointApi[]> = {
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

export type DashboardStatusStubParams = {
  range: DashboardRangeApi
  fromDate: string
  toDate: string
}

/** GET /alerts-admin/v1/dashboard/status stub */
export function getDashboardStatusStub(params: DashboardStatusStubParams): DashboardStatusResponseApi {
  return {
    range: params.range,
    fromDate: params.fromDate,
    toDate: params.toDate,
    data: STATUS_BY_RANGE[params.range] ?? STATUS_BY_RANGE.TWO_WEEKS
  }
}
